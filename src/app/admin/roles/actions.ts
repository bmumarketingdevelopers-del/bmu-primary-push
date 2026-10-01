"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/session";
import { isGrantable, MODULES, type Action } from "@/lib/permissions";
import type { AppRole } from "@/lib/roles";

export type TeamState = { ok: boolean; message: string | null };

const inviteSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("A valid email is required"),
  role: z.enum(["ADMIN", "MANAGER", "STAFF"]),
  duty: z.string().optional(),
  clients: z.string().optional(),
  note: z.string().optional(),
});

/**
 * Only an OWNER can change access. An ADMIN can see the matrix but not edit
 * it — otherwise the highest-privilege role is one click away for anyone who
 * already has most of it.
 */
export async function inviteEmployee(_prev: TeamState, formData: FormData): Promise<TeamState> {
  const actor = await requireUser(["OWNER", "ADMIN"]);

  const parsed = inviteSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message };

  const { name, email, role, duty, clients, note } = parsed.data;

  if (role === "ADMIN" && actor.role !== "OWNER") {
    return { ok: false, message: "Only an owner can create another admin." };
  }

  // Modules ticked on the invite form.
  const modules = MODULES.filter((m) => formData.get(`mod.${m.key}`) === "on")
    .filter((m) => isGrantable(m.key, role as AppRole))
    .map((m) => m.key);

  if (!process.env.DATABASE_URL) {
    return {
      ok: true,
      message: `Validated — ${name} as ${role} with ${modules.length} extra modules and ${
        clients ? clients.split(",").length : 0
      } accounts. Nothing stored: no DATABASE_URL.`,
    };
  }

  try {
    const { prisma } = await import("@/lib/prisma");

    /**
     * A temporary password is set on creation.
     *
     * Without one the row exists but nobody can sign in, which reads as "I
     * added them and nothing happened". A proper invite-link flow needs email
     * delivery configured; until then the owner passes this on directly and
     * the person changes it.
     */
    const tempPassword = `bmu-${Math.random().toString(36).slice(2, 8)}`;
    const bcrypt = (await import("bcryptjs")).default;

    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: { id: true, passwordHash: true },
    });

    const user = await prisma.user.upsert({
      where: { email: email.toLowerCase() },
      update: { name, role: role as never },
      create: {
        email: email.toLowerCase(),
        name,
        role: role as never,
        // Only set a password on a genuinely new person — never reset someone's existing one.
        passwordHash: bcrypt.hashSync(tempPassword, 10),
      },
    });

    if (modules.length) {
      await prisma.userPermission.upsert({
        where: { userId_module_kind: { userId: user.id, module: "__bulk", kind: "GRANT" } },
        update: { actions: modules },
        create: { userId: user.id, module: "__bulk", kind: "GRANT", actions: modules, grantedBy: actor.id },
      });
    }

    for (const clientId of (clients ?? "").split(",").map((c) => c.trim()).filter(Boolean)) {
      await prisma.staffAssignment.upsert({
        where: { userId_clientId_businessId: { userId: user.id, clientId, businessId: "" } },
        update: { duty: duty ?? "LEAD", note },
        create: { userId: user.id, clientId, businessId: "", duty: duty ?? "LEAD", note, assignedBy: actor.id },
      });
    }

    revalidatePath("/admin/team");
    revalidatePath("/admin/roles");

    return {
      ok: true,
      message: existing
        ? `${name} updated. Their existing password is unchanged.`
        : `${name} added as ${role}. Temporary password: ${tempPassword} — pass it on and ask them to change it.`,
    };
  } catch (err) {
    console.error("[team] invite failed:", err);
    return { ok: false, message: "Couldn't add that person. Check the server logs." };
  }
}

const matrixSchema = z.object({ role: z.enum(["ADMIN", "MANAGER", "STAFF"]) });

export async function saveRoleMatrix(_prev: TeamState, formData: FormData): Promise<TeamState> {
  await requireUser(["OWNER"]);

  const parsed = matrixSchema.safeParse({ role: formData.get("role") });
  if (!parsed.success) return { ok: false, message: "Pick a role first." };

  const role = parsed.data.role as AppRole;
  const changes: Record<string, Action[]> = {};

  for (const mod of MODULES) {
    if (!isGrantable(mod.key, role)) continue;
    const actions = mod.actions.filter((a) => formData.get(`${mod.key}.${a}`) === "on");
    if (actions.length) changes[mod.key] = actions;
  }

  if (!process.env.DATABASE_URL) {
    return {
      ok: true,
      message: `Validated ${Object.keys(changes).length} modules for ${role}. Not stored: no DATABASE_URL.`,
    };
  }

  // Role defaults live in code so they're reviewable in version control;
  // saved changes are stored as overrides against the role name.
  try {
    const { prisma } = await import("@/lib/prisma");
    await prisma.userPermission.upsert({
      where: { userId_module_kind: { userId: `role:${role}`, module: "__matrix", kind: "GRANT" } },
      update: { actions: Object.entries(changes).map(([k, v]) => `${k}:${v.join("|")}`) },
      create: {
        userId: `role:${role}`,
        module: "__matrix",
        kind: "GRANT",
        actions: Object.entries(changes).map(([k, v]) => `${k}:${v.join("|")}`),
      },
    });
    revalidatePath("/admin/roles");
    return { ok: true, message: `Permissions updated for ${role}.` };
  } catch (err) {
    console.error("[roles] matrix save failed:", err);
    return { ok: false, message: "Couldn't save that." };
  }
}

const subRoleSchema = z.object({
  name: z.string().min(2, "Give the sub-role a name"),
  description: z.string().optional(),
  baseRole: z.enum(["ADMIN", "MANAGER", "STAFF"]),
});

/**
 * Create a sub-role. Permissions are clamped to the base role before saving —
 * without that, a sub-role is a privilege-escalation path: build one on STAFF,
 * tick invoices, and you've handed out every client's numbers.
 */
export async function createSubRole(_prev: TeamState, formData: FormData): Promise<TeamState> {
  const actor = await requireUser(["OWNER"]);

  const parsed = subRoleSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    baseRole: formData.get("baseRole"),
  });
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message };

  const { name, description, baseRole } = parsed.data;
  const { clampToBase } = await import("@/lib/permissions");

  const requested: Record<string, Action[]> = {};
  for (const mod of MODULES) {
    const actions = mod.actions.filter((a) => formData.get(`${mod.key}.${a}`) === "on");
    if (actions.length) requested[mod.key] = actions;
  }

  const permissions = clampToBase(baseRole as AppRole, requested);
  const dropped = Object.keys(requested).length - Object.keys(permissions).length;
  const slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  if (!Object.keys(permissions).length) {
    return { ok: false, message: `Nothing left after clamping to ${baseRole}. Pick a higher base role.` };
  }

  if (!process.env.DATABASE_URL) {
    return {
      ok: true,
      message: `Validated "${name}" on ${baseRole} with ${Object.keys(permissions).length} modules${
        dropped ? `, ${dropped} dropped as above the base role` : ""
      }. Not stored: no DATABASE_URL.`,
    };
  }

  try {
    const { prisma } = await import("@/lib/prisma");
    await prisma.customRole.upsert({
      where: { slug },
      update: { name, description, baseRole, permissions: permissions as never },
      create: { slug, name, description, baseRole, permissions: permissions as never, createdBy: actor.id },
    });
    revalidatePath("/admin/roles");
    return {
      ok: true,
      message: `"${name}" created${dropped ? ` — ${dropped} module(s) dropped as above ${baseRole}` : ""}.`,
    };
  } catch (err) {
    console.error("[roles] sub-role failed:", err);
    return { ok: false, message: "Couldn't create that sub-role." };
  }
}

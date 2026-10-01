"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/session";
import { isStaff } from "@/lib/roles";

export type LeadState = { ok: boolean; message: string | null };

const NEXT_STATUS = ["NEW", "CONTACTED", "QUALIFIED", "SITE_VISIT", "PROPOSAL", "WON", "LOST"] as const;

/**
 * Assigning a lead is the moment someone becomes accountable for it, so it
 * writes a trail entry as well as the field. An unassigned lead with no
 * history is indistinguishable from one everybody assumed someone else had.
 */
export async function assignLead(_prev: LeadState, formData: FormData): Promise<LeadState> {
  const user = await requireUser();
  if (!isStaff(user.role)) return { ok: false, message: "Only agency staff can assign leads." };

  const leadId = String(formData.get("leadId") ?? "");
  const assignee = String(formData.get("assignee") ?? "");
  const assigneeName = String(formData.get("assigneeName") ?? "someone");

  if (!leadId) return { ok: false, message: "Missing lead." };

  if (!process.env.DATABASE_URL) {
    return {
      ok: true,
      message: assignee
        ? `Would assign to ${assigneeName}. Not stored — no DATABASE_URL.`
        : "Would unassign. Not stored — no DATABASE_URL.",
    };
  }

  try {
    const { prisma } = await import("@/lib/prisma");
    await prisma.$transaction([
      prisma.lead.update({
        where: { id: leadId },
        data: {
          assignedTo: assignee || null,
          assignedAt: assignee ? new Date() : null,
        },
      }),
      prisma.leadNote.create({
        data: {
          leadId,
          authorId: user.id,
          authorName: user.name ?? "Someone",
          kind: "ASSIGN",
          body: assignee ? `Assigned to ${assigneeName}` : "Unassigned",
        },
      }),
    ]);

    revalidatePath("/admin/leads");
    return { ok: true, message: assignee ? `Assigned to ${assigneeName}.` : "Unassigned." };
  } catch (err) {
    console.error("[leads] assign failed:", err);
    return { ok: false, message: "Couldn't assign that lead." };
  }
}

const statusSchema = z.object({
  leadId: z.string().min(1),
  status: z.enum(NEXT_STATUS),
  lostReason: z.string().optional(),
});

export async function updateLeadStatus(_prev: LeadState, formData: FormData): Promise<LeadState> {
  const user = await requireUser();

  const parsed = statusSchema.safeParse({
    leadId: formData.get("leadId"),
    status: formData.get("status"),
    lostReason: formData.get("lostReason"),
  });
  if (!parsed.success) return { ok: false, message: "Pick a valid status." };

  const { leadId, status, lostReason } = parsed.data;

  // A lost lead without a reason teaches you nothing next quarter.
  if (status === "LOST" && !lostReason?.trim()) {
    return { ok: false, message: "Say why it was lost — that's the only useful part of a loss." };
  }

  if (!process.env.DATABASE_URL) {
    return { ok: true, message: `Would move to ${status.toLowerCase()}. Not stored — no DATABASE_URL.` };
  }

  try {
    const { prisma } = await import("@/lib/prisma");
    const existing = await prisma.lead.findUnique({
      where: { id: leadId },
      select: { firstResponseAt: true, status: true },
    });

    await prisma.$transaction([
      prisma.lead.update({
        where: { id: leadId },
        data: {
          status,
          lostReason: status === "LOST" ? lostReason : null,
          lastContactedAt: new Date(),
          // Only stamped once, the first time it moves off NEW.
          firstResponseAt:
            !existing?.firstResponseAt && existing?.status === "NEW" ? new Date() : undefined,
        },
      }),
      prisma.leadNote.create({
        data: {
          leadId,
          authorId: user.id,
          authorName: user.name ?? "Someone",
          kind: "STATUS",
          body: `Moved to ${status.replace("_", " ").toLowerCase()}${lostReason ? ` — ${lostReason}` : ""}`,
        },
      }),
    ]);

    revalidatePath("/admin/leads");
    revalidatePath("/dashboard/leads");
    return { ok: true, message: `Moved to ${status.replace("_", " ").toLowerCase()}.` };
  } catch (err) {
    console.error("[leads] status update failed:", err);
    return { ok: false, message: "Couldn't update that lead." };
  }
}

export async function addLeadNote(_prev: LeadState, formData: FormData): Promise<LeadState> {
  const user = await requireUser();

  const leadId = String(formData.get("leadId") ?? "");
  const body = String(formData.get("body") ?? "").trim();
  const kind = String(formData.get("kind") ?? "NOTE");

  if (!body) return { ok: false, message: "Write something first." };

  if (!process.env.DATABASE_URL) {
    return { ok: true, message: "Note validated. Not stored — no DATABASE_URL." };
  }

  try {
    const { prisma } = await import("@/lib/prisma");
    await prisma.$transaction([
      prisma.leadNote.create({
        data: { leadId, authorId: user.id, authorName: user.name ?? "Someone", kind, body },
      }),
      prisma.lead.update({ where: { id: leadId }, data: { lastContactedAt: new Date() } }),
    ]);

    revalidatePath("/admin/leads");
    return { ok: true, message: "Note added." };
  } catch (err) {
    console.error("[leads] note failed:", err);
    return { ok: false, message: "Couldn't save that note." };
  }
}

/** Bulk assign — the realistic case is 30 overnight leads and one owner. */
export async function bulkAssign(formData: FormData) {
  const user = await requireUser();
  if (!isStaff(user.role)) return;

  const ids = String(formData.get("ids") ?? "").split(",").filter(Boolean);
  const assignee = String(formData.get("assignee") ?? "");
  if (!ids.length || !process.env.DATABASE_URL) return;

  try {
    const { prisma } = await import("@/lib/prisma");
    await prisma.lead.updateMany({
      where: { id: { in: ids } },
      data: { assignedTo: assignee || null, assignedAt: assignee ? new Date() : null },
    });
    revalidatePath("/admin/leads");
  } catch (err) {
    console.error("[leads] bulk assign failed:", err);
  }
}

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireStaff } from "@/lib/session";
import { KPI_LIBRARY, MODULE_LABEL, setupBySlug } from "@/lib/industry-setup";

export type IndustryState = { ok: boolean; message: string | null };

const schema = z.object({
  slug: z.string().min(2),
  name: z.string().min(2, "Give the industry a name"),
  category: z.string().min(2),
  plan: z.enum(["STARTER", "BUSINESS", "PRO"]),
  primaryGoal: z.string().min(2, "What is this business trying to increase?"),
  heroMetric: z.string().min(2, "Name the metric that goes first"),
  primaryActions: z.string().optional(),
  kit: z.string().optional(),
});

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 48);

export async function saveIndustrySetup(
  _prev: IndustryState,
  formData: FormData
): Promise<IndustryState> {
  const user = await requireStaff();

  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message };

  const d = parsed.data;
  const isNew = d.slug === "new";
  const slug = isNew ? slugify(d.name) : d.slug;

  const modules = Object.keys(MODULE_LABEL).filter((m) => formData.get(`mod.${m}`) === "on");
  const kpis = Object.keys(KPI_LIBRARY).filter((k) => formData.get(`kpi.${k}`) === "on");

  if (!modules.length) return { ok: false, message: "Pick at least one module." };
  if (kpis.length !== 4) {
    return { ok: false, message: `Pick exactly four KPI cards — you have ${kpis.length}.` };
  }

  const primaryActions = (d.primaryActions ?? "").split("\n").map((l) => l.trim()).filter(Boolean);
  const kit = (d.kit ?? "").split("\n").map((l) => l.trim()).filter(Boolean);

  if (!primaryActions.length) {
    return { ok: false, message: "Add at least one profile button." };
  }

  if (!process.env.DATABASE_URL) {
    return {
      ok: true,
      message: `Validated "${d.name}" — ${modules.length} modules, ${kpis.length} KPIs, ${primaryActions.length} buttons. Not stored: no DATABASE_URL.`,
    };
  }

  try {
    const { prisma } = await import("@/lib/prisma");
    await prisma.industrySetting.upsert({
      where: { slug },
      update: {
        name: d.name, category: d.category, plan: d.plan,
        primaryGoal: d.primaryGoal, heroMetric: d.heroMetric,
        primaryActions, modules, kpis, kit, updatedBy: user.id,
      },
      create: {
        slug, name: d.name, category: d.category, plan: d.plan,
        primaryGoal: d.primaryGoal, heroMetric: d.heroMetric,
        primaryActions, modules, kpis, kit, updatedBy: user.id,
      },
    });

    revalidatePath("/admin/industries");
    revalidatePath("/business");

    if (isNew) redirect(`/admin/industries/${slug}`);
    return { ok: true, message: "Saved. Tenants in this industry see it on next load." };
  } catch (err) {
    if (err && typeof err === "object" && "digest" in err) throw err;
    console.error("[industry] save failed:", err);
    return { ok: false, message: "Couldn't save that. Check the server logs." };
  }
}

/** Removes the override so the shipped default takes over again. */
export async function resetIndustry(formData: FormData) {
  await requireStaff();
  const slug = String(formData.get("slug") ?? "");

  if (process.env.DATABASE_URL) {
    try {
      const { prisma } = await import("@/lib/prisma");
      await prisma.industrySetting.delete({ where: { slug } }).catch(() => null);
    } catch (err) {
      console.error("[industry] reset failed:", err);
    }
  }

  revalidatePath("/admin/industries");
  redirect(setupBySlug(slug) ? `/admin/industries/${slug}` : "/admin/industries");
}

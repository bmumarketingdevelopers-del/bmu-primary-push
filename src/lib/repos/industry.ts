import { LIST_LIMIT } from "./db";
import { cache } from "react";
import {
  INDUSTRY_SETUPS, type IndustrySetup, type KpiKey, type ModuleKey,
} from "@/lib/industry-setup";

/**
 * Industry setups, editable from the admin panel.
 *
 * Shipped defaults live in code so they're reviewable in version control.
 * An edit writes an IndustrySetting row that overrides the default on slug;
 * deleting that row restores the original, which is why "reset" is possible
 * at all.
 */
const fromRow = (row: {
  slug: string; name: string; category: string; primaryActions: string[];
  modules: string[]; kpis: string[]; plan: string; kit: string[];
  primaryGoal: string; heroMetric: string;
}): IndustrySetup => {
  const fallback = INDUSTRY_SETUPS.find((i) => i.slug === row.slug);

  return {
    slug: row.slug,
    name: row.name,
    category: row.category,
    primaryGoal: row.primaryGoal,
    heroMetric: row.heroMetric,
    primaryActions: row.primaryActions.length ? row.primaryActions : (fallback?.primaryActions ?? []),
    // Exactly four cards — more overflows the row, fewer looks unfinished.
    kpis: (row.kpis.length ? row.kpis : (fallback?.kpis ?? [])).slice(0, 4) as KpiKey[],
    modules: (row.modules.length ? row.modules : (fallback?.modules ?? [])) as ModuleKey[],
    plan: row.plan.toUpperCase() as IndustrySetup["plan"],
    kit: row.kit.length ? row.kit : (fallback?.kit ?? []),
  };
};

export const getIndustrySetups = cache(async (): Promise<IndustrySetup[]> => {
  if (!process.env.DATABASE_URL) return INDUSTRY_SETUPS;

  try {
    const { prisma } = await import("@/lib/prisma");
    const rows = await prisma.industrySetting.findMany({
        take: LIST_LIMIT,
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });

    const bySlug = new Map(INDUSTRY_SETUPS.map((i) => [i.slug, i]));
    for (const row of rows) bySlug.set(row.slug, fromRow(row));

    return [...bySlug.values()];
  } catch (err) {
    console.warn("[industry] database unavailable, using shipped setups:", err);
    return INDUSTRY_SETUPS;
  }
});

export async function getIndustrySetup(slug: string) {
  const all = await getIndustrySetups();
  return all.find((i) => i.slug === slug) ?? null;
}

/** True when an override exists — drives the "Reset to default" button. */
export async function isCustomised(slug: string) {
  if (!process.env.DATABASE_URL) return false;

  try {
    const { prisma } = await import("@/lib/prisma");
    const row = await prisma.industrySetting.findUnique({
      where: { slug },
      select: { id: true },
    });
    return Boolean(row);
  } catch {
    return false;
  }
}

/** Industries added in admin that have no shipped default behind them. */
export async function customIndustries() {
  const all = await getIndustrySetups();
  const shipped = new Set(INDUSTRY_SETUPS.map((i) => i.slug));
  return all.filter((i) => !shipped.has(i.slug));
}

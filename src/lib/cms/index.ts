import { cache } from "react";
import { CMS_DEFAULTS } from "./defaults";

/**
 * Read a content block.
 *
 * Order of resolution: database → defaults. Never throws, never returns
 * undefined for a known key, so a page render can't be broken by an empty
 * table or an unreachable database.
 *
 * `cache()` dedupes within a single render pass, so ten components asking for
 * "global.footer" issue one query.
 */
export const getBlock = cache(async <T extends Record<string, unknown>>(key: string): Promise<T> => {
  const fallback = (CMS_DEFAULTS[key] ?? {}) as T;

  if (!process.env.DATABASE_URL) return fallback;

  try {
    const { prisma } = await import("@/lib/prisma");
    const row = await prisma.contentBlock.findUnique({ where: { key } });
    if (!row?.data) return fallback;

    // Merge so a block saved before a new field existed still resolves it.
    return { ...fallback, ...(row.data as Record<string, unknown>) } as T;
  } catch (err) {
    console.warn(`[cms] "${key}" fell back to defaults:`, err);
    return fallback;
  }
});

/** All blocks in one query — for pages that need several. */
export async function getBlocks(keys: string[]) {
  const entries = await Promise.all(keys.map(async (k) => [k, await getBlock(k)] as const));
  return Object.fromEntries(entries) as Record<string, Record<string, unknown>>;
}

export async function saveBlock(key: string, data: Record<string, unknown>, userId?: string) {
  if (!process.env.DATABASE_URL) {
    console.info(`[cms] would save "${key}" — no DATABASE_URL`);
    return { saved: false as const, reason: "no-database" as const };
  }

  const { prisma } = await import("@/lib/prisma");
  const { blockByKey } = await import("./schema");
  const def = blockByKey(key);

  await prisma.contentBlock.upsert({
    where: { key },
    update: { data: data as never, updatedBy: userId },
    create: {
      key,
      label: def?.label ?? key,
      group: def?.group ?? "general",
      data: data as never,
      updatedBy: userId,
    },
  });

  return { saved: true as const };
}

export { CMS_DEFAULTS };

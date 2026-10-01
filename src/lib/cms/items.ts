import { cache } from "react";
import { COLLECTION_DEFAULTS } from "./collection-defaults";
import { collectionByKey } from "./collections";

export type CollectionItem = Record<string, unknown> & {
  slug: string;
  __published?: boolean;
  __fromDb?: boolean;
};

/**
 * Read a collection.
 *
 * Database items win over defaults, matched on slug. An item saved in admin
 * replaces the seed version; an item only in the seed still appears. That
 * means the site works before anything is edited and keeps working after.
 */
export const getCollection = cache(async (key: string, opts: { includeDrafts?: boolean } = {}): Promise<CollectionItem[]> => {
  const defaults = (COLLECTION_DEFAULTS[key] ?? []) as CollectionItem[];

  if (!process.env.DATABASE_URL) {
    return defaults.map((d) => ({ ...d, __published: true }));
  }

  try {
    const { prisma } = await import("@/lib/prisma");
    const rows = await prisma.contentItem.findMany({
      where: { collection: key, ...(opts.includeDrafts ? {} : { isPublished: true }) },
      orderBy: { sortOrder: "asc" },
    });

    const bySlug = new Map<string, CollectionItem>();
    for (const d of defaults) bySlug.set(String(d.slug), { ...d, __published: true });

    for (const row of rows) {
      bySlug.set(row.slug, {
        ...(row.data as Record<string, unknown>),
        slug: row.slug,
        __published: row.isPublished,
        __fromDb: true,
      });
    }

    // Anything deliberately unpublished in admin disappears from the site.
    const all = [...bySlug.values()];
    return opts.includeDrafts ? all : all.filter((i) => i.__published !== false);
  } catch (err) {
    console.warn(`[cms] collection "${key}" fell back to defaults:`, err);
    return defaults.map((d) => ({ ...d, __published: true }));
  }
});

export async function getItem(key: string, slug: string) {
  const items = await getCollection(key, { includeDrafts: true });
  return items.find((i) => String(i.slug) === slug) ?? null;
}

export async function saveItem(
  key: string,
  slug: string,
  data: Record<string, unknown>,
  userId?: string
) {
  if (!process.env.DATABASE_URL) {
    console.info(`[cms] would save ${key}/${slug} — no DATABASE_URL`);
    return { saved: false as const };
  }

  const def = collectionByKey(key);
  const title = String(data[def?.titleField ?? "title"] ?? slug);

  const { prisma } = await import("@/lib/prisma");
  const existing = await prisma.contentItem.findUnique({
    where: { collection_slug: { collection: key, slug } },
  });

  await prisma.contentItem.upsert({
    where: { collection_slug: { collection: key, slug } },
    update: { data: data as never, title, updatedBy: userId },
    create: {
      collection: key,
      slug,
      title,
      data: data as never,
      updatedBy: userId,
      // New items land at the end rather than jumping to the top.
      sortOrder: existing?.sortOrder ?? (await nextSortOrder(key)),
    },
  });

  return { saved: true as const };
}

async function nextSortOrder(key: string) {
  const { prisma } = await import("@/lib/prisma");
  const last = await prisma.contentItem.findFirst({
    where: { collection: key },
    orderBy: { sortOrder: "desc" },
    select: { sortOrder: true },
  });
  return (last?.sortOrder ?? 0) + 10;
}

export async function setPublished(key: string, slug: string, isPublished: boolean) {
  if (!process.env.DATABASE_URL) return;
  const { prisma } = await import("@/lib/prisma");

  // A seed item has no row yet, so publishing state needs one created first.
  const defaults = COLLECTION_DEFAULTS[key] ?? [];
  const seed = defaults.find((d) => String(d.slug) === slug);
  const def = collectionByKey(key);

  await prisma.contentItem.upsert({
    where: { collection_slug: { collection: key, slug } },
    update: { isPublished },
    create: {
      collection: key,
      slug,
      title: String(seed?.[def?.titleField ?? "title"] ?? slug),
      data: (seed ?? { slug }) as never,
      isPublished,
      sortOrder: await nextSortOrder(key),
    },
  });
}

export async function deleteItem(key: string, slug: string) {
  if (!process.env.DATABASE_URL) return { deleted: false as const };
  const { prisma } = await import("@/lib/prisma");

  await prisma.contentItem
    .delete({ where: { collection_slug: { collection: key, slug } } })
    .catch(() => null);

  // Deleting a seed-backed item would just resurrect it, so hide it instead.
  const defaults = COLLECTION_DEFAULTS[key] ?? [];
  if (defaults.some((d) => String(d.slug) === slug)) {
    await setPublished(key, slug, false);
    return { deleted: false as const, hidden: true as const };
  }

  return { deleted: true as const };
}

export async function reorder(key: string, slugs: string[]) {
  if (!process.env.DATABASE_URL) return;
  const { prisma } = await import("@/lib/prisma");

  await Promise.all(
    slugs.map((slug, index) =>
      prisma.contentItem.updateMany({
        where: { collection: key, slug },
        data: { sortOrder: index * 10 },
      })
    )
  );
}

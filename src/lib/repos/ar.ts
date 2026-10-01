import { cache } from "react";

export type ArExperience = {
  slug: string;
  name: string;
  businessName: string;
  businessSlug: string;
  targetUrl: string;
  targetMindUrl: string | null;
  targetQuality: number | null;
  contentType: string;
  contentUrl: string;
  contentRatio: number;
  loop: boolean;
  ctaLabel: string | null;
  ctaUrl: string | null;
  scans: number;
  isPublished: boolean;
};

/**
 * Demo experiences so the feature is reachable before anything is uploaded.
 *
 * targetMindUrl is null on purpose: a compiled target is generated from the
 * artwork, and inventing a URL for one that doesn't exist would produce a
 * viewer that loads a camera and then silently never tracks anything. Null
 * surfaces an honest "not ready" state instead.
 */
const DEMO: ArExperience[] = [
  {
    slug: "saffron-menu-card",
    name: "Brunch menu card",
    businessName: "Saffron & Co",
    businessSlug: "restaurants",
    targetUrl: "/demo/ar-target-menu.jpg",
    targetMindUrl: null,
    targetQuality: 82,
    contentType: "VIDEO",
    contentUrl: "/demo/ar-brunch.mp4",
    contentRatio: 0.5625,
    loop: true,
    ctaLabel: "Book a table",
    ctaUrl: "/b/restaurants/book",
    scans: 412,
    isPublished: true,
  },
  {
    slug: "atria-brochure",
    name: "Tower C brochure",
    businessName: "Atria Living",
    businessSlug: "real-estate",
    targetUrl: "/demo/ar-target-brochure.jpg",
    targetMindUrl: null,
    targetQuality: 91,
    contentType: "VIDEO",
    contentUrl: "/demo/ar-walkthrough.mp4",
    contentRatio: 0.5625,
    loop: true,
    ctaLabel: "Book a site visit",
    ctaUrl: "/b/real-estate/book",
    scans: 1284,
    isPublished: true,
  },
  {
    slug: "abc-salon-card",
    name: "Visiting card",
    businessName: "ABC Salon",
    businessSlug: "salons",
    targetUrl: "/demo/ar-target-card.jpg",
    targetMindUrl: null,
    targetQuality: 48,
    contentType: "VIDEO",
    contentUrl: "/demo/ar-salon.mp4",
    contentRatio: 1.3333,
    loop: true,
    ctaLabel: null,
    ctaUrl: null,
    scans: 96,
    isPublished: false,
  },
];

export const getArExperiences = cache(async (businessSlug?: string) => {
  if (!process.env.DATABASE_URL) {
    return businessSlug ? DEMO.filter((e) => e.businessSlug === businessSlug) : DEMO;
  }

  try {
    const { prisma } = await import("@/lib/prisma");
    const rows = await prisma.arExperience.findMany({
      where: businessSlug ? { business: { slug: businessSlug } } : {},
      orderBy: { createdAt: "desc" },
      include: { business: { select: { name: true, slug: true } } },
      take: 200,
    });

    if (rows.length === 0) {
      return businessSlug ? DEMO.filter((e) => e.businessSlug === businessSlug) : DEMO;
    }

    return rows.map((r) => ({
      slug: r.slug,
      name: r.name,
      businessName: r.business.name,
      businessSlug: r.business.slug,
      targetUrl: r.targetUrl,
      targetMindUrl: r.targetMindUrl,
      targetQuality: r.targetQuality,
      contentType: r.contentType,
      contentUrl: r.contentUrl,
      contentRatio: r.contentRatio,
      loop: r.loop,
      ctaLabel: r.ctaLabel,
      ctaUrl: r.ctaUrl,
      scans: r.scans,
      isPublished: r.isPublished,
    })) as ArExperience[];
  } catch (err) {
    console.warn("[ar] database unavailable:", err);
    return DEMO;
  }
});

export async function getArExperience(slug: string) {
  const all = await getArExperiences();
  const found = all.find((e) => e.slug === slug) ?? null;

  // A view is worth counting, but a failed count must never block the camera.
  if (found && process.env.DATABASE_URL) {
    try {
      const { prisma } = await import("@/lib/prisma");
      await prisma.arExperience.updateMany({
        where: { slug },
        data: { scans: { increment: 1 } },
      });
    } catch {
      /* counting is best-effort */
    }
  }

  return found;
}

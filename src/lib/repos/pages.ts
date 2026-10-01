import { LIST_LIMIT } from "./db";
import { cache } from "react";
import type { PageSection } from "@/lib/page-builder";

export type CustomPage = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  sections: PageSection[];
  metaTitle: string | null;
  metaDesc: string | null;
  isPublished: boolean;
  navLabel: string | null;
  navOrder: number;
  updatedAt: string;
};

/** Example page so the builder isn't a blank screen on first open. */
const DEMO_PAGES: CustomPage[] = [
  {
    id: "demo-1",
    slug: "why-bmu",
    title: "Why BMU",
    subtitle: "What working with us actually looks like",
    isPublished: false,
    navLabel: null,
    navOrder: 100,
    metaTitle: null,
    metaDesc: null,
    updatedAt: new Date().toISOString(),
    sections: [
      {
        id: "s1", type: "hero",
        data: {
          eyebrow: "About",
          heading: "Marketing that reports honestly",
          lede: "Most agencies show you impressions. We show you what came in, what it cost, and what closed.",
          ctaLabel: "Book a call", ctaHref: "/contact",
        },
      },
      {
        id: "s2", type: "stats",
        data: { items: [
          { value: "312%", label: "Average traffic growth" },
          { value: "₹4.2Cr", label: "Client revenue attributed" },
          { value: "11", label: "Average months retained" },
        ] },
      },
      {
        id: "s3", type: "text",
        data: { width: "narrow", paragraphs: [
          "Every report we send names the number that got worse as well as the ones that improved.",
          "That is unusual, and it is the reason clients stay past the first contract.",
        ] },
      },
    ],
  },
];

export const getCustomPages = cache(async (opts: { includeDrafts?: boolean } = {}) => {
  if (!process.env.DATABASE_URL) {
    return opts.includeDrafts ? DEMO_PAGES : DEMO_PAGES.filter((p) => p.isPublished);
  }

  try {
    const { prisma } = await import("@/lib/prisma");
    const rows = await prisma.customPage.findMany({
        take: LIST_LIMIT,
      where: opts.includeDrafts ? {} : { isPublished: true },
      orderBy: { navOrder: "asc" },
    });

    // An empty table on a fresh install is not the same as "no pages" — show
    // the example so the builder has something to open.
    if (rows.length === 0) {
      return opts.includeDrafts ? DEMO_PAGES : [];
    }

    return rows.map((r) => ({
      ...r,
      sections: (r.sections as unknown as PageSection[]) ?? [],
      updatedAt: r.updatedAt.toISOString(),
    })) as CustomPage[];
  } catch (err) {
    console.warn("[pages] database unavailable:", err);
    return opts.includeDrafts ? DEMO_PAGES : [];
  }
});

export async function getCustomPage(slug: string) {
  const pages = await getCustomPages({ includeDrafts: true });
  return pages.find((p) => p.slug === slug) ?? null;
}

/** Published pages that asked to appear in the header. */
export async function getNavPages() {
  const pages = await getCustomPages();
  return pages
    .filter((p) => p.navLabel)
    .map((p) => ({ href: `/p/${p.slug}`, label: p.navLabel as string, order: p.navOrder }));
}

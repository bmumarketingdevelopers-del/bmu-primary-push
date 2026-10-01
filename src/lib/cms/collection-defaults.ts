/**
 * Seed content for every collection, taken from the existing data files.
 *
 * These are what the site renders until something is saved in the admin
 * panel, and what it falls back to if the database is unreachable. Nothing
 * on the public site can render empty because of a CMS problem.
 */
import { SERVICE_DETAILS } from "@/lib/services-data";
import { PRODUCT_DETAILS } from "@/lib/products-data";
import { INDUSTRY_DETAILS } from "@/lib/industries-data";
import { CASE_STUDIES } from "@/lib/case-studies-data";
import { POSTS } from "@/lib/posts-data";
import { WORK } from "@/lib/content";
import { PRODUCTS as STORE_PRODUCTS } from "@/lib/store";
import { TEAM, VALUES } from "@/lib/company-data";

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const COLLECTION_DEFAULTS: Record<string, Record<string, unknown>[]> = {
  services: SERVICE_DETAILS as unknown as Record<string, unknown>[],
  products: PRODUCT_DETAILS as unknown as Record<string, unknown>[],
  industries: INDUSTRY_DETAILS as unknown as Record<string, unknown>[],
  "case-studies": CASE_STUDIES as unknown as Record<string, unknown>[],
  posts: POSTS as unknown as Record<string, unknown>[],

  portfolio: WORK.map((w) => ({ ...w, slug: slugify(w.title) })),

  "store-products": STORE_PRODUCTS.map((p) => ({
    ...p,
    isPopular: p.isPopular ? "yes" : "no",
  })) as unknown as Record<string, unknown>[],

  team: TEAM.map((t) => ({ ...t, slug: slugify(t.name) })),
  values: VALUES.map((v) => ({ ...v, slug: slugify(v.title) })),
};

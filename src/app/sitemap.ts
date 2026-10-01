import type { MetadataRoute } from "next";
import { SERVICE_DETAILS } from "@/lib/services-data";
import { PRODUCT_DETAILS, productHref } from "@/lib/products-data";
import { INDUSTRY_DETAILS } from "@/lib/industries-data";
import { CASE_STUDIES } from "@/lib/case-studies-data";
import { POSTS } from "@/lib/posts-data";
import { PRODUCTS as STORE_PRODUCTS } from "@/lib/store";

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes = [
    { path: "", priority: 1 },
    { path: "/services", priority: 0.9 },
    { path: "/products", priority: 0.9 },
    { path: "/industries", priority: 0.8 },
    { path: "/case-studies", priority: 0.8 },
    { path: "/pricing", priority: 0.9 },
    { path: "/resources", priority: 0.7 },
    { path: "/about", priority: 0.6 },
    { path: "/contact", priority: 0.9 },
    { path: "/join", priority: 0.7 },
    { path: "/store", priority: 0.9 },
    { path: "/partners", priority: 0.8 },
  ].map((r) => ({
    url: `${BASE}${r.path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: r.priority,
  }));

  const dynamicRoutes = [
    ...SERVICE_DETAILS.map((s) => `/services/${s.slug}`),
    // Coming-soon products aren't linked anywhere, so they're left out here too
    ...PRODUCT_DETAILS.map(productHref).filter((href): href is string => !!href),
    ...INDUSTRY_DETAILS.map((i) => `/industries/${i.slug}`),
    ...CASE_STUDIES.map((c) => `/case-studies/${c.slug}`),
    ...POSTS.map((p) => `/resources/${p.slug}`),
    ...STORE_PRODUCTS.map((p) => `/store/${p.slug}`),
  ].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...dynamicRoutes];
}

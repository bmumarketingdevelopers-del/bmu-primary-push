/**
 * The one place that decides between real data and demo data.
 *
 * Every repository function goes through `query`. If DATABASE_URL is unset,
 * or Postgres is unreachable, or the table is simply empty on a fresh
 * install, the fallback is returned. That means a page never has to know
 * which mode it's in — and a database blip degrades the dashboard rather
 * than breaking it.
 */

let warned = false;

/**
 * How many rows a dashboard list may load at once.
 *
 * An admin page that pulls every project ever created works fine at fifty and
 * times out at five thousand. These caps are deliberately generous — enough
 * that nobody hits them in normal use, low enough that one bad query can't
 * take the page down.
 */
export const LIST_LIMIT = 500;
export const RECENT_LIMIT = 100;

/** Rows per page in admin lists. */
export const PAGE_SIZE = 25;

export type Page = { page: number; pageSize: number; total: number; pages: number };

/**
 * Reads a page number off the URL.
 *
 * Anything unparseable becomes page 1 rather than an error — a mistyped query
 * string should show the first page, not a stack trace.
 */
export function pageFrom(searchParams?: { page?: string | string[] }): number {
  const raw = Array.isArray(searchParams?.page) ? searchParams?.page[0] : searchParams?.page;
  const n = Number(raw);
  return Number.isFinite(n) && n >= 1 ? Math.floor(n) : 1;
}

export function paginate<T>(rows: T[], page: number, pageSize = PAGE_SIZE) {
  const total = rows.length;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  // Asking for page 40 of 3 should land on the last page, not an empty one.
  const current = Math.min(page, pages);
  const start = (current - 1) * pageSize;

  return {
    rows: rows.slice(start, start + pageSize),
    meta: { page: current, pageSize, total, pages } satisfies Page,
  };
}

export type Source = "db" | "demo";

export async function query<T>(
  label: string,
  run: (prisma: import("@prisma/client").PrismaClient) => Promise<T>,
  fallback: T,
  /** Treat an empty result as "not seeded yet" rather than "genuinely none". */
  emptyMeansDemo = true
): Promise<{ data: T; source: Source }> {
  if (!process.env.DATABASE_URL) {
    return { data: fallback, source: "demo" };
  }

  try {
    const { prisma } = await import("@/lib/prisma");
    const result = await run(prisma);

    if (emptyMeansDemo && Array.isArray(result) && result.length === 0) {
      return { data: fallback, source: "demo" };
    }
    if (result === null || result === undefined) {
      return { data: fallback, source: "demo" };
    }

    return { data: result, source: "db" };
  } catch (err) {
    if (!warned) {
      console.warn(`[repo] database unavailable, serving demo data (${label}):`, err);
      warned = true;
    }
    return { data: fallback, source: "demo" };
  }
}

/** Shorthand when the caller doesn't care where the data came from. */
export async function queryData<T>(
  label: string,
  run: (prisma: import("@prisma/client").PrismaClient) => Promise<T>,
  fallback: T
): Promise<T> {
  const { data } = await query(label, run, fallback);
  return data;
}

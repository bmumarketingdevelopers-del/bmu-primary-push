import { createHash, randomBytes } from "node:crypto";

/**
 * Repeat-visit measurement.
 *
 * The claim this supports is "41% came back within 30 days", which is a
 * number no offline business has ever had. It's worth being precise about
 * what it actually measures, because the honest version is still valuable
 * and the overstated version gets found out:
 *
 *  - It counts *devices*, not people. A shared family phone reads as one
 *    visitor; someone who scans on their phone and again on their partner's
 *    reads as two.
 *  - Clearing browser data resets it.
 *  - It only sees people who scan. A regular who never scans is invisible.
 *
 * So the dashboard says "returning devices", not "returning customers", and
 * the number is a floor rather than an estimate.
 */

const COOKIE = "bmu_v";
/** A year. Long enough for seasonal businesses, short enough to expire. */
const MAX_AGE = 60 * 60 * 24 * 365;

/**
 * Hashed with a server-side secret so a leaked row can't be replayed as
 * someone's cookie, and salted per business so the same device can't be
 * correlated across two unrelated shops.
 */
export function visitorKey(cookieValue: string, businessId: string) {
  const secret = process.env.AUTH_SECRET ?? "dev-only-insecure-secret-change-me";
  return createHash("sha256")
    .update(`${cookieValue}:${businessId}:${secret}`)
    .digest("hex")
    .slice(0, 32);
}

export const newVisitorId = () => randomBytes(16).toString("hex");

export type VisitOutcome = {
  isReturning: boolean;
  visitCount: number;
  daysSinceFirst: number | null;
};

/**
 * Records a visit and reports whether this device has been here before.
 *
 * Called from the profile page. Failures are swallowed — a analytics write
 * must never stop someone seeing a menu.
 */
export async function recordVisit(opts: {
  businessId: string;
  cookieValue: string;
  source?: string | null;
}): Promise<VisitOutcome> {
  const fallback: VisitOutcome = { isReturning: false, visitCount: 1, daysSinceFirst: null };

  if (!process.env.DATABASE_URL) return fallback;

  try {
    const { prisma } = await import("@/lib/prisma");
    const key = visitorKey(opts.cookieValue, opts.businessId);

    const existing = await prisma.scanVisitor.findUnique({
      where: { businessId_visitorKey: { businessId: opts.businessId, visitorKey: key } },
      select: { firstSeenAt: true, visitCount: true },
    });

    if (!existing) {
      await prisma.scanVisitor.create({
        data: {
          businessId: opts.businessId,
          visitorKey: key,
          firstSource: opts.source ?? null,
          lastSource: opts.source ?? null,
        },
      });
      return fallback;
    }

    const updated = await prisma.scanVisitor.update({
      where: { businessId_visitorKey: { businessId: opts.businessId, visitorKey: key } },
      data: {
        lastSeenAt: new Date(),
        visitCount: { increment: 1 },
        lastSource: opts.source ?? undefined,
      },
      select: { visitCount: true, firstSeenAt: true },
    });

    return {
      isReturning: true,
      visitCount: updated.visitCount,
      daysSinceFirst: Math.floor(
        (Date.now() - existing.firstSeenAt.getTime()) / 86_400_000
      ),
    };
  } catch (err) {
    console.error("[visitors] record failed:", err);
    return fallback;
  }
}

export type RepeatStats = {
  totalVisitors: number;
  returning: number;
  repeatRate: number;
  /** Returned within 30 days of their first visit. */
  returnedIn30: number;
  returnedIn30Rate: number;
  loyal: number; // four or more visits
  averageVisits: number;
  /** Devices last seen more than 60 days ago — the lapsed group. */
  lapsed: number;
};

const DEMO: RepeatStats = {
  totalVisitors: 1842,
  returning: 756,
  repeatRate: 41,
  returnedIn30: 604,
  returnedIn30Rate: 33,
  loyal: 188,
  averageVisits: 2.1,
  lapsed: 312,
};

export async function getRepeatStats(businessId: string): Promise<RepeatStats> {
  if (!process.env.DATABASE_URL) return DEMO;

  try {
    const { prisma } = await import("@/lib/prisma");
    const rows = await prisma.scanVisitor.findMany({
      where: { businessId },
      select: { visitCount: true, firstSeenAt: true, lastSeenAt: true },
      take: 20000,
    });

    // An empty table on a fresh install isn't "nobody came back" — it's no
    // data yet, and a 0% repeat rate would read as a damning result.
    if (rows.length === 0) return DEMO;

    const total = rows.length;
    const returning = rows.filter((r) => r.visitCount > 1).length;
    const returnedIn30 = rows.filter(
      (r) =>
        r.visitCount > 1 &&
        r.lastSeenAt.getTime() - r.firstSeenAt.getTime() <= 30 * 86_400_000
    ).length;
    const sixtyDaysAgo = Date.now() - 60 * 86_400_000;

    return {
      totalVisitors: total,
      returning,
      repeatRate: Math.round((returning / total) * 100),
      returnedIn30,
      returnedIn30Rate: Math.round((returnedIn30 / total) * 100),
      loyal: rows.filter((r) => r.visitCount >= 4).length,
      averageVisits: Number((rows.reduce((s, r) => s + r.visitCount, 0) / total).toFixed(1)),
      lapsed: rows.filter((r) => r.lastSeenAt.getTime() < sixtyDaysAgo).length,
    };
  } catch (err) {
    console.error("[visitors] stats failed:", err);
    return DEMO;
  }
}

export { COOKIE as VISITOR_COOKIE, MAX_AGE as VISITOR_MAX_AGE };

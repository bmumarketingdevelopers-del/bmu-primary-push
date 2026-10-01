import { cookies } from "next/headers";
import { newVisitorId, recordVisit, VISITOR_COOKIE, VISITOR_MAX_AGE } from "./visitors";
import type { VisitOutcome } from "./visitors";

/**
 * Reads or issues the visitor cookie, then records the visit.
 *
 * Kept apart from visitors.ts so that file stays free of next/headers and
 * remains unit-testable.
 *
 * A first-time visitor gets an ID generated here and written on the response.
 * Server components can't set cookies during render in every Next.js
 * configuration, so the write is attempted and its failure ignored — worst
 * case the visitor is counted as new again next time, which understates the
 * repeat rate rather than inflating it. Understating is the right direction
 * for a number you put in front of a client.
 */
export async function trackVisit(
  businessId: string,
  source?: string | null
): Promise<VisitOutcome> {
  try {
    const jar = await cookies();
    const existing = jar.get(VISITOR_COOKIE)?.value;
    const cookieValue = existing ?? newVisitorId();

    if (!existing) {
      try {
        jar.set(VISITOR_COOKIE, cookieValue, {
          maxAge: VISITOR_MAX_AGE,
          httpOnly: true,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
          path: "/",
        });
      } catch {
        // Read-only cookie store during render. Counting is still attempted.
      }
    }

    return await recordVisit({ businessId, cookieValue, source });
  } catch (err) {
    console.warn("[visitors] tracking failed:", err);
    return { isReturning: false, visitCount: 1, daysSinceFirst: null };
  }
}

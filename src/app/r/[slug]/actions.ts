"use server";

import { getBusiness } from "@/lib/qr-platform";
import { z } from "zod";
import { actionIp, rateLimit } from "@/lib/rate-limit";

export type FeedbackState = { ok: boolean; message: string | null };

/**
 * Negative and neutral feedback lands here — privately.
 *
 * The whole point of the review booster is that an unhappy customer talks to
 * the business instead of to Google. So this path must never redirect out.
 */
/**
 * Bounded because this form is open to the internet with no login. Without
 * length caps, a script can push megabytes of text into the database through
 * a QR code printed on a standee.
 */
const schema = z.object({
  slug: z.string().min(1).max(64),
  sentiment: z.enum(["NEGATIVE", "NEUTRAL", "POSITIVE"]).catch("NEGATIVE"),
  comment: z.string().trim().min(3, "Tell us a little about what went wrong.").max(2000),
  name: z.string().trim().max(120).optional().default(""),
  phone: z.string().trim().max(20).optional().default(""),
});

export async function submitFeedback(_prev: FeedbackState, formData: FormData): Promise<FeedbackState> {
  // Enforced here rather than in a helper — the previous helper existed but
  // nothing ever called it, so this form had no limit at all.
  const limit = rateLimit(`feedback:${await actionIp()}`, { limit: 6, windowMs: 60_000 });
  if (!limit.ok) {
    return { ok: false, message: "Thanks — we've already got your message." };
  }

  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0].message };
  }

  const { slug, sentiment, comment, name, phone } = parsed.data;

  const business = await getBusiness(slug);
  if (!business) return { ok: false, message: "That business no longer exists." };

  if (process.env.DATABASE_URL) {
    try {
      const { prisma } = await import("@/lib/prisma");
      const row = await prisma.business.findUnique({ where: { slug }, select: { id: true } });
      if (row) {
        await prisma.feedbackEntry.create({
          data: {
            businessId: row.id,
            sentiment: sentiment as never,
            comment,
            name: name || null,
            phone: phone || null,
            routedToGoogle: false,
          },
        });
      }
    } catch (err) {
      console.error("[feedback] write failed:", err);
    }
  } else {
    console.info(`[feedback] ${slug} (${sentiment}): ${comment}`);
  }

  return { ok: true, message: null };
}

/** Records that a happy customer was sent to Google, for the conversion rate. */
export async function recordGoogleRedirect(slug: string) {
  if (!process.env.DATABASE_URL) return;
  try {
    const { prisma } = await import("@/lib/prisma");
    const row = await prisma.business.findUnique({ where: { slug }, select: { id: true } });
    if (row) {
      await prisma.feedbackEntry.create({
        data: { businessId: row.id, sentiment: "POSITIVE", rating: 5, routedToGoogle: true },
      });
    }
  } catch (err) {
    console.error("[feedback] positive route not recorded:", err);
  }
}



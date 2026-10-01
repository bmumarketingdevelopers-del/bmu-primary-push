"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { absoluteTarget, recordScan, resolveQr } from "@/lib/qr";
import { actionIp, rateLimit } from "@/lib/rate-limit";

export type UnlockState = { error: string | null };

const schema = z.object({
  slug: z.string().min(1).max(64),
  password: z.string().max(128),
});

export async function unlockQr(_prev: UnlockState, formData: FormData): Promise<UnlockState> {
  /**
   * A password check with no limit is a brute-force target — these codes are
   * printed in public and the passwords are usually short. Ten attempts a
   * minute is generous for someone typing it off a standee and useless for a
   * script.
   */
  const limit = rateLimit(`unlock:${await actionIp()}`, { limit: 10, windowMs: 60_000 });
  if (!limit.ok) {
    return { error: "Too many attempts. Wait a minute and try again." };
  }

  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: "That code isn't valid." };

  const code = await resolveQr(parsed.data.slug);
  if (!code || !code.isActive) return { error: "This code is no longer active." };

  // Same message whichever check fails, so a wrong password can't be used to
  // work out which codes exist.
  if (code.password !== parsed.data.password) {
    return { error: "That password isn't right." };
  }

  await recordScan(code);
  redirect(absoluteTarget(code.target));
}

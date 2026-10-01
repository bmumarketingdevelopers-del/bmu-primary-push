"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/session";
import { sendEmail } from "@/lib/email";
import { inr } from "@/lib/utils";

export type BriefState = { ok: boolean; message: string | null };

const schema = z.object({
  briefId: z.string().min(1),
  briefTitle: z.string().optional(),
  decision: z.enum(["ACCEPTED", "DECLINED", "QUESTION"]),
  message: z.string().optional(),
  quotedFee: z.string().optional(),
  proposedAt: z.string().optional(),
});

/**
 * A creator's response to a brief.
 *
 * Declining asks for a reason but doesn't require one — forcing a
 * justification is how you stop people declining and start them ignoring
 * briefs instead, which is worse for everyone.
 */
export async function respondToBrief(_prev: BriefState, formData: FormData): Promise<BriefState> {
  const user = await requireUser(["CREATOR", "OWNER", "ADMIN", "MANAGER"]);

  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message };

  const { briefId, briefTitle, decision, message, quotedFee, proposedAt } = parsed.data;

  if (decision === "QUESTION" && !message?.trim()) {
    return { ok: false, message: "Write your question first." };
  }

  const fee = quotedFee ? Math.round(Number(quotedFee) * 100) : null;
  if (quotedFee && (!fee || Number.isNaN(fee))) {
    return { ok: false, message: "That fee isn't a number." };
  }

  const verb =
    decision === "ACCEPTED" ? "accepted" : decision === "DECLINED" ? "declined" : "asked a question about";

  if (!process.env.DATABASE_URL) {
    return {
      ok: true,
      message: `Validated — you ${verb} this brief${fee ? ` at ${inr(fee)}` : ""}. Not stored: no DATABASE_URL.`,
    };
  }

  try {
    const { prisma } = await import("@/lib/prisma");

    await prisma.briefResponse.upsert({
      where: { briefId_creatorId: { briefId, creatorId: user.id } },
      update: {
        decision,
        message: message || null,
        quotedFee: fee,
        proposedAt: proposedAt ? new Date(proposedAt) : null,
      },
      create: {
        briefId,
        creatorId: user.id,
        decision,
        message: message || null,
        quotedFee: fee,
        proposedAt: proposedAt ? new Date(proposedAt) : null,
      },
    });

    // The agency needs to know without watching a dashboard.
    await sendEmail({
      to: process.env.EMAIL_INTERNAL ?? "hello@bmu.marketing",
      subject: `${user.name ?? "A creator"} ${verb} "${briefTitle ?? briefId}"`,
      html: `<p><strong>${user.name ?? "A creator"}</strong> ${verb} the brief <strong>${briefTitle ?? briefId}</strong>.</p>${
        fee ? `<p>Quoted fee: <strong>${inr(fee)}</strong></p>` : ""
      }${message ? `<p>${message}</p>` : ""}`,
    }).catch((err) => console.error("[briefs] notify failed:", err));

    revalidatePath("/creators/briefs");
    revalidatePath("/admin/creators");

    return {
      ok: true,
      message:
        decision === "ACCEPTED"
          ? `Accepted${fee ? ` at ${inr(fee)}` : ""}. The team will confirm and send the contract.`
          : decision === "DECLINED"
            ? "Declined. It'll drop off your list."
            : "Question sent. You'll get a reply by email.",
    };
  } catch (err) {
    console.error("[briefs] response failed:", err);
    return { ok: false, message: "Couldn't send that. Try again." };
  }
}

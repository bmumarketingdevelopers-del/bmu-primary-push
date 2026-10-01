"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/session";
import { sendEmail } from "@/lib/email";

export type ApprovalDecisionState = { ok: boolean; message: string | null };

const schema = z.object({
  id: z.string().min(1),
  title: z.string().optional(),
  decision: z.enum(["APPROVED", "CHANGES_REQUESTED"]),
  feedback: z.string().optional(),
});

/**
 * A client approving or rejecting creative.
 *
 * Changes require a note. "Request changes" with no explanation produces a
 * second version that misses in a different way, and a third round after
 * that — the note is the whole point of the button.
 */
export async function decideApproval(
  _prev: ApprovalDecisionState,
  formData: FormData
): Promise<ApprovalDecisionState> {
  const user = await requireUser(["CLIENT", "OWNER", "ADMIN", "MANAGER"]);

  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message };

  const { id, title, decision, feedback } = parsed.data;

  if (decision === "CHANGES_REQUESTED" && !feedback?.trim()) {
    return { ok: false, message: "Tell us what needs changing — otherwise the next version guesses." };
  }

  if (!process.env.DATABASE_URL) {
    return {
      ok: true,
      message: decision === "APPROVED"
        ? "Validated as approved. Not stored — no DATABASE_URL."
        : "Validated as changes requested. Not stored — no DATABASE_URL.",
    };
  }

  try {
    const { prisma } = await import("@/lib/prisma");

    const approval = await prisma.contentApproval.update({
      where: { id },
      data: {
        status: decision,
        feedback: feedback || null,
        reviewedAt: new Date(),
        reviewedById: user.id,
        // A change request starts a new round; approving doesn't.
        revision: decision === "CHANGES_REQUESTED" ? { increment: 1 } : undefined,
      },
      include: { client: { select: { name: true } } },
    });

    if (feedback?.trim()) {
      await prisma.approvalComment.create({
        data: {
          approvalId: id,
          authorId: user.id,
          authorName: user.name ?? approval.client.name,
          side: "CLIENT",
          body: feedback,
          isDecision: true,
        },
      });
    }

    await sendEmail({
      to: process.env.EMAIL_INTERNAL ?? "hello@bmu.marketing",
      subject: `${approval.client.name} ${decision === "APPROVED" ? "approved" : "requested changes on"} "${title ?? approval.title}"`,
      html: `<p><strong>${approval.client.name}</strong> ${
        decision === "APPROVED" ? "approved" : "requested changes on"
      } <strong>${title ?? approval.title}</strong>.</p>${feedback ? `<p>${feedback}</p>` : ""}`,
    }).catch((err) => console.error("[approvals] notify failed:", err));

    revalidatePath("/dashboard/approvals");
    revalidatePath("/admin/approvals");

    return {
      ok: true,
      message: decision === "APPROVED"
        ? "Approved. It'll go out as scheduled."
        : "Sent back with your notes. You'll see the next version here.",
    };
  } catch (err) {
    console.error("[approvals] decision failed:", err);
    return { ok: false, message: "Couldn't record that. Try again." };
  }
}

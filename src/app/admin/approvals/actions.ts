"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireStaff } from "@/lib/session";
import { approvalReminder, sendEmail } from "@/lib/email";
import { APPROVAL_QUEUE } from "@/lib/admin-data";
import { formatDate } from "@/lib/utils";

export type ReminderState = { ok: boolean; message: string | null };
export type ApprovalState = ReminderState;

export async function sendApprovalReminder(
  _prev: ReminderState,
  formData: FormData
): Promise<ReminderState> {
  await requireStaff();

  const id = String(formData.get("id") ?? "");
  const item = APPROVAL_QUEUE.find((a) => a.id === id);
  if (!item) return { ok: false, message: "That item no longer exists." };

  let recipient = String(formData.get("email") ?? "");

  if (!recipient && process.env.DATABASE_URL) {
    try {
      const { prisma } = await import("@/lib/prisma");
      const client = await prisma.client.findFirst({
        where: { name: item.client },
        select: { contactEmail: true },
      });
      recipient = client?.contactEmail ?? "";
    } catch (err) {
      console.error("[approvals] contact lookup failed:", err);
    }
  }

  if (!recipient) {
    return { ok: false, message: "No contact email on file for this client." };
  }

  const mail = approvalReminder({
    title: item.title,
    client: item.client,
    scheduledFor: formatDate(item.scheduledFor),
  });

  const result = await sendEmail({ to: recipient, ...mail });

  return result.sent
    ? { ok: true, message: `Reminder sent to ${recipient}.` }
    : { ok: true, message: `Logged — set RESEND_API_KEY to actually send.` };
}

const escalateSchema = z.object({
  id: z.string().min(1),
  to: z.string().min(1, "Pick who's taking it over"),
  note: z.string().optional(),
});

/**
 * Escalation, which is what a super-admin queue is actually for.
 *
 * The agency can't approve on a client's behalf, so the only lever here is
 * moving ownership to someone senior enough to pick up the phone. That's why
 * this records who took it, not a status change on the creative.
 */
export async function escalateApproval(
  _prev: ApprovalState,
  formData: FormData
): Promise<ApprovalState> {
  const user = await requireStaff();

  const parsed = escalateSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message };

  const { id, to, note } = parsed.data;

  if (!process.env.DATABASE_URL) {
    return { ok: true, message: `Would escalate to ${to}. Not stored — no DATABASE_URL.` };
  }

  try {
    const { prisma } = await import("@/lib/prisma");
    await prisma.contentApproval.update({
      where: { id },
      data: { escalatedAt: new Date(), escalatedTo: to },
    });

    if (note?.trim()) {
      await prisma.approvalComment.create({
        data: {
          approvalId: id,
          authorId: user.id,
          authorName: user.name ?? "Agency",
          side: "AGENCY",
          body: note.trim(),
        },
      });
    }

    revalidatePath("/admin/approvals");
    return { ok: true, message: `Escalated to ${to}.` };
  } catch (err) {
    console.error("[approvals] escalate failed:", err);
    return { ok: false, message: "Couldn't escalate that." };
  }
}

const commentSchema = z.object({
  id: z.string().min(1),
  body: z.string().min(2, "Write something first"),
});

export async function addApprovalComment(
  _prev: ApprovalState,
  formData: FormData
): Promise<ApprovalState> {
  const user = await requireStaff();

  const parsed = commentSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message };

  if (!process.env.DATABASE_URL) {
    return { ok: true, message: "Comment validated but not stored — no DATABASE_URL." };
  }

  try {
    const { prisma } = await import("@/lib/prisma");
    await prisma.approvalComment.create({
      data: {
        approvalId: parsed.data.id,
        authorId: user.id,
        authorName: user.name ?? "Agency",
        side: "AGENCY",
        body: parsed.data.body,
      },
    });
    revalidatePath("/admin/approvals");
    return { ok: true, message: "Added." };
  } catch (err) {
    console.error("[approvals] comment failed:", err);
    return { ok: false, message: "Couldn't add that comment." };
  }
}

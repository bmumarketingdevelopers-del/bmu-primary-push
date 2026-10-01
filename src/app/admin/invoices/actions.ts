"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/session";
import { decodeFields } from "@/lib/form-decode";
import { invoiceIssued, paymentReceipt, sendEmail } from "@/lib/email";
import { inr } from "@/lib/utils";
import type { Field } from "@/lib/cms/schema";

export type InvoiceState = { ok: boolean; message: string | null };

/** Line items, as a repeater the dialog can render. */
export const LINE_ITEM_FIELDS: Field[] = [
  {
    name: "items",
    label: "Line items",
    type: "repeater",
    help: "The total is calculated from these. Amounts in rupees.",
    fields: [
      { name: "description", label: "Description", type: "text", placeholder: "Social media retainer — August" },
      { name: "quantity", label: "Qty", type: "number" },
      { name: "unitPrice", label: "Rate", type: "number" },
    ],
  },
];

const createSchema = z.object({
  clientId: z.string().min(1, "Pick a client"),
  number: z.string().optional(),
  taxRate: z.coerce.number().min(0).max(50).default(18),
  dueAt: z.string().optional(),
  notes: z.string().optional(),
});

/**
 * Create an invoice from line items.
 *
 * Totals are computed here and never accepted from the form. A hand-typed
 * total that disagrees with its own line items is the kind of thing a client
 * notices and an accountant has to unpick months later.
 */
export async function createInvoice(_prev: InvoiceState, formData: FormData): Promise<InvoiceState> {
  await requireUser(["OWNER", "ADMIN"]);

  const parsed = createSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message };

  const decoded = decodeFields(LINE_ITEM_FIELDS, formData);
  const rows = (decoded.items as Record<string, unknown>[]) ?? [];

  const items = rows
    .filter((r) => String(r.description ?? "").trim())
    .map((r) => {
      const quantity = Math.max(1, Number(r.quantity) || 1);
      const unitPrice = Math.round((Number(r.unitPrice) || 0) * 100); // rupees → paise
      return { description: String(r.description), quantity, unitPrice, amount: quantity * unitPrice };
    });

  if (!items.length) return { ok: false, message: "Add at least one line item." };

  const subtotal = items.reduce((s, i) => s + i.amount, 0);
  if (subtotal <= 0) return { ok: false, message: "The line items add up to nothing." };

  // Service invoices are raised pre-tax with GST added on top, matching the
  // store's convention rather than the menu's inclusive pricing.
  const taxRate = parsed.data.taxRate;
  const total = Math.round(subtotal * (1 + taxRate / 100));

  if (!process.env.DATABASE_URL) {
    return {
      ok: true,
      message: `Validated: ${items.length} lines, ${inr(subtotal)} + ${taxRate}% GST = ${inr(total)}. Not stored — no DATABASE_URL.`,
    };
  }

  try {
    const { prisma } = await import("@/lib/prisma");

    // Generated here so two people creating invoices don't collide on a number.
    const number = parsed.data.number?.trim() || (await nextInvoiceNumber(prisma));

    await prisma.invoice.create({
      data: {
        clientId: parsed.data.clientId,
        number,
        subtotal,
        taxRate,
        total,
        dueAt: parsed.data.dueAt ? new Date(parsed.data.dueAt) : null,
        notes: parsed.data.notes || null,
        items: { create: items },
      },
    });

    revalidatePath("/admin/invoices");
    return { ok: true, message: `${number} created for ${inr(total)}.` };
  } catch (err) {
    console.error("[invoices] create failed:", err);
    const msg = err instanceof Error ? err.message : "";
    if (msg.includes("Unique constraint")) return { ok: false, message: "That invoice number already exists." };
    if (msg.includes("Foreign key")) return { ok: false, message: "That client ID doesn't exist." };
    return { ok: false, message: "Couldn't create the invoice." };
  }
}

async function nextInvoiceNumber(prisma: import("@prisma/client").PrismaClient) {
  const year = new Date().getFullYear();
  const last = await prisma.invoice.findFirst({
    where: { number: { startsWith: `BMU-${year}-` } },
    orderBy: { number: "desc" },
    select: { number: true },
  });

  const seq = last ? Number(last.number.split("-").pop()) + 1 : 1;
  return `BMU-${year}-${String(seq).padStart(4, "0")}`;
}

/** Marks an invoice sent and emails it. Status and email move together. */
export async function sendInvoice(_prev: InvoiceState, formData: FormData): Promise<InvoiceState> {
  await requireUser(["OWNER", "ADMIN"]);
  const id = String(formData.get("id") ?? "");
  if (!id) return { ok: false, message: "Missing invoice." };

  if (!process.env.DATABASE_URL) return { ok: true, message: "Would send. No DATABASE_URL configured." };

  try {
    const { prisma } = await import("@/lib/prisma");
    const invoice = await prisma.invoice.update({
      where: { id },
      data: { status: "SENT" },
      include: { client: { select: { name: true, contactEmail: true } } },
    });

    if (invoice.client.contactEmail) {
      await sendEmail({
        to: invoice.client.contactEmail,
        ...invoiceIssued({
          number: invoice.number,
          client: invoice.client.name,
          total: inr(invoice.total),
          dueAt: invoice.dueAt?.toISOString().slice(0, 10) ?? "on receipt",
        }),
      });
    }

    revalidatePath("/admin/invoices");
    return {
      ok: true,
      message: invoice.client.contactEmail
        ? `Sent to ${invoice.client.contactEmail}.`
        : "Marked sent — but this client has no contact email on file.",
    };
  } catch (err) {
    console.error("[invoices] send failed:", err);
    return { ok: false, message: "Couldn't send that invoice." };
  }
}

const paymentSchema = z.object({
  id: z.string().min(1),
  amount: z.coerce.number().positive("Enter the amount received"),
  reference: z.string().optional(),
});

/**
 * Record a payment received outside Razorpay — bank transfer, cheque, UPI.
 * Partial payments are supported, because they happen constantly and a
 * part-paid invoice marked PAID is how receivables quietly go wrong.
 */
export async function recordPayment(_prev: InvoiceState, formData: FormData): Promise<InvoiceState> {
  await requireUser(["OWNER", "ADMIN"]);

  const parsed = paymentSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message };

  const paise = Math.round(parsed.data.amount * 100);

  if (!process.env.DATABASE_URL) {
    return { ok: true, message: `Would record ${inr(paise)}. No DATABASE_URL configured.` };
  }

  try {
    const { prisma } = await import("@/lib/prisma");
    const existing = await prisma.invoice.findUnique({
      where: { id: parsed.data.id },
      include: { client: { select: { name: true, contactEmail: true } } },
    });
    if (!existing) return { ok: false, message: "Invoice not found." };

    const amountPaid = existing.amountPaid + paise;
    const settled = amountPaid >= existing.total;

    await prisma.invoice.update({
      where: { id: parsed.data.id },
      data: {
        amountPaid,
        status: settled ? "PAID" : existing.status,
        paidAt: settled ? new Date() : null,
        notes: parsed.data.reference
          ? `${existing.notes ? existing.notes + "\n" : ""}Payment ref: ${parsed.data.reference}`
          : existing.notes,
      },
    });

    if (settled && existing.client.contactEmail) {
      await sendEmail({
        to: existing.client.contactEmail,
        ...paymentReceipt({ number: existing.number, total: inr(existing.total) }),
      });
    }

    revalidatePath("/admin/invoices");
    return {
      ok: true,
      message: settled
        ? `${existing.number} settled in full.`
        : `Recorded. ${inr(existing.total - amountPaid)} still outstanding.`,
    };
  } catch (err) {
    console.error("[invoices] payment failed:", err);
    return { ok: false, message: "Couldn't record that payment." };
  }
}

/** Chase an overdue invoice. Tone escalates with how late it is. */
export async function sendPaymentReminder(_prev: InvoiceState, formData: FormData): Promise<InvoiceState> {
  await requireUser(["OWNER", "ADMIN"]);
  const id = String(formData.get("id") ?? "");

  if (!process.env.DATABASE_URL) return { ok: true, message: "Would chase. No DATABASE_URL configured." };

  try {
    const { prisma } = await import("@/lib/prisma");
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: { client: { select: { name: true, contactEmail: true } } },
    });
    if (!invoice) return { ok: false, message: "Invoice not found." };
    if (!invoice.client.contactEmail) return { ok: false, message: "No contact email on this client." };

    const daysLate = invoice.dueAt
      ? Math.floor((Date.now() - invoice.dueAt.getTime()) / 86_400_000)
      : 0;
    const outstanding = invoice.total - invoice.amountPaid;

    const opening =
      daysLate <= 0
        ? `A quick note that invoice ${invoice.number} is due shortly.`
        : daysLate <= 14
          ? `Invoice ${invoice.number} is now ${daysLate} days past its due date.`
          : `Invoice ${invoice.number} is ${daysLate} days overdue and we'd like to get it settled.`;

    await sendEmail({
      to: invoice.client.contactEmail,
      subject: `${daysLate > 0 ? "Overdue: " : ""}Invoice ${invoice.number}`,
      html: `<p>Hello ${invoice.client.name},</p><p>${opening}</p><p>Amount outstanding: <strong>${inr(outstanding)}</strong>.</p><p>If it's already been paid, ignore this and let us know the reference so we can match it up.</p><p>— BMU.Marketing</p>`,
    });

    return { ok: true, message: `Reminder sent to ${invoice.client.contactEmail}.` };
  } catch (err) {
    console.error("[invoices] reminder failed:", err);
    return { ok: false, message: "Couldn't send that reminder." };
  }
}

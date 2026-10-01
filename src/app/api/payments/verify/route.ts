import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/session";
import { paymentsConfigured, verifySignature } from "@/lib/payments";
import { paymentReceipt, sendEmail } from "@/lib/email";
import { getInvoice } from "@/lib/invoices";
import { inr } from "@/lib/utils";

const schema = z.object({
  invoiceNumber: z.string().min(1),
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
});

export async function POST(req: Request) {
  const user = await requireUser();

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { invoiceNumber, razorpay_order_id, razorpay_payment_id, razorpay_signature } = parsed.data;

  if (!paymentsConfigured()) {
    return NextResponse.json({ ok: true, demo: true });
  }

  if (!verifySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature)) {
    console.warn("[payments] signature mismatch for", invoiceNumber);
    return NextResponse.json({ error: "Signature verification failed" }, { status: 400 });
  }

  if (process.env.DATABASE_URL) {
    try {
      const { prisma } = await import("@/lib/prisma");
      const invoice = await prisma.invoice.findUnique({ where: { number: invoiceNumber } });
      if (invoice) {
        await prisma.invoice.update({
          where: { id: invoice.id },
          data: {
            status: "PAID",
            paidAt: new Date(),
            amountPaid: invoice.total,
            razorpayPaymentId: razorpay_payment_id,
          },
        });
      }
    } catch (err) {
      // Payment succeeded even if our write didn't — never fail the response here.
      console.error("[payments] invoice not marked paid:", err);
    }
  }

  const invoice = await getInvoice(invoiceNumber);

  if (user.email && invoice) {
    const receipt = paymentReceipt({ number: invoice.number, total: inr(invoice.total) });
    await sendEmail({ to: user.email, ...receipt });
  }

  return NextResponse.json({ ok: true, demo: false });
}

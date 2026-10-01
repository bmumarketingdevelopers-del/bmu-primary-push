import { after, NextResponse } from "next/server";
import { z } from "zod";
import { orderNumber, productBySlug, storeTotals } from "@/lib/store";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { sendEmail } from "@/lib/email";
import { COMPANY } from "@/lib/company-data";
import { inr } from "@/lib/utils";
import { appendToSheet, formContextSchema, pageColumns } from "@/lib/google-sheets";

const schema = z.object({
  name: z.string().min(2),
  phone: z.string().min(8),
  email: z.string().email().optional().or(z.literal("")),
  address: z.string().min(8),
  city: z.string().min(2),
  pincode: z.string().regex(/^\d{6}$/, "Enter a 6-digit pincode"),
  businessName: z.string().optional(),
  paymentMode: z.enum(["ONLINE", "COD"]),
  lines: z.array(z.object({ slug: z.string(), quantity: z.number().int().positive().max(99) })).min(1),
}).merge(formContextSchema);

export async function POST(req: Request) {
  const limit = rateLimit(`store:${clientIp(req)}`, { limit: 5, windowMs: 60_000 });
  if (!limit.ok) {
    return NextResponse.json({ error: "Too many attempts. Try again shortly." }, { status: 429 });
  }

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const o = parsed.data;

  /**
   * Prices come from the server catalogue, never from the browser. The cart
   * sends slugs and quantities only — anything else and a Rs 5,499 kit could
   * arrive as a one-rupee order.
   */
  const priced = [];
  for (const line of o.lines) {
    const product = productBySlug(line.slug);
    if (!product) {
      return NextResponse.json({ error: "One of those products is no longer available." }, { status: 400 });
    }
    priced.push({ slug: product.slug, name: product.name, price: product.price, quantity: line.quantity });
  }

  const totals = storeTotals(priced);
  const number = orderNumber();

  if (process.env.DATABASE_URL) {
    try {
      const { prisma } = await import("@/lib/prisma");
      await prisma.productOrder.create({
        data: {
          number,
          status: "PENDING",
          name: o.name,
          phone: o.phone,
          email: o.email || null,
          address: o.address,
          city: o.city,
          pincode: o.pincode,
          subtotal: totals.subtotal,
          shipping: totals.shipping,
          total: totals.total,
        },
      });
    } catch (err) {
      console.error("[store] order write failed:", err);
    }
  } else {
    console.info(`[store] ${number} - ${totals.count} items - ${inr(totals.total)} - ${o.paymentMode}`);
  }

  const row = {
    "Order number": number,
    Name: o.name,
    "Business name": o.businessName,
    Phone: o.phone,
    Email: o.email,
    Address: o.address,
    City: o.city,
    Pincode: o.pincode,
    Items: priced.map((l) => `${l.quantity}x ${l.name}`).join(", "),
    "Subtotal (₹)": totals.subtotal / 100,
    "Shipping (₹)": totals.shipping / 100,
    "Total (₹)": totals.total / 100,
    "Payment mode": o.paymentMode,
    ...pageColumns(o, req),
  };
  after(() => appendToSheet("Store orders", row));

  const summary = priced.map((l) => `${l.quantity}x ${l.name}`).join("<br>");

  await sendEmail({
    to: process.env.EMAIL_INTERNAL ?? COMPANY.email,
    subject: `Store order ${number} - ${inr(totals.total)}`,
    html: `<p><strong>${o.name}</strong> - ${o.phone}${o.businessName ? ` - ${o.businessName}` : ""}</p>
           <p>${o.address}, ${o.city} ${o.pincode}</p>
           <p>${summary}</p>
           <p>Shipping ${inr(totals.shipping)} - <strong>Total ${inr(totals.total)}</strong> - ${o.paymentMode}</p>`,
  });

  if (o.email) {
    await sendEmail({
      to: o.email,
      subject: `Order ${number} confirmed - BMU QR`,
      html: `<p>Hello ${o.name.split(" ")[0]},</p>
             <p>We have your order.</p>
             <p>${summary}</p>
             <p><strong>Total ${inr(totals.total)}</strong></p>
             <p>Everything arrives pre-linked to your account, so it works the moment it is out of the box.
             We will email tracking once it ships.</p>`,
    });
  }

  return NextResponse.json({ ok: true, number, total: totals.total });
}

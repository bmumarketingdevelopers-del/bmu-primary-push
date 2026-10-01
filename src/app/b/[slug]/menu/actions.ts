"use server";

import { z } from "zod";
import { actionIp, rateLimit } from "@/lib/rate-limit";
import { cartTotals, orderReference, type CartLine } from "@/lib/menu";
import { getBusiness } from "@/lib/qr-platform";

export type OrderState = { ok: boolean; message: string | null; reference?: string };

const lineSchema = z.object({
  itemId: z.string(),
  name: z.string(),
  /**
   * Accepted because the cart component sends it, but NEVER used — every
   * line is re-priced from the server's own menu further down. If you're
   * editing this file, don't start trusting this value.
   */
  price: z.number().int().nonnegative(),
  quantity: z.number().int().positive().max(50),
  note: z.string().optional(),
});

const schema = z.object({
  slug: z.string().min(1),
  table: z.string().optional(),
  channel: z.enum(["DINE_IN", "TAKEAWAY"]).default("DINE_IN"),
  paymentMode: z.enum(["PAY_AT_COUNTER", "ONLINE", "WHATSAPP"]).default("PAY_AT_COUNTER"),
  name: z.string().optional(),
  phone: z.string().optional(),
  notes: z.string().optional(),
  lines: z.array(lineSchema).min(1, "Your cart is empty"),
});

export async function placeOrder(input: unknown): Promise<OrderState> {
  /**
   * A table QR is printed in public, so anyone who walks past can hit this.
   * Twelve orders a minute from one address is well above a real table and
   * well below anything that would inconvenience a busy group.
   */
  const limit = rateLimit(`order:${await actionIp()}`, { limit: 12, windowMs: 60_000 });
  if (!limit.ok) {
    return { ok: false, message: "That's a lot of orders at once. Give it a moment." };
  }

  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0].message };
  }

  const o = parsed.data;
  const business = await getBusiness(o.slug);
  if (!business) return { ok: false, message: "This restaurant isn't taking orders right now." };

  /**
   * Prices are recalculated from the server's own menu, never from the cart.
   * The client sends what it thinks things cost; believing it would let anyone
   * order a biryani for one rupee by editing the request.
   */
  const { getMenu } = await import("@/lib/menu");
  const menu = await getMenu(o.slug);
  const priced: CartLine[] = [];

  for (const line of o.lines) {
    const item = menu.flatMap((c) => c.items).find((i) => i.id === line.itemId);
    if (!item) return { ok: false, message: `${line.name} is no longer on the menu.` };
    if (!item.isAvailable) return { ok: false, message: `${item.name} just went off the menu.` };

    priced.push({
      itemId: item.id,
      name: item.name,
      price: item.price,
      quantity: line.quantity,
      note: line.note,
    });
  }

  const totals = cartTotals(priced);
  const reference = orderReference();

  if (process.env.DATABASE_URL) {
    try {
      const { prisma } = await import("@/lib/prisma");
      const row = await prisma.business.findUnique({ where: { slug: o.slug }, select: { id: true } });
      if (row) {
        await prisma.foodOrder.create({
          data: {
            businessId: row.id,
            number: reference,
            mode: o.channel,
            status: "PLACED",
            customerName: o.name || null,
            customerPhone: o.phone || null,
            notes: o.notes || null,
            subtotal: totals.subtotal,
            total: totals.total,
            paymentMode: o.paymentMode,
            lines: {
              create: priced.map((l) => ({
                itemId: l.itemId,
                name: l.name,
                unitPrice: l.price,
                quantity: l.quantity,
                amount: l.price * l.quantity,
                note: l.note,
              })),
            },
          },
        });
      }
    } catch (err) {
      console.error("[order] write failed:", err);
      return { ok: false, message: "Couldn't send that to the kitchen. Please call a server." };
    }
  } else {
    console.info(`[order] ${o.slug} ${reference} · ${o.table ?? "takeaway"} · ${totals.count} items · ${totals.total / 100}`);
  }

  return { ok: true, message: null, reference };
}

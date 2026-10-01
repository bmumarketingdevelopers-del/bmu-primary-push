import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/session";
import { createOrder } from "@/lib/payments";

const schema = z.object({
  invoiceNumber: z.string().min(1),
  amount: z.number().int().positive(),
});

export async function POST(req: Request) {
  await requireUser();

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  try {
    const order = await createOrder(parsed.data.amount, parsed.data.invoiceNumber);
    return NextResponse.json(order);
  } catch (err) {
    console.error("[payments] order failed:", err);
    return NextResponse.json({ error: "Could not start the payment" }, { status: 502 });
  }
}

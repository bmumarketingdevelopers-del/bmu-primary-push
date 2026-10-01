"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/session";

export type OrderState = { ok: boolean; message: string | null };

/** The only legal moves. A ticket can't jump from New to Served. */
const NEXT_STATUS: Record<string, string> = {
  PLACED: "PREPARING",
  PREPARING: "READY",
  READY: "SERVED",
  SERVED: "COMPLETED",
};

const schema = z.object({
  id: z.string().min(1),
  from: z.string().min(1),
});

/**
 * Advance an order one step.
 *
 * The next status is derived from the current one rather than sent by the
 * browser. On a kitchen screen with several people tapping, accepting a
 * target status from the client is how a ticket ends up marked served while
 * it's still being cooked.
 */
export async function advanceOrder(_prev: OrderState, formData: FormData): Promise<OrderState> {
  const user = await requireUser(["BUSINESS", "OWNER", "ADMIN", "MANAGER", "STAFF"]);

  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: "Couldn't read that ticket." };

  const next = NEXT_STATUS[parsed.data.from];
  if (!next) return { ok: false, message: "That order is already closed." };

  if (!process.env.DATABASE_URL) {
    return { ok: true, message: `Would move to ${next.toLowerCase()}. Not stored — no DATABASE_URL.` };
  }

  try {
    const { prisma } = await import("@/lib/prisma");

    // Only advance if it's still where the screen thinks it is — two people
    // tapping the same ticket shouldn't push it two steps.
    const result = await prisma.foodOrder.updateMany({
      where: { id: parsed.data.id, status: parsed.data.from as never },
      data: {
        status: next as never,
        ...(next === "READY" ? { readyAt: new Date() } : {}),
        ...(next === "COMPLETED" ? { completedAt: new Date() } : {}),
      },
    });

    if (result.count === 0) {
      return { ok: false, message: "Someone already moved that ticket." };
    }

    revalidatePath("/business/orders");
    return { ok: true, message: null };
  } catch (err) {
    console.error("[orders] advance failed:", err);
    return { ok: false, message: "Couldn't move that ticket." };
  }
}

const cancelSchema = z.object({ id: z.string().min(1), reason: z.string().optional() });

export async function cancelOrder(_prev: OrderState, formData: FormData): Promise<OrderState> {
  await requireUser(["BUSINESS", "OWNER", "ADMIN", "MANAGER"]);

  const parsed = cancelSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: "Couldn't read that ticket." };

  if (!process.env.DATABASE_URL) {
    return { ok: true, message: "Would cancel. Not stored — no DATABASE_URL." };
  }

  try {
    const { prisma } = await import("@/lib/prisma");
    await prisma.foodOrder.update({
      where: { id: parsed.data.id },
      data: { status: "CANCELLED" as never, notes: parsed.data.reason || null },
    });
    revalidatePath("/business/orders");
    return { ok: true, message: "Cancelled." };
  } catch (err) {
    console.error("[orders] cancel failed:", err);
    return { ok: false, message: "Couldn't cancel that." };
  }
}

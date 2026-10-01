import crypto from "crypto";

/** Razorpay is optional — the app runs fully without keys, just in demo mode. */
export const paymentsConfigured = () =>
  Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);

export type OrderResult = {
  orderId: string;
  amount: number; // paise
  currency: string;
  keyId: string | null;
  demo: boolean;
};

export async function createOrder(amountInPaise: number, receipt: string): Promise<OrderResult> {
  if (!paymentsConfigured()) {
    return {
      orderId: `demo_${receipt}_${Date.now()}`,
      amount: amountInPaise,
      currency: "INR",
      keyId: null,
      demo: true,
    };
  }

  const Razorpay = (await import("razorpay")).default;
  const client = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });

  const order = await client.orders.create({
    amount: amountInPaise,
    currency: "INR",
    receipt,
    notes: { source: "bmu-dashboard" },
  });

  return {
    orderId: order.id,
    amount: Number(order.amount),
    currency: order.currency,
    keyId: process.env.RAZORPAY_KEY_ID!,
    demo: false,
  };
}

/**
 * Razorpay signs `order_id|payment_id` with the key secret. Verifying this
 * server-side is what stops a forged success callback from marking an
 * invoice paid — never trust the client's word for it.
 */
export function verifySignature(orderId: string, paymentId: string, signature: string) {
  if (!paymentsConfigured()) return false;

  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

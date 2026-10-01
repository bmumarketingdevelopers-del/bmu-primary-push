"use client";

import * as React from "react";
import { CreditCard, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import styles from "./pay-invoice-button.module.css";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

const CHECKOUT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

function loadCheckout(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = CHECKOUT_SRC;
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export function PayInvoiceButton({
  invoiceNumber,
  amount,
  payerName,
  payerEmail,
}: {
  invoiceNumber: string;
  amount: number; // paise
  payerName?: string;
  payerEmail?: string;
}) {
  const [status, setStatus] = React.useState<"idle" | "working" | "paid" | "error">("idle");
  const [note, setNote] = React.useState<string | null>(null);

  async function pay() {
    setStatus("working");
    setNote(null);

    try {
      const res = await fetch("/api/payments/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceNumber, amount }),
      });
      if (!res.ok) throw new Error("order failed");
      const order = await res.json();

      // No keys configured: confirm the flow works without charging anyone.
      if (order.demo) {
        setStatus("paid");
        setNote("Demo mode — add Razorpay keys in .env to take real payments.");
        return;
      }

      const ready = await loadCheckout();
      if (!ready || !window.Razorpay) throw new Error("checkout unavailable");

      const rzp = new window.Razorpay({
        key: order.keyId,
        order_id: order.orderId,
        amount: order.amount,
        currency: order.currency,
        name: "BMU.Marketing",
        description: `Invoice ${invoiceNumber}`,
        prefill: { name: payerName, email: payerEmail },
        theme: { color: "#8BB72C" },
        handler: async (response: Record<string, string>) => {
          const verify = await fetch("/api/payments/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ invoiceNumber, ...response }),
          });
          if (verify.ok) {
            setStatus("paid");
            setNote("Payment received. Receipt is on its way.");
          } else {
            setStatus("error");
            setNote("Payment taken but not verified — we'll reconcile and confirm.");
          }
        },
        modal: { ondismiss: () => setStatus("idle") },
      });

      rzp.open();
    } catch (err) {
      console.error(err);
      setStatus("error");
      setNote("Couldn't start the payment. Try again or pay by bank transfer.");
    }
  }

  if (status === "paid") {
    return (
      <div className={styles.root}>
        <span className={styles.paid}>Paid</span>
        {note && <p className={cn(styles.note, styles.noteMuted)}>{note}</p>}
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <Button size="sm" onClick={pay} disabled={status === "working"}>
        {status === "working" ? <Loader2 className={styles.spinner} /> : <CreditCard />}
        {status === "working" ? "Opening…" : "Pay now"}
      </Button>
      {note && <p className={cn(styles.note, styles.noteError)}>{note}</p>}
    </div>
  );
}

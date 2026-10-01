"use client";

import * as React from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "./cart-provider";
import { inr, cn } from "@/lib/utils";
import { formContext } from "@/lib/form-context";
import styles from "./checkout-form.module.css";

export function CheckoutForm() {
  const { lines, totals, clear, ready } = useCart();
  const [mode, setMode] = React.useState<"ONLINE" | "COD">("ONLINE");
  const [state, setState] = React.useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = React.useState<string | null>(null);
  const [placed, setPlaced] = React.useState<{ number: string; total: number } | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    setError(null);
    const f = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/store/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: f.get("name"),
          phone: f.get("phone"),
          email: f.get("email") || "",
          address: f.get("address"),
          city: f.get("city"),
          pincode: f.get("pincode"),
          businessName: f.get("businessName") || undefined,
          paymentMode: mode,
          // Only slugs and quantities — the server prices the order itself.
          lines: lines.map((l) => ({ slug: l.slug, quantity: l.quantity })),
          ...formContext(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "That didn't go through. Try again.");
        setState("idle");
        return;
      }

      setPlaced({ number: data.number, total: data.total });
      setState("done");
      clear();
    } catch {
      setError("Network problem. Try again in a moment.");
      setState("idle");
    }
  }

  if (state === "done" && placed) {
    return (
      <div className={styles.placed}>
        <CheckCircle2 className={styles.placedIcon} strokeWidth={1.5} />
        <h1 className={cn("display", styles.placedTitle)}>Order placed</h1>
        <p className={styles.orderNumber}>
          {placed.number}
        </p>
        <p className={styles.placedNote}>
          {inr(placed.total)}
          {mode === "COD" ? ", payable on delivery." : " — we'll send a payment link on WhatsApp within the hour."}
          {" "}Everything arrives pre-linked to your account.
        </p>
        <Button asChild variant="outline" className={styles.backToStore}>
          <Link href="/store">Back to the store</Link>
        </Button>
      </div>
    );
  }

  if (ready && lines.length === 0) {
    return (
      <div className={styles.empty}>
        <Package className={styles.emptyIcon} strokeWidth={1.5} />
        <p className={styles.emptyText}>Your cart is empty.</p>
        <Button asChild className={styles.browse}>
          <Link href="/store">Browse products</Link>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={styles.checkout}>
      <div className={styles.sections}>
        <section className={styles.panel}>
          <h2 className={cn("display", styles.panelTitle)}>Where should it go?</h2>
          <div className={styles.addressGrid}>
            <Field id="name" label="Your name" required placeholder="Meena Rao" />
            <Field id="businessName" label="Business name" placeholder="ABC Salon" />
            <Field id="phone" label="Phone" type="tel" required placeholder="+91 98450 00000" />
            <Field id="email" label="Email" type="email" placeholder="For the invoice and tracking" />
            <div className={cn(styles.field, styles.fieldWide)}>
              <Label htmlFor="address">Address</Label>
              <textarea
                id="address"
                name="address"
                rows={3}
                required
                placeholder="Shop number, building, street, landmark"
                className={styles.textarea}
              />
            </div>
            <Field id="city" label="City" required placeholder="Bengaluru" />
            <Field id="pincode" label="Pincode" required placeholder="560038" />
          </div>
        </section>

        <section className={styles.panel}>
          <h2 className={cn("display", styles.panelTitle)}>How would you like to pay?</h2>
          <div className={styles.paymentOptions}>
            {[
              { key: "ONLINE" as const, label: "Pay online", help: "UPI, card or netbanking. We send a secure link within the hour." },
              { key: "COD" as const, label: "Cash on delivery", help: "Available on orders under ₹5,000. ₹50 handling fee applies." },
            ].map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => setMode(option.key)}
                className={cn(
                  styles.paymentOption,
                  mode === option.key ? styles.paymentOptionOn : styles.paymentOptionOff
                )}
              >
                <span
                  className={cn(
                    styles.radio,
                    mode === option.key ? styles.radioOn : styles.radioOff
                  )}
                >
                  {mode === option.key && <span className={styles.radioDot} />}
                </span>
                <span>
                  <span className={styles.paymentLabel}>{option.label}</span>
                  <span className={styles.paymentHelp}>{option.help}</span>
                </span>
              </button>
            ))}
          </div>
        </section>
      </div>

      <aside className={styles.summaryColumn}>
        <div className={styles.summary}>
          <h2 className={cn("display", styles.summaryTitle)}>Order summary</h2>

          <ul className={styles.summaryLines}>
            {lines.map((l) => (
              <li key={l.slug} className={styles.summaryLine}>
                <span className={styles.summaryName}>
                  {l.name}
                  <span className={styles.summaryQuantity}>Qty {l.quantity}</span>
                </span>
                <span className={styles.summaryPrice}>{inr(l.price * l.quantity)}</span>
              </li>
            ))}
          </ul>

          <dl className={styles.totals}>
            <div className={styles.totalsRow}>
              <dt className={styles.totalsLabel}>Subtotal</dt>
              <dd>{inr(totals.subtotal)}</dd>
            </div>
            <div className={styles.totalsRow}>
              <dt className={styles.totalsLabel}>Shipping</dt>
              <dd>{totals.shipping === 0 ? "Free" : inr(totals.shipping)}</dd>
            </div>
            <div className={cn(styles.totalsRow, styles.grandTotal)}>
              <dt>Total</dt>
              <dd>{inr(totals.total)}</dd>
            </div>
          </dl>
          <p className={styles.gst}>Includes {inr(totals.gst)} GST</p>

          {error && (
            <p className={styles.error}>
              <AlertCircle className={styles.errorIcon} />
              {error}
            </p>
          )}

          <Button type="submit" size="lg" disabled={state === "sending"} className={styles.placeOrder}>
            {state === "sending" ? "Placing order…" : "Place order"}
          </Button>

          <p className={styles.accountNote}>
            A free BMU QR account is created with your order.
          </p>
        </div>
      </aside>
    </form>
  );
}

function Field({
  id, label, type = "text", required, placeholder,
}: { id: string; label: string; type?: string; required?: boolean; placeholder?: string }) {
  return (
    <div className={styles.field}>
      <Label htmlFor={id}>
        {label} {required && <span className={styles.required}>*</span>}
      </Label>
      <Input id={id} name={id} type={type} required={required} placeholder={placeholder} />
    </div>
  );
}

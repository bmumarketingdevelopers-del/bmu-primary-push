import type { Metadata } from "next";
import { CheckoutForm } from "@/components/store/checkout-form";
import { cn } from "@/lib/utils";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <section className="section">
      <div className="container">
        <span className="eyebrow">Checkout</span>
        <h1 className={cn("sec-title", styles.title)}>Almost there</h1>
        <CheckoutForm />
      </div>
    </section>
  );
}

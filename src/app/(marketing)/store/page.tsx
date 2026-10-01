import type { Metadata } from "next";
import { PackageCheck, RefreshCw, Truck } from "lucide-react";
import { PageHero } from "@/components/marketing/page-hero";
import { ProductGrid } from "@/components/store/product-grid";
import { CartButton } from "@/components/store/cart-drawer";
import { CtaBand } from "@/components/marketing/cta-band";
import { Reveal } from "@/components/marketing/reveal";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema } from "@/lib/structured-data";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "QR & NFC store",
  description:
    "NFC business cards, Google review standees, table QR tents and starter kits. Every product arrives pre-linked to your BMU QR account.",
};

const PROMISES = [
  { icon: RefreshCw, title: "Reprogrammable forever", body: "Change where any product points from your dashboard. Nothing you print ever expires." },
  { icon: Truck, title: "Free delivery over ₹2,000", body: "Shipped across India. Tracking emailed the moment it leaves us." },
  { icon: PackageCheck, title: "Arrives ready to use", body: "Pre-linked to your account and tested before dispatch. Unbox and put it on the counter." },
];

export default function StorePage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ href: "/store", label: "Store" }])} />

      <PageHero
        eyebrow="Store"
        title="QR and NFC products that keep working"
        lede="Cards, standees, stickers and kits. Each one is a doorway into your BMU QR account — so what it does is a setting, not something printed on it."
      />

      <section className="section">
        <div className="container">
          <div className={styles.toolbar}>
            <div className={styles.promises}>
              {PROMISES.map((p) => {
                const Icon = p.icon;
                return (
                  <div key={p.title} className={styles.promise}>
                    <span className={styles.promiseIconWrap}>
                      <Icon className={styles.promiseIcon} strokeWidth={1.8} />
                    </span>
                    <div>
                      <p className={styles.promiseTitle}>{p.title}</p>
                      <p className={styles.promiseBody}>{p.body}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <CartButton />
          </div>

          <Reveal>
            <ProductGrid />
          </Reveal>
        </div>
      </section>

      <CtaBand
        title="Not sure which one you need?"
        body="Tell us what kind of business you run and we'll say what's actually worth buying — often less than you'd expect."
        secondary={{ href: "/products", label: "See the software" }}
      />
    </>
  );
}

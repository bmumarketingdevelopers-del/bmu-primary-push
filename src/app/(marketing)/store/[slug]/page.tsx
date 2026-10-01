import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check, Nfc, QrCode, Truck } from "lucide-react";
import { AddToCart, CartButton } from "@/components/store/cart-drawer";
import { CtaBand } from "@/components/marketing/cta-band";
import { Badge } from "@/components/ui/badge";
import { PRODUCTS, productBySlug } from "@/lib/store";
import { cn, inr } from "@/lib/utils";
import styles from "./page.module.css";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = productBySlug(slug);
  if (!p) return { title: "Product not found" };
  return { title: p.name, description: p.tagline };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = productBySlug(slug);
  if (!product) notFound();

  return (
    <>
      <section className="section">
        <div className="container">
          <div className={styles.toolbar}>
            <Link
              href="/store"
              className={styles.backLink}
            >
              <ArrowLeft className={styles.smallIcon} /> All products
            </Link>
            <CartButton />
          </div>

          <div className={styles.layout}>
            <div className={styles.visual}>
              <span className={styles.visualTile}>
                {product.tech === "NFC"
                  ? <Nfc className={styles.visualIcon} strokeWidth={1.4} />
                  : <QrCode className={styles.visualIcon} strokeWidth={1.4} />}
              </span>
            </div>

            <div>
              <div className={styles.badges}>
                <Badge variant="outline">{product.tech}</Badge>
                {product.isPopular && <Badge variant="solid">Popular</Badge>}
              </div>

              <h1 className={cn("display", styles.name)}>{product.name}</h1>
              <p className={styles.tagline}>{product.tagline}</p>

              <p className={styles.priceRow}>
                <span className={cn("display", styles.price)}>{inr(product.price)}</span>
                {product.compareAt && (
                  <span className={styles.compareAt}>{inr(product.compareAt)}</span>
                )}
              </p>
              <p className={styles.taxNote}>Inclusive of GST</p>

              <AddToCart slug={product.slug} className={styles.addToCart} />

              <p className={styles.delivery}>
                <Truck className={styles.smallIcon} /> {product.leadTime} · free over ₹2,000
              </p>

              <p className={styles.description}>
                {product.description}
              </p>

              <div className={styles.block}>
                <h2 className={styles.blockTitle}>
                  What&apos;s included
                </h2>
                <ul className={styles.features}>
                  {product.features.map((f) => (
                    <li key={f} className={styles.feature}>
                      <Check className={styles.featureIcon} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles.block}>
                <h2 className={styles.blockTitle}>
                  Best for
                </h2>
                <div className={styles.bestFor}>
                  {product.bestFor.map((b) => (
                    <Badge key={b} variant="secondary">{b}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CtaBand
        title="Every product needs an account"
        body="A free BMU QR account comes with each order - that's what makes the code reprogrammable. Upgrade only when you need more."
        secondary={{ href: "/store", label: "Keep browsing" }}
      />
    </>
  );
}

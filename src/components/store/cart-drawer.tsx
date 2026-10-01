"use client";

import Link from "next/link";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "./cart-provider";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/store";
import { cn, inr } from "@/lib/utils";
import styles from "./cart-drawer.module.css";

export function CartDrawer() {
  const { lines, setQuantity, totals, isOpen, setOpen } = useCart();

  if (!isOpen) return null;

  const toFreeShipping = FREE_SHIPPING_THRESHOLD - totals.subtotal;

  return (
    <div className={styles.overlay} onClick={() => setOpen(false)}>
      <aside
        className={styles.drawer}
        onClick={(e) => e.stopPropagation()}
      >
        <header className={styles.header}>
          <h2 className={cn("display", styles.title)}>
            <ShoppingBag className={styles.titleIcon} /> Your cart
          </h2>
          <button onClick={() => setOpen(false)} aria-label="Close cart" className={styles.close}>
            <X className={styles.closeIcon} />
          </button>
        </header>

        {lines.length === 0 ? (
          <div className={styles.empty}>
            <div>
              <p className={styles.emptyText}>Nothing in here yet.</p>
              <Button asChild variant="outline" className={styles.browse} onClick={() => setOpen(false)}>
                <Link href="/store">Browse products</Link>
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className={cn("scroll-thin", styles.body)}>
              <ul className={styles.lines}>
                {lines.map((l) => (
                  <li key={l.slug} className={styles.line}>
                    <div className={styles.lineInfo}>
                      <Link
                        href={`/store/${l.slug}`}
                        onClick={() => setOpen(false)}
                        className={styles.lineName}
                      >
                        {l.name}
                      </Link>
                      <p className={styles.lineUnitPrice}>{inr(l.price)} each</p>

                      <div className={styles.stepper}>
                        <button onClick={() => setQuantity(l.slug, l.quantity - 1)} aria-label="One less" className={styles.stepperButton}>
                          <Minus className={styles.stepperIcon} />
                        </button>
                        <span className={styles.quantity}>{l.quantity}</span>
                        <button onClick={() => setQuantity(l.slug, l.quantity + 1)} aria-label="One more" className={styles.stepperButton}>
                          <Plus className={styles.stepperIcon} />
                        </button>
                      </div>
                    </div>
                    <span className={styles.lineTotal}>{inr(l.price * l.quantity)}</span>
                  </li>
                ))}
              </ul>

              {toFreeShipping > 0 && (
                <p className={styles.shippingNudge}>
                  Add {inr(toFreeShipping)} more for free shipping.
                </p>
              )}
            </div>

            <footer className={styles.footer}>
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
              <p className={styles.gst}>
                Includes {inr(totals.gst)} GST
              </p>

              <Button asChild size="lg" className={styles.checkout} onClick={() => setOpen(false)}>
                <Link href="/store/checkout">Checkout</Link>
              </Button>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}

export function CartButton() {
  const { totals, setOpen, ready } = useCart();

  return (
    <button
      onClick={() => setOpen(true)}
      aria-label={`Cart, ${totals.count} items`}
      className={styles.cartButton}
    >
      <ShoppingBag className={styles.cartIcon} />
      {ready && totals.count > 0 && (
        <span className={styles.cartCount}>
          {totals.count}
        </span>
      )}
    </button>
  );
}

export function AddToCart({ slug, className }: { slug: string; className?: string }) {
  const { add } = useCart();
  return (
    <Button size="lg" className={className} onClick={() => add(slug)}>
      Add to cart
    </Button>
  );
}

"use client";

import * as React from "react";
import { CheckCircle2, Minus, Plus, ShoppingBag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { placeOrder } from "@/app/b/[slug]/menu/actions";
import { cartTotals, FOOD_LABEL, type CartLine, type MenuCategory } from "@/lib/menu";
import { whatsappUrl } from "@/lib/qr-platform";
import { inr, cn } from "@/lib/utils";
import styles from "./menu-view.module.css";

type Filter = "ALL" | "VEG" | "NON_VEG";

export function MenuView({
  slug,
  businessName,
  whatsapp,
  brandColor,
  table,
  categories,
}: {
  slug: string;
  businessName: string;
  whatsapp: string;
  brandColor: string;
  table?: string;
  categories: MenuCategory[];
}) {
  const [cart, setCart] = React.useState<CartLine[]>([]);
  const [filter, setFilter] = React.useState<Filter>("ALL");
  const [open, setOpen] = React.useState(false);
  const [placing, setPlacing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [done, setDone] = React.useState<string | null>(null);

  const totals = cartTotals(cart);

  function change(item: { id: string; name: string; price: number }, delta: number) {
    setCart((prev) => {
      const existing = prev.find((l) => l.itemId === item.id);
      if (!existing) return delta > 0 ? [...prev, { itemId: item.id, name: item.name, price: item.price, quantity: 1 }] : prev;
      const quantity = existing.quantity + delta;
      return quantity <= 0
        ? prev.filter((l) => l.itemId !== item.id)
        : prev.map((l) => (l.itemId === item.id ? { ...l, quantity } : l));
    });
  }

  const qtyOf = (id: string) => cart.find((l) => l.itemId === id)?.quantity ?? 0;

  async function submit(paymentMode: "PAY_AT_COUNTER" | "WHATSAPP", form?: FormData) {
    setPlacing(true);
    setError(null);

    const result = await placeOrder({
      slug,
      table,
      channel: table ? "DINE_IN" : "TAKEAWAY",
      paymentMode,
      name: form?.get("name")?.toString(),
      phone: form?.get("phone")?.toString(),
      notes: form?.get("notes")?.toString(),
      lines: cart,
    });

    setPlacing(false);

    if (!result.ok) {
      setError(result.message);
      return;
    }

    if (paymentMode === "WHATSAPP") {
      const summary = cart.map((l) => `${l.quantity}× ${l.name}`).join("\n");
      window.open(
        whatsappUrl(
          whatsapp,
          `Order ${result.reference} from ${table ?? "takeaway"}\n\n${summary}\n\nTotal ${inr(totals.total)}`
        ),
        "_blank"
      );
    }

    setDone(result.reference ?? null);
    setCart([]);
  }

  /* ------------------------------ confirmed ----------------------------- */
  if (done) {
    return (
      <div className={styles.confirmed} style={{ "--brand": brandColor } as React.CSSProperties}>
        <div>
          <CheckCircle2 className={styles.confirmIcon} strokeWidth={1.5} />
          <h1 className={cn("display", styles.confirmTitle)}>Order sent to the kitchen</h1>
          <p className={styles.reference}>
            {done}
          </p>
          <p className={styles.confirmNote}>
            {table ? `Someone will bring it to ${table}.` : "We'll call your number when it's ready."}
          </p>
          <Button variant="outline" className={styles.againButton} onClick={() => setDone(null)}>
            Order something else
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.menu} style={{ "--brand": brandColor } as React.CSSProperties}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <h1 className={cn("display", styles.businessName)}>{businessName}</h1>
          <p className={styles.orderMode}>
            {table ? `Ordering for ${table}` : "Takeaway order"}
          </p>

          <div className={styles.filters}>
            {(["ALL", "VEG", "NON_VEG"] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  styles.filter,
                  filter === f ? styles.filterActive : styles.filterIdle
                )}
              >
                {f === "ALL" ? "Everything" : FOOD_LABEL[f].label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Menu */}
      <div className={styles.body}>
        {categories.map((c) => {
          const items = c.items.filter((i) =>
            filter === "ALL" ? true : filter === "VEG" ? i.foodType === "VEG" : i.foodType === "NON_VEG"
          );
          if (!items.length) return null;

          return (
            <section key={c.id} className={styles.category}>
              <h2 className={cn("display", styles.categoryName)}>{c.name}</h2>
              {c.description && (
                <p className={styles.categoryDescription}>{c.description}</p>
              )}

              <ul className={styles.items}>
                {items.map((i) => {
                  const qty = qtyOf(i.id);
                  const food = FOOD_LABEL[i.foodType];
                  return (
                    <li key={i.id} className={cn(styles.item, !i.isAvailable && styles.itemUnavailable)}>
                      <div className={styles.itemInfo}>
                        <div className={styles.itemHead}>
                          <span
                            className={styles.foodMark}
                            style={{ "--food": food.color } as React.CSSProperties}
                            aria-label={food.label}
                          >
                            <span className={styles.foodDot} />
                          </span>
                          <p className={styles.itemName}>{i.name}</p>
                          {i.isBestseller && (
                            <span className={styles.popular}>
                              Popular
                            </span>
                          )}
                        </div>
                        {i.description && (
                          <p className={styles.itemDescription}>{i.description}</p>
                        )}
                        <p className={styles.itemPrice}>{inr(i.price)}</p>
                        {!i.isAvailable && (
                          <p className={styles.soldOut}>Finished for today</p>
                        )}
                      </div>

                      {i.isAvailable && (
                        <div className={styles.itemAction}>
                          {qty === 0 ? (
                            <button
                              onClick={() => change(i, 1)}
                              className={styles.add}
                            >
                              Add
                            </button>
                          ) : (
                            <div className={styles.stepper}>
                              <button onClick={() => change(i, -1)} aria-label="One less" className={styles.stepButton}>
                                <Minus className={styles.stepIcon} />
                              </button>
                              <span className={styles.qty}>{qty}</span>
                              <button onClick={() => change(i, 1)} aria-label="One more" className={styles.stepButton}>
                                <Plus className={styles.stepIcon} />
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>

      {/* Cart bar */}
      {totals.count > 0 && !open && (
        <button
          onClick={() => setOpen(true)}
          className={styles.cartBar}
        >
          <span className={styles.cartCount}>
            <ShoppingBag className={styles.cartIcon} />
            {totals.count} item{totals.count > 1 ? "s" : ""}
          </span>
          <span className={styles.cartTotal}>{inr(totals.total)} · Review</span>
        </button>
      )}

      {/* Checkout sheet */}
      {open && (
        <div className={styles.overlay}>
          <div className={styles.sheet}>
            <div className={styles.sheetHeader}>
              <h2 className={cn("display", styles.sheetTitle)}>Your order</h2>
              <button onClick={() => setOpen(false)} aria-label="Close" className={styles.close}>
                <X className={styles.closeIcon} />
              </button>
            </div>

            <ul className={styles.cartLines}>
              {cart.map((l) => (
                <li key={l.itemId} className={styles.cartLine}>
                  <span className={styles.lineName}>{l.name}</span>
                  <div className={styles.lineControls}>
                    <button onClick={() => change({ id: l.itemId, name: l.name, price: l.price }, -1)} className={styles.lineStep}>
                      <Minus className={styles.stepIcon} />
                    </button>
                    <span className={styles.lineQty}>{l.quantity}</span>
                    <button onClick={() => change({ id: l.itemId, name: l.name, price: l.price }, 1)} className={styles.lineStep}>
                      <Plus className={styles.stepIcon} />
                    </button>
                    <span className={styles.lineTotal}>{inr(l.price * l.quantity)}</span>
                  </div>
                </li>
              ))}
            </ul>

            <dl className={styles.totals}>
              <div className={styles.totalRow}>
                <dt className={styles.totalLabel}>Subtotal</dt>
                <dd>{inr(totals.subtotal)}</dd>
              </div>
              <div className={styles.totalRow}>
                <dt className={styles.totalLabel}>GST 5%</dt>
                <dd>{inr(totals.tax)}</dd>
              </div>
              <div className={styles.grandTotal}>
                <dt>Total</dt>
                <dd>{inr(totals.total)}</dd>
              </div>
            </dl>

            <form
              className={styles.checkout}
              onSubmit={(e) => {
                e.preventDefault();
                submit("PAY_AT_COUNTER", new FormData(e.currentTarget));
              }}
            >
              {!table && (
                <div className={styles.contactGrid}>
                  <div className={styles.field}>
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" name="name" required />
                  </div>
                  <div className={styles.field}>
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" name="phone" type="tel" required />
                  </div>
                </div>
              )}

              <div className={styles.field}>
                <Label htmlFor="notes">Anything for the kitchen?</Label>
                <Input id="notes" name="notes" placeholder="Less spicy, no onion…" />
              </div>

              {error && (
                <p className={styles.error}>{error}</p>
              )}

              <Button type="submit" size="lg" disabled={placing} className={styles.checkoutButton}>
                {placing ? "Sending…" : `Send to kitchen · ${inr(totals.total)}`}
              </Button>

              <Button
                type="button"
                variant="outline"
                size="lg"
                disabled={placing}
                className={styles.checkoutButton}
                onClick={() => submit("WHATSAPP")}
              >
                Order on WhatsApp instead
              </Button>

              <p className={styles.payNote}>
                Pay at the counter when you&apos;re done.
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import * as React from "react";
import Link from "next/link";
import { Nfc, QrCode } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "./cart-provider";
import { PRODUCTS, STORE_CATEGORIES } from "@/lib/store";
import { inr, cn } from "@/lib/utils";
import styles from "./product-grid.module.css";

export function ProductGrid() {
  const [category, setCategory] = React.useState<string>("ALL");
  const { add } = useCart();

  const visible = category === "ALL" ? PRODUCTS : PRODUCTS.filter((p) => p.category === category);

  return (
    <>
      <div className={styles.filters}>
        {STORE_CATEGORIES.map((c) => (
          <button
            key={c.key}
            onClick={() => setCategory(c.key)}
            aria-pressed={category === c.key}
            className={cn(styles.filter, category === c.key ? styles.filterActive : styles.filterIdle)}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className={styles.grid}>
        {visible.map((p) => (
          <article
            key={p.slug}
            className={styles.card}
          >
            <Link href={`/store/${p.slug}`} className={styles.mediaLink}>
              <div className={styles.media}>
                <span className={styles.tile}>
                  {p.tech === "NFC" ? <Nfc className={styles.tileIcon} strokeWidth={1.5} /> : <QrCode className={styles.tileIcon} strokeWidth={1.5} />}
                </span>
                {p.isPopular && (
                  <Badge variant="solid" className={styles.popularBadge}>Popular</Badge>
                )}
                {p.compareAt && (
                  <Badge variant="warning" className={styles.saveBadge}>
                    Save {inr(p.compareAt - p.price)}
                  </Badge>
                )}
              </div>
            </Link>

            <div className={styles.body}>
              <Badge variant="outline" className={styles.techBadge}>{p.tech}</Badge>
              <Link href={`/store/${p.slug}`}>
                <h3 className={cn("display", styles.name)}>{p.name}</h3>
              </Link>
              <p className={styles.tagline}>{p.tagline}</p>

              <div className={styles.buy}>
                <p className={styles.priceRow}>
                  <span className={cn("display", styles.price)}>{inr(p.price)}</span>
                  {p.compareAt && (
                    <span className={styles.compareAt}>{inr(p.compareAt)}</span>
                  )}
                </p>
                <p className={styles.leadTime}>{p.leadTime}</p>
                <Button className={styles.addToCart} onClick={() => add(p.slug)}>Add to cart</Button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

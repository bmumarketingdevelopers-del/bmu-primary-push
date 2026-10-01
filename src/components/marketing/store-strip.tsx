import Link from "next/link";
import { ArrowRight, IdCard, Link2, Scan, Tent, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "./reveal";
import { PRODUCTS } from "@/lib/store";
import { cn, inr } from "@/lib/utils";
import styles from "./store-strip.module.css";

/** The four products shown in the banner, in display order, each with its tile icon. */
const FEATURED: { slug: string; icon: LucideIcon }[] = [
  { slug: "nfc-business-card", icon: IdCard },
  { slug: "google-review-standee", icon: Tent },
  { slug: "table-qr-tents", icon: Scan },
  { slug: "nfc-keychain", icon: Link2 },
];

/**
 * The hardware is how most businesses enter the funnel, so it needs a place
 * on the homepage rather than only in the footer.
 */
export function StoreStrip() {
  const featured = FEATURED.flatMap(({ slug, icon }) => {
    const product = PRODUCTS.find((p) => p.slug === slug);
    return product ? [{ product, Icon: icon }] : [];
  });

  return (
    <section className={cn("section", styles.section)}>
      <div className="container">
        <Reveal>
          <div className={styles.banner}>
            <div className={styles.copy}>
              <span className="eyebrow">Store</span>
              <h2 className={cn("sec-title", styles.title)}>
                <span className={styles.line}>Order the Hardware.</span>
                <span className={styles.line}>Unlock the Software.</span>
              </h2>
              <p className={styles.lede}>
                NFC cards, standees &amp; table tents — ready from day one, pre-linked to your free BMU QR account,
                making easier to turn interactions into reviews.
              </p>
              <Button asChild className={styles.cta}>
                <Link href="/store">
                  Browse the store <ArrowRight />
                </Link>
              </Button>
            </div>

            <ul className={styles.grid}>
              {featured.map(({ product: p, Icon }, i) => (
                <li key={p.slug}>
                  <Reveal delay={0.1 + i * 0.06} className={styles.tileWrap}>
                    <Link href={`/store/${p.slug}`} className={styles.tile}>
                      <span className={styles.icon}>
                        <Icon className={styles.glyph} strokeWidth={1.75} />
                      </span>
                      <h3 className={styles.name}>{p.name}</h3>
                      <span className={styles.price}>{inr(p.price)}</span>
                    </Link>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
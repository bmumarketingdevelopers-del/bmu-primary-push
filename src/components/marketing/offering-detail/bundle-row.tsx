"use client";

import { Fragment, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import styles from "./offering-bundle.module.css";

export type BundleItem = {
  slug: string;
  title: string;
  priceFrom: string;
  /** Set when the offering has its own page */
  href?: string;
  icon: React.ReactNode;
};

export function BundleRow({ current, others }: { current: BundleItem; others: BundleItem[] }) {
  const [added, setAdded] = useState<string[]>([]);

  const toggle = (slug: string) =>
    setAdded((list) => (list.includes(slug) ? list.filter((s) => s !== slug) : [...list, slug]));

  const picked = others.filter((o) => added.includes(o.slug));
  const enquireHref = `/contact?services=${[current, ...picked].map((o) => o.slug).join(",")}`;

  return (
    <>
      <div className={styles.row}>
        <div className={cn(styles.card, styles.cardCurrent)}>
          <span className={styles.viewing}>You&apos;re viewing</span>
          <div className={styles.cardBody}>
            <span className={cn(styles.icon, styles.iconCurrent)} aria-hidden="true">{current.icon}</span>
            <div className={styles.text}>
              <p className={styles.name}>{current.title}</p>
              <p className={styles.price}>From {current.priceFrom}</p>
            </div>
          </div>
        </div>

        {others.map((o) => {
          const isAdded = added.includes(o.slug);
          return (
            <Fragment key={o.slug}>
              <span className={styles.plus} aria-hidden="true"><Plus /></span>
              <div className={cn(styles.card, isAdded && styles.cardAdded)}>
                <div className={styles.cardBody}>
                  <span className={styles.icon} aria-hidden="true">{o.icon}</span>
                  <div className={styles.text}>
                    {o.href ? (
                      <Link href={o.href} className={cn(styles.name, styles.nameLink)}>{o.title}</Link>
                    ) : (
                      <p className={styles.name}>{o.title}</p>
                    )}
                    <p className={styles.price}>From <b>{o.priceFrom}</b></p>
                  </div>
                  <button
                    type="button"
                    className={styles.add}
                    aria-pressed={isAdded}
                    aria-label={`${isAdded ? "Remove" : "Add"} ${o.title}`}
                    onClick={() => toggle(o.slug)}
                  >
                    {isAdded ? <Check /> : <Plus />}
                    {isAdded ? "Added" : "Add"}
                  </button>
                </div>
              </div>
            </Fragment>
          );
        })}
      </div>

      {picked.length > 0 && (
        <p className={styles.summary}>
          <span>
            {current.title} + {picked.map((o) => o.title).join(" + ")}
          </span>
          <Link href={enquireHref} className={styles.summaryLink}>
            Enquire about this bundle <ArrowRight />
          </Link>
        </p>
      )}
    </>
  );
}

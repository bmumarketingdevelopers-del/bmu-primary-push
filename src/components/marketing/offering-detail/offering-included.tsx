import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Reveal } from "../reveal";
import type { OfferingPage } from "@/lib/service-pages-data";
import { cn } from "@/lib/utils";
import styles from "./offering-included.module.css";

const COUNT_WORDS = ["Zero", "One", "Two", "Three", "Four", "Five", "Six"];

export function OfferingIncluded({ offering }: Pick<OfferingPage, "offering">) {
  const { included } = offering.detail;
  const count = COUNT_WORDS[included.length] ?? String(included.length);

  return (
    <section className={styles.section}>
      <div className={cn("container", styles.grid)}>
        <Reveal>
          <span className={cn("eyebrow", styles.eyebrow)}>What&apos;s included</span>
          <h2 className={cn("display", styles.title)}>Everything in the package</h2>
          <p className={styles.lede}>
            {count} core pieces that make {offering.title} work, planned around your goals and reviewed every month.
          </p>
          <Link href="/contact" className={styles.link}>Enquire now <ArrowRight /></Link>
        </Reveal>

        <ol className={styles.list}>
          {included.map((item, i) => (
            <li key={item.title}>
              <Reveal delay={i * 0.07}>
                <div className={styles.item}>
                  <span className={cn("display", styles.number, i === 0 && styles.numberActive)}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className={styles.text}>
                    <h3 className={styles.itemTitle}>{item.title}</h3>
                    <p className={styles.itemBody}>{item.body}</p>
                  </div>
                  <span className={styles.check} aria-hidden="true"><Check /></span>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

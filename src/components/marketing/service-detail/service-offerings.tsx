import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "../reveal";
import { SectionHead } from "./section-head";
import { offeringHref, type ServicePageWithDetail } from "@/lib/service-pages-data";
import { cn } from "@/lib/utils";
import styles from "./service-offerings.module.css";

export function ServiceOfferings({ service, note }: { service: ServicePageWithDetail; note?: string }) {
  const { offerings } = service.detail;

  return (
    <section className={styles.section}>
      <div className="container">
        <SectionHead
          eyebrow="What you get"
          title="Services we provide"
          aside={note}
        />
        <div
          className={cn(
            styles.grid,
            offerings.length === 3 && styles.gridThree,
            offerings.length === 6 && styles.gridSix,
          )}
        >
          {offerings.map((o, i) => {
            const Icon = o.icon;
            return (
              <Reveal key={o.title} delay={(i % 3) * 0.07} className={styles.cardWrap}>
                <Link href={offeringHref(service, o)} className={styles.card}>
                  <div className={styles.top}>
                    <span className={styles.icon} aria-hidden="true"><Icon strokeWidth={1.8} /></span>
                    <span className={cn("display", styles.number)} aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className={styles.title}>{o.title}</h3>
                  <p className={styles.body}>{o.body}</p>
                  <div className={styles.footer}>
                    <span className={styles.price}>
                      From <b className={styles.priceValue}>{o.priceFrom}</b>
                    </span>
                    <span className={styles.enquire}>
                      Enquire
                      <span className={styles.enquireIcon} aria-hidden="true"><ArrowRight /></span>
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

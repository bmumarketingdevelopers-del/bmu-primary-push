import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "../reveal";
import { OFFERING_FACTS, type OfferingPage } from "@/lib/service-pages-data";
import { cn } from "@/lib/utils";
import styles from "./offering-hero.module.css";

export function OfferingHero({ service, offering }: OfferingPage) {
  const Icon = offering.icon;
  const facts = [{ label: "Starting from", value: offering.priceFrom }, ...OFFERING_FACTS];

  return (
    <section className={styles.hero}>
      <div className={cn("container", styles.inner)}>
        <Reveal className={styles.copy}>
          <Link href={`/services/${service.slug}`} className={styles.parentPill}>{service.title}</Link>
          <h1 className={cn("display", styles.title)}>{offering.title}</h1>
          <p className={styles.lede}>{offering.body}</p>

          <div className={styles.actions}>
            <Button asChild className={styles.button}>
              <Link href="/contact">Enquire now <ArrowRight /></Link>
            </Button>
            <Button asChild variant="ghostLight" className={styles.button}>
              <Link href="/contact">Book a free consultation</Link>
            </Button>
          </div>

          <dl className={styles.facts}>
            {facts.map((f) => (
              <div key={f.label}>
                <dt className={styles.factLabel}>{f.label}</dt>
                <dd className={styles.factValue}>{f.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal delay={0.12}>
          <div className={styles.card}>
            <div className={styles.cardHead}>
              <span className={styles.cardIcon} aria-hidden="true"><Icon strokeWidth={1.8} /></span>
              <div className={styles.cardName}>
                <p className={styles.cardTitle}>{offering.title}</p>
                <p className={styles.cardParent}>{service.title}</p>
              </div>
              <div className={styles.cardPrice}>
                <span className={styles.cardPriceLabel}>Starting from</span>
                <span className={cn("display", styles.cardPriceValue)}>{offering.priceFrom}</span>
              </div>
            </div>

            <p className={styles.cardEyebrow}>What&apos;s included</p>
            <ul className={styles.cardList}>
              {offering.detail.included.map((item) => (
                <li key={item.title} className={styles.cardItem}>
                  <span className={styles.cardCheck} aria-hidden="true"><Check /></span>
                  <span>
                    <span className={styles.cardItemTitle}>{item.title}</span>
                    <span className={styles.cardItemBody}>{item.body}</span>
                  </span>
                </li>
              ))}
            </ul>

            <div className={styles.cardFoot}>
              <span className={styles.cardReply}>Reply within one working day</span>
              <Link href="/contact" className={styles.cardLink}>Enquire <ArrowRight /></Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

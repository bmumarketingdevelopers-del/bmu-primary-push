import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "../reveal";
import { SERVICE_PROMISES, type ServicePageWithDetail } from "@/lib/service-pages-data";
import { cn } from "@/lib/utils";
import styles from "./service-hero.module.css";

// Where the labels sit on the outer ring, in degrees clockwise from 12 o'clock
const NODE_ANGLES: Record<number, number[]> = {
  2: [-50, 115], // top-left, lower right
  3: [35, -105, 105], // top-right, left, right
  4: [-48, 48, -132, 132], // top-left, top-right, bottom-left, bottom-right
};

export function ServiceHero({ service }: { service: ServicePageWithDetail }) {
  const Icon = service.detail.heroIcon ?? service.icon;
  const angles = NODE_ANGLES[service.detail.heroNodes.length] ?? NODE_ANGLES[4];

  return (
    <>
      <section className={styles.hero}>
        <div className={cn("container", styles.inner)}>
          <Reveal className={styles.copy}>
            <span className={cn("eyebrow", styles.eyebrow)}>{service.tagline}</span>
            <h1 className={cn("display", styles.title)}>{service.title}</h1>
            <p className={styles.lede}>{service.detail.lede}</p>
            <div className={styles.actions}>
              <Button asChild className={styles.button}>
                <Link href="/contact">Book a free consultation <ArrowRight /></Link>
              </Button>
              <p className={styles.price}>
                From <b className={styles.priceValue}>{service.priceFrom}</b>
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.12} className={styles.visualWrap}>
            <div className={styles.visual} aria-hidden="true">
              <span className={cn(styles.ring, styles.ringOuter)} />
              <span className={cn(styles.ring, styles.ringMid)} />
              <span className={styles.glow} />
              <span className={styles.core}>
                <span className={styles.coreIcon}>
                  <Icon strokeWidth={2.2} />
                </span>
              </span>
              {service.detail.heroNodes.map((label, i) => (
                <span key={label} className={styles.node} style={{ "--a": `${angles[i]}deg` } as React.CSSProperties}>
                  {label}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <div className={cn("container", styles.promiseWrap)}>
        <Reveal>
          <ul className={styles.promises}>
            {SERVICE_PROMISES.map((p) => {
              const PIcon = p.icon;
              return (
                <li key={p.title} className={styles.promise}>
                  <span className={styles.promiseIcon} aria-hidden="true"><PIcon /></span>
                  <span>
                    <span className={styles.promiseTitle}>{p.title}</span>
                    <span className={styles.promiseBody}>{p.body}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </>
  );
}

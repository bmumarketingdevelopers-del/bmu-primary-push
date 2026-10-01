import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Reveal } from "@/components/marketing/reveal";
import { Button } from "@/components/ui/button";
import { SERVICE_PAGES, servicePageHref } from "@/lib/service-pages-data";
import { cn } from "@/lib/utils";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Marketing and visibility, brand and design, web and AI, social and personal brand, content production and UGC creator marketing — six services from one team in Bengaluru.",
};

// Clockwise from 12 o'clock, one every 60°
const ORBIT_NODES = ["Marketing", "Personal brand", "UGC & creators", "Brand & design", "Content", "Web & AI"];

const CALL_POINTS = [
  "30-minute strategy conversation",
  "Review of your current approach",
  "Practical opportunities to explore",
];

function Orbit() {
  return (
    <figure className={styles.orbitFigure}>
      <div className={styles.orbit} aria-hidden="true">
        <svg className={styles.orbitLines} viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="42" className={styles.orbitRing} />
          <circle cx="50" cy="50" r="27" className={styles.orbitInner} />
          {ORBIT_NODES.map((_, i) => {
            const a = (i * Math.PI) / 3;
            return (
              <line
                key={i}
                x1="50"
                y1="50"
                x2={50 + 42 * Math.sin(a)}
                y2={50 - 42 * Math.cos(a)}
                className={styles.orbitSpoke}
              />
            );
          })}
        </svg>
        <span className={styles.orbitGlow} />
        <span className={styles.orbitCore}>
          <span className={styles.orbitMark}>
            <span className={styles.orbitMarkCore} />
          </span>
        </span>
        {ORBIT_NODES.map((label, i) => (
          <span key={label} className={styles.orbitNode} style={{ "--i": i } as React.CSSProperties}>
            {label}
          </span>
        ))}
      </div>
      <figcaption className={styles.orbitCaption}>Every service reports into one monthly review</figcaption>
    </figure>
  );
}

export default function ServicesPage() {
  return (
    <>
      <section className={styles.hero}>
        <div className={cn("container", styles.heroInner)}>
          <Reveal className={styles.heroCopy}>
            <span className={cn("eyebrow", styles.heroEyebrow)}>Services</span>
            <h1 className={cn("display", styles.heroTitle)}>Six services that plug into each other</h1>
            <p className={styles.heroLede}>
              Most clients start with one and add the rest as results compound. Every engagement is priced monthly,
              reported monthly, and reviewed together.
            </p>
            <Button asChild className={styles.heroButton}>
              <Link href="/contact">Book a free consultation <ArrowRight /></Link>
            </Button>
          </Reveal>

          <Reveal delay={0.12} className={styles.heroVisual}>
            <Orbit />
          </Reveal>
        </div>
      </section>

      <section className={styles.cardsSection}>
        <div className={cn("container", styles.serviceGrid)}>
          {SERVICE_PAGES.map((s, i) => {
            const Icon = s.icon;
            return (
              <Reveal key={s.title} delay={(i % 2) * 0.08} className={styles.cardWrap}>
                <Link href={servicePageHref(s)} className={styles.serviceCard}>
                  <span className={styles.iconWrap}>
                    <Icon className={styles.icon} strokeWidth={1.8} aria-hidden="true" />
                  </span>
                  <p className={styles.tagline}>{s.tagline}</p>
                  <h2 className={cn("display", styles.title)}>{s.title}</h2>
                  <p className={styles.summary}>{s.summary}</p>
                  <div className={styles.chips}>
                    {s.chips.map((c) => (
                      <span key={c} className={styles.chip}>{c}</span>
                    ))}
                  </div>
                  <div className={styles.footer}>
                    <span className={styles.price}>
                      From <b className={styles.priceValue}>{s.priceFrom}</b>
                    </span>
                    <span className={styles.details}>Details</span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className="container">
          <Reveal>
            <div className={styles.cta}>
              <span className={styles.ctaRings} aria-hidden="true" />
              <div className={styles.ctaCopy}>
                <h2 className={cn("display", styles.ctaTitle)}>Ready to make your numbers move?</h2>
                <p className={styles.ctaBody}>
                  Bring us the challenge. We&apos;ll bring the strategy, creative thinking and execution to move your
                  business forward.
                </p>
                <div className={styles.ctaActions}>
                  <Button asChild>
                    <Link href="/contact">Book a free consultation <ArrowRight /></Link>
                  </Button>
                  <Button asChild variant="ghostLight">
                    <Link href="/pricing">See pricing</Link>
                  </Button>
                </div>
              </div>
              <div className={styles.ctaCard}>
                <p className={styles.ctaCardTitle}>What you get from the call</p>
                <ul className={styles.ctaList}>
                  {CALL_POINTS.map((p) => (
                    <li key={p} className={styles.ctaItem}>
                      <span className={styles.ctaCheck} aria-hidden="true"><Check /></span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

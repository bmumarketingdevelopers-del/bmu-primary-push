"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DotMatrix } from "./dot-matrix";
import { CountUp } from "./count-up";
import { HERO_PILLS, HERO_ROTATIONS, HERO_STATS } from "@/lib/content";
import { cn } from "@/lib/utils";
import styles from "./hero.module.css";

export type HeroContent = {
  badge?: string;
  headingLine1?: string;
  headingLine2?: string;
  rotations?: string[];
  subheading?: string;
  pills?: string[];
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
};

export type HeroStat = { value: string; label: string };

export function Hero({ content = {}, stats }: { content?: HeroContent; stats?: HeroStat[] }) {
  // Content comes from the CMS; these constants are the fallback.
  const rotations = content.rotations?.length ? content.rotations : HERO_ROTATIONS;
  const pills = content.pills?.length ? content.pills : HERO_PILLS;
  const figures = stats?.length ? stats : HERO_STATS;

  const [i, setI] = React.useState(0);



  React.useEffect(() => {
    const id = setInterval(() => setI((p) => (p + 1) % rotations.length), 2600);
    return () => clearInterval(id);
  }, [rotations.length]);

  // CHANGE: shrink font-size for longer rotations, based on character length
  const REFERENCE_LENGTH = Math.min(...rotations.map((r) => r.length));


  return (
    <section className={styles.hero}>
      <div className="container">
        <div className={styles.grid}>
          <div>
            <span className={styles.badge}>
              <span className={styles.liveDot}>
                <span className={styles.liveDotPing} />
                <span className={styles.liveDotCore} />
              </span>
              {content.badge ?? "Taking on 4 new retainers for Q3"}
            </span>

            <h1 className={cn("display", styles.title)}>

              Building Smarter
              <br />
              Growth Systems for

              <br />
              <span className={styles.rotator}>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -14 }}
                    transition={{ duration: 0.42, ease: [0.4, 0, 0.2, 1] }}
                    className={styles.rotation}

                  >
                    {rotations[i]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </h1>

            <p className={styles.lede}>
              {content.subheading ??
                "We bring strategy, creative, marketing, web, and automation together under one roof."}
            </p>

            <div className={styles.pills}>
              {pills.map((p) => (
                <span
                  key={p}
                  className={styles.pill}
                >
                  {p}
                </span>
              ))}
            </div>

            <div className={styles.actions}>
              <Button asChild>
                <Link href={content.primaryCtaHref ?? "/contact"}>
                  {content.primaryCtaLabel ?? "Book a free consultation"} <ArrowRight />
                </Link>
              </Button>
              <Button asChild variant="ghostLight">
                <Link href={content.secondaryCtaHref ?? "/case-studies"}>
                  {content.secondaryCtaLabel ?? "See the work"}
                </Link>
              </Button>
            </div>

            <dl className={styles.stats}>
              {figures.map((s) => (
                <div key={s.label}>
                  <dt className={cn("display", styles.statValue)}>
                    <CountUp value={s.value} />
                  </dt>
                  <dd className={styles.statLabel}>{s.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className={styles.visual}>
            <DotMatrix />
            <FloatCard className={styles.floatLeads} value="+312%" label="Social Reach" />
            <FloatCard
              className={styles.floatScans}
              value="18,402"
              label="QR scans this week"
            />
          </div>
        </div>


      </div>
    </section>
  );
}

function FloatCard({ value, label, className }: { value: string; label: string; className?: string }) {
  return (
    <div
      className={cn(styles.floatCard, className)}
    >
      <b className={cn("display", styles.floatValue)}>
        <CountUp value={value} />
      </b>
      <span className={styles.floatLabel}>{label}</span>
    </div>
  );
}

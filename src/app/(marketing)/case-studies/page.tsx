import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CountUp } from "@/components/marketing/count-up";
import { Reveal } from "@/components/marketing/reveal";
import { CaseStudiesShowcase } from "@/components/marketing/case-studies-showcase";
import { CASE_STUDIES } from "@/lib/case-studies-data";
import { cn } from "@/lib/utils";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Case studies",
  description: "How we lifted site visits by 312%, moved six restaurant outlets to 4.8 stars, and cut D2C acquisition cost by 41%.",
};

const CALL_INCLUDES = [
  "30-minute strategy conversation",
  "Review of your current approach",
  "Practical opportunities to explore",
];

export default function CaseStudiesPage() {
  return (
    <>
      <section className={styles.hero}>
        <div aria-hidden className={styles.heroGrid} />
        <div className={cn("container", styles.heroInner)}>
          <div className={styles.heroCopy}>
            <nav aria-label="Breadcrumb" className={styles.breadcrumbs}>
              <Link href="/" className={styles.crumbLink}>Home</Link>
              <ChevronRight className={styles.crumbIcon} />
              <span className={styles.crumbCurrent}>Case studies</span>
            </nav>
            <h1 className={cn("display", styles.heroTitle)}>
              Ideas are easy. Making them work is harder.
            </h1>
            <p className={styles.heroLede}>
              Behind every result is a problem worth solving. Here&apos;s how we turned business challenges into
              sharper strategies, stronger creative and measurable outcomes.
            </p>
          </div>

          <Reveal delay={0.1}>
            <div className={styles.glance}>
              <p className={styles.glanceTitle}>Results at a glance</p>
              <ul className={styles.glanceList}>
                {CASE_STUDIES.map((c) => (
                  <li key={c.slug}>
                    <Link href={`/case-studies/${c.slug}`} className={styles.glanceRow}>
                      <span className={cn("display", styles.glanceValue)}>
                        <CountUp value={c.metric} />
                      </span>
                      <span className={styles.glanceText}>
                        <b>{c.results[0].label}</b>
                        <span>{c.industry}</span>
                      </span>
                      <span className={styles.glanceArrow}>
                        <ArrowRight />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      <CaseStudiesShowcase studies={CASE_STUDIES} />

      <section className={cn("section", styles.ctaSection)}>
        <div className="container">
          <Reveal>
            <div className={styles.cta}>
              <div className={styles.ctaCopy}>
                <h2 className={cn("display", styles.ctaTitle)}>Ready to make your numbers move?</h2>
                <p className={styles.ctaBody}>
                  Bring us the challenge. We&apos;ll bring the strategy, creative thinking and execution to help move
                  your business forward.
                </p>
                <div className={styles.ctaActions}>
                  <Button asChild>
                    <Link href="/contact">
                      Start a conversation <ArrowRight />
                    </Link>
                  </Button>
                  <Button asChild variant="ghostLight">
                    <Link href="/services">See our services</Link>
                  </Button>
                </div>
              </div>

              <div className={styles.ctaCard}>
                <p className={styles.ctaCardTitle}>What you get from the call</p>
                <ul className={styles.ctaList}>
                  {CALL_INCLUDES.map((item) => (
                    <li key={item}>
                      <span className={styles.ctaCheck}>
                        <Check />
                      </span>
                      {item}
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

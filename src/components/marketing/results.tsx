import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "./section-heading";
import { Reveal } from "./reveal";
import { CountUp } from "./count-up";
import { ResultsCarousel } from "./results-carousel";
import { CASE_STUDIES } from "@/lib/case-studies-data";
import { cn } from "@/lib/utils";
import styles from "./results.module.css";

export function Results({ heading = true }: { heading?: boolean }) {
  return (
    <section id="results" className="section">
      <div className="container">
        {heading && (
          <Reveal>
            <SectionHeading
              className={styles.heading}
              eyebrow="Case studies"
              title={<>The numbers that <br />actually got reported</>}
              lede={
                <>
                  Your marketing should be measurable.{" "}
                  <br className={styles.ledeBreak} />
                  Every retainer includes a monthly report connecting traffic, leads, acquisition costs, search
                  visibility and revenue to the outcomes that matter.
                </>
              }
              action={
                <Button asChild variant="outline">
                  <Link href="/case-studies">
                    All case studies <ArrowRight />
                  </Link>
                </Button>
              }
            />
          </Reveal>
        )}

        <ResultsCarousel
          slides={CASE_STUDIES.map((c, i) => (
            <Reveal key={c.slug} delay={i * 0.07} className={styles.reveal}>
              <Link
                href={`/case-studies/${c.slug}`}
                className={styles.card}
              >
                <p className={styles.industry}>{c.industry}</p>
                <p className={cn("display", styles.metric)}>
                  {/* Card 1 (312%) has the biggest number to climb, so it gets a slower count. */}
                  <CountUp value={c.metric} duration={i === 0 ? 7 : undefined} />
                </p>
                <h3 className={styles.metricLabel}>{c.metricLabel}</h3>
                <p className={styles.summary}>{c.summary}</p>
                <p className={styles.more}>
                  Read the case study{" "}
                  <span className={styles.arrow}>→</span>
                </p>
              </Link>
            </Reveal>
          ))}
        />
      </div>
    </section>
  );
}
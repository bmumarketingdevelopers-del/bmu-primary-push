import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/marketing/page-hero";
import { CtaBand } from "@/components/marketing/cta-band";
import { Reveal } from "@/components/marketing/reveal";
import { Button } from "@/components/ui/button";
import { INDUSTRY_DETAILS, ALL_INDUSTRIES } from "@/lib/industries-data";
import { cn } from "@/lib/utils";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Industries",
  description: "Marketing playbooks for real estate, restaurants, hotels, healthcare, education, ecommerce, automobile, fitness and more.",
};

export default function IndustriesPage() {
  const featuredNames = new Set(INDUSTRY_DETAILS.map((i) => i.name));

  return (
    <>
      <PageHero
        eyebrow="Industries"
        title="Twenty-seven sectors, twenty-seven playbooks"
        lede="Every industry has a different buying cycle, a different response window and a different definition of a good lead. We start from the playbook rather than from scratch."
      />

      <section className="section">
        <div className="container">
          <Reveal>
            <span className="eyebrow">Deep expertise</span>
            <h2 className={cn("sec-title", styles.featuredTitle)}>Sectors we work in most</h2>
          </Reveal>
          <div className={styles.featuredGrid}>
            {INDUSTRY_DETAILS.map((ind, i) => (
              <Reveal key={ind.slug} delay={(i % 4) * 0.06}>
                <Link
                  href={`/industries/${ind.slug}`}
                  className={styles.industryCard}
                >
                  <p className={cn("display", styles.industryName)}>{ind.name}</p>
                  <p className={styles.industryTagline}>{ind.tagline}</p>
                  <p className={styles.industrySummary}>{ind.summary}</p>
                  <div className={styles.industryMetric}>
                    <span className={cn("display", styles.industryMetricValue)}>{ind.metrics[0].value}</span>
                    <span className={styles.industryMetricLabel}>{ind.metrics[0].label}</span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className={cn("section", styles.otherSection)}>
        <div className="container">
          <Reveal>
            <span className="eyebrow">Everyone else</span>
            <h2 className="sec-title">Also served</h2>
            <p className={styles.otherLede}>
              These sectors don&apos;t have a dedicated page yet, but we work in all of them. Ask on a call and
              we&apos;ll walk you through comparable work.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <ul className={styles.otherList}>
              {ALL_INDUSTRIES.filter((n) => !featuredNames.has(n)).map((name) => (
                <li
                  key={name}
                  className={styles.otherItem}
                >
                  {name}
                </li>
              ))}
            </ul>
            <Button asChild variant="outline" className={styles.askButton}>
              <Link href="/contact">Ask about your sector <ArrowRight /></Link>
            </Button>
          </Reveal>
        </div>
      </section>

      <CtaBand secondary={{ href: "/case-studies", label: "See results" }} />
    </>
  );
}

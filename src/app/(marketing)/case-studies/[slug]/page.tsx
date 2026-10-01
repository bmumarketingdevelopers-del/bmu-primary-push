import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/marketing/page-hero";
import { CtaBand } from "@/components/marketing/cta-band";
import { Reveal } from "@/components/marketing/reveal";
import { Card } from "@/components/ui/card";
import { CASE_STUDIES, getCaseStudy } from "@/lib/case-studies-data";
import { getService } from "@/lib/services-data";
import { cn } from "@/lib/utils";
import styles from "./page.module.css";

export function generateStaticParams() {
  return CASE_STUDIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};
  return { title: study.title, description: study.summary };
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  const services = study.services.map(getService).filter(Boolean);
  const others = CASE_STUDIES.filter((c) => c.slug !== study.slug);

  return (
    <>
      <PageHero
        eyebrow={study.industry}
        title={study.title}
        lede={study.summary}
        breadcrumbs={[
          { href: "/case-studies", label: "Case studies" },
          { href: `/case-studies/${study.slug}`, label: study.client },
        ]}
      />

      <section className={styles.resultsBand}>
        <div className={cn("container", styles.resultsGrid)}>
          {study.results.map((r) => (
            <div key={r.label} className={styles.result}>
              <p className={cn("display", styles.resultValue)}>{r.value}</p>
              <p className={styles.resultLabel}>{r.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className={cn("container", styles.situationGrid)}>
          <Reveal>
            <span className="eyebrow">The situation</span>
            <h2 className="sec-title">What we found</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className={styles.challenge}>
              {study.challenge.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className={cn("section", styles.approachSection)}>
        <div className="container">
          <Reveal>
            <span className="eyebrow">What we did</span>
            <h2 className={cn("sec-title", styles.approachTitle)}>The approach</h2>
          </Reveal>
          <ol className={styles.approachGrid}>
            {study.approach.map((a, i) => (
              <Reveal key={a.title} delay={(i % 3) * 0.06}>
                <Card className={styles.stepCard}>
                  <span className={cn("display", styles.stepNumber)}>0{i + 1}</span>
                  <h3 className={styles.stepTitle}>{a.title}</h3>
                  <p className={styles.stepBody}>{a.body}</p>
                </Card>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {study.quote && (
        <section className="section">
          <div className="container">
            <Reveal>
              <figure className={styles.quote}>
                <p className={cn("display", styles.quoteMark)}>&ldquo;</p>
                <blockquote className={styles.quoteText}>
                  {study.quote.text}
                </blockquote>
                <figcaption className={styles.quoteCaption}>
                  <b className={styles.quoteAuthor}>{study.quote.author}</b>
                  {study.quote.role}
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </section>
      )}

      <section className={cn("section", styles.servicesSection)}>
        <div className="container">
          <Reveal>
            <span className="eyebrow">Services used</span>
            <h2 className={cn("sec-title", styles.servicesTitle)}>What was involved</h2>
            <div className={styles.serviceList}>
              {services.map((s) => (
                <Link
                  key={s!.slug}
                  href={`/services/${s!.slug}`}
                  className={styles.serviceLink}
                >
                  {s!.title}
                </Link>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className={styles.othersGrid}>
              {others.map((o) => (
                <Link
                  key={o.slug}
                  href={`/case-studies/${o.slug}`}
                  className={styles.otherCard}
                >
                  <div>
                    <p className={styles.otherIndustry}>{o.industry}</p>
                    <h3 className={cn("display", styles.otherTitle)}>{o.title}</h3>
                  </div>
                  <span className={cn("display", styles.otherMetric)}>{o.metric}</span>
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <CtaBand secondary={{ href: "/case-studies", label: "All case studies" }} />
    </>
  );
}

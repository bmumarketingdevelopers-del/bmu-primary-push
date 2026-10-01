import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/marketing/page-hero";
import { CtaBand } from "@/components/marketing/cta-band";
import { Reveal } from "@/components/marketing/reveal";
import { ServiceIcon } from "@/components/marketing/service-icon";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { INDUSTRY_DETAILS, getIndustry } from "@/lib/industries-data";
import { getService } from "@/lib/services-data";
import { cn } from "@/lib/utils";
import styles from "./page.module.css";

export function generateStaticParams() {
  return INDUSTRY_DETAILS.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const industry = getIndustry(slug);
  if (!industry) return {};
  return { title: `${industry.name} marketing`, description: industry.summary };
}

export default async function IndustryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const industry = getIndustry(slug);
  if (!industry) notFound();

  const services = industry.services.map(getService).filter(Boolean);

  return (
    <>
      <PageHero
        eyebrow={`${industry.name} · ${industry.tagline}`}
        title={`Marketing for ${industry.name.toLowerCase()}`}
        lede={industry.intro}
        breadcrumbs={[
          { href: "/industries", label: "Industries" },
          { href: `/industries/${industry.slug}`, label: industry.name },
        ]}
      >
        <Button asChild>
          <Link href="/contact">Book a free consultation <ArrowRight /></Link>
        </Button>
      </PageHero>

      <section className={styles.metricsBand}>
        <div className={cn("container", styles.metricsGrid)}>
          {industry.metrics.map((m) => (
            <div key={m.label} className={styles.metric}>
              <p className={cn("display", styles.metricValue)}>{m.value}</p>
              <p className={styles.metricLabel}>{m.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal>
            <span className="eyebrow">What usually goes wrong</span>
            <h2 className={cn("sec-title", styles.sectionTitle)}>The problems we&apos;re called in for</h2>
          </Reveal>
          <div className={styles.challengeGrid}>
            {industry.challenges.map((c, i) => (
              <Reveal key={c.title} delay={(i % 2) * 0.07}>
                <Card className={styles.challengeCard}>
                  <h3 className={cn("display", styles.challengeTitle)}>{c.title}</h3>
                  <p className={styles.challengeBody}>
                    <span className={styles.challengeLead}>How we fix it: </span>
                    {c.body}
                  </p>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className={cn("section", styles.playbookSection)}>
        <div className={cn("container", styles.playbookGrid)}>
          <Reveal>
            <span className="eyebrow">The playbook</span>
            <h2 className="sec-title">What a {industry.name.toLowerCase()} engagement looks like</h2>
            <p className={styles.playbookLede}>
              Sequenced, not simultaneous. Each step gets the previous one working first.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <ol className={styles.steps}>
              {industry.playbook.map((step, i) => (
                <li key={step} className={styles.step}>
                  <span className={cn("display", styles.stepNumber)}>
                    {i + 1}
                  </span>
                  <p className={styles.stepText}>{step}</p>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal>
            <span className="eyebrow">Services involved</span>
            <h2 className={cn("sec-title", styles.sectionTitle)}>What we bring to this</h2>
          </Reveal>
          <div className={styles.serviceGrid}>
            {services.map((s, i) => (
              <Reveal key={s!.slug} delay={(i % 4) * 0.06}>
                <Link
                  href={`/services/${s!.slug}`}
                  className={styles.serviceCard}
                >
                  <div className={styles.serviceIconWrap}>
                    <ServiceIcon name={s!.icon} className={styles.serviceIcon} />
                  </div>
                  <h3 className={cn("display", styles.serviceTitle)}>{s!.title}</h3>
                  <p className={styles.serviceTagline}>{s!.tagline}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title={`Let's talk about your ${industry.name.toLowerCase()} pipeline`}
        secondary={{ href: "/industries", label: "All industries" }}
      />
    </>
  );
}

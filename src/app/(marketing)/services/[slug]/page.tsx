import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import { PageHero } from "@/components/marketing/page-hero";
import { CtaBand } from "@/components/marketing/cta-band";
import { Reveal } from "@/components/marketing/reveal";
import { ServiceIcon } from "@/components/marketing/service-icon";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SERVICE_DETAILS, getService } from "@/lib/services-data";
import { SERVICE_PAGES, getServicePage } from "@/lib/service-pages-data";
import { ServiceDetail } from "@/components/marketing/service-detail/service-detail";
import { cn } from "@/lib/utils";
import styles from "./page.module.css";

export function generateStaticParams() {
  return [
    ...SERVICE_PAGES.filter((s) => s.detail).map((s) => ({ slug: s.slug })),
    ...SERVICE_DETAILS.map((s) => ({ slug: s.slug })),
  ];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = getServicePage(slug);
  if (page) return { title: page.title, description: page.summary };
  const service = getService(slug);
  if (!service) return {};
  return { title: service.title, description: service.summary };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // The six current services use the new section-based layout
  const page = getServicePage(slug);
  if (page) return <ServiceDetail service={page} />;

  const service = getService(slug);
  if (!service) notFound();

  const related = service.related.map(getService).filter(Boolean);

  return (
    <>
      <PageHero
        eyebrow={service.tagline}
        title={service.title}
        lede={service.intro}
        breadcrumbs={[
          { href: "/services", label: "Services" },
          { href: `/services/${service.slug}`, label: service.title },
        ]}
      >
        <div className={styles.heroActions}>
          <Button asChild>
            <Link href="/contact">Book a free consultation <ArrowRight /></Link>
          </Button>
          <span className={styles.heroPrice}>
            From <b className={styles.heroPriceValue}>{service.priceFrom}</b>
          </span>
        </div>
      </PageHero>

      <section className="section">
        <div className="container">
          <Reveal>
            <span className="eyebrow">What you get</span>
            <h2 className={cn("sec-title", styles.sectionTitle)}>Deliverables</h2>
          </Reveal>
          <div className={styles.deliverableGrid}>
            {service.deliverables.map((d, i) => (
              <Reveal key={d.title} delay={(i % 3) * 0.07}>
                <Card className={styles.deliverableCard}>
                  <div className={styles.iconWrap}>
                    <ServiceIcon name={service.icon} slug={service.slug} className={styles.serviceIcon} />
                  </div>
                  <h3 className={styles.deliverableTitle}>{d.title}</h3>
                  <p className={styles.deliverableBody}>{d.body}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className={cn("section", styles.processSection)}>
        <div className={cn("container", styles.processGrid)}>
          <Reveal>
            <span className="eyebrow">How it runs</span>
            <h2 className="sec-title">The process</h2>
            <p className={styles.processLede}>
              Four stages, in this order. We don&apos;t skip ahead — most of the failures we&apos;re asked to fix
              come from launching before the foundation was in place.
            </p>
            <ul className={styles.outcomes}>
              {service.outcomes.map((o) => (
                <li key={o} className={styles.outcome}>
                  <Check className={styles.outcomeIcon} />
                  {o}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.1}>
            <ol className={styles.steps}>
              {service.process.map((p, i) => (
                <li key={p.title} className={styles.step}>
                  <span className={cn("display", styles.stepNumber)}>
                    {i + 1}
                  </span>
                  <h3 className={cn("display", styles.stepTitle)}>{p.title}</h3>
                  <p className={styles.stepBody}>{p.body}</p>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className={cn("container", styles.faqGrid)}>
          <Reveal>
            <span className="eyebrow">FAQ</span>
            <h2 className="sec-title">Common questions</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <Accordion type="single" collapsible className={styles.faqList}>
              {service.faqs.map((f) => (
                <AccordionItem key={f.q} value={f.q}>
                  <AccordionTrigger>{f.q}</AccordionTrigger>
                  <AccordionContent>{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </section>

      {related.length > 0 && (
        <section className={cn("section", styles.relatedSection)}>
          <div className="container">
            <Reveal>
              <span className="eyebrow">Works well with</span>
              <h2 className={cn("sec-title", styles.sectionTitle)}>Pairs with</h2>
            </Reveal>
            <div className={styles.relatedGrid}>
              {related.map((r, i) => (
                <Reveal key={r!.slug} delay={i * 0.07}>
                  <Link
                    href={`/services/${r!.slug}`}
                    className={styles.relatedCard}
                  >
                    <div className={styles.iconWrap}>
                      <ServiceIcon name={r!.icon} slug={r!.slug} className={styles.serviceIcon} />
                    </div>
                    <h3 className={cn("display", styles.relatedTitle)}>{r!.title}</h3>
                    <p className={styles.relatedSummary}>{r!.summary}</p>
                    <p className={styles.relatedMore}>
                      Explore <span className={styles.arrow}>→</span>
                    </p>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBand secondary={{ href: "/services", label: "All services" }} />
    </>
  );
}

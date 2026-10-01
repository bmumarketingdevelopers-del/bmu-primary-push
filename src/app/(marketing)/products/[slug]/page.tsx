import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/marketing/page-hero";
import { CtaBand } from "@/components/marketing/cta-band";
import { Reveal } from "@/components/marketing/reveal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PRODUCT_DETAILS, getProduct, productHref } from "@/lib/products-data";
import { cn } from "@/lib/utils";
import styles from "./page.module.css";

export function generateStaticParams() {
  return PRODUCT_DETAILS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  return { title: product.name, description: product.summary };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const others = PRODUCT_DETAILS.filter((p) => p.slug !== product.slug).slice(0, 3);

  return (
    <>
      <PageHero
        eyebrow={product.tag}
        title={product.name}
        lede={product.tagline}
      >
        <Button asChild>
          <Link href="/contact">{product.cta} <ArrowRight /></Link>
        </Button>
      </PageHero>

      <section className="section">
        <div className="container">
          <Reveal>
            <p className={styles.intro}>
              {product.intro}
            </p>
          </Reveal>

          <div className={styles.featureGrid}>
            {product.features.map((f, i) => (
              <Reveal key={f.title} delay={(i % 3) * 0.06}>
                <Card className={styles.featureCard}>
                  <h3 className={styles.featureTitle}>{f.title}</h3>
                  <p className={styles.featureBody}>{f.body}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className={cn("section", styles.useCaseSection)}>
        <div className="container">
          <Reveal>
            <span className="eyebrow">Who uses it</span>
            <h2 className={cn("sec-title", styles.sectionTitle)}>Built for these situations</h2>
          </Reveal>
          <div className={styles.useCaseGrid}>
            {product.useCases.map((u, i) => (
              <Reveal key={u.who} delay={(i % 4) * 0.06}>
                <div className={styles.useCase}>
                  <p className={cn("display", styles.useCaseWho)}>{u.who}</p>
                  <p className={styles.useCaseWhat}>{u.what}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {product.plans && (
        <section className="section">
          <div className="container">
            <Reveal>
              <div className={styles.plansHeader}>
                <span className={cn("eyebrow", styles.plansEyebrow)}>Pricing</span>
                <h2 className="sec-title">Three plans, no setup fee</h2>
              </div>
            </Reveal>
            <div className={styles.planGrid}>
              {product.plans.map((p) => (
                <article
                  key={p.name}
                  className={cn(styles.plan, p.featured && styles.planFeatured)}
                >
                  <h3 className={cn("display", styles.planName)}>{p.name}</h3>
                  <p className={cn("display", styles.planPrice)}>
                    {p.price}{" "}
                    <small className={cn(styles.planUnit, p.featured && styles.planUnitFeatured)}>
                      {p.unit}
                    </small>
                  </p>
                  <ul className={cn(styles.planFeatures, p.featured && styles.planFeaturesFeatured)}>
                    {p.features.map((f) => (
                      <li key={f} className={styles.planFeature}>
                        <span className={styles.planBullet} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button asChild variant={p.featured ? "default" : "outline"} className={styles.planCta}>
                    <Link href="/contact">{p.price === "Custom" ? "Talk to sales" : "Start free trial"}</Link>
                  </Button>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className={cn("section", styles.faqSection)}>
        <div className={cn("container", styles.faqGrid)}>
          <Reveal>
            <span className="eyebrow">FAQ</span>
            <h2 className="sec-title">Common questions</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <Accordion type="single" collapsible className={styles.faqList}>
              {product.faqs.map((f) => (
                <AccordionItem key={f.q} value={f.q}>
                  <AccordionTrigger>{f.q}</AccordionTrigger>
                  <AccordionContent>{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal>
            <span className="eyebrow">Also from BMU</span>
            <h2 className={cn("sec-title", styles.sectionTitle)}>Other products</h2>
          </Reveal>
          <div className={styles.otherGrid}>
            {others.map((o, i) => {
              const href = productHref(o);
              const body = (
                <>
                  <h3 className={cn("display", styles.otherName)}>{o.name}</h3>
                  <p className={styles.otherSummary}>{o.summary}</p>
                  <p className={styles.otherMore}>
                    {href ? <>Learn more <span className={styles.arrow}>→</span></> : "Coming soon"}
                  </p>
                </>
              );
              return (
                <Reveal key={o.slug} delay={i * 0.07}>
                  {href ? (
                    <Link href={href} className={styles.otherCard}>{body}</Link>
                  ) : (
                    // Coming soon: shown as content only, no link
                    <div className={styles.otherCard}>{body}</div>
                  )}
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <CtaBand primary={{ href: "/contact", label: product.cta }} secondary={{ href: "/products", label: "All products" }} />
    </>
  );
}

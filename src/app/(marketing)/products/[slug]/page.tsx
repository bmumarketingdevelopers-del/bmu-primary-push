import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { Reveal } from "@/components/marketing/reveal";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PRODUCT_DETAILS, getProduct } from "@/lib/products-data";
import { cn } from "@/lib/utils";
import { PRODUCT_EXTRAS } from "./product-extras";
import { HowDiagram, QrDashboard } from "./product-visuals";
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

  const extra = PRODUCT_EXTRAS[product.slug] ?? {};
  const features = extra.features ?? product.features.map((f) => ({ ...f, Icon: Sparkles }));

  return (
    <>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={cn("container", styles.heroGrid, !extra.dashboard && styles.heroSolo)}>
          <div>
            <span className={styles.tag}>
              <span className={styles.tagDot} aria-hidden="true" />
              {product.tag}
            </span>
            <h1 className={cn("display", styles.heroTitle)}>{product.name}</h1>
            <p className={styles.heroTagline}>{product.tagline}.</p>
            <p className={styles.heroIntro}>{extra.heroIntro ?? product.intro}</p>
            <div className={styles.heroActions}>
              <Link href="/contact" className={styles.btnPrimary}>
                {product.cta} <ArrowRight aria-hidden="true" />
              </Link>
              {product.plans && (
                <Link href="#pricing" className={styles.btnGhostDark}>
                  See pricing
                </Link>
              )}
            </div>
            {extra.stats && (
              <dl className={styles.heroStats}>
                {extra.stats.map((s) => (
                  <div key={s.label}>
                    <dt>{s.label}</dt>
                    <dd>{s.value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>

          {extra.dashboard && (
            <Reveal delay={0.1}>
              <QrDashboard data={extra.dashboard} />
            </Reveal>
          )}
        </div>
      </section>

      {/* How it works */}
      {extra.how && (
        <section className="section">
          <div className={cn("container", styles.howGrid)}>
            <Reveal>
              <span className="eyebrow">How it works</span>
              <h2 className={cn("display", styles.howTitle)}>
                {extra.how.title[0]}
                <br />
                {extra.how.title[1]}
              </h2>
              <p className={styles.howBody}>{extra.how.body}</p>
              <ul className={styles.howPoints}>
                {extra.how.points.map((p) => (
                  <li key={p}>
                    <span className={styles.checkDot} aria-hidden="true">
                      <Check />
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.1}>
              <HowDiagram data={extra.how} />
            </Reveal>
          </div>
        </section>
      )}

      {/* Features */}
      <section className="section">
        <div className="container">
          <Reveal>
            <div className={styles.featuresHead}>
              <div>
                <span className="eyebrow">Features</span>
                <h2 className="sec-title">{extra.featuresTitle ?? `What ${product.name} does`}</h2>
              </div>
              {extra.featuresNote && <p className={styles.featuresNote}>{extra.featuresNote}</p>}
            </div>
          </Reveal>
          <div className={styles.featureGrid}>
            {features.map(({ title, body, Icon }, i) => (
              <Reveal key={title} delay={(i % 4) * 0.06}>
                <article className={styles.featureCard}>
                  <span className={styles.featureIcon} aria-hidden="true">
                    <Icon />
                  </span>
                  <h3 className={styles.featureTitle}>{title}</h3>
                  <p className={styles.featureBody}>{body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      {product.plans && (
        <section id="pricing" className={cn("section", styles.pricing)}>
          <div className="container">
            <Reveal>
              <div className={styles.pricingHead}>
                <span className="eyebrow">Pricing</span>
                <h2 className="sec-title">Three plans, no setup fee</h2>
                {extra.pricingNote && <p className={styles.pricingNote}>{extra.pricingNote}</p>}
              </div>
            </Reveal>
            <div className={styles.planGrid}>
              {product.plans.map((p, i) => (
                <Reveal key={p.name} delay={i * 0.07} className={styles.planReveal}>
                  <article className={cn(styles.plan, p.featured && styles.planFeatured)}>
                    {p.featured && <span className={styles.planBadge}>Most popular</span>}
                    <h3 className={cn("display", styles.planName)}>{p.name}</h3>
                    {extra.planNotes?.[p.name] && <p className={styles.planNote}>{extra.planNotes[p.name]}</p>}
                    <p className={styles.planPrice}>
                      <span className={cn("display", styles.planAmount)}>{p.price}</span>
                      <span className={styles.planUnit}>{p.unit}</span>
                    </p>
                    <ul className={styles.planFeatures}>
                      {p.features.map((f) => (
                        <li key={f}>
                          <span className={styles.checkDot} aria-hidden="true">
                            <Check />
                          </span>
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Link href="/contact" className={p.featured ? styles.btnPrimary : styles.btnOutline}>
                      {p.price === "Custom" ? "Talk to sales" : "Start free trial"}
                    </Link>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ: same dropdown as the landing page (shared Accordion, round chevron); first one starts open */}
      <section className="section">
        <div className={cn("container", styles.faqGrid)}>
          <Reveal>
            <span className="eyebrow">FAQ</span>
            <h2 className={cn("display", styles.faqTitle)}>
              Common
              <br />
              questions
            </h2>
            {extra.faqNote && <p className={styles.faqNote}>{extra.faqNote}</p>}
          </Reveal>
          <Reveal delay={0.1}>
            <Accordion
              type="single"
              collapsible
              defaultValue={product.faqs[0]?.q}
              className={styles.faqList}
            >
              {product.faqs.map((f) => (
                <AccordionItem key={f.q} value={f.q}>
                  <AccordionTrigger icon="chevron" className={styles.faqTrigger}>
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className={styles.faqAnswer}>{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </section>

      {/* Closing call to action */}
      <section className="section">
        <div className="container">
          <Reveal>
            <div className={styles.cta}>
              <svg className={styles.ctaRings} viewBox="0 0 400 400" aria-hidden="true">
                <g fill="none" stroke="rgb(255 255 255 / 0.08)" strokeWidth="1">
                  <circle cx="200" cy="200" r="80" />
                  <circle cx="200" cy="200" r="130" />
                  <circle cx="200" cy="200" r="180" />
                </g>
              </svg>
              <div className={styles.ctaText}>
                <p className={styles.ctaEyebrow}>{extra.cta?.eyebrow ?? "Ready when you are"}</p>
                <h2 className={styles.ctaTitle}>{extra.cta?.title ?? product.tagline}</h2>
                {/* one line on desktop ("a · b"); each part on its own line on phones */}
                <p className={styles.ctaBody}>
                  {(extra.cta?.body ?? [product.summary]).map((line, i) => (
                    <span key={line}>
                      {i > 0 && <span className={styles.ctaSep}> · </span>}
                      <span className={styles.ctaLine}>{line}</span>
                    </span>
                  ))}
                </p>
              </div>
              <div className={styles.ctaActions}>
                <Link href="/contact" className={styles.btnPrimary}>
                  {product.cta} <ArrowRight aria-hidden="true" />
                </Link>
                <Link href="/contact" className={styles.btnGhostDark}>
                  Book a free consultation
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

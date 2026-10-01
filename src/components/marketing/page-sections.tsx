import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Reveal } from "./reveal";
import { embedUrl, type PageSection } from "@/lib/page-builder";
import { cn } from "@/lib/utils";
import styles from "./page-sections.module.css";

/**
 * Renders a built page using the site's own components.
 *
 * Nothing here accepts raw HTML — every section is a fixed shape with typed
 * fields, so a page built in the admin panel inherits the same type scale,
 * spacing and colours as the hand-built ones.
 */
export function PageSections({ sections }: { sections: PageSection[] }) {
  return (
    <>
      {sections.map((section, i) => (
        <SectionRenderer key={section.id} section={section} index={i} />
      ))}
    </>
  );
}

function SectionRenderer({ section, index }: { section: PageSection; index: number }) {
  const d = section.data as Record<string, never>;
  const str = (k: string) => (typeof d[k] === "string" ? (d[k] as string) : "");
  const list = (k: string) => (Array.isArray(d[k]) ? (d[k] as unknown as string[]) : []);
  const rows = (k: string) =>
    (Array.isArray(d[k]) ? (d[k] as unknown as Record<string, string>[]) : []);

  switch (section.type) {
    case "hero":
      return (
        <section className={cn("section", styles.headingSection)}>
          <div className={cn("container", styles.heroInner)}>
            <Reveal>
              {str("eyebrow") && <span className="eyebrow">{str("eyebrow")}</span>}
              <h1 className="sec-title">{str("heading")}</h1>
              {str("lede") && (
                <p className={styles.heroLede}>
                  {str("lede")}
                </p>
              )}
              {str("ctaLabel") && str("ctaHref") && (
                <Button asChild className={styles.action}>
                  <Link href={str("ctaHref")}>{str("ctaLabel")}</Link>
                </Button>
              )}
            </Reveal>
          </div>
        </section>
      );

    case "heading":
      return (
        <section className={cn("section", styles.headingSection)}>
          <div className={cn("container", str("align") === "center" && styles.centered)}>
            <Reveal>
              {str("eyebrow") && <span className="eyebrow">{str("eyebrow")}</span>}
              <h2 className="sec-title">{str("heading")}</h2>
              {str("lede") && (
                <p className={cn(styles.headingLede, str("align") === "center" && styles.headingLedeCentered)}>
                  {str("lede")}
                </p>
              )}
            </Reveal>
          </div>
        </section>
      );

    case "subheading":
      return (
        <div className={cn("container", styles.subheading)}>
          <Reveal>
            <h3 className={cn("display", styles.subheadingTitle)}>{str("heading")}</h3>
          </Reveal>
        </div>
      );

    case "text":
      return (
        <div className={cn("container", styles.text, str("width") !== "full" && styles.textNarrow)}>
          <Reveal>
            <div className={styles.paragraphs}>
              {list("paragraphs").map((p, i) => (
                <p key={i} className={styles.paragraph}>{p}</p>
              ))}
            </div>
          </Reveal>
        </div>
      );

    case "image":
      return (
        <div className={cn("container", styles.media)}>
          <Reveal>
            <figure>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={str("url")}
                alt={str("alt")}
                className={styles.framedImage}
              />
              {str("caption") && (
                <figcaption className={styles.caption}>
                  {str("caption")}
                </figcaption>
              )}
            </figure>
          </Reveal>
        </div>
      );

    case "features":
      return (
        <section className="section">
          <div className="container">
            {str("heading") && (
              <Reveal><h2 className={cn("sec-title", styles.featuresTitle)}>{str("heading")}</h2></Reveal>
            )}
            <div className={styles.features}>
              {rows("items").map((item, i) => (
                <Reveal key={i} delay={i * 0.06}>
                  <article className={styles.feature}>
                    <h3 className={cn("display", styles.featureTitle)}>{item.title}</h3>
                    <p className={styles.featureBody}>{item.body}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      );

    case "columns":
      return (
        <section className="section">
          <div className={cn("container", styles.columns)}>
            <Reveal className={cn(str("imageSide") === "left" && styles.textOnRight)}>
              <h2 className="sec-title">{str("heading")}</h2>
              <p className={styles.columnBody}>{str("body")}</p>
            </Reveal>
            <Reveal delay={0.1} className={cn(str("imageSide") === "left" && styles.imageOnLeft)}>
              {str("imageUrl") ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={str("imageUrl")} alt="" className={styles.framedImage} />
              ) : (
                <div className={styles.imagePlaceholder} />
              )}
            </Reveal>
          </div>
        </section>
      );

    case "stats":
      return (
        <section className={cn("section", styles.stats)}>
          <div className="container">
            <dl className={styles.statGrid}>
              {rows("items").map((item, i) => (
                <Reveal key={i} delay={i * 0.06}>
                  <div>
                    <dt className={cn("display", styles.statValue)}>
                      {item.value}
                    </dt>
                    <dd className={styles.statLabel}>{item.label}</dd>
                  </div>
                </Reveal>
              ))}
            </dl>
          </div>
        </section>
      );

    case "quote":
      return (
        <section className="section">
          <div className={cn("container", styles.quoteContainer)}>
            <Reveal>
              <blockquote className={styles.blockquote}>
                <p className={styles.quoteText}>{str("quote")}</p>
                {str("author") && (
                  <footer className={styles.quoteAuthor}>
                    {str("author")}{str("role") && ` · ${str("role")}`}
                  </footer>
                )}
              </blockquote>
            </Reveal>
          </div>
        </section>
      );

    case "faq":
      return (
        <section className="section">
          <div className={cn("container", styles.faqContainer)}>
            {str("heading") && <Reveal><h2 className={cn("sec-title", styles.faqTitle)}>{str("heading")}</h2></Reveal>}
            <Reveal delay={0.06}>
              <Accordion type="single" collapsible className={styles.faqList}>
                {rows("items").map((item, i) => (
                  <AccordionItem key={i} value={`q-${i}`}>
                    <AccordionTrigger>{item.q}</AccordionTrigger>
                    <AccordionContent>{item.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Reveal>
          </div>
        </section>
      );

    case "cta":
      return (
        <section className="section">
          <div className="container">
            <Reveal>
              <div className={styles.cta}>
                <h2 className={cn("display", styles.ctaTitle)}>{str("heading")}</h2>
                {str("body") && (
                  <p className={styles.ctaBody}>{str("body")}</p>
                )}
                {str("ctaLabel") && str("ctaHref") && (
                  <Button asChild size="lg" className={styles.action}>
                    <Link href={str("ctaHref")}>{str("ctaLabel")}</Link>
                  </Button>
                )}
              </div>
            </Reveal>
          </div>
        </section>
      );

    case "divider":
      return (
        <div className={cn("container", styles.divider)}>
          <hr />
        </div>
      );

    case "embed": {
      const src = embedUrl(str("url"));
      if (!src) return null;
      return (
        <div className={cn("container", styles.media)}>
          <Reveal>
            <div className={styles.embedFrame}>
              <iframe
                src={src}
                title={str("caption") || `Embedded video ${index + 1}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
                allowFullScreen
                className={styles.embedPlayer}
              />
            </div>
            {str("caption") && (
              <p className={styles.caption}>{str("caption")}</p>
            )}
          </Reveal>
        </div>
      );
    }

    default:
      return null;
  }
}

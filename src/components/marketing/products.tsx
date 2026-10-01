import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "./section-heading";
import { Reveal } from "./reveal";
import { PRODUCT_DETAILS, productHref } from "@/lib/products-data";
import { cn } from "@/lib/utils";
import styles from "./products.module.css";

export function Products({ heading = true }: { heading?: boolean }) {
  return (
    <section id="products" className={cn("section", styles.products)}>
      <div className="container">
        {heading && (
          <Reveal>
            <SectionHeading
              invert
              eyebrow="Products"
              title={<>Software that keeps<br />earning after the campaign</>}
              lede="Five platforms built in-house. Use them with a retainer or on their own — you own the data either way."
              action={
                <Button asChild variant="ghostLight">
                  <Link href="/products">
                    All products <ArrowRight />
                  </Link>
                </Button>
              }
            />
          </Reveal>
        )}

        <div className={styles.grid}>
          {PRODUCT_DETAILS.map((p, i) => {
            const lead = i === 0;
            const href = productHref(p);
            return (
              <Reveal key={p.slug} delay={(i % 3) * 0.07} className={cn(lead && styles.leadCell)}>
                <article
                  className={cn(
                    styles.card,
                    lead && styles.lead
                  )}
                >
                  <Badge className={styles.tag}>{p.tag}</Badge>
                  <h3 className={cn("display", styles.name)}>{p.name}</h3>
                  <p className={styles.summary}>{lead ? p.intro : p.summary}</p>

                  <ul className={cn(styles.features, lead ? styles.featuresDouble : styles.featuresSingle)}>
                    {p.features.slice(0, lead ? 8 : 4).map((f) => (
                      <li key={f.title} className={styles.feature}>
                        <span className={styles.bullet} />
                        {f.title}
                      </li>
                    ))}
                  </ul>

                  <div className={styles.footer}>
                    {lead && p.plans && (
                      <div className={styles.plans}>
                        <b className={cn("display", styles.fromPrice)}>from {p.plans[0].price}/mo</b>
                        {p.plans.length} plans available
                      </div>
                    )}
                    {href ? (
                      <Button asChild variant={lead ? "default" : "ghostLight"} size="sm">
                        <Link href={href}>
                          Learn more {lead && <ArrowRight />}
                        </Link>
                      </Button>
                    ) : (
                      <span className={styles.soon}>Coming soon</span>
                    )}
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

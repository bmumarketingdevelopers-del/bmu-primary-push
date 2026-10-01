import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/marketing/page-hero";
import { CtaBand } from "@/components/marketing/cta-band";
import { Reveal } from "@/components/marketing/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PRODUCT_DETAILS } from "@/lib/products-data";
import { cn } from "@/lib/utils";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Products",
  description: "BMU QR, Smart Review, BMU Creators, AI Studio and the Real Estate Suite — software built in-house.",
};

export default function ProductsPage() {
  return (
    <>
      <PageHero
        eyebrow="Products"
        title="Software that keeps earning after the campaign"
        lede="Five platforms built in-house. Use them alongside a retainer or on their own — either way the data stays yours, and it exports."
        breadcrumbs={[{ href: "/products", label: "Products" }]}
      >
        <Button asChild>
          <Link href="/contact">Request a demo <ArrowRight /></Link>
        </Button>
      </PageHero>

      <section className="section">
        <div className={cn("container", styles.list)}>
          {PRODUCT_DETAILS.map((p, i) => {
            const live = p.status === "live";
            const body = (
              <>
                <div>
                  <div className={styles.tags}>
                    <Badge className={styles.tag}>{p.tag}</Badge>
                    {live ? (
                      <Badge variant="success" className={styles.tag}>Live</Badge>
                    ) : (
                      <Badge variant="secondary" className={styles.tag}>Coming soon</Badge>
                    )}
                  </div>
                  <h2 className={cn("display", styles.name)}>{p.name}</h2>
                  <p className={styles.tagline}>{p.tagline}</p>
                  {live && (
                    <p className={styles.cta}>
                      {p.cta} <span className={styles.arrow}>→</span>
                    </p>
                  )}
                </div>
                <div>
                  <p className={styles.intro}>{p.intro}</p>
                  <ul className={styles.features}>
                    {p.features.slice(0, 6).map((f) => (
                      <li key={f.title} className={styles.feature}>
                        <span className={styles.featureBullet} />
                        {f.title}
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            );

            return (
              <Reveal key={p.slug} delay={(i % 2) * 0.05}>
                {live ? (
                  <Link href={`/products/${p.slug}`} className={styles.productCard}>
                    {body}
                  </Link>
                ) : (
                  // Coming soon: no link to /products/[slug] yet. Setting the
                  // product's status to "live" in products-data.ts restores it.
                  <div className={styles.productCard}>{body}</div>
                )}
              </Reveal>
            );
          })}
        </div>
      </section>

      <CtaBand
        title="Want a walkthrough?"
        body="Twenty minutes on a call, screen shared, using your business as the example. We'll tell you if it isn't a fit."
        primary={{ href: "/contact", label: "Request a demo" }}
        secondary={{ href: "/pricing", label: "See pricing" }}
      />
    </>
  );
}

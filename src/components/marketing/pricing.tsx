"use client";

import Link from "next/link";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Reveal } from "./reveal";
import { SwipeCarousel } from "./swipe-carousel";
import { PLANS, type Plan } from "@/lib/content";
import { cn } from "@/lib/utils";
import styles from "./pricing.module.css";

export function Pricing({ heading = true }: { heading?: boolean }) {
  return (
    <section id="pricing" className={cn("section", styles.section)}>
      <div className="container">
        <Tabs defaultValue="retainer">
          <Reveal>
            <div className={cn(styles.header, heading ? styles.headerSplit : styles.headerCentered)}>
              {heading && (
                <div>
                  <span className="eyebrow">Pricing</span>
                  <h2 className="sec-title">Clear monthly pricing</h2>
                  <p className={styles.lede}>
                    No setup fees, no lock-in past the first 90 days. Switch between plans as the pipeline grows.
                  </p>
                </div>
              )}
              <TabsList>
                <TabsTrigger value="retainer">Marketing retainers</TabsTrigger>
                <TabsTrigger value="qr">Premium</TabsTrigger>
              </TabsList>
            </div>
          </Reveal>

          <TabsContent value="retainer"><PlanGrid plans={PLANS.retainer} /></TabsContent>
          <TabsContent value="qr"><PlanGrid plans={PLANS.qr} /></TabsContent>
        </Tabs>

        <p className={styles.note}>
          All prices exclude GST. Ad spend is billed separately and paid directly to the platform.
        </p>
      </div>
    </section>
  );
}

function PlanGrid({ plans }: { plans: Plan[] }) {
  return (
    <SwipeCarousel label="Plans">
      {plans.map((p) => (
        <article
          key={p.name}
          className={cn(
            styles.plan,
            p.featured && styles.featured
          )}
        >
          <h3 className={cn("display", styles.planName)}>{p.name}</h3>
          <p className={cn(styles.description, p.featured && styles.descriptionFeatured)}>
            {p.description}
          </p>
          <p className={cn("display", styles.price)}>
            {p.price}{" "}
            <small className={cn(styles.unit, p.featured && styles.unitFeatured)}>
              {p.unit}
            </small>
          </p>
          <ul className={cn(styles.features, p.featured && styles.featuresFeatured)}>
            {p.features.map((f) => (
              <li key={f} className={styles.feature}>
                <span className={styles.bullet} />
                {f}
              </li>
            ))}
          </ul>
          <Button asChild variant={p.featured ? "default" : "outline"} className={styles.planCta}>
            <Link href="/contact">{p.cta}</Link>
          </Button>
        </article>
      ))}
    </SwipeCarousel>
  );
}

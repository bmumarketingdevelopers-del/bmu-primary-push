"use client";

import Link from "next/link";
import { Check } from "lucide-react";
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
                </div>
              )}
              <TabsList className={styles.tabs}>
                <TabsTrigger value="retainer" className={styles.tab}>Marketing retainers</TabsTrigger>
                {/* Premium is hidden for now. Uncomment this and its TabsContent below to bring it back. */}
                {/* <TabsTrigger value="qr" className={styles.tab}>Premium</TabsTrigger> */}
              </TabsList>
            </div>
          </Reveal>

          <TabsContent value="retainer"><PlanGrid plans={PLANS.retainer} /></TabsContent>
          {/* <TabsContent value="qr"><PlanGrid plans={PLANS.qr} /></TabsContent> */}
        </Tabs>

        {/* Landing page leaves the note out (per its design); the /pricing page keeps it */}
        {!heading && (
          <p className={styles.note}>
            All prices exclude GST. Ad spend is billed separately and paid directly to the platform.
          </p>
        )}
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
          <div className={styles.planHead}>
            <h3 className={cn("display", styles.planName)}>{p.name}</h3>
            {p.featured && <span className={styles.popular}>Most popular</span>}
          </div>
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
                <Check className={styles.check} strokeWidth={2.5} aria-hidden="true" />
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

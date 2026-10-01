import type { Metadata } from "next";
import styles from "./page.module.css";
import { PageHero } from "@/components/marketing/page-hero";
import { Pricing } from "@/components/marketing/pricing";
import { CtaBand } from "@/components/marketing/cta-band";
import { Reveal } from "@/components/marketing/reveal";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Check, Minus } from "lucide-react";
import { FAQS } from "@/lib/content";
import { cn } from "@/lib/utils";

const COMPARISON = [
  { feature: "Ad platforms managed", launch: "2", growth: "4 + retargeting", scale: "Unlimited" },
  { feature: "Creatives per month", launch: "12", growth: "30 incl. UGC", scale: "Custom" },
  { feature: "SEO retainer", launch: false, growth: true, scale: true },
  { feature: "Landing pages and funnels", launch: false, growth: true, scale: true },
  { feature: "Automation and CRM setup", launch: false, growth: true, scale: true },
  { feature: "Drone and video production", launch: false, growth: false, scale: true },
  { feature: "AI Studio access", launch: false, growth: false, scale: true },
  { feature: "Client dashboard", launch: true, growth: true, scale: true },
  { feature: "Strategy calls", launch: "Monthly", growth: "Fortnightly", scale: "Weekly" },
  { feature: "Dedicated account team", launch: false, growth: false, scale: true },
];

export const metadata: Metadata = {
  title: "Pricing",
  description: "Marketing retainers from ₹35,000/month and BMU QR software from ₹499/month. No setup fees, no lock-in past 90 days.",
};

function Cell({ value }: { value: string | boolean }) {
  if (value === true) return <Check className={cn(styles.cellIcon, styles.cellIncluded)} />;
  if (value === false) return <Minus className={cn(styles.cellIcon, styles.cellExcluded)} />;
  return <span className={styles.cellText}>{value}</span>;
}

export default function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title="Flat monthly fees, no percentage of your ad spend"
        lede="We charge for the work, not a cut of the budget - so nobody has an incentive to talk you into spending more than the pipeline needs."
      />

      <Pricing heading={false} />

      <section className={cn("section", styles.comparison)}>
        <div className="container">
          <Reveal>
            <span className="eyebrow">Side by side</span>
            <h2 className={cn("sec-title", styles.comparisonTitle)}>What&apos;s in each retainer</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <Card className={styles.tableWrap}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className={styles.featureHead}>Feature</TableHead>
                    <TableHead className={styles.centerHead}>Launch</TableHead>
                    <TableHead className={styles.centerHead}>Growth</TableHead>
                    <TableHead className={styles.centerHead}>Scale</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {COMPARISON.map((row) => (
                    <TableRow key={row.feature}>
                      <TableCell className={styles.featureCell}>{row.feature}</TableCell>
                      <TableCell><Cell value={row.launch} /></TableCell>
                      <TableCell><Cell value={row.growth} /></TableCell>
                      <TableCell><Cell value={row.scale} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className={cn("container", styles.faqGrid)}>
          <Reveal>
            <span className="eyebrow">FAQ</span>
            <h2 className="sec-title">Before you commit</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <Accordion type="single" collapsible className={styles.faqList}>
              {FAQS.map((f) => (
                <AccordionItem key={f.q} value={f.q}>
                  <AccordionTrigger>{f.q}</AccordionTrigger>
                  <AccordionContent>{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </section>

      <CtaBand title="Still not sure which plan fits?" body="Tell us your monthly budget and what you're trying to hit. We'll tell you which plan makes sense - including if the answer is the cheapest one." />
    </>
  );
}

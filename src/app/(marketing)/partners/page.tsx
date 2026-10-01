import type { Metadata } from "next";
import { Building2, Globe, Percent, Rocket } from "lucide-react";
import { PageHero } from "@/components/marketing/page-hero";
import { CtaBand } from "@/components/marketing/cta-band";
import { Reveal } from "@/components/marketing/reveal";
import { SectionHeading } from "@/components/marketing/section-heading";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema } from "@/lib/structured-data";
import { cn } from "@/lib/utils";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Partners & white label",
  description:
    "Sell BMU QR under your own brand. For marketing agencies, print resellers and franchise groups across India.",
};

const TRACKS = [
  {
    icon: Building2,
    tag: "Agency",
    title: "Sell it as your own product",
    body: "Your domain, your logo, your colour. Clients sign in at your address and never see our name. You set retail pricing and keep the margin.",
    terms: ["20% recurring commission", "White-label domain included", "Your branding throughout", "We handle hosting and support"],
  },
  {
    icon: Percent,
    tag: "Reseller",
    title: "Sell hardware, earn on software",
    body: "Print shops and IT dealers buy standees and cards at wholesale, then earn on every subscription that follows. No support burden — we take those calls.",
    terms: ["30% off hardware", "25% recurring commission", "Co-branded, not white label", "Stock on 30-day credit"],
  },
  {
    icon: Rocket,
    tag: "Franchise",
    title: "One platform, every outlet",
    body: "Roll out to every franchisee with one dashboard across all locations. Head office sees comparative numbers; each outlet manages its own floor.",
    terms: ["15% group rate", "Multi-location dashboard", "Central brand control", "Per-outlet analytics"],
  },
];

const FAQS = [
  {
    q: "Who owns the client relationship?",
    a: "You do. You invoice them, you set the price, you're the name on the account. We never contact your clients directly unless you ask us to join a call.",
  },
  {
    q: "How is commission calculated?",
    a: "On collected revenue, not invoiced revenue — so a client who doesn't pay doesn't cost you a clawback later. Paid monthly, in the first week for the previous month.",
  },
  {
    q: "What happens if we stop partnering?",
    a: "Your clients keep working. You can transfer accounts to us or to another partner, and there's no lock-in that holds a business hostage to your contract.",
  },
  {
    q: "Do we need technical people?",
    a: "No. White-label setup is one DNS record that we walk you through. Everything after that is configuration in a dashboard.",
  },
  {
    q: "Is there a minimum?",
    a: "Three active clients within the first ninety days for agency terms. Resellers have a minimum first hardware order instead.",
  },
];

export default function PartnersPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ href: "/partners", label: "Partners" }])} />

      <PageHero
        eyebrow="Partners"
        title="Sell it under your own name"
        lede="Agencies, print resellers and franchise groups already run BMU QR as their own product. You keep the client, the branding and the margin — we keep the platform running."
        breadcrumbs={[{ href: "/partners", label: "Partners" }]}
      />

      <section className="section">
        <div className="container">
          <Reveal>
            <SectionHeading
              eyebrow="Three ways in"
              title={<>Pick the one that<br />matches your business</>}
              lede="Different economics, same platform. Most agencies start co-branded and move to white label once they're past ten clients."
            />
          </Reveal>

          <div className={styles.trackGrid}>
            {TRACKS.map((t, i) => {
              const Icon = t.icon;
              return (
                <Reveal key={t.tag} delay={i * 0.07}>
                  <article className={styles.trackCard}>
                    <div className={styles.trackHeader}>
                      <span className={styles.trackIconWrap}>
                        <Icon className={styles.trackIcon} strokeWidth={1.8} />
                      </span>
                      <Badge variant="outline">{t.tag}</Badge>
                    </div>

                    <h3 className={cn("display", styles.trackTitle)}>{t.title}</h3>
                    <p className={styles.trackBody}>{t.body}</p>

                    <ul className={styles.terms}>
                      {t.terms.map((term) => (
                        <li key={term} className={styles.term}>
                          <span className={styles.termBullet} />
                          {term}
                        </li>
                      ))}
                    </ul>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className={cn("section", styles.whiteLabelSection)}>
        <div className={cn("container", styles.whiteLabelGrid)}>
          <Reveal>
            <span className="eyebrow">White label</span>
            <h2 className="sec-title">
              One DNS record
              <br />
              and it&apos;s yours
            </h2>
            <p className={styles.whiteLabelLede}>
              Point a subdomain at us and your clients sign in at your address, see your logo and your
              brand colour, and never encounter our name anywhere in the product.
            </p>
            <p className={styles.whiteLabelNote}>
              Setup takes about twenty minutes, most of which is waiting for DNS.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className={styles.preview}>
              <p className={styles.previewLabel}>
                <Globe className={styles.previewIcon} /> What your client sees
              </p>
              <pre className={styles.previewCode}>
{`qr.youragency.com/login
qr.youragency.com/business
qr.youragency.com/b/their-shop

Your logo. Your colour.
No mention of us anywhere.`}
              </pre>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className={cn("container", styles.faqGrid)}>
          <Reveal>
            <span className="eyebrow">Questions</span>
            <h2 className="sec-title">
              The things
              <br />
              partners ask
            </h2>
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

      <CtaBand
        title="Talk to us about partnering"
        body="Tell us how many clients you work with and what you sell them today. We'll say plainly whether this is worth your time."
        secondary={{ href: "/store", label: "See the hardware" }}
      />
    </>
  );
}

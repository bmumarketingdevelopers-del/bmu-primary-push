import Link from "next/link";
import { Building2, ImagePlus, QrCode, Star, UsersRound, type LucideIcon } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { Reveal } from "./reveal";
import { PRODUCT_DETAILS, productHref } from "@/lib/products-data";
import { cn } from "@/lib/utils";
import styles from "./products.module.css";

/** Copy for the landing-page cards; links and "Coming soon" come from each product's status. */
const CARDS: Record<string, { icon: LucideIcon; name?: string; body: string; highlights: string[] }> = {
  "bmu-qr": {
    icon: QrCode,
    body: "Turn customer interactions into reviews and repeat engagement.",
    highlights: ["QR-powered feedback", "Review generation", "Customer insights"],
  },
  "smart-review": {
    icon: Star,
    body: "Catch unhappy customers early and turn positive experiences into public reviews.",
    highlights: ["Instant feedback", "Issue alerts", "Reputation growth"],
  },
  "bmu-creators": {
    icon: UsersRound,
    name: "BMU Creators",
    body: "Find, brief and track creators in one place.",
    highlights: ["Creator discovery", "Campaigns", "UGC management"],
  },
  "ai-studio": {
    icon: ImagePlus,
    body: "Product imagery without booking a studio.",
    highlights: ["AI visuals", "Rapid production", "Creative variations"],
  },
  "real-estate-suite": {
    icon: Building2,
    body: "The whole launch stack, one team.",
    highlights: ["Property", "Leads", "Performance"],
  },
};

export function Products({ heading = true }: { heading?: boolean }) {
  return (
    <section id="products" className={cn("section", styles.products)}>
      <div className="container">
        {heading && (
          <Reveal>
            <SectionHeading
              invert
              className={styles.heading}
              eyebrow="Products"
              title={<>Tools built to keep growth moving,<br className={styles.titleBreak} /> even after the campaign ends.</>}
              lede="In-house products designed to take your marketing beyond the campaign - helping you capture attention, build lasting trust, strengthen customer relationships and turn everyday interactions into meaningful, measurable growth."
            />
          </Reveal>
        )}

        <div className={styles.grid}>
          {PRODUCT_DETAILS.map((p, i) => {
            const card = CARDS[p.slug];
            if (!card) return null;
            const Icon = card.icon;
            const href = productHref(p);

            const body = (
              <>
                <span className={styles.iconWrap}>
                  <Icon className={styles.icon} strokeWidth={1.8} aria-hidden="true" />
                </span>
                <h3 className={cn("display", styles.name)}>{card.name ?? p.name}</h3>
                <p className={styles.body}>{card.body}</p>
                <p className={styles.highlights}>{card.highlights.join(" · ")}</p>
                <p className={styles.cta}>
                  {href ? (
                    <>
                      Explore product <span className={styles.arrow}>→</span>
                    </>
                  ) : (
                    "Coming soon"
                  )}
                </p>
              </>
            );

            return (
              <Reveal key={p.slug} delay={(i % 3) * 0.07} className={styles.cell}>
                {href ? (
                  <Link href={href} className={cn(styles.card, styles.cardLink)}>
                    {body}
                  </Link>
                ) : (
                  // Coming soon: content only, not a link
                  <div className={styles.card}>{body}</div>
                )}
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "./reveal";
import { IndustriesMarquee } from "./industries-marquee";
import { INDUSTRY_DETAILS, ALL_INDUSTRIES } from "@/lib/industries-data";
import { cn } from "@/lib/utils";
import styles from "./industries.module.css";

// name → slug for the industries that have their own page
const LINKS: Record<string, string> = Object.fromEntries(INDUSTRY_DETAILS.map((i) => [i.name, i.slug]));

const half = Math.ceil(ALL_INDUSTRIES.length / 2);
const ROWS = [
  { names: ALL_INDUSTRIES.slice(0, half), direction: "left" },
  { names: ALL_INDUSTRIES.slice(half), direction: "right" },
] as const;

export function Industries() {
  return (
    <section id="industries" className={cn("section", styles.section)}>
      <div className="container">
        <Reveal>
          <span className="eyebrow">Industries</span>
          <div className={styles.titleRow}>
            <h2 className="sec-title">We already know your funnel</h2>
            <Button asChild variant="outline" className={styles.browse}>
              <Link href="/industries">
                Browse industries <ArrowRight />
              </Link>
            </Button>
          </div>
          <p className={styles.lede}>
            Experience across 27 sectors gives us a head start from creative direction and campaign architecture to
            lead-response strategy.{" "}
            <br className={styles.break} />
            We spend less time learning your category and more time finding your next growth opportunity.
          </p>
        </Reveal>
      </div>

      <Reveal delay={0.1} className={styles.rows}>
        {ROWS.map((r) => (
          <IndustriesMarquee key={r.direction} names={r.names} direction={r.direction} links={LINKS} />
        ))}
      </Reveal>
    </section>
  );
}
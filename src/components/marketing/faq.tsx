import Link from "next/link";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Reveal } from "./reveal";
import { FAQS } from "@/lib/content";
import { cn } from "@/lib/utils";
import styles from "./faq.module.css";

type Item = { q: string; a: string };

export function Faq({ items }: { items?: Item[] }) {
  const faqs = items?.length ? items : FAQS;

  return (
    <section className={cn("section", styles.section)}>
      <div className={cn("container", styles.grid)}>
        <Reveal className={styles.intro}>
          <span className="eyebrow">FAQ&apos;s</span>
          <h2 className="sec-title">
            Clear answers for
            <br />
            complex operations
          </h2>
          <p className={styles.lede}>
            Clear answers on timelines, engagement models, reporting and measurable business outcomes.
          </p>
        </Reveal>

        <Reveal delay={0.1} className={styles.listWrap}>
          <Accordion type="single" collapsible className={styles.list}>
            {faqs.map((f) => (
              <AccordionItem key={f.q} value={f.q}>
                <AccordionTrigger icon="chevron" className={styles.trigger}>
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className={styles.answer}>{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>

        <Reveal delay={0.15} className={styles.helpWrap}>
          <div className={styles.help}>
            <div>
              <p className={cn("display", styles.helpTitle)}>Still have questions?</p>
              <p className={styles.helpText}>We&apos;re here to help you!</p>
            </div>
            <Button asChild variant="secondary" size="sm" className={styles.helpButton}>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
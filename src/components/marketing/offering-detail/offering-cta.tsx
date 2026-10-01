import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "../reveal";
import type { OfferingPage } from "@/lib/service-pages-data";
import styles from "./offering-cta.module.css";

export function OfferingCta({ offering }: Pick<OfferingPage, "offering">) {
  return (
    <section className={styles.section}>
      <div className="container">
        <Reveal>
          <div className={styles.band}>
            <span className={styles.rings} aria-hidden="true" />
            <div>
              <span className={styles.eyebrow}>Ready when you are</span>
              <h2 className={styles.title}>Start with {offering.title}</h2>
              <p className={styles.body}>
                From {offering.priceFrom} · Written plan in 3 working days · No pressure
              </p>
            </div>
            <div className={styles.actions}>
              <Button asChild className={styles.primary}>
                <Link href="/contact">Enquire now <ArrowRight /></Link>
              </Button>
              <Button asChild variant="ghostLight">
                <Link href="/contact">Book a free consultation</Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

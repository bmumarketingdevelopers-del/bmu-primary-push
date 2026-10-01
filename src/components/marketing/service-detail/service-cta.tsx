import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "../reveal";
import { cn } from "@/lib/utils";
import styles from "./service-cta.module.css";

export function ServiceCta({
  title = "Tell us what you're trying to grow",
  body = "A 30-minute call, a look at your current numbers, and a written plan within three working days. No deck, no pressure.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <section className={styles.section}>
      <div className="container">
        <Reveal>
          <div className={styles.band}>
            <span className={styles.rings} aria-hidden="true" />
            <div className={styles.copy}>
              <h2 className={cn("display", styles.title)}>{title}</h2>
              <p className={styles.body}>{body}</p>
            </div>
            <div className={styles.actions}>
              <Button asChild>
                <Link href="/contact">Book a free consultation <ArrowRight /></Link>
              </Button>
              <Button asChild variant="ghostLight">
                <Link href="/services">All services</Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

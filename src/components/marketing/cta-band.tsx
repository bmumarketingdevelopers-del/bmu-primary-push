import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "./reveal";
import { cn } from "@/lib/utils";
import styles from "./cta-band.module.css";

export function CtaBand({
  title = "Tell us what you're trying to grow",
  body = "A 30-minute call, a look at your current numbers, and a written plan within three working days. No deck, no pressure.",
  primary = { href: "/contact", label: "Book a free consultation" },
  secondary,
}: {
  title?: string;
  body?: string;
  primary?: { href: string; label: string };
  secondary?: { href: string; label: string };
}) {
  return (
    <section className="section">
      <div className="container">
        <Reveal>
          <div className={styles.band}>
            <div
              aria-hidden
              className={styles.glow}
            />
            <div className={styles.content}>
              <h2 className={cn("display", styles.title)}>{title}</h2>
              <p className={styles.body}>{body}</p>
              <div className={styles.actions}>
                <Button asChild>
                  <Link href={primary.href}>
                    {primary.label} <ArrowRight />
                  </Link>
                </Button>
                {secondary && (
                  <Button asChild variant="ghostLight">
                    <Link href={secondary.href}>{secondary.label}</Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

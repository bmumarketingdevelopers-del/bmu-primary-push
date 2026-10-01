import { TRUSTED_BY } from "@/lib/content";
import { cn } from "@/lib/utils";
import styles from "./trusted-marquee.module.css";

export function TrustedMarquee({ heading, names }: { heading?: string; names?: string[] }) {
  const list = names?.length ? names : TRUSTED_BY;
  const row = [...list, ...list];
  return (
    <section className={styles.marquee}>
      <p className={styles.heading}>
        {heading ?? "Trusted by teams across real estate, hospitality, healthcare and retail"}
      </p>
      <div className={styles.track}>
        {row.map((name, i) => (
          <span
            key={`${name}-${i}`}
            className={cn("display", styles.name)}
          >
            {name}
          </span>
        ))}
      </div>
    </section>
  );
}

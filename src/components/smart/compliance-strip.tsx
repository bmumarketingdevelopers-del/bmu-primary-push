import { BadgeCheck, ExternalLink } from "lucide-react";
import { complianceFor, type LicenceKey } from "@/lib/compliance";
import { cn } from "@/lib/utils";
import styles from "./compliance-strip.module.css";

/**
 * Statutory numbers on the public profile.
 *
 * Deliberately understated — this is a legal display, not a trust badge.
 * Dressing it up as a certification would be its own problem.
 */
export function ComplianceStrip({
  category,
  values,
}: {
  category: string;
  values: Partial<Record<LicenceKey, string | null>>;
}) {
  const shown = complianceFor(category, values).filter((s) => s.present);
  if (shown.length === 0) return null;

  return (
    <section className={styles.strip}>
      <h2 className={styles.title}>
        Licences
      </h2>

      <ul className={styles.list}>
        {shown.map((s, i) => (
          <li
            key={s.key}
            className={cn(styles.item, i !== 0 && styles.itemDivided)}
          >
            <span className={styles.label}>
              <BadgeCheck className={styles.labelIcon} />
              {s.def.short}
            </span>

            <span className={styles.value}>
              {s.value}
              {s.def.verifyUrl && (
                <a
                  href={s.def.verifyUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Verify this ${s.def.short} number on the official register`}
                  className={styles.verify}
                >
                  <ExternalLink className={styles.verifyIcon} />
                </a>
              )}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

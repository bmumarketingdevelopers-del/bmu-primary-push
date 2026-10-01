import { cn } from "@/lib/utils";
import styles from "./section-heading.module.css";

/**
 * Eyebrow, then the title with the optional action button in the right-hand corner (level with
 * the title), then the lede underneath.
 */
export function SectionHeading({
  eyebrow,
  title,
  lede,
  action,
  invert,
  className,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lede?: string;
  action?: React.ReactNode;
  invert?: boolean;
  className?: string;
}) {
  return (
    <div className={cn(styles.heading, className)}>
      <span className="eyebrow">{eyebrow}</span>
      <div className={styles.titleRow}>
        <h2 className={cn("sec-title", invert && styles.titleInverted)}>{title}</h2>
        {action && <div className={styles.action}>{action}</div>}
      </div>
      {lede && (
        <p className={cn(styles.lede, invert && styles.ledeInverted)}>
          {lede}
        </p>
      )}
    </div>
  );
}

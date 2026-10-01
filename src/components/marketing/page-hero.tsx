import { cn } from "@/lib/utils";
import styles from "./page-hero.module.css";

export function PageHero({
  eyebrow,
  title,
  lede,
  children,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className={styles.hero}>
      <div className={cn("container", styles.inner)}>
        <span className="eyebrow">{eyebrow}</span>
        <h1 className={cn("display", styles.title)}>{title}</h1>
        {lede && <p className={styles.lede}>{lede}</p>}
        {children && <div className={styles.actions}>{children}</div>}
      </div>
    </section>
  );
}

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import styles from "./page-hero.module.css";

export function PageHero({
  eyebrow,
  title,
  lede,
  breadcrumbs,
  children,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
  breadcrumbs?: { href: string; label: string }[];
  children?: React.ReactNode;
}) {
  return (
    <section className={styles.hero}>
      <div className={cn("container", styles.inner)}>
        {breadcrumbs && (
          <nav aria-label="Breadcrumb" className={styles.breadcrumbs}>
            <Link href="/" className={styles.crumbLink}>Home</Link>
            {breadcrumbs.map((b, i) => (
              <span key={b.href} className={styles.crumb}>
                <ChevronRight className={styles.crumbIcon} />
                {i === breadcrumbs.length - 1 ? (
                  <span className={styles.crumbCurrent}>{b.label}</span>
                ) : (
                  <Link href={b.href} className={styles.crumbLink}>{b.label}</Link>
                )}
              </span>
            ))}
          </nav>
        )}

        <span className="eyebrow">{eyebrow}</span>
        <h1 className={cn("display", styles.title)}>{title}</h1>
        {lede && <p className={styles.lede}>{lede}</p>}
        {children && <div className={styles.actions}>{children}</div>}
      </div>
    </section>
  );
}

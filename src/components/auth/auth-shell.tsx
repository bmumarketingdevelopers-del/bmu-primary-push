import Image from "next/image";
import { Logo } from "@/components/marketing/logo";
import { cn } from "@/lib/utils";
import styles from "./auth-shell.module.css";

/**
 * Shared frame for the sign-in and sign-up pages.
 * Desktop: one card, illustration panel on the left and the form on the right.
 * Tablets: the same card stacked (illustration on top). Phones: full-bleed, no card.
 */
export function AuthShell({
  title,
  lede,
  children,
}: {
  title: string;
  lede: string;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <aside className={styles.brand}>
          <Logo tone="onLight" className={styles.logo} />
          <Image
            src="/images/auth/signup-growth.png"
            alt="Growth chart: bars rising to a flag, with +312% and a 4.8 star rating"
            width={531}
            height={478}
            priority
            sizes="(min-width: 1024px) 420px, (min-width: 640px) 380px, 340px"
            className={styles.illustration}
          />
          <div className={styles.caption}>
            <p className={styles.captionTitle}>Every step of your growth, in one place.</p>
            <p className={styles.captionText}>Reports, updates and support from your team.</p>
          </div>
        </aside>

        <main className={styles.formSide}>
          <div className={styles.formInner}>
            <h1 className={cn("display", styles.title)}>{title}</h1>
            <p className={styles.lede}>{lede}</p>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

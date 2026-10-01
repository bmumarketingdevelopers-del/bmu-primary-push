import Link from "next/link";
import { cn } from "@/lib/utils";
import styles from "./logo.module.css";

export function Logo({ className, href = "/" }: { className?: string; href?: string }) {
  return (
    <Link href={href} className={cn("display", styles.logo, className)}>
      <span className={styles.mark}>
        <span className={styles.markCore} />
      </span>
      BMU<span className={styles.dot}>.</span>Marketing
    </Link>
  );
}

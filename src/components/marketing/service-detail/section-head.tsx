import { Reveal } from "../reveal";
import { cn } from "@/lib/utils";
import styles from "./section-head.module.css";

/** Eyebrow + title on the left, a short note on the right (the note is hidden on phones). */
export function SectionHead({
  eyebrow,
  title,
  aside,
  className,
}: {
  eyebrow: string;
  title: string;
  aside?: string;
  className?: string;
}) {
  return (
    <Reveal className={cn(styles.head, className)}>
      <div>
        <span className={cn("eyebrow", styles.eyebrow)}>{eyebrow}</span>
        <h2 className={cn("display", styles.title)}>{title}</h2>
      </div>
      {aside && <p className={styles.aside}>{aside}</p>}
    </Reveal>
  );
}

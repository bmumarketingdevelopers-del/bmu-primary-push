import { Reveal } from "../reveal";
import { SectionHead } from "./section-head";
import { SERVICE_REASONS } from "@/lib/service-pages-data";
import { cn } from "@/lib/utils";
import styles from "./service-reasons.module.css";

export function ServiceReasons({ note }: { note?: string }) {
  return (
    <section className={styles.section}>
      <div className="container">
        <SectionHead
          eyebrow="Why BMU"
          title="Built to show results"
          aside={note}
        />
        <Reveal delay={0.06}>
          <ol className={styles.card}>
            {SERVICE_REASONS.map((r, i) => (
              <li key={r.title} className={styles.item}>
                <span className={cn("display", styles.number)}>{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className={styles.title}>{r.title}</h3>
                  <p className={styles.body}>{r.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}

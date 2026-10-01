import { Check } from "lucide-react";
import { Reveal } from "../reveal";
import { SERVICE_PROCESS } from "@/lib/service-pages-data";
import { cn } from "@/lib/utils";
import styles from "./service-process.module.css";

export function ServiceProcess({ checks }: { checks: string[] }) {
  return (
    <section className={styles.section}>
      <div className={cn("container", styles.grid)}>
        <Reveal>
          <span className={cn("eyebrow", styles.eyebrow)}>How it runs</span>
          <h2 className={cn("display", styles.title)}>The process</h2>
          <p className={styles.lede}>Four stages, in this order. Nothing launches before the plan is agreed.</p>
          <ul className={styles.checks}>
            {checks.map((c) => (
              <li key={c} className={styles.check}>
                <Check className={styles.checkIcon} aria-hidden="true" />
                {c}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.1}>
          <ol className={styles.steps}>
            {SERVICE_PROCESS.map((p, i) => (
              <li key={p.title} className={styles.step}>
                <span className={cn(styles.stepNumber, i === 0 && styles.stepNumberActive)}>{i + 1}</span>
                <div>
                  <h3 className={cn("display", styles.stepTitle)}>{p.title}</h3>
                  <p className={styles.stepBody}>{p.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}

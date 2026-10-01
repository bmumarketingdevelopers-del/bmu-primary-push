import { ArrowRight } from "lucide-react";
import { Reveal } from "../reveal";
import { OFFERING_STEPS } from "@/lib/service-pages-data";
import { cn } from "@/lib/utils";
import styles from "./offering-steps.module.css";

export function OfferingSteps() {
  return (
    <section className={styles.section}>
      <div className="container">
        <Reveal>
          <span className={cn("eyebrow", styles.eyebrow)}>How it works</span>
          <h2 className={cn("display", styles.title)}>From first call to first results</h2>
        </Reveal>

        <ol className={styles.steps}>
          {OFFERING_STEPS.map((step, i) => (
            <li key={step.title}>
              <Reveal delay={i * 0.07} className={styles.stepWrap}>
                <div className={styles.step}>
                  <span className={cn("display", styles.number)}>{String(i + 1).padStart(2, "0")}</span>
                  <div className={styles.stepText}>
                    <h3 className={styles.stepTitle}>{step.title}</h3>
                    <p className={styles.stepBody}>{step.body}</p>
                  </div>
                </div>
                {i < OFFERING_STEPS.length - 1 && (
                  <span className={styles.arrow} aria-hidden="true"><ArrowRight /></span>
                )}
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

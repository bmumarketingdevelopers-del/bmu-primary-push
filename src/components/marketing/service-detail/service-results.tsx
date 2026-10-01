import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Reveal } from "../reveal";
import { SectionHead } from "./section-head";
import type { ServicePageWithDetail } from "@/lib/service-pages-data";
import { cn } from "@/lib/utils";
import styles from "./service-results.module.css";

export function ServiceResults({ service, note }: { service: ServicePageWithDetail; note?: string }) {
  const { stats, phases } = service.detail;

  return (
    <section className={styles.section}>
      <div className="container">
        <SectionHead
          eyebrow="Achievements"
          title="Results that speak"
          aside={note}
        />

        <Reveal delay={0.06}>
          <ul className={styles.stats}>
            {stats.map((s) => {
              const Icon = s.icon;
              return (
                <li key={s.label} className={styles.stat}>
                  <span className={styles.statIcon} aria-hidden="true"><Icon /></span>
                  <p className={cn("display", styles.statValue)}>{s.value}</p>
                  <p className={styles.statLabel}>{s.label}</p>
                  <p className={styles.statBody}>{s.body}</p>
                </li>
              );
            })}
          </ul>
        </Reveal>

        <Reveal delay={0.08}>
          <div className={styles.roadmap}>
            <div className={styles.panel}>
              <span className={styles.panelRings} aria-hidden="true" />
              <span className={styles.panelEyebrow}>Your roadmap</span>
              <h2 className={cn("display", styles.panelTitle)}>From kickoff to results</h2>
              <p className={styles.panelBody}>
                {service.detail.roadmapLede ?? `How a ${service.title} engagement runs, step by step.`}
              </p>
              <Link href="/contact" className={styles.panelLink}>
                Book a free consultation <ArrowRight />
              </Link>
            </div>

            <ol className={styles.phases}>
              {phases.map((p, i) => (
                <li key={p.title} className={styles.phase}>
                  <div className={styles.phaseHead}>
                    <span className={styles.phasePill}>Phase {String(i + 1).padStart(2, "0")}</span>
                    {i < phases.length - 1 && <span className={styles.connector} aria-hidden="true" />}
                    <h3 className={styles.phaseTitle}>{p.title}</h3>
                  </div>
                  <ul className={styles.phaseList}>
                    {p.items.map((item) => (
                      <li key={item} className={styles.phaseItem}>
                        <Check className={styles.phaseCheck} aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

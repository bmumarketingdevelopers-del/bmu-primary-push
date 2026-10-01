"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import styles from "./page.module.css";

// Time between steps. Within each step the line takes 400ms to reach the next
// dot, then that dot and its text fade in (timings in page.module.css, .journey*).
const STEP_MS = 600;
const FIRST_STEP_DELAY_MS = 250;

type Step = { label: string; title: string; body: string };

/**
 * The first dot and its text are always shown. When the section comes into view
 * the line travels to the next dot, that dot lights up and its text appears, one
 * step at a time. Resets once the section leaves the screen so it replays.
 */
export function AboutTimeline({ steps }: { steps: Step[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const [reached, setReached] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const last = steps.length - 1;
    let timers: ReturnType<typeof setTimeout>[] = [];
    let played = false;

    const clear = () => {
      timers.forEach(clearTimeout);
      timers = [];
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          if (played && !reduced) {
            clear();
            played = false;
            setReached(0);
          }
          return;
        }
        if (played || entry.intersectionRatio < 0.35) return;
        played = true;

        if (reduced) {
          setReached(last);
          return;
        }
        for (let i = 1; i <= last; i++) {
          timers.push(setTimeout(() => setReached(i), FIRST_STEP_DELAY_MS + (i - 1) * STEP_MS));
        }
      },
      { threshold: [0, 0.35] },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      clear();
    };
  }, [steps.length]);

  return (
    <ol ref={ref} className={styles.journey}>
      {steps.map((s, i) => {
        const isLast = i === steps.length - 1;
        return (
          <li
            key={s.label}
            className={cn(
              styles.journeyItem,
              i <= reached && styles.journeyReached,
              isLast && styles.journeyLast,
            )}
          >
            <span className={styles.journeyDot} aria-hidden="true" />
            {isLast ? (
              // grey line running on past the last dot to the edge (laptop/tablet only)
              <span className={cn(styles.journeyLine, styles.journeyTail)} aria-hidden="true" />
            ) : (
              <span className={styles.journeyLine} aria-hidden="true">
                <span className={cn(styles.journeyFill, i < reached && styles.journeyFilled)} />
              </span>
            )}
            <div className={styles.journeyText}>
              <p className={cn("display", styles.journeyLabel)}>{s.label}</p>
              <p className={styles.journeyTitle}>{s.title}</p>
              <p className={styles.journeyBody}>{s.body}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

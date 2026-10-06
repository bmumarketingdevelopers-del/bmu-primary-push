"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import styles from "./page.module.css";

// Count-up timing, same as the About page stats and the BMU QR dashboard: 2s, easing out
const COUNT_MS = 2000;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

type Stat = { value: string; label: string; sub: string };

/**
 * A value counts only when it holds a single number with text around it ("+312%", "<60s",
 * "−38%", "12"). Values like "24/7" or "Monthly" stay as they are.
 */
function parse(value: string) {
  const match = value.match(/^(\D*)(\d[\d,]*(?:\.\d+)?)(\D*)$/);
  if (!match) return null;
  const [, prefix, num, suffix] = match;
  const clean = num.replace(/,/g, "");
  return {
    prefix,
    suffix,
    target: parseFloat(clean),
    decimals: clean.includes(".") ? clean.split(".")[1].length : 0,
    grouped: num.includes(","),
  };
}

/**
 * The centred hero's numbers row. Counts every number up from 0 when the row comes into view
 * (at least 35% on screen) and resets once it has fully left, so it replays on every visit.
 * Reduced motion: shows the final values straight away.
 */
export function HeroStats({ stats, left }: { stats: Stat[]; left?: boolean }) {
  const ref = React.useRef<HTMLUListElement>(null);
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Reduced motion: jump straight to the final values (same as the About page)
    const duration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : COUNT_MS;

    let frame = 0;
    let played = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          if (played && duration) {
            cancelAnimationFrame(frame);
            played = false;
            setProgress(0);
          }
          return;
        }
        if (played || entry.intersectionRatio < 0.35) return;
        played = true;
        const start = performance.now();
        const tick = (now: number) => {
          const t = duration ? Math.min(Math.max((now - start) / duration, 0), 1) : 1;
          setProgress(easeOut(t));
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: [0, 0.35] },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <ul ref={ref} className={cn(styles.heroStats, left && styles.heroStatsLeft)}>
      {stats.map((s, i) => {
        const p = parse(s.value);
        const shown = p
          ? `${p.prefix}${(p.target * progress).toLocaleString("en-US", {
              minimumFractionDigits: p.decimals,
              maximumFractionDigits: p.decimals,
              useGrouping: p.grouped,
            })}${p.suffix}`
          : s.value;
        return (
          <li key={s.label} className={styles.heroStat}>
            <span
              className={cn("display", styles.heroStatValue, i === 0 && styles.heroStatValueAccent)}
              aria-label={s.value}
            >
              {shown}
            </span>
            <span className={styles.heroStatLabel}>{s.label}</span>
            <span className={styles.heroStatSub}>{s.sub}</span>
          </li>
        );
      })}
    </ul>
  );
}

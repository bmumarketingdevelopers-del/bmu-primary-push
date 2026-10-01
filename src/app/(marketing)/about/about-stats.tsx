"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import styles from "./page.module.css";

// Every stat shares one timer, so all counters start and finish together.
const DURATION_MS = 2000;

type Stat = { value: string; label: string };

function parse(value: string) {
  const match = value.match(/^(\D*)(\d+(?:\.\d+)?)(.*)$/);
  if (!match) return null;
  const [, prefix, num, suffix] = match;
  const decimals = num.includes(".") ? num.split(".")[1].length : 0;
  return { prefix, target: parseFloat(num), suffix, decimals };
}

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export function AboutStats({ stats }: { stats: Stat[] }) {
  const ref = useRef<HTMLDListElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Reduced motion: jump straight to the final values.
    const duration = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? 0
      : DURATION_MS;

    // Replays on every visit: starts when 30% is visible, resets to 0 once
    // fully out of view so the next visit counts up again.
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
        if (played || entry.intersectionRatio < 0.3) return;
        played = true;
        const start = performance.now();
        const tick = (now: number) => {
          const t = duration ? Math.min((now - start) / duration, 1) : 1;
          setProgress(easeOut(t));
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: [0, 0.3] },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <dl ref={ref} className={styles.stats}>
      {stats.map((s) => {
        const p = parse(s.value);
        const shown = p
          ? `${p.prefix}${(p.target * progress).toFixed(p.decimals)}${p.suffix}`
          : s.value;
        return (
          <div key={s.label}>
            <dt className={cn("display", styles.statValue)} aria-label={s.value}>
              {shown}
            </dt>
            <dd className={styles.statLabel}>{s.label}</dd>
          </div>
        );
      })}
    </dl>
  );
}

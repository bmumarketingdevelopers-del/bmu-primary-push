"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { CarouselSlideContext } from "./results-carousel";
import styles from "./count-up.module.css";

/**
 * Splits a display metric like "312%", "4.8★", "−41%", "₹38Cr" or "18,402" into the text
 * before the number, the number itself (decimals, thousands commas), and the text after it.
 */
function parseMetric(value: string) {
  const match = value.match(/^(\D*?)(\d[\d,]*(?:\.\d+)?)(.*)$/);
  if (!match) return null;
  const [, prefix, number, suffix] = match;
  const decimals = number.includes(".") ? number.split(".")[1].length : 0;
  return {
    prefix,
    suffix,
    decimals,
    grouped: number.includes(","),
    target: parseFloat(number.replace(/,/g, "")),
  };
}

function formatNumber(n: number, decimals: number, grouped: boolean) {
  return grouped
    ? n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
    : n.toFixed(decimals);
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Counts a metric up from zero every time it scrolls into view (down or back up, and on page
 * load). It resets to zero once it leaves the screen so the next visit replays it. Inside the
 * results carousel it also waits until its slide is the active one.
 * Values without a number are rendered as-is; reduced-motion users see the final value.
 */
export function CountUp({ value, duration = 2 }: { value: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { margin: "0px 0px -40px" });
  const slide = useContext(CarouselSlideContext);
  const reduceMotion = useReducedMotion();
  const parsed = parseMetric(value);
  const [current, setCurrent] = useState(0);

  const shouldRun = inView && (slide?.active ?? true);

  useEffect(() => {
    if (!parsed || reduceMotion) return;

    // Off screen (or on a hidden slide): park at zero, ready for the next replay
    if (!shouldRun) {
      setCurrent(0);
      return;
    }

    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / (duration * 1000), 1);
      setCurrent(parsed.target * easeOutCubic(progress));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
    // parsed is derived from value, so value is the real dependency
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, shouldRun, reduceMotion, duration]);

  if (!parsed) return <>{value}</>;

  const shown = reduceMotion ? parsed.target : current;

  return (
    <span ref={ref} className={styles.root}>
      {/* Invisible final value reserves the width, so nothing shifts while counting */}
      <span className={styles.sizer} aria-hidden="true">
        {value}
      </span>
      <span className={styles.value} aria-hidden="true">
        {parsed.prefix}
        {formatNumber(shown, parsed.decimals, parsed.grouped)}
        {parsed.suffix}
      </span>
      {/* Screen readers get the real value, not every intermediate number */}
      <span className="sr-only">{value}</span>
    </span>
  );
}

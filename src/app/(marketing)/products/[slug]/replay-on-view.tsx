"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// Count-up timing, same as the About page stats: 2s, easing out
const COUNT_MS = 2000;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

type Counter = { node: Text; target: number; decimals: number; grouped: boolean };

const format = (c: Counter, value: number) =>
  value.toLocaleString("en-US", {
    minimumFractionDigits: c.decimals,
    maximumFractionDigits: c.decimals,
    useGrouping: c.grouped,
  });

/**
 * Wraps a block whose CSS animations should replay every time it comes into view.
 * Adds `playClassName` once at least 35% of the block is on screen, and removes it after the
 * block has fully left the screen, so the animations (gated on that class in page.module.css)
 * run again on the next visit. Same approach as the About timeline and the Contact steps.
 *
 * `countClassNames`: elements with these classes count up from 0 to their number on every
 * visit, like the About page stats. Only the number's own text is changed ("18,402", "45"),
 * so a "%" written after it stays put, and the markup inside (product-visuals.tsx) is untouched.
 */
export function ReplayOnView({
  children,
  className,
  playClassName,
  countClassNames = [],
}: {
  children: React.ReactNode;
  className?: string;
  playClassName: string;
  countClassNames?: string[];
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const counters = React.useRef<Counter[]>([]);
  const [play, setPlay] = React.useState(false);
  const reduced = React.useRef(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Find each number's text and remember its final value. The value is read once and kept on
    // the element (data-count-to), because the text itself is set to 0 while waiting; reading it
    // again (React runs this setup twice in development) would otherwise count to 0.
    counters.current = countClassNames
      .flatMap((c) => Array.from(el.getElementsByClassName(c)))
      .map((item) => {
        const node = Array.from(item.childNodes).find((n): n is Text => n.nodeType === Node.TEXT_NODE);
        if (!(item instanceof HTMLElement) || !node) return null;
        item.dataset.countTo ??= node.nodeValue?.trim() ?? "";
        const raw = item.dataset.countTo;
        const num = raw.replace(/,/g, "");
        if (!/^\d+(\.\d+)?$/.test(num)) return null;
        return {
          node,
          target: parseFloat(num),
          decimals: num.includes(".") ? num.split(".")[1].length : 0,
          grouped: raw.includes(","),
        };
      })
      .filter((c): c is Counter => c !== null);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) setPlay(false);
        else if (entry.intersectionRatio >= 0.35) setPlay(true);
      },
      { threshold: [0, 0.35] },
    );
    observer.observe(el);
    return () => observer.disconnect();
    // class names are fixed for the page
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Count up while in view; sit at 0 while away so the next visit counts up again
  React.useEffect(() => {
    const list = counters.current;
    if (!list.length || reduced.current) return;

    if (!play) {
      list.forEach((c) => (c.node.nodeValue = format(c, 0)));
      return;
    }

    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / COUNT_MS, 1);
      const p = easeOut(t);
      list.forEach((c) => (c.node.nodeValue = format(c, c.target * p)));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [play]);

  return (
    <div ref={ref} className={cn(className, play && playClassName)}>
      {children}
    </div>
  );
}

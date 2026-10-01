"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import styles from "./industries.module.css";

const SPEED = 40; // px per second
const RESUME_DELAY = 1200; // ms after the user lets go before auto-scroll continues
const DRAG_THRESHOLD = 5;

/**
 * One auto-scrolling row of industry chips that can also be swiped (touch) or dragged (mouse).
 * The list is rendered twice so the scroll position can wrap around seamlessly; the copy is
 * hidden from assistive tech. Hovering, touching or dragging pauses the auto-scroll.
 */
export function IndustriesMarquee({
  names,
  direction,
  links,
}: {
  names: readonly string[];
  direction: "left" | "right";
  /** name → industry page slug, for the chips that have a page */
  links: Record<string, string>;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const row = [...names, ...names];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Width of one copy of the list: wrapping by exactly this much is invisible
    const half = () => el.scrollWidth / 2;
    const wrap = () => {
      if (el.scrollLeft >= half()) el.scrollLeft -= half();
      else if (el.scrollLeft <= 0) el.scrollLeft += half();
    };

    if (direction === "right") el.scrollLeft = half();

    let paused = false;
    let hovering = false;
    let resumeTimer = 0;
    let pos = el.scrollLeft; // fractional position, since scrollLeft may round
    let last = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const dt = Math.min(now - last, 64) / 1000;
      last = now;
      if (!paused && !hovering) {
        pos += (direction === "left" ? 1 : -1) * SPEED * dt;
        const h = half();
        if (pos >= h) pos -= h;
        if (pos <= 0) pos += h;
        el.scrollLeft = pos;
      }
      frame = requestAnimationFrame(tick);
    };

    // Only animate while the row is on screen (and never with reduced motion)
    const start = () => {
      if (frame || reduceMotion) return;
      last = performance.now();
      pos = el.scrollLeft;
      frame = requestAnimationFrame(tick);
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };
    const observer = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()));
    observer.observe(el);

    const pause = () => {
      paused = true;
      window.clearTimeout(resumeTimer);
    };
    const resumeLater = () => {
      window.clearTimeout(resumeTimer);
      resumeTimer = window.setTimeout(() => {
        wrap();
        pos = el.scrollLeft;
        paused = false;
      }, RESUME_DELAY);
    };

    // Manual scrolling (swipe momentum, trackpad): keep looping and pick up from there
    const onScroll = () => {
      if (paused || hovering) {
        wrap();
        pos = el.scrollLeft;
      }
    };

    // Mouse drag
    let dragging = false;
    let moved = false;
    let startX = 0;
    let startScroll = 0;
    const onPointerDown = (e: PointerEvent) => {
      pause();
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      dragging = true;
      moved = false;
      startX = e.clientX;
      startScroll = el.scrollLeft;
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      if (!moved && Math.abs(dx) > DRAG_THRESHOLD) {
        moved = true;
        el.classList.add(styles.dragging);
        el.setPointerCapture(e.pointerId);
      }
      if (moved) el.scrollLeft = startScroll - dx;
    };
    const onPointerUp = (e: PointerEvent) => {
      if (dragging && el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
      dragging = false;
      el.classList.remove(styles.dragging);
      resumeLater();
    };
    // A drag shouldn't open the chip's link
    const onClickCapture = (e: MouseEvent) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
        moved = false;
      }
    };
    // Hover-pause for real mice only (touch taps fire enter without a matching leave)
    const onEnter = (e: PointerEvent) => {
      if (e.pointerType === "mouse") hovering = true;
    };
    const onLeave = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      hovering = false;
      pos = el.scrollLeft;
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", onPointerUp);
    el.addEventListener("pointercancel", onPointerUp);
    el.addEventListener("touchend", resumeLater, { passive: true });
    el.addEventListener("click", onClickCapture, true);
    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointerleave", onLeave);

    return () => {
      stop();
      observer.disconnect();
      window.clearTimeout(resumeTimer);
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("pointercancel", onPointerUp);
      el.removeEventListener("touchend", resumeLater);
      el.removeEventListener("click", onClickCapture, true);
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [direction, reduceMotion]);

  return (
    <div ref={ref} className={styles.marquee} onDragStart={(e) => e.preventDefault()}>
      <ul className={styles.track}>
        {row.map((name, i) => {
          const slug = links[name];
          const copy = i >= names.length;
          return (
            <li key={`${name}-${i}`} className={styles.item} aria-hidden={copy || undefined}>
              {slug ? (
                <Link href={`/industries/${slug}`} className={styles.chip} tabIndex={copy ? -1 : undefined}>
                  {name}
                </Link>
              ) : (
                <span className={cn(styles.chip)}>{name}</span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

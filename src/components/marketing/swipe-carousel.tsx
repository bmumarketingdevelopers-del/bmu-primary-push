"use client";

import { Children, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import styles from "./swipe-carousel.module.css";

// Index of the slide whose left edge is closest to the track's snap position
function getClosestIndex(track: HTMLElement) {
  const slides = Array.from(track.children) as HTMLElement[];
  if (!slides.length) return 0;

  // At the very end the last slides can't reach the snap position
  if (track.scrollLeft >= track.scrollWidth - track.clientWidth - 2) return slides.length - 1;

  const snap = track.getBoundingClientRect().left + (parseFloat(getComputedStyle(track).scrollPaddingLeft) || 0);
  let closest = 0;
  let min = Infinity;
  slides.forEach((slide, i) => {
    const distance = Math.abs(slide.getBoundingClientRect().left - snap);
    if (distance < min) {
      min = distance;
      closest = i;
    }
  });
  return closest;
}

/**
 * Cards that swipe on phones (1 visible + next peeking) and tablets (2 visible + next peeking),
 * with dots underneath. From 1024px up the same markup is a plain 3-column grid and the dots
 * are hidden (see swipe-carousel.module.css).
 */
export function SwipeCarousel({
  children,
  label,
  className,
}: {
  children: React.ReactNode;
  /** Accessible name for the dots, e.g. "Testimonials" */
  label: string;
  className?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const slides = Children.toArray(children);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onScroll = () => setActive(getClosestIndex(track));
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, []);

  const goTo = (index: number) => {
    const track = trackRef.current;
    const slide = track?.children[index] as HTMLElement | undefined;
    if (!track || !slide) return;
    const padding = parseFloat(getComputedStyle(track).scrollPaddingLeft) || 0;
    const offset = slide.getBoundingClientRect().left - track.getBoundingClientRect().left - padding;
    track.scrollTo({ left: track.scrollLeft + offset, behavior: "smooth" });
    setActive(index);
  };

  return (
    <div className={className}>
      <div ref={trackRef} className={styles.track}>
        {slides.map((slide, i) => (
          <div key={i} className={styles.slide}>
            {slide}
          </div>
        ))}
      </div>

      <div className={styles.dots} role="tablist" aria-label={label}>
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-label={`Show ${label.toLowerCase()} ${i + 1}`}
            className={cn(styles.dot, i === active && styles.dotActive)}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </div>
  );
}

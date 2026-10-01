"use client";

import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/marketing/reveal";
import { cn } from "@/lib/utils";
import styles from "./page.module.css";

// Same swipe behaviour as the Services section (components/marketing/services.tsx),
// copied here so that shared file stays untouched.

const DRAG_THRESHOLD = 5;

type Value = { title: string; body: string };

function getCards(track: HTMLElement) {
  return Array.from(track.querySelectorAll<HTMLElement>(`.${styles.valueSlide}`));
}

// Scroll position that puts each card at the start of the track (cards past the end clamp to it)
function getStops(track: HTMLElement) {
  const cards = getCards(track);
  if (!cards.length) return [0];
  const first = cards[0].offsetLeft;
  const max = track.scrollWidth - track.clientWidth;
  const stops = cards.map((c) => Math.min(c.offsetLeft - first, max));
  // Cards that can't reach the start share the last stop, so they get one dot between them
  return stops.filter((s, i) => i === 0 || s > stops[i - 1] + 1);
}

function getClosestStop(track: HTMLElement, stops: number[]) {
  let closest = 0;
  stops.forEach((s, i) => {
    if (Math.abs(s - track.scrollLeft) < Math.abs(stops[closest] - track.scrollLeft)) closest = i;
  });
  return closest;
}

/** Phones: swipeable row (1 card + the next peeking) with dots. Tablet/laptop: 2 x 2 grid. */
export function AboutValues({ values }: { values: Value[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [stops, setStops] = useState<number[]>([0]);
  const [active, setActive] = useState(0);
  const drag = useRef({ active: false, moved: false, startX: 0, startScroll: 0 });

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const measure = () => {
      const next = getStops(track);
      setStops(next);
      setActive(getClosestStop(track, next));
    };
    const onScroll = () => setActive(getClosestStop(track, getStops(track)));

    const observer = new ResizeObserver(measure);
    observer.observe(track);
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      track.removeEventListener("scroll", onScroll);
    };
  }, []);

  const goTo = (index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const all = getStops(track);
    const i = Math.max(0, Math.min(index, all.length - 1));
    track.scrollTo({ left: all[i], behavior: "smooth" });
    setActive(i);
  };

  /* Mouse drag-to-swipe (touch devices already scroll natively) */

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!track || e.pointerType !== "mouse" || e.button !== 0) return;
    // Tablet/laptop grid doesn't scroll, so leave text selection alone there
    if (track.scrollWidth <= track.clientWidth) return;
    drag.current = { active: true, moved: false, startX: e.clientX, startScroll: track.scrollLeft };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    const state = drag.current;
    if (!track || !state.active) return;

    const dx = e.clientX - state.startX;
    if (!state.moved && Math.abs(dx) > DRAG_THRESHOLD) {
      state.moved = true;
      track.classList.add(styles.valueDragging);
      track.setPointerCapture(e.pointerId);
    }
    if (state.moved) track.scrollLeft = state.startScroll - dx;
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    const state = drag.current;
    if (!track || !state.active) return;

    state.active = false;
    if (track.hasPointerCapture(e.pointerId)) track.releasePointerCapture(e.pointerId);
    if (state.moved) {
      track.classList.remove(styles.valueDragging);
      goTo(getClosestStop(track, getStops(track)));
    }
  };

  const scrollable = stops.length > 1;

  return (
    <>
      <div
        ref={trackRef}
        className={styles.valueGrid}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onDragStart={(e) => e.preventDefault()}
      >
        {values.map((v, i) => (
          <div key={v.title} className={styles.valueSlide}>
            <Reveal delay={(i % 2) * 0.07} className={styles.valueReveal}>
              <article className={styles.valueCard}>
                <h3 className={cn("display", styles.valueTitle)}>{v.title}</h3>
                <p className={styles.valueBody}>{v.body}</p>
              </article>
            </Reveal>
          </div>
        ))}
      </div>

      {scrollable && (
        <div className={styles.valueDots}>
          {stops.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to value ${i + 1}`}
              aria-current={active === i ? "true" : undefined}
              className={cn(styles.valueDot, active === i && styles.valueDotActive)}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      )}
    </>
  );
}

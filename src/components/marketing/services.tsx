"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "./section-heading";
import { Reveal } from "./reveal";
import { SERVICE_PAGES, servicePageHref } from "@/lib/service-pages-data";
import { cn } from "@/lib/utils";
import styles from "./services.module.css";

const DRAG_THRESHOLD = 5;

function getCards(track: HTMLElement) {
  return Array.from(track.querySelectorAll<HTMLElement>(`.${styles.cardWrapper}`));
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

/**
 * The six services from /services as a swipeable row: 4 cards visible on desktop (the rest swipe
 * or drag in), 3 on laptops, 2 on tablets and 1 on phones, each with the next one peeking.
 */
export function Services({ heading = true }: { heading?: boolean }) {
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

    measure();
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
    drag.current = { active: true, moved: false, startX: e.clientX, startScroll: track.scrollLeft };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    const state = drag.current;
    if (!track || !state.active) return;

    const dx = e.clientX - state.startX;
    if (!state.moved && Math.abs(dx) > DRAG_THRESHOLD) {
      state.moved = true;
      track.classList.add(styles.dragging);
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
      track.classList.remove(styles.dragging);
      goTo(getClosestStop(track, getStops(track)));
    }
  };

  // Stop the card link from opening when the user was dragging
  const handleClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      drag.current.moved = false;
    }
  };

  const scrollable = stops.length > 1;

  return (
    <section id="services" className={cn("section", styles.section)}>
      <div className="container">
        {heading && (
          <Reveal>
            <SectionHeading
              className={styles.heading}
              eyebrow="Services"
              title={
                <>
                  Everything growth needs,
                  <br />
                  under one roof
                </>
              }
              lede="Six services that plug into each other. Most clients start with one and add the rest as results compound."
              action={
                <Button asChild variant="outline" className={styles.allServices}>
                  <Link href="/services">
                    All services <ArrowRight />
                  </Link>
                </Button>
              }
            />
          </Reveal>
        )}

        <div
          ref={trackRef}
          className={styles.track}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onClickCapture={handleClickCapture}
          onDragStart={(e) => e.preventDefault()}
        >
          {SERVICE_PAGES.map((s, i) => (
            <div key={s.slug} className={styles.cardWrapper}>
              <Reveal delay={(i % 4) * 0.07} className={styles.reveal}>
                <Link href={servicePageHref(s)} className={styles.card}>
                  <h3 className={cn("display", styles.title)}>{s.title}</h3>
                  <p className={styles.summary}>{s.summary}</p>
                  <div className={styles.footer}>
                    <span className={styles.price}>
                      From <b className={styles.priceValue}>{s.priceFrom}</b>
                    </span>
                    <span className={styles.details}>Details</span>
                  </div>
                </Link>
              </Reveal>
            </div>
          ))}
        </div>

        {scrollable && (
          <div className={styles.dots}>
            {stops.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to services slide ${i + 1}`}
                aria-current={active === i ? "true" : undefined}
                className={cn(styles.dot, active === i && styles.activeDot)}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

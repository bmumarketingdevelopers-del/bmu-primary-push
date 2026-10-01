"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { CaseStudyDetail } from "@/lib/case-studies-data";
import { cn } from "@/lib/utils";
import styles from "./case-studies-showcase.module.css";

type Visual =
  | { kind: "bars"; label: string; before: number; after: number; multiple: string }
  | { kind: "rating"; label: string; before: number; after: number; min: number; max: number }
  | { kind: "index"; label: string; before: number; after: number };

// Listing-page copy and chart for each case study (the detail pages keep their own copy)
const SHOWCASE: Record<string, { title: string; summary?: string; visual: Visual }> = {
  "atria-living-tower-c": {
    title: "Turning property searches into qualified enquiries.",
    visual: { kind: "bars", label: "Site visits booked", before: 24, after: 100, multiple: "4.1×" },
  },
  "restaurant-group-ratings": {
    title: "Turning great experiences into stronger reviews",
    summary:
      "A growing hospitality brand wanted to improve its online reputation and become easier to discover. We created a focused review and local visibility strategy across its locations.",
    visual: { kind: "rating", label: "Average rating, all outlets", before: 3.9, after: 4.8, min: 3.5, max: 5 },
  },
  "d2c-beauty-creative-velocity": {
    title: "Making creative performance work harder for growth",
    visual: { kind: "index", label: "Cost per acquisition, indexed", before: 100, after: 59 },
  },
};

const category = (c: CaseStudyDetail) => c.industry.split(" · ")[0];

/* ------------------------------------------------------------------ charts */

function Chart({ visual, play }: { visual: Visual; play: boolean }) {
  if (visual.kind === "bars") {
    const bars = [
      { name: "Before", h: visual.before, tag: "1×" },
      { name: "After", h: visual.after, tag: visual.multiple, after: true },
    ];
    return (
      <div className={styles.bars} aria-hidden="true">
        <div className={styles.barsPlot}>
          {bars.map((b) => (
            <div key={b.name} className={styles.barSlot}>
              <div className={styles.barWrap} style={{ height: `${b.h}%` }}>
                <span className={cn(styles.barTag, b.after && styles.barTagAfter, play && styles.barTagOn)}>
                  {b.tag}
                </span>
                <span className={cn(styles.bar, b.after && styles.barAfter, play && styles.barOn)} />
              </div>
            </div>
          ))}
        </div>
        <div className={styles.barsAxis}>
          {bars.map((b) => (
            <span key={b.name}>{b.name}</span>
          ))}
        </div>
      </div>
    );
  }

  if (visual.kind === "rating") {
    const pos = (v: number) => ((v - visual.min) / (visual.max - visual.min)) * 100;
    const ticks = [3.5, 3.8, 4.0, 4.2, 4.5, 4.8, 5.0];
    const current = play ? visual.after : visual.before;
    return (
      <div className={styles.rating} aria-hidden="true">
        <div className={styles.ticks}>
          {ticks.map((t) => (
            <span key={t} style={{ left: `${pos(t)}%` }}>{t.toFixed(1)}</span>
          ))}
        </div>
        <div className={styles.track}>
          <span
            className={styles.fill}
            style={{ left: `${pos(visual.before)}%`, width: `${pos(current) - pos(visual.before)}%` }}
          />
          <span className={styles.dotBefore} style={{ left: `${pos(visual.before)}%` }}>
            <em>Before {visual.before}</em>
          </span>
          <span className={styles.knob} style={{ left: `${pos(current)}%` }}>
            <em className={cn(styles.knobTag, play && styles.knobTagOn)}>After {visual.after}</em>
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.index} aria-hidden="true">
      <div className={styles.indexRow}>
        <span className={styles.indexName}>Before</span>
        <div className={styles.indexTrack}>
          <span className={styles.indexBar} style={{ width: play ? `${visual.before}%` : "0%" }}>
            <b>{visual.before}</b>
          </span>
        </div>
      </div>
      <div className={styles.indexRow}>
        <span className={styles.indexName}>After</span>
        <div className={styles.indexTrack}>
          <span
            className={cn(styles.indexBar, styles.indexAfter)}
            style={{ width: play ? `${visual.after}%` : `${visual.before}%` }}
          >
            <b>{visual.after}</b>
          </span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ card */

function CaseCard({ study, index }: { study: CaseStudyDetail; index: number }) {
  const ref = useRef<HTMLAnchorElement>(null);
  // Replays whenever the card comes back on screen — including swiping to it in the carousel,
  // since slides clipped by the track don't count as in view
  const play = useInView(ref, { amount: 0.45 });
  const show = SHOWCASE[study.slug];
  const visual = show?.visual;

  return (
    <Link
      ref={ref}
      href={`/case-studies/${study.slug}`}
      className={cn(styles.card, index % 2 === 1 && styles.cardFlip)}
    >
      <div className={cn(styles.visual, visual && styles[`visual_${visual.kind}`])}>
        <p className={styles.visualLabel}>{visual?.label ?? study.industry}</p>
        {visual && <Chart visual={visual} play={play} />}
        <div className={styles.metricBlock}>
          <p className={cn("display", styles.metric)}>{study.metric}</p>
          <p className={styles.metricLabel}>{study.metricLabel}</p>
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.bodyTop}>
          <p className={styles.industry}>{study.industry}</p>
          <span className={styles.readMore}>
            <span className={styles.readMoreText}>Read the full story</span>
            <span className={styles.arrow}>
              <ArrowRight />
            </span>
          </span>
        </div>
        <h2 className={cn("display", styles.title)}>{show?.title ?? study.title}</h2>
        <p className={styles.summary}>{show?.summary ?? study.summary}</p>
        <dl className={styles.stats}>
          {study.results.map((r) => (
            <div key={r.label} className={styles.stat}>
              <dt className={styles.statValue}>{r.value}</dt>
              <dd className={styles.statLabel}>{r.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Link>
  );
}

/* ------------------------------------------------------------------ showcase */

/**
 * Filterable case study list. From 1024px up the cards stack with alternating layouts; below
 * that they become a swipeable strip with dots (one card + peek on phones, two on tablets).
 */
export function CaseStudiesShowcase({ studies }: { studies: CaseStudyDetail[] }) {
  const filters = ["All", ...Array.from(new Set(studies.map(category)))];
  const [filter, setFilter] = useState("All");
  const [active, setActive] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const shown = filter === "All" ? studies : studies.filter((s) => category(s) === filter);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const slides = Array.from(track.children) as HTMLElement[];
      if (track.scrollLeft >= track.scrollWidth - track.clientWidth - 2) {
        setActive(slides.length - 1);
        return;
      }
      const snap = track.getBoundingClientRect().left + (parseFloat(getComputedStyle(track).scrollPaddingLeft) || 0);
      let closest = 0;
      let min = Infinity;
      slides.forEach((s, i) => {
        const d = Math.abs(s.getBoundingClientRect().left - snap);
        if (d < min) {
          min = d;
          closest = i;
        }
      });
      setActive(closest);
    };
    // Measure at most once per frame while swiping
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  const choose = (f: string) => {
    setFilter(f);
    setActive(0);
    trackRef.current?.scrollTo({ left: 0 });
  };

  const goTo = (i: number) => {
    const track = trackRef.current;
    const slide = track?.children[i] as HTMLElement | undefined;
    if (!track || !slide) return;
    const padding = parseFloat(getComputedStyle(track).scrollPaddingLeft) || 0;
    const offset = slide.getBoundingClientRect().left - track.getBoundingClientRect().left - padding;
    track.scrollTo({ left: track.scrollLeft + offset, behavior: "smooth" });
    setActive(i);
  };

  return (
    <section className={cn("section", styles.section)}>
      <div className="container">
        <div className={styles.toolbar}>
          <p className={styles.count}>
            {shown.length} case {shown.length === 1 ? "study" : "studies"}
          </p>
          <div className={styles.filters} role="group" aria-label="Filter case studies by industry">
            {filters.map((f) => (
              <button
                key={f}
                type="button"
                aria-pressed={filter === f}
                className={cn(styles.filter, filter === f && styles.filterActive)}
                onClick={() => choose(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div ref={trackRef} className={styles.list}>
          {shown.map((s, i) => (
            // Keyed by filter so the cards fade back in when the filter changes
            <div
              key={`${filter}-${s.slug}`}
              className={styles.slide}
              style={{ animationDelay: `${Math.min(i, 2) * 70}ms` }}
            >
              <CaseCard study={s} index={i} />
            </div>
          ))}
        </div>

        {shown.length > 1 && (
          <div className={styles.dots} role="tablist" aria-label="Case studies">
            {shown.map((s, i) => (
              <button
                key={s.slug}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-label={`Show case study ${i + 1}`}
                className={cn(styles.dot, i === active && styles.dotActive)}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

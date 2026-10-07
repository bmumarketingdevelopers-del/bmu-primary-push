"use client";

import * as React from "react";
import { Car, MapPin, ReceiptText, Search, Utensils } from "lucide-react";
import { cn } from "@/lib/utils";
import styles from "./page.module.css";

const QUERY = "best cafe near me";
const TYPE_MS = 75; // per letter
const START_MS = 300; // pause before typing starts
const DRIVE_MS = 2600; // route draw + car drive

// Route to the café along the map's roads, in % of the map (x, y): in from the left on the lower
// road, up the diagonal road, right along the upper road, then down into the green pin.
const ROUTE: [number, number][] = [
  [0, 80],
  [33.2, 72.8],
  [26.1, 27.2],
  [50, 21.7],
  [50, 30],
];

/**
 * Restaurants: a Google Maps style search where the client is the top result.
 *
 * Animation (replays every time the panel comes into view, resets once it has fully left):
 * "best cafe near me" types itself into the search bar, then a red route draws itself along the
 * roads to the green café pin while a car drives along its tip (both moved together below).
 * Reduced motion: the full query, route and car at the café are shown straight away.
 */
export function RestaurantVisual() {
  const ref = React.useRef<HTMLDivElement>(null);
  const mapRef = React.useRef<HTMLDivElement>(null);
  const pathRef = React.useRef<SVGPathElement>(null);
  const carRef = React.useRef<HTMLSpanElement>(null);
  const progress = React.useRef(0);
  const [typed, setTyped] = React.useState(0);
  const [routing, setRouting] = React.useState(false);
  // The route is drawn at the map's real pixel size, so the red line and the car stay in step
  const [size, setSize] = React.useState({ w: 0, h: 0 });

  React.useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ w: width, h: height });
    });
    ro.observe(map);
    return () => ro.disconnect();
  }, []);

  // Draw the red line and move the car together, from the stored progress to the café
  React.useEffect(() => {
    const path = pathRef.current;
    const car = carRef.current;
    if (!path || !car || !size.w) return;

    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length}`;
    const apply = (t: number) => {
      path.style.strokeDashoffset = `${length * (1 - t)}`;
      const p = path.getPointAtLength(length * t);
      car.style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%, -50%)`;
    };

    if (!routing) {
      progress.current = 0;
      apply(0);
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      progress.current = 1;
      apply(1);
      return;
    }

    let frame = 0;
    const from = progress.current;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(from + Math.max(now - start, 0) / DRIVE_MS, 1);
      progress.current = t;
      apply(t);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [routing, size.w, size.h]);

  const routeD = ROUTE.map(([x, y], i) => `${i ? "L" : "M"}${(x / 100) * size.w} ${(y / 100) * size.h}`).join(" ");

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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
            setTyped(0);
            setRouting(false);
          }
          return;
        }
        if (played || entry.intersectionRatio < 0.35) return;
        played = true;

        if (reduced) {
          setTyped(QUERY.length);
          setRouting(true);
          return;
        }
        for (let i = 1; i <= QUERY.length; i++) {
          timers.push(setTimeout(() => setTyped(i), START_MS + i * TYPE_MS));
        }
        // route + car start once the last letter is in
        timers.push(setTimeout(() => setRouting(true), START_MS + QUERY.length * TYPE_MS + 250));
      },
      { threshold: [0, 0.35] },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      clear();
    };
  }, []);

  return (
    <div ref={ref} className={styles.visual} aria-hidden="true">
      <div className={styles.mapsPanel}>
        <div className={styles.mapsSearch}>
          <Search />
          <span>
            {QUERY.slice(0, typed)}
            <span className={cn(styles.mapsCaret, typed === QUERY.length && routing && styles.mapsCaretDone)} />
          </span>
        </div>

        <div ref={mapRef} className={cn(styles.mapsMap, routing && styles.mapsRouting)}>
          <svg viewBox="0 0 320 120" preserveAspectRatio="none" className={styles.mapsRoads}>
            <path d="M0 40 L320 12" />
            <path d="M0 96 L320 70" />
            <path d="M70 0 L120 120" />
            <path d="M210 0 L250 120" />
          </svg>
          <span className={styles.mapsBlock} />
          <MapPin className={styles.mapsPin} style={{ left: "24%", top: "26%" }} />
          <MapPin className={styles.mapsPin} style={{ left: "12%", top: "62%" }} />
          <MapPin className={styles.mapsPin} style={{ left: "77%", top: "60%" }} />
          <span className={styles.mapsPinMain} style={{ left: "50%", top: "40%" }}>
            <MapPin />
          </span>

          {/* Red route along the roads to the café, and the car that drives it */}
          <svg viewBox={`0 0 ${size.w || 1} ${size.h || 1}`} className={styles.mapsRoute}>
            {size.w > 0 && <path ref={pathRef} d={routeD} />}
          </svg>
          <span ref={carRef} className={styles.mapsCar}>
            <Car />
          </span>
        </div>

        <div className={cn(styles.mapsResult, styles.mapsResultTop)}>
          <span className={styles.mapsTopBadge}>Top result</span>
          <span className={cn(styles.mapsLogo, styles.mapsLogoTop)}>
            <Utensils />
          </span>
          <span className={styles.mapsInfo}>
            <span className={styles.mapsName}>The Green Table</span>
            <span className={styles.mapsMeta}>
              <span className={styles.mapsRating}>4.8</span>
              <span className={styles.mapsStars}>★★★★★</span>
              (1,240) · Open now · 0.8 km
            </span>
          </span>
          <span className={styles.mapsDirections}>Directions</span>
        </div>

        <div className={cn(styles.mapsResult, styles.mapsResultDim)}>
          <span className={styles.mapsLogo}>
            <Utensils />
          </span>
          <span className={styles.mapsInfo}>
            <span className={styles.mapsName}>Café Aroma</span>
            <span className={styles.mapsMeta}>
              <span>4.1</span>
              <span className={cn(styles.mapsStars, styles.mapsStarOff)}>★★★★★</span>
              (312) · Open now · 1.4 km
            </span>
          </span>
        </div>
      </div>

      <div className={styles.scanChip}>
        <span className={styles.scanIcon}>
          <ReceiptText />
        </span>
        <span>
          <span className={styles.scanTitle}>312 table scans today</span>
          <span className={styles.scanSub}>Reviews routed to Google</span>
        </span>
      </div>
    </div>
  );
}

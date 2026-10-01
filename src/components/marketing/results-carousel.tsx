"use client";

import { createContext, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import styles from "./results.module.css";

/**
 * Whether the slide a component sits in is currently fully on screen. Always true at desktop
 * widths, where all cards are visible at once. `null` outside a carousel.
 */
export const CarouselSlideContext = createContext<{ active: boolean } | null>(null);

// Snap position inside the track (its scroll-padding), where the "current" slide starts
const snapOffset = (track: HTMLElement) => parseFloat(getComputedStyle(track).scrollPaddingLeft) || 0;

/**
 * Below 1024px the cards become a swipeable strip that snaps to the left margin with the next
 * card peeking in (one card on phones, two on tablets), with dots; at desktop widths the same
 * markup is a plain three-column grid and the dots are hidden (see results.module.css).
 */
export function ResultsCarousel({ slides }: { slides: React.ReactNode[] }) {
    const trackRef = useRef<HTMLDivElement>(null);
    const [active, setActive] = useState(0);
    const [visible, setVisible] = useState<boolean[]>(() => slides.map(() => true));

    useEffect(() => {
        const track = trackRef.current;
        if (!track) return;

        const update = () => {
            const items = Array.from(track.children) as HTMLElement[];
            const box = track.getBoundingClientRect();
            const snap = box.left + snapOffset(track);

            // Current slide: the one whose left edge is nearest the snap position
            // (at the very end of the strip, the last one)
            let nearest = 0;
            if (track.scrollLeft >= track.scrollWidth - track.clientWidth - 2) {
                nearest = items.length - 1;
            } else {
                let min = Infinity;
                items.forEach((el, i) => {
                    const d = Math.abs(el.getBoundingClientRect().left - snap);
                    if (d < min) {
                        min = d;
                        nearest = i;
                    }
                });
            }
            setActive(nearest);

            // Fully visible slides (so every card you can see counts up, e.g. two on tablets)
            setVisible(
                items.map((el) => {
                    const r = el.getBoundingClientRect();
                    return r.left >= box.left - 2 && r.right <= box.right + 2;
                }),
            );
        };

        update();
        track.addEventListener("scroll", update, { passive: true });
        window.addEventListener("resize", update);
        return () => {
            track.removeEventListener("scroll", update);
            window.removeEventListener("resize", update);
        };
    }, []);

    const goTo = (i: number) => {
        const track = trackRef.current;
        const slide = track?.children[i] as HTMLElement | undefined;
        if (!track || !slide) return;
        const offset = slide.getBoundingClientRect().left - track.getBoundingClientRect().left - snapOffset(track);
        track.scrollTo({ left: track.scrollLeft + offset, behavior: "smooth" });
    };

    return (
        <>
            <div ref={trackRef} className={styles.grid}>
                {slides.map((slide, i) => (
                    <div key={i} className={styles.slide}>
                        <CarouselSlideContext.Provider value={{ active: visible[i] ?? true }}>
                            {slide}
                        </CarouselSlideContext.Provider>
                    </div>
                ))}
            </div>

            <div className={styles.dots} role="tablist" aria-label="Case studies">
                {slides.map((_, i) => (
                    <button
                        key={i}
                        type="button"
                        role="tab"
                        aria-selected={i === active}
                        aria-label={`Show case study ${i + 1}`}
                        className={cn(styles.dot, i === active && styles.dotActive)}
                        onClick={() => goTo(i)}
                    />
                ))}
            </div>
        </>
    );
}

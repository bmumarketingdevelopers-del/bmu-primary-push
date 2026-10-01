"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "./section-heading";
import { Reveal } from "./reveal";
import { ServiceIcon } from "./service-icon";
import { SERVICE_DETAILS } from "@/lib/services-data";
import { cn } from "@/lib/utils";
import styles from "./services.module.css";


const DESKTOP_QUERY = "(min-width: 1280px)";
const DRAG_THRESHOLD = 5;

function getCards(carousel: HTMLElement) {
  return carousel.querySelectorAll<HTMLElement>(`.${styles.cardWrapper}`);
}

// Cards snap to the start on mobile and to the center on tablet (see CSS)
function isStartAligned(card: HTMLElement) {
  return getComputedStyle(card).scrollSnapAlign.includes("start");
}

// Where a card's left edge must sit (relative to the carousel) to be "active"
function getSnapOffset(carousel: HTMLElement, card: HTMLElement) {
  if (isStartAligned(card)) {
    return parseFloat(getComputedStyle(carousel).scrollPaddingLeft) || 0;
  }

  return (carousel.clientWidth - card.offsetWidth) / 2;
}

// Index of the card sitting closest to its snap position
function getClosestIndex(carousel: HTMLElement) {
  const cards = getCards(carousel);

  if (!cards.length) return 0;

  // At the very end the last cards can't reach the start position
  const maxScroll = carousel.scrollWidth - carousel.clientWidth;

  if (carousel.scrollLeft >= maxScroll - 2) return cards.length - 1;

  const carouselLeft = carousel.getBoundingClientRect().left;
  const snapOffset = getSnapOffset(carousel, cards[0]);

  let closest = 0;
  let minDistance = Infinity;

  cards.forEach((card, i) => {
    const left = card.getBoundingClientRect().left - carouselLeft;
    const distance = Math.abs(left - snapOffset);

    if (distance < minDistance) {
      minDistance = distance;
      closest = i;
    }
  });

  return closest;
}

export function Services({ heading = true }: { heading?: boolean }) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const drag = useRef({
    active: false,
    moved: false,
    startX: 0,
    startScroll: 0,
  });

  useEffect(() => {
    const carousel = carouselRef.current;

    if (!carousel) return;

    const handleScroll = () => {
      setActiveIndex(getClosestIndex(carousel));
    };

    carousel.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      carousel.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const goToSlide = (index: number) => {
    const carousel = carouselRef.current;

    if (!carousel) return;

    const card = getCards(carousel)[index];

    if (!card) return;

    // Scroll so the target card sits at its snap position
    const carouselLeft = carousel.getBoundingClientRect().left;
    const cardLeft = card.getBoundingClientRect().left - carouselLeft;

    carousel.scrollTo({
      left:
        carousel.scrollLeft +
        cardLeft -
        getSnapOffset(carousel, card),
      behavior: "smooth",
    });

    setActiveIndex(index);
  };

  /* Mouse drag-to-swipe (touch devices already scroll natively) */

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const carousel = carouselRef.current;

    if (
      !carousel ||
      e.pointerType !== "mouse" ||
      e.button !== 0 ||
      window.matchMedia(DESKTOP_QUERY).matches
    ) {
      return;
    }

    drag.current = {
      active: true,
      moved: false,
      startX: e.clientX,
      startScroll: carousel.scrollLeft,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const carousel = carouselRef.current;
    const state = drag.current;

    if (!carousel || !state.active) return;

    const dx = e.clientX - state.startX;

    if (!state.moved && Math.abs(dx) > DRAG_THRESHOLD) {
      state.moved = true;
      carousel.classList.add(styles.dragging);
      carousel.setPointerCapture(e.pointerId);
    }

    if (state.moved) {
      carousel.scrollLeft = state.startScroll - dx;
    }
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const carousel = carouselRef.current;
    const state = drag.current;

    if (!carousel || !state.active) return;

    state.active = false;

    if (carousel.hasPointerCapture(e.pointerId)) {
      carousel.releasePointerCapture(e.pointerId);
    }

    if (state.moved) {
      carousel.classList.remove(styles.dragging);
      goToSlide(getClosestIndex(carousel));
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
              lede="Eight practice areas that plug into each other. Most clients start with one and add the rest as results compound."
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

        <div className={styles.carousel}>
          <div
            ref={carouselRef}
            className={styles.grid}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onClickCapture={handleClickCapture}
            onDragStart={(e) => e.preventDefault()}
          >
            {SERVICE_DETAILS.map((s, i) => (
              <div
                key={s.slug}
                className={styles.cardWrapper}
              >
                <Reveal
                  delay={(i % 4) * 0.07}
                  className={styles.reveal}
                >
                  <Link
                    href={`/services/${s.slug}`}
                    className={styles.card}
                  >
                    <span className={styles.accent} />

                    <div className={styles.iconWrap}>
                      <ServiceIcon
                        name={s.icon}
                        slug={s.slug}
                        className={styles.icon}
                      />
                    </div>

                    <h3
                      className={cn(
                        "display",
                        styles.title
                      )}
                    >
                      {s.title}
                    </h3>

                    <p className={styles.summary}>
                      {s.summary}
                    </p>

                    <p className={styles.more}>
                      Explore{" "}
                      <span className={styles.arrow}>
                        →
                      </span>
                    </p>
                  </Link>
                </Reveal>
              </div>
            ))}
          </div>

          {/* Mobile slide indicators */}
          <div className={styles.dots}>
            {SERVICE_DETAILS.map((s, i) => (
              <button
                key={s.slug}
                type="button"
                aria-label={`Go to service ${i + 1}`}
                aria-current={
                  activeIndex === i ? "true" : undefined
                }
                className={cn(
                  styles.dot,
                  activeIndex === i &&
                  styles.activeDot
                )}
                onClick={() => goToSlide(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

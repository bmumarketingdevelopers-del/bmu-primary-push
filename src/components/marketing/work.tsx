"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { SectionHeading } from "./section-heading";
import { Reveal } from "./reveal";
import { WORK } from "@/lib/content";
import { cn } from "@/lib/utils";
import styles from "./work.module.css";

const CATEGORIES = [
  "All",
  ...Array.from(
    new Set(WORK.map((w) => w.category))
  ),
];

export function Work({
  heading = true,
  limit,
}: {
  heading?: boolean;
  limit?: number;
}) {
  const [active, setActive] =
    React.useState("All");

  const [activeIndex, setActiveIndex] =
    React.useState(0);

  /*
   * Filter projects based on selected category.
   */
  const filtered =
    active === "All"
      ? WORK
      : WORK.filter(
        (w) => w.category === active
      );

  /*
   * Limit number of cards if required.
   */
  const visible = limit
    ? filtered.slice(0, limit)
    : filtered;

  /*
   * Reset carousel when category changes.
   */
  React.useEffect(() => {
    setActiveIndex(0);
  }, [active]);

  /*
   * =========================================================
   * AUTOMATIC CAROUSEL
   * =========================================================
   *
   * The carousel keeps moving automatically.
   *
   * It does NOT pause when:
   * - user hovers
   * - user touches
   * - user swipes
   *
   * Every 4 seconds it moves to the next card.
   */
  React.useEffect(() => {
    if (visible.length <= 1) {
      return;
    }

    const timer =
      window.setInterval(() => {
        setActiveIndex(
          (current) =>
            (current + 1) %
            visible.length
        );
      }, 4000);

    return () => {
      window.clearInterval(timer);
    };
  }, [visible.length]);

  /*
   * =========================================================
   * NEXT
   * =========================================================
   */
  const next = React.useCallback(() => {
    if (visible.length <= 1) return;

    setActiveIndex(
      (current) =>
        (current + 1) %
        visible.length
    );
  }, [visible.length]);

  /*
   * =========================================================
   * PREVIOUS
   * =========================================================
   */
  const previous =
    React.useCallback(() => {
      if (visible.length <= 1) return;

      setActiveIndex(
        (current) =>
          (current -
            1 +
            visible.length) %
          visible.length
      );
    }, [visible.length]);

  /*
   * =========================================================
   * RELATIVE CARD POSITION
   * =========================================================
   *
   * Example with 9 cards:
   *
   *             -4
   *        -3         -2
   *     -1     CENTER      +1
   *        +2         +3
   *             +4
   *
   * 0 = center
   * -1 = left
   * +1 = right
   */
  const getRelativePosition = React.useCallback(
    (index: number) => {
      if (visible.length === 0) {
        return 0;
      }

      let position =
        index - activeIndex;

      const half = Math.floor(
        visible.length / 2
      );

      if (position > half) {
        position -= visible.length;
      }

      if (position < -half) {
        position += visible.length;
      }

      return position;
    },
    [activeIndex, visible.length]
  );

  /*
   * =========================================================
   * CARD POSITION / APPEARANCE
   * =========================================================
   */
  const getCardStyle = (
    position: number
  ) => {
    /*
     * CENTER CARD
     */
    if (position === 0) {
      return {
        x: "0%",
        scale: 1,
        opacity: 1,
        zIndex: 50,
        rotateY: 0,
        filter: "brightness(1)",
      };
    }

    /*
     * IMMEDIATE LEFT CARD
     */
    if (position === -1) {
      return {
        x: "-72%",
        scale: 0.84,

        /*
         * Lower opacity so it doesn't
         * interfere with center card.
         */
        opacity: 0.35,

        zIndex: 40,
        rotateY: 0,
        filter:
          "brightness(0.55)",
      };
    }

    /*
     * IMMEDIATE RIGHT CARD
     */
    if (position === 1) {
      return {
        x: "72%",
        scale: 0.84,
        opacity: 0.35,
        zIndex: 40,
        rotateY: 0,
        filter:
          "brightness(0.55)",
      };
    }

    /*
     * SECOND LEFT CARD
     */
    if (position === -2) {
      return {
        x: "-132%",
        scale: 0.68,
        opacity: 0.12,
        zIndex: 30,
        rotateY: 0,
        filter:
          "brightness(0.45)",
      };
    }

    /*
     * SECOND RIGHT CARD
     */
    if (position === 2) {
      return {
        x: "132%",
        scale: 0.68,
        opacity: 0.12,
        zIndex: 30,
        rotateY: 0,
        filter:
          "brightness(0.45)",
      };
    }

    /*
     * ALL REMAINING CARDS
     *
     * They are technically still part of the
     * carousel but remain invisible.
     */
    return {
      x:
        position < 0
          ? "-155%"
          : "155%",
      scale: 0.55,
      opacity: 0,
      zIndex: 10,
      rotateY: 0,
      filter:
        "brightness(0.4)",
    };
  };

  /*
   * =========================================================
   * EMPTY STATE
   * =========================================================
   */
  if (visible.length === 0) {
    return null;
  }

  /*
   * =========================================================
   * SWIPE STATE
   * =========================================================
   */
  const handlePointerDown = (
    e: React.PointerEvent<HTMLDivElement>
  ) => {
    const target =
      e.currentTarget;

    target.dataset.startX =
      String(e.clientX);

    target.dataset.startY =
      String(e.clientY);
  };

  const handlePointerUp = (
    e: React.PointerEvent<HTMLDivElement>
  ) => {
    const target =
      e.currentTarget;

    const startX = Number(
      target.dataset.startX || 0
    );

    const startY = Number(
      target.dataset.startY || 0
    );

    const deltaX =
      e.clientX - startX;

    const deltaY =
      e.clientY - startY;

    delete target.dataset.startX;
    delete target.dataset.startY;

    /*
     * Ignore vertical movement.
     *
     * This is important because users should
     * still be able to scroll the webpage normally.
     */
    if (
      Math.abs(deltaY) >
      Math.abs(deltaX)
    ) {
      return;
    }

    /*
     * Minimum horizontal movement required
     * to count as a swipe.
     */
    const SWIPE_THRESHOLD = 50;

    /*
     * Swipe LEFT
     * → NEXT
     */
    if (
      deltaX <
      -SWIPE_THRESHOLD
    ) {
      next();
      return;
    }

    /*
     * Swipe RIGHT
     * → PREVIOUS
     */
    if (
      deltaX >
      SWIPE_THRESHOLD
    ) {
      previous();
    }
  };

  return (
    <section
      id="work"
      className={cn(
        "section",
        styles.work
      )}
    >
      <div className="container">

        {/* =================================================
            SECTION HEADING
            ================================================= */}

        {heading && (
          <Reveal>
            <SectionHeading
              className={styles.heading}
              eyebrow="Portfolio"
              title="Recent work"
              lede="Websites, brand systems, drone films, apps and AI creative. Filter by what you need built."
              action={
                <Button
                  asChild
                  variant="outline"
                >
                  <Link href="/portfolio">
                    Full portfolio <ArrowRight />
                  </Link>
                </Button>
              }
            />
          </Reveal>
        )}

        {/* =================================================
            CATEGORY FILTERS
            ================================================= */}

        <div
          className={styles.filters}
        >
          {CATEGORIES.map(
            (category) => (
              <button
                key={category}
                type="button"
                onClick={() =>
                  setActive(category)
                }
                aria-pressed={
                  active === category
                }
                className={cn(
                  styles.filter,
                  active === category
                    ? styles.filterActive
                    : styles.filterIdle
                )}
              >
                {category}
              </button>
            )
          )}
        </div>

        {/* =================================================
            CAROUSEL
            ================================================= */}

        <div
          className={
            styles.carouselWrapper
          }

          /*
           * Swipe detection.
           *
           * We intentionally do NOT pause
           * automatic rotation here.
           */
          onPointerDown={
            handlePointerDown
          }

          onPointerUp={
            handlePointerUp
          }
        >
          {/* =================================================
              CARDS
              ================================================= */}

          <div
            className={styles.carousel}
          >
            <AnimatePresence
              initial={false}
            >
              {visible.map(
                (w, index) => {
                  const position =
                    getRelativePosition(
                      index
                    );

                  const cardStyle =
                    getCardStyle(
                      position
                    );

                  return (
                    <motion.article
                      key={`${w.title}-${index}`}

                      className={cn(
                        styles.card,
                        position === 0 &&
                        styles.cardActive,
                        position !== 0 &&
                        styles.cardSide
                      )}

                      initial={false}

                      animate={
                        cardStyle
                      }

                      transition={{
                        duration: 0.7,
                        ease: [
                          0.22,
                          1,
                          0.36,
                          1,
                        ],
                      }}

                      /*
                       * Clicking a side card
                       * brings it to the center.
                       */
                      onClick={() => {
                        if (
                          position !==
                          0
                        ) {
                          setActiveIndex(
                            index
                          );
                        }
                      }}
                    >
                      {/* PROJECT ART — same green gradient on every card */}

                      <span
                        className={
                          styles.art
                        }
                      />

                      {/* DARK OVERLAY */}

                      <span
                        className={
                          styles.shade
                        }
                      />

                      {/* CARD CONTENT */}

                      <div
                        className={
                          styles.caption
                        }
                      >
                        <p
                          className={
                            styles.category
                          }
                        >
                          {
                            w.category
                          }
                        </p>

                        <h3
                          className={cn(
                            "display",
                            styles.title
                          )}
                        >
                          {w.title}
                        </h3>

                        <p
                          className={
                            styles.summary
                          }
                        >
                          {w.summary}
                        </p>
                      </div>
                    </motion.article>
                  );
                }
              )}
            </AnimatePresence>
          </div>

          {/* =================================================
              LEFT ARROW
              ================================================= */}

          <button
            type="button"
            className={cn(
              styles.navigationButton,
              styles.navigationLeft
            )}

            /*
             * Prevent arrow interaction from
             * being interpreted as a swipe.
             */
            onPointerDown={(e) =>
              e.stopPropagation()
            }

            onPointerUp={(e) =>
              e.stopPropagation()
            }

            onClick={(e) => {
              e.stopPropagation();
              previous();
            }}

            aria-label="Previous project"
          >
            <ArrowLeft
              size={20}
            />
          </button>

          {/* =================================================
              RIGHT ARROW
              ================================================= */}

          <button
            type="button"
            className={cn(
              styles.navigationButton,
              styles.navigationRight
            )}

            onPointerDown={(e) =>
              e.stopPropagation()
            }

            onPointerUp={(e) =>
              e.stopPropagation()
            }

            onClick={(e) => {
              e.stopPropagation();
              next();
            }}

            aria-label="Next project"
          >
            <ArrowRight
              size={20}
            />
          </button>
        </div>

        {/* =================================================
            DOTS
            ================================================= */}

        <div
          className={styles.dots}
        >
          {visible.map(
            (_, index) => (
              <button
                key={index}
                type="button"

                aria-label={`Go to project ${index + 1
                  }`}

                className={cn(
                  styles.dot,
                  index ===
                  activeIndex &&
                  styles.dotActive
                )}

                onClick={() =>
                  setActiveIndex(
                    index
                  )
                }
              />
            )
          )}
        </div>
      </div>
    </section>
  );
}

"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import styles from "./page.module.css";

/**
 * Scroll reveal for the industry pages. Same props as the shared marketing `Reveal`, but it
 * replays: the block fades and slides up whenever it comes into view, and resets once it has
 * fully left the screen. Cards and rows inside it then follow one after another (the stagger is
 * in page.module.css, .reveal / .revealIn). The hero is not wrapped, so it stays static.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [inView, setInView] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // In view once its top is 40px inside the screen; reset only after it has fully left
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      rootMargin: "0px 0px -40px",
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(styles.reveal, inView && styles.revealIn, className)}
      style={{ "--reveal-delay": `${delay}s` } as React.CSSProperties}
    >
      {children}
    </div>
  );
}

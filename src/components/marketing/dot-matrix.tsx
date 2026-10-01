"use client";

import * as React from "react";
import styles from "./dot-matrix.module.css";

/**
 * Signature element: a dot matrix that ties the three things this brand is
 * made of — Zen Dots (the display face), QR modules (the flagship product)
 * and data points (what the agency actually sells).
 */
export function DotMatrix() {
  const ref = React.useRef<HTMLCanvasElement | null>(null);

  React.useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const N = 26;
    const S = canvas.width / N;
    const R = 3.4;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let t = 0;
    let mx = -999;
    let my = -999;
    let raf = 0;

    const finders: [number, number][] = [
      [2, 2],
      [19, 2],
      [2, 19],
    ];
    const inFinder = (i: number, j: number) =>
      finders.some(([fi, fj]) => {
        const di = i - fi;
        const dj = j - fj;
        if (di < 0 || dj < 0 || di > 4 || dj > 4) return false;
        const edge = di === 0 || dj === 0 || di === 4 || dj === 4;
        const core = di === 2 && dj === 2;
        return edge || core;
      });

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mx = ((e.clientX - r.left) / r.width) * canvas.width;
      my = ((e.clientY - r.top) / r.height) * canvas.height;
    };
    const onLeave = () => {
      mx = -999;
      my = -999;
    };

    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);

    const frame = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
          const px = i * S + S / 2;
          const py = j * S + S / 2;
          const wave = Math.sin(i * 0.42 + j * 0.3 - t) * 0.5 + 0.5;
          const d = Math.hypot(px - mx, py - my);
          const near = Math.max(0, 1 - d / 300);
          const marker = inFinder(i, j);

          const r = R * (0.7 + wave * 0.45) + near * 3.4 + (marker ? 1.9 : 0);
          const a = 0.1 + wave * 0.16 + near * 0.55 + (marker ? 0.34 : 0);
          const green = marker || near > 0.28 || wave > 0.88;

          ctx.beginPath();
          ctx.arc(px, py, r, 0, Math.PI * 2);
          ctx.fillStyle = green
            ? `rgba(139,183,44,${Math.min(a + 0.14, 1)})`
            : `rgba(255,255,255,${a})`;
          ctx.fill();
        }
      }
      if (!reduce) {
        t += 0.022;
        raf = requestAnimationFrame(frame);
      }
    };
    frame();

    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={ref} width={1040} height={1040} aria-hidden className={styles.canvas} />;
}

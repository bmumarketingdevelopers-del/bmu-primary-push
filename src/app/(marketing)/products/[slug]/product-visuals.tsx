import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProductExtras } from "./product-extras";
import styles from "./page.module.css";

/* ---- Hero: "Where your scans go" dashboard card */

// Point on a circle, 0° = top, clockwise
function polar(cx: number, cy: number, r: number, deg: number) {
  const a = ((deg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as const;
}

function arc(cx: number, cy: number, r: number, from: number, to: number) {
  const [x1, y1] = polar(cx, cy, r, from);
  const [x2, y2] = polar(cx, cy, r, to);
  return `M${x1.toFixed(2)} ${y1.toFixed(2)} A${r} ${r} 0 0 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`;
}

/** Grey ring with four clusters of striped segments (top, right, bottom, left), as in the design. */
function Donut({ colors, total, label }: { colors: string[]; total: string; label: string }) {
  const c = 100;
  const r = 78;
  const stripe = 6.5;
  const gap = 1.5;
  const span = colors.length * stripe + (colors.length - 1) * gap;
  return (
    <div className={styles.donut}>
      <svg viewBox="0 0 200 200" aria-hidden="true">
        <circle cx={c} cy={c} r={r} fill="none" stroke="rgb(255 255 255 / 0.12)" strokeWidth="18" />
        {[0, 90, 180, 270].map((centre) =>
          colors.map((color, i) => {
            const start = centre - span / 2 + i * (stripe + gap);
            return (
              <path
                key={`${centre}-${i}`}
                d={arc(c, c, r, start, start + stripe)}
                fill="none"
                stroke={color}
                strokeWidth="18"
              />
            );
          }),
        )}
      </svg>
      <div className={styles.donutCenter}>
        <span className={cn("display", styles.donutTotal)}>{total}</span>
        <span className={styles.donutLabel}>{label}</span>
      </div>
    </div>
  );
}

export function QrDashboard({ data }: { data: NonNullable<ProductExtras["dashboard"]> }) {
  return (
    <div className={styles.dash}>
      <div className={styles.dashCard}>
        <div className={styles.dashHead}>
          <div>
            <p className={styles.dashTitle}>{data.title}</p>
            <p className={styles.dashSub}>{data.subtitle}</p>
          </div>
          <span className={styles.livePill}>
            <span className={styles.liveDot} aria-hidden="true" /> Live
          </span>
        </div>

        <div className={styles.dashBody}>
          <Donut colors={data.rows.map((r) => r.color)} total={data.total} label={data.totalLabel} />
          <ul className={styles.dashRows}>
            {data.rows.map((r) => (
              <li key={r.label} className={styles.dashRow}>
                <span className={styles.dashSwatch} style={{ backgroundColor: r.color }} aria-hidden="true" />
                <span className={styles.dashRowLabel}>{r.label}</span>
                <span className={styles.dashRowValue}>{r.percent}%</span>
                <span className={styles.dashBar} aria-hidden="true">
                  <span style={{ width: `${(r.percent / data.rows[0].percent) * 100}%`, backgroundColor: r.color }} />
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.feed}>
          <p className={styles.feedLabel}>Live feed</p>
          <ul>
            {data.feed.map((f, i) => (
              <li key={f.label} className={styles.feedRow}>
                <span className={cn(styles.feedDot, i === 0 && styles.feedDotNew)} aria-hidden="true" />
                <span className={styles.feedName}>{f.label}</span>
                <span className={styles.feedWhere}>{f.where}</span>
                <span className={styles.feedWhen}>{f.when}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={styles.toast}>
        <span className={styles.toastIcon} aria-hidden="true">
          <RefreshCw />
        </span>
        <span>
          <span className={styles.toastTitle}>{data.toast.title}</span>
          <span className={styles.toastBody}>{data.toast.body}</span>
        </span>
      </div>
    </div>
  );
}

/* ---- "How it works": phone in the middle, destinations either side, dashed links.
   Drawing coordinates (viewBox 1103 x 668) are traced from the design; the cards are
   HTML placed at matching percentages in page.module.css (.howCard_*). */

export function HowDiagram({ data }: { data: NonNullable<ProductExtras["how"]> }) {
  const cards = [
    ...data.left.map((c, i) => ({ ...c, pos: `l${i}` })),
    ...data.right.map((c, i) => ({ ...c, pos: `r${i}` })),
  ];
  return (
    <div className={styles.howPanel}>
      <div className={styles.howStage}>
        <svg className={styles.howLinks} viewBox="0 0 1103 668" aria-hidden="true">
          <defs>
            <pattern id="howDots" width="34" height="34" patternUnits="userSpaceOnUse">
              <circle cx="17" cy="17" r="1.6" fill="hsl(var(--border))" />
            </pattern>
          </defs>
          <rect width="1103" height="668" fill="url(#howDots)" />
          <g fill="none" stroke="hsl(var(--primary))" strokeWidth="3" strokeDasharray="7 8" strokeLinecap="round">
            <path d="M378 140 C450 150 455 320 485 330" />
            <path d="M378 320 L485 330" />
            <path d="M378 500 C450 490 455 345 485 340" />
            <path d="M725 140 C653 150 648 320 618 330" />
            <path d="M725 320 L618 330" />
            <path d="M725 500 C653 490 648 345 618 340" />
          </g>
          <g fill="hsl(var(--primary))">
            <circle cx="378" cy="140" r="6" />
            <circle cx="378" cy="320" r="6" />
            <circle cx="378" cy="500" r="6" />
            <circle cx="725" cy="140" r="6" />
            <circle cx="725" cy="320" r="6" />
            <circle cx="725" cy="500" r="6" />
          </g>
        </svg>

        <div className={styles.howHalo} aria-hidden="true" />
        <div className={styles.phone} aria-hidden="true">
          <span className={styles.phoneNotch} />
          <span className={styles.phoneFrame}>
            <span className={styles.phoneScan} />
          </span>
          <span className={styles.phoneText}>Scanning...</span>
          <span className={styles.phoneBar}>
            <span />
          </span>
        </div>
        <span className={styles.switchPill}>Switch anytime</span>
      </div>

      {/* phones/tablets only: dashed lines branching from "Switch anytime" down to the two card columns */}
      <svg className={styles.howBranch} viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">
        <g
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          vectorEffect="non-scaling-stroke"
        >
          <path d="M50 0 C50 22 25 16 25 40" vectorEffect="non-scaling-stroke" />
          <path d="M50 0 C50 22 75 16 75 40" vectorEffect="non-scaling-stroke" />
        </g>
      </svg>

      <ul className={styles.howCards}>
        {cards.map(({ title, body, Icon, pos }) => (
          <li key={title} className={cn(styles.howCard, styles[`howCard_${pos}`])}>
            <span className={styles.howIcon} aria-hidden="true">
              <Icon />
            </span>
            <span>
              <span className={styles.howCardTitle}>{title}</span>
              <span className={styles.howCardBody}>{body}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

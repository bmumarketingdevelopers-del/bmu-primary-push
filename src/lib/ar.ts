/**
 * Image-tracked WebAR.
 *
 * The customer points their phone camera at printed material — a flyer, a
 * visiting card, a menu — and video plays locked to the print, tracking as
 * they move. It runs in the browser camera with no app install, which is the
 * only version an SMB's customer will actually use.
 *
 * Engine is MindAR: open source, browser-based, no per-scan licence fee.
 * The paid alternatives (8th Wall, DEVAR) track better on difficult targets
 * but charge per view, which doesn't survive a ₹1,499 subscription.
 */

export type ArContentType = "VIDEO" | "IMAGE" | "MODEL";

export const AR_CONTENT: Record<ArContentType, { label: string; note: string; accept: string }> = {
  VIDEO: {
    label: "Video",
    note: "Plays over the print and tracks with it. Keep it under 15 seconds and under 5MB.",
    accept: "video/mp4",
  },
  IMAGE: {
    label: "Image",
    note: "A still overlay — an offer, a price list, a photo the print doesn't have room for.",
    accept: "image/*",
  },
  MODEL: {
    label: "3D model",
    note: "A .glb model standing on the print. Heavier to load; use for products, not decoration.",
    accept: ".glb,.gltf",
  },
};

/**
 * Whether an image will track well.
 *
 * Weights are deliberately harsh. Being wrong in the permissive direction
 * means someone prints five thousand flyers that don't work; being wrong in
 * the strict direction means they change a design before printing. The second
 * mistake costs an afternoon, the first costs the print run.
 *
 * This is the thing that decides if the feature works, and it's decided at
 * design time rather than in code. Tracking finds distinctive feature points;
 * flat colour, large blank areas and repeated patterns give it nothing to
 * hold on to, so the overlay drifts or drops.
 *
 * Warning the designer before printing 5,000 flyers is worth more than any
 * amount of tuning afterwards.
 */
export type TargetAdvice = {
  score: number;
  verdict: "GOOD" | "USABLE" | "POOR";
  reasons: string[];
};

export function adviseTarget(stats: {
  /** Distinct feature points the compiler found. */
  featurePoints: number;
  /** Share of the image that is one flat colour, 0-1. */
  flatAreaRatio: number;
  /** Whether the artwork repeats a pattern. */
  hasRepeatingPattern: boolean;
  widthPx: number;
  heightPx: number;
}): TargetAdvice {
  const reasons: string[] = [];
  let score = 100;

  if (stats.featurePoints < 150) {
    score -= 45;
    reasons.push("Too few distinctive details. Add texture, a photograph, or varied artwork.");
  } else if (stats.featurePoints < 350) {
    score -= 30;
    reasons.push("Tracking will work but may drift when the phone is at an angle.");
  }

  if (stats.flatAreaRatio > 0.6) {
    score -= 25;
    reasons.push("Mostly flat colour. Large plain areas give the camera nothing to lock on to.");
  }

  if (stats.hasRepeatingPattern) {
    score -= 35;
    reasons.push("Repeating pattern — the camera can't tell one repeat from another, so the overlay jumps.");
  }

  const shortest = Math.min(stats.widthPx, stats.heightPx);
  if (shortest < 500) {
    score -= 30;
    reasons.push("Low resolution. Upload at least 800px on the shorter side.");
  }

  score = Math.max(0, score);

  return {
    score,
    verdict: score >= 75 ? "GOOD" : score >= 45 ? "USABLE" : "POOR",
    reasons,
  };
}

export const VERDICT_COPY: Record<TargetAdvice["verdict"], string> = {
  GOOD: "Tracks well. Safe to print.",
  USABLE: "Will work, but expect some drift when the phone is at an angle.",
  POOR: "Won't track reliably. Change the artwork before printing.",
};

/** Public URL a printed AR marker points at. */
export function arUrl(slug: string) {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return `${base}/ar/${slug}`;
}

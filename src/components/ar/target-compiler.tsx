"use client";

import * as React from "react";
import {
  AlertTriangle, CheckCircle2, ImageUp, Loader2, RotateCcw, Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { adviseTarget, VERDICT_COPY, type TargetAdvice } from "@/lib/ar";
import { cn } from "@/lib/utils";
import styles from "./target-compiler.module.css";

/**
 * Compiles printed artwork into a tracking target.
 *
 * This runs entirely in the browser. MindAR's compiler is CPU-heavy and
 * produces a binary that only the viewer reads — pushing the image to a
 * server, running it there, and sending the result back would add an image
 * pipeline, a queue and a failure mode, for no benefit. The owner's laptop
 * does the work in about twenty seconds.
 *
 * The quality analysis runs first and deliberately gates the upload. Telling
 * someone their artwork won't track *after* they've printed five thousand
 * flyers is worthless.
 */

type Stage = "idle" | "analysing" | "ready" | "compiling" | "uploading" | "done" | "failed";

export function ArTargetCompiler({
  experienceSlug,
  onCompiled,
}: {
  experienceSlug: string;
  /** Called with the stored .mind URL and the quality score. */
  onCompiled?: (mindUrl: string, quality: number) => void;
}) {
  const fileRef = React.useRef<HTMLInputElement>(null);
  const [stage, setStage] = React.useState<Stage>("idle");
  const [progress, setProgress] = React.useState(0);
  const [preview, setPreview] = React.useState<string | null>(null);
  const [advice, setAdvice] = React.useState<TargetAdvice | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [file, setFile] = React.useState<File | null>(null);

  async function onPick(picked: File) {
    setError(null);
    setStage("analysing");
    setFile(picked);
    setPreview(URL.createObjectURL(picked));

    try {
      const image = await loadImage(picked);
      const stats = analyseImage(image);
      setAdvice(adviseTarget(stats));
      setStage("ready");
    } catch (err) {
      console.error("[ar] analysis failed:", err);
      setError("Couldn't read that image. Try a JPG or PNG.");
      setStage("failed");
    }
  }

  async function compile() {
    if (!file) return;

    setStage("compiling");
    setProgress(0);
    setError(null);

    try {
      await loadScript(
        "https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image.prod.js"
      );

      const CompilerCtor = (window as unknown as {
        MINDAR?: { IMAGE?: { Compiler?: new () => MindCompiler } };
      }).MINDAR?.IMAGE?.Compiler;

      if (!CompilerCtor) {
        setError("The compiler didn't load. Check your connection and try again.");
        setStage("failed");
        return;
      }

      const image = await loadImage(file);
      const compiler = new CompilerCtor();

      await compiler.compileImageTargets([image], (p: number) => {
        setProgress(Math.round(p));
      });

      const buffer = await compiler.exportData();

      setStage("uploading");
      const mindUrl = await uploadTarget(buffer, experienceSlug);

      if (!mindUrl) {
        setError("Compiled successfully, but storage isn't configured — nothing was saved.");
        setStage("failed");
        return;
      }

      setStage("done");
      onCompiled?.(mindUrl, advice?.score ?? 0);
    } catch (err) {
      console.error("[ar] compile failed:", err);
      setError("Compilation failed. A smaller image usually fixes it.");
      setStage("failed");
    }
  }

  function reset() {
    setStage("idle");
    setAdvice(null);
    setPreview(null);
    setFile(null);
    setError(null);
    setProgress(0);
  }

  const busy = stage === "compiling" || stage === "uploading" || stage === "analysing";

  return (
    <div className={styles.compiler}>
      {/* Picker */}
      {!preview && (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className={styles.picker}
        >
          <ImageUp className={styles.pickerIcon} strokeWidth={1.6} />
          <span className={styles.pickerTitle}>Upload the printed artwork</span>
          <span className={styles.pickerHint}>
            The exact design that goes to print. At least 800px on the shorter side.
          </span>
        </button>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png"
        hidden
        onChange={(e) => e.target.files?.[0] && onPick(e.target.files[0])}
      />

      {preview && (
        <div className={styles.previewGrid}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Artwork to be tracked"
            className={styles.previewImage}
          />

          <div className={styles.details}>
            {stage === "analysing" && (
              <p className={cn(styles.statusLine, styles.statusLineMuted)}>
                <Loader2 className={styles.spinner} /> Checking how well this will track…
              </p>
            )}

            {advice && (
              <>
                <div className={styles.panel}>
                  <div className={styles.qualityHeader}>
                    <span className={styles.qualityLabel}>Tracking quality</span>
                    <Badge
                      variant={
                        advice.verdict === "GOOD" ? "success"
                        : advice.verdict === "USABLE" ? "warning"
                        : "destructive"
                      }
                    >
                      {advice.score}/100
                    </Badge>
                  </div>
                  <Progress value={advice.score} />
                  <p
                    className={cn(
                      styles.verdict,
                      advice.verdict === "POOR" ? styles.verdictPoor : styles.verdictFine
                    )}
                  >
                    {VERDICT_COPY[advice.verdict]}
                  </p>
                </div>

                {advice.reasons.length > 0 && (
                  <ul className={styles.reasons}>
                    {advice.reasons.map((r) => (
                      <li key={r} className={styles.reason}>
                        <AlertTriangle className={styles.reasonIcon} />
                        {r}
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}

            {stage === "compiling" && (
              <div className={styles.panel}>
                <p className={styles.statusLine}>
                  <Loader2 className={styles.spinner} /> Compiling — {progress}%
                </p>
                <Progress value={progress} />
                <p className={styles.note}>
                  Runs on this device. Around twenty seconds; keep the tab open.
                </p>
              </div>
            )}

            {stage === "uploading" && (
              <p className={styles.statusLine}>
                <Loader2 className={styles.spinner} /> Saving the target…
              </p>
            )}

            {stage === "done" && (
              <p className={cn(styles.message, styles.messageOk)}>
                <CheckCircle2 className={styles.messageIcon} />
                Target ready. Point a camera at the print and it will track.
              </p>
            )}

            {error && (
              <p className={cn(styles.message, styles.messageError)}>
                <AlertTriangle className={styles.messageIcon} />
                {error}
              </p>
            )}

            <div className={styles.actions}>
              {stage === "ready" && (
                <Button
                  type="button"
                  onClick={compile}
                  variant={advice?.verdict === "POOR" ? "outline" : "default"}
                >
                  <Upload />
                  {advice?.verdict === "POOR" ? "Compile anyway" : "Compile target"}
                </Button>
              )}

              {!busy && (
                <Button type="button" variant="ghost" onClick={reset}>
                  <RotateCcw /> Different image
                </Button>
              )}
            </div>

            {advice?.verdict === "POOR" && stage === "ready" && (
              <p className={styles.note}>
                You can compile it, but it will drift and drop. Changing the artwork now costs
                nothing; changing it after a print run costs the print run.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------- internals ------------------------------ */

type MindCompiler = {
  compileImageTargets: (
    images: HTMLImageElement[],
    onProgress: (p: number) => void
  ) => Promise<unknown>;
  exportData: () => Promise<ArrayBuffer>;
};

const loadedScripts = new Set<string>();

function loadScript(src: string) {
  if (loadedScripts.has(src)) return Promise.resolve();

  return new Promise<void>((resolve, reject) => {
    const el = document.createElement("script");
    el.src = src;
    el.async = true;
    el.onload = () => {
      loadedScripts.add(src);
      resolve();
    };
    el.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(el);
  });
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not decode image"));
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Estimates trackability before compiling.
 *
 * This is not the same algorithm MindAR uses — it's a cheap proxy that
 * catches the two failures that actually happen in practice: artwork that is
 * mostly flat colour, and artwork that repeats. Both are decided by the
 * designer, and both are unfixable once printed.
 */
function analyseImage(img: HTMLImageElement) {
  const SAMPLE = 320;
  const canvas = document.createElement("canvas");
  const scale = SAMPLE / Math.max(img.width, img.height);

  canvas.width = Math.max(1, Math.round(img.width * scale));
  canvas.height = Math.max(1, Math.round(img.height * scale));

  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Canvas unavailable");

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  const { data, width, height } = ctx.getImageData(0, 0, canvas.width, canvas.height);

  const grey = new Uint8Array(width * height);
  for (let i = 0; i < grey.length; i++) {
    const p = i * 4;
    grey[i] = (data[p] * 0.299 + data[p + 1] * 0.587 + data[p + 2] * 0.114) | 0;
  }

  /**
   * Feature points: pixels where the local gradient is strong. Tracking
   * needs corners and edges; a flat region contributes nothing.
   */
  let strongEdges = 0;
  let flatPixels = 0;
  const EDGE_THRESHOLD = 28;

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const i = y * width + x;
      const gx = Math.abs(grey[i - 1] - grey[i + 1]);
      const gy = Math.abs(grey[i - width] - grey[i + width]);
      const magnitude = gx + gy;

      if (magnitude > EDGE_THRESHOLD) strongEdges++;
      else if (magnitude < 6) flatPixels++;
    }
  }

  const sampled = (width - 2) * (height - 2);

  /**
   * Repetition check: compare the left half against the right half and the
   * top against the bottom. A design that repeats scores similarly to itself
   * when shifted, and the tracker can't tell one repeat from another.
   */
  const hasRepeatingPattern =
    similarity(grey, width, height, "horizontal") > 0.92 ||
    similarity(grey, width, height, "vertical") > 0.92;

  return {
    // Scaled back toward the count a full-resolution compile would find.
    featurePoints: Math.round((strongEdges / sampled) * 2400),
    flatAreaRatio: flatPixels / sampled,
    hasRepeatingPattern,
    widthPx: img.width,
    heightPx: img.height,
  };
}

/** Rough self-similarity, 0-1, comparing one half against the other. */
function similarity(
  grey: Uint8Array,
  width: number,
  height: number,
  axis: "horizontal" | "vertical"
) {
  let matched = 0;
  let compared = 0;

  if (axis === "horizontal") {
    const half = Math.floor(width / 2);
    for (let y = 0; y < height; y += 2) {
      for (let x = 0; x < half; x += 2) {
        const a = grey[y * width + x];
        const b = grey[y * width + x + half];
        if (Math.abs(a - b) < 18) matched++;
        compared++;
      }
    }
  } else {
    const half = Math.floor(height / 2);
    for (let y = 0; y < half; y += 2) {
      for (let x = 0; x < width; x += 2) {
        const a = grey[y * width + x];
        const b = grey[(y + half) * width + x];
        if (Math.abs(a - b) < 18) matched++;
        compared++;
      }
    }
  }

  return compared ? matched / compared : 0;
}

/** Pushes the compiled binary to storage via the existing presign route. */
async function uploadTarget(buffer: ArrayBuffer, slug: string): Promise<string | null> {
  const filename = `${slug}-${Date.now()}.mind`;

  const res = await fetch("/api/uploads/presign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      filename,
      contentType: "application/octet-stream",
      size: buffer.byteLength,
    }),
  });

  const data = await res.json();
  if (!res.ok || data.configured === false) return null;

  const put = await fetch(data.uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": "application/octet-stream" },
    body: buffer,
  });

  return put.ok ? (data.publicUrl ?? null) : null;
}

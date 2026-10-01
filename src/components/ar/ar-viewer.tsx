"use client";

import * as React from "react";
import { AlertTriangle, Camera, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";
import styles from "./ar-viewer.module.css";

/**
 * The camera view.
 *
 * MindAR and three.js load from a CDN on mount rather than being bundled.
 * That's deliberate: the library is roughly 500KB, and bundling it would put
 * that weight on every route sharing a chunk with this one. Here it's paid
 * only by someone who has actually opened an AR experience — which keeps the
 * smart profile itself light.
 */

type Status =
  | "loading" | "requesting" | "scanning" | "found"
  | "denied" | "unsupported" | "failed";

export type ArExperienceView = {
  slug: string;
  name: string;
  businessName: string;
  targetMindUrl: string | null;
  contentUrl: string;
  contentType: string;
  contentRatio: number;
  loop: boolean;
  ctaLabel: string | null;
  ctaUrl: string | null;
};

export function ArViewer({ experience }: { experience: ArExperienceView }) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [status, setStatus] = React.useState<Status>("loading");
  const [muted, setMuted] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;
    let teardown: (() => void) | undefined;

    async function start() {
      if (typeof window === "undefined") return;

      /**
       * Camera access needs a secure context. Checking first turns a cryptic
       * getUserMedia error into a sentence someone can act on.
       */
      if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
        setStatus("unsupported");
        return;
      }

      if (!experience.targetMindUrl) {
        setStatus("failed");
        return;
      }

      try {
        await loadScript(
          "https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-three.prod.js"
        );
        if (cancelled) return;

        setStatus("requesting");

        const mindarNamespace = (window as unknown as {
          MINDAR?: { IMAGE?: { MindARThree?: new (o: unknown) => MindArInstance } };
        }).MINDAR;

        const MindARThree = mindarNamespace?.IMAGE?.MindARThree;
        if (!MindARThree) {
          setStatus("failed");
          return;
        }

        const mindar = new MindARThree({
          container: containerRef.current,
          imageTargetSrc: experience.targetMindUrl,
          uiScanning: "no",
          uiLoading: "no",
        });

        const anchor = mindar.addAnchor(0);
        const media = buildContent(experience, muted);
        if (media) anchor.group.add(media.object);

        anchor.onTargetFound = () => {
          setStatus("found");
          media?.play();
        };
        anchor.onTargetLost = () => {
          setStatus("scanning");
          media?.pause();
        };

        await mindar.start();
        if (cancelled) {
          mindar.stop();
          return;
        }

        setStatus("scanning");
        mindar.renderer.setAnimationLoop(() =>
          mindar.renderer.render(mindar.scene, mindar.camera)
        );

        teardown = () => {
          mindar.renderer.setAnimationLoop(null);
          mindar.stop();
          media?.dispose();
        };
      } catch (err) {
        if (cancelled) return;
        const name = (err as { name?: string })?.name;
        setStatus(name === "NotAllowedError" ? "denied" : "failed");
        console.error("[ar] failed to start:", err);
      }
    }

    start();

    return () => {
      cancelled = true;
      teardown?.();
    };
    // Rerunning on mute would tear down the camera; mute is set on the element.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [experience.targetMindUrl]);

  function toggleSound() {
    const video = document.getElementById("ar-video") as HTMLVideoElement | null;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  }

  return (
    <div className={styles.viewer}>
      <div ref={containerRef} className={styles.stage} />

      <header className={styles.header}>
        <p className={styles.businessName}>{experience.businessName}</p>
        <p className={styles.experienceName}>{experience.name}</p>
      </header>

      {status !== "found" && <Overlay status={status} />}

      {status === "found" && experience.contentType === "VIDEO" && (
        <button
          onClick={toggleSound}
          aria-label={muted ? "Turn sound on" : "Turn sound off"}
          className={styles.soundButton}
        >
          {muted ? <VolumeX className={styles.soundIcon} /> : <Volume2 className={styles.soundIcon} />}
        </button>
      )}

      {experience.ctaUrl && experience.ctaLabel && (
        <a
          href={experience.ctaUrl}
          className={styles.cta}
        >
          {experience.ctaLabel}
        </a>
      )}
    </div>
  );
}

/** Every failure state gets a sentence someone can act on. */
function Overlay({ status }: { status: Status }) {
  const COPY: Record<Status, { title: string; body: string; icon: typeof Camera }> = {
    loading: { title: "Getting ready", body: "Loading the experience.", icon: RotateCcw },
    requesting: {
      title: "Allow camera access",
      body: "Tap allow when your browser asks. Nothing is recorded or uploaded.",
      icon: Camera,
    },
    scanning: {
      title: "Point at the printed design",
      body: "Hold steady, fill the frame, keep it well lit.",
      icon: Camera,
    },
    found: { title: "", body: "", icon: Camera },
    denied: {
      title: "Camera blocked",
      body: "Allow camera access in your browser settings, then reload this page.",
      icon: AlertTriangle,
    },
    unsupported: {
      title: "Camera unavailable",
      body: "This needs a secure connection and a browser that can use the camera. Try Chrome or Safari.",
      icon: AlertTriangle,
    },
    failed: {
      title: "Couldn't start",
      body: "Something went wrong loading the experience. Reload and try again.",
      icon: AlertTriangle,
    },
  };

  const { title, body, icon: Icon } = COPY[status];
  if (!title) return null;

  const isError = status === "denied" || status === "unsupported" || status === "failed";

  return (
    <div className={styles.overlay}>
      <div className={styles.overlayCard}>
        <Icon
          className={cn(
            styles.overlayIcon,
            isError ? styles.overlayIconError : styles.overlayIconIdle,
            status === "loading" && styles.spinning
          )}
          strokeWidth={1.7}
        />
        <p className={styles.overlayTitle}>{title}</p>
        <p className={styles.overlayBody}>{body}</p>

        {status === "scanning" && (
          <div className={styles.scanFrame} />
        )}
      </div>
    </div>
  );
}

/* ------------------------------- internals ------------------------------ */

type MindArInstance = {
  renderer: {
    setAnimationLoop: (fn: (() => void) | null) => void;
    render: (scene: unknown, camera: unknown) => void;
  };
  scene: unknown;
  camera: unknown;
  addAnchor: (index: number) => {
    group: { add: (o: unknown) => void };
    onTargetFound?: () => void;
    onTargetLost?: () => void;
  };
  start: () => Promise<void>;
  stop: () => void;
};

type ThreeNamespace = Record<string, new (...args: unknown[]) => unknown>;

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

type ArMedia = {
  object: unknown;
  play: () => void;
  pause: () => void;
  dispose: () => void;
};

/**
 * Builds what sits on the target.
 *
 * Video starts muted because every mobile browser blocks autoplay with
 * sound. A silent video that plays beats a sound-on video that doesn't, and
 * the viewer can unmute in one tap.
 */
function buildContent(exp: ArExperienceView, muted: boolean): ArMedia | null {
  const THREE = (window as unknown as { THREE?: ThreeNamespace }).THREE;
  if (!THREE) return null;

  const geometry = new THREE.PlaneGeometry(1, exp.contentRatio);

  if (exp.contentType === "VIDEO") {
    const video = document.createElement("video");
    video.id = "ar-video";
    video.src = exp.contentUrl;
    video.loop = exp.loop;
    video.muted = muted;
    video.playsInline = true;
    video.crossOrigin = "anonymous";

    const texture = new THREE.VideoTexture(video);
    const material = new THREE.MeshBasicMaterial({ map: texture });

    return {
      object: new THREE.Mesh(geometry, material),
      play: () => void video.play().catch(() => undefined),
      pause: () => video.pause(),
      dispose: () => {
        video.pause();
        video.removeAttribute("src");
      },
    };
  }

  const loader = new THREE.TextureLoader() as { load: (u: string) => unknown };
  const material = new THREE.MeshBasicMaterial({
    map: loader.load(exp.contentUrl),
    transparent: true,
  });

  return {
    object: new THREE.Mesh(geometry, material),
    play: () => undefined,
    pause: () => undefined,
    dispose: () => undefined,
  };
}

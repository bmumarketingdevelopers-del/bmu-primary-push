"use client";

import { useEffect, useRef, useState } from "react";
import { BarChart3, PlayCircle, Search, Code2, Zap, PenTool, Sparkles, Building2 } from "lucide-react";
import type { IconName } from "@/lib/services-data";
import { cn } from "@/lib/utils";
import styles from "./service-icon.module.css";

export const SERVICE_ICONS = { BarChart3, PlayCircle, Search, Code2, Zap, PenTool, Sparkles, Building2 };

/*
 * Service icons are WEBP files in /public/images/services/<slug>.webp
 * (black line art). CSS turns them white in dark mode.
 * If a file is missing, the lucide icon above is shown instead.
 */
const IMAGE_DIR = "/images/services";

export function ServiceIcon({
  name,
  slug,
  className,
}: {
  name: IconName;
  slug?: string;
  className?: string;
}) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [failed, setFailed] = useState(false);

  // An <img> can fail before React hydrates and miss onError, so check once mounted
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, []);

  if (!slug || failed) {
    const Icon = SERVICE_ICONS[name];
    return <Icon className={className} strokeWidth={1.8} />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={imgRef}
      src={`${IMAGE_DIR}/${slug}.webp`}
      alt=""
      aria-hidden="true"
      decoding="async"
      draggable={false}
      className={cn(styles.img, className)}
      onError={() => setFailed(true)}
    />
  );
}

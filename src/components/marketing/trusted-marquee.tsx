import Image from "next/image";
import { cn } from "@/lib/utils";
import styles from "./trusted-marquee.module.css";

/**
 * Client logos (files in public/images/clients). `h` is each logo's display
 * height in px at desktop size, traced from the design so they look balanced;
 * `w`/`hSrc` are the files' own pixel sizes. `mono` logos are single dark colour,
 * so in dark mode they show white on hover instead of near-invisible black.
 */
const LOGOS = [
  { src: "/images/clients/quantela.png", alt: "Quantela", w: 588, hSrc: 112, h: 32, mono: true },
  { src: "/images/clients/medmidwest.png", alt: "MedMidwest", w: 333, hSrc: 130, h: 39 },
  { src: "/images/clients/micro-labs.png", alt: "Micro Labs", w: 433, hSrc: 110, h: 32 },
  { src: "/images/clients/corizo.png", alt: "Corizo", w: 344, hSrc: 104, h: 32 },
  { src: "/images/clients/miles.png", alt: "Miles", w: 404, hSrc: 102, h: 31, mono: true },
  { src: "/images/clients/medplus.png", alt: "MedPlus", w: 422, hSrc: 125, h: 37 },
  { src: "/images/clients/vetenza.png", alt: "Vetenza", w: 603, hSrc: 143, h: 30 },
];

// `names` is still accepted (the landing page passes the CMS list) but the strip now shows logos.
export function TrustedMarquee({ heading }: { heading?: string; names?: string[] }) {
  // Two copies side by side so the scroll loops seamlessly (animation unchanged).
  const row = [...LOGOS, ...LOGOS];
  return (
    <section className={styles.marquee}>
      <p className={styles.heading}>
        {heading ?? "Partnering with ambitious brands across diverse industries."}
      </p>
      <div className={styles.track}>
        {row.map((logo, i) => {
          const copy = i >= LOGOS.length;
          return (
            <span
              key={`${logo.alt}-${i}`}
              className={cn(styles.logo, logo.mono && styles.logoMono)}
              style={{ "--logo-h": `${logo.h}px` } as React.CSSProperties}
              aria-hidden={copy || undefined}
            >
              <Image src={logo.src} alt={copy ? "" : logo.alt} width={logo.w} height={logo.hSrc} />
            </span>
          );
        })}
      </div>
    </section>
  );
}

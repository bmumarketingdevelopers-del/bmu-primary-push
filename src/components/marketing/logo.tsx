import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import styles from "./logo.module.css";

// Both files are 556 × 233 transparent PNGs in public/images/brand
const WIDTH = 556;
const HEIGHT = 233;

/**
 * The BMU Marketing logo.
 *
 * - `onLight`: navy + green version, for light backgrounds
 * - `onDark`: off-white + green version, for dark backgrounds (footer, sidebars, header over the hero)
 * - `auto` (default): follows the site theme, navy in light mode and off-white in dark mode
 *
 * Height is set with the `--logo-h` CSS variable (default 40px); width follows the aspect ratio.
 */
export function Logo({
  className,
  href = "/",
  tone = "auto",
}: {
  className?: string;
  href?: string;
  tone?: "auto" | "onLight" | "onDark";
}) {
  const light = (
    <Image
      src="/images/brand/bmu-logo-light.png"
      alt="BMU Marketing"
      width={WIDTH}
      height={HEIGHT}
      priority
      className={cn(styles.img, tone === "auto" && styles.lightOnly)}
    />
  );
  const dark = (
    <Image
      src="/images/brand/bmu-logo-dark.png"
      alt="BMU Marketing"
      width={WIDTH}
      height={HEIGHT}
      priority
      className={cn(styles.img, tone === "auto" && styles.darkOnly)}
    />
  );

  return (
    <Link href={href} className={cn(styles.logo, className)}>
      {tone === "onLight" ? light : tone === "onDark" ? dark : <>{light}{dark}</>}
    </Link>
  );
}

import { clsx, type ClassValue } from "clsx";

/**
 * Joins class names, dropping falsy values. Conflicts between a component's
 * own classes and a `className` passed in are settled by cascade layers in
 * globals.css, not here.
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/** Paise -> ₹ display string. 3500000 -> "₹35,000" */
export function inr(paise: number, opts: { decimals?: boolean } = {}) {
  const rupees = paise / 100;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: opts.decimals ? 2 : 0,
  }).format(rupees);
}

/** 1240000 -> "12.4L", 38000000 -> "3.8Cr" */
export function compactInr(rupees: number) {
  if (rupees >= 1_00_00_000) return `₹${(rupees / 1_00_00_000).toFixed(1)}Cr`;
  if (rupees >= 1_00_000) return `₹${(rupees / 1_00_000).toFixed(1)}L`;
  if (rupees >= 1_000) return `₹${(rupees / 1_000).toFixed(0)}K`;
  return `₹${rupees}`;
}

export function compactNumber(n: number) {
  return new Intl.NumberFormat("en-IN", { notation: "compact" }).format(n);
}

export function formatDate(d: Date | string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(d));
}

export function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

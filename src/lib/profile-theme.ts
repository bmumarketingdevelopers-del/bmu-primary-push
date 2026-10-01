/**
 * Appearance system for the smart profile.
 *
 * Presets are a starting point, not a cage — every colour is fully editable
 * and every font is selectable. Where a choice can make the page unreadable
 * we warn with a measured contrast ratio rather than blocking it, because the
 * owner knows their brand and we don't.
 */

export type ThemeKey =
  | "signature" | "midnight" | "ivory" | "terracotta" | "forest" | "royal"
  | "rose" | "slate" | "sand" | "mono" | "ocean" | "plum" | "citrus"
  | "charcoal" | "mint" | "custom";

export type FontKey =
  | "albert" | "zen" | "playfair" | "space" | "poppins" | "dmserif"
  | "inter" | "outfit" | "sora" | "manrope" | "lora" | "bebas"
  | "cormorant" | "worksans" | "figtree" | "syne";

export type LayoutKey =
  | "classic" | "cover" | "minimal" | "card" | "spotlight"
  | "split" | "stack" | "gradient" | "editorial" | "grid3";

export type ButtonKey = "solid" | "soft" | "outline" | "glass" | "pill" | "square" | "raised";
export type MotionKey = "off" | "subtle" | "lively" | "cascade" | "zoom" | "slide";
export type CornerKey = "sharp" | "soft" | "round" | "pill";

export type ProfileTheme = {
  theme: ThemeKey;
  font: FontKey;
  headingFont?: FontKey;
  layout: LayoutKey;
  buttons: ButtonKey;
  motion: MotionKey;
  corners: CornerKey;
  /** Full custom colours. Any valid CSS colour. */
  accent?: string;
  bg?: string;
  surface?: string;
  text?: string;
  logoUrl?: string;
  coverUrl?: string;
  logoShape?: "circle" | "rounded" | "square";
};

export const DEFAULT_THEME: ProfileTheme = {
  theme: "signature",
  font: "albert",
  layout: "classic",
  buttons: "solid",
  motion: "subtle",
  corners: "soft",
  logoShape: "rounded",
};

export const THEMES: Record<
  ThemeKey,
  { label: string; accent: string; bg: string; surface: string; text: string; muted: string; onAccent: string }
> = {
  signature:  { label: "Signature green", accent: "#8BB72C", bg: "#F8F7F4", surface: "#FFFFFF", text: "#121F2F", muted: "#5C6874", onAccent: "#FFFFFF" },
  midnight:   { label: "Midnight",        accent: "#8BB72C", bg: "#121F2F", surface: "#1C2B3A", text: "#FFFFFF", muted: "#A9B6C2", onAccent: "#121F2F" },
  ivory:      { label: "Ivory & ink",     accent: "#121F2F", bg: "#FAF9F6", surface: "#FFFFFF", text: "#121F2F", muted: "#5C6874", onAccent: "#FFFFFF" },
  terracotta: { label: "Terracotta",      accent: "#C2410C", bg: "#FDF6F1", surface: "#FFFFFF", text: "#3B1F13", muted: "#7C5643", onAccent: "#FFFFFF" },
  forest:     { label: "Forest",          accent: "#0F766E", bg: "#F2F8F7", surface: "#FFFFFF", text: "#10312E", muted: "#4A6B68", onAccent: "#FFFFFF" },
  royal:      { label: "Royal blue",      accent: "#1D4ED8", bg: "#F5F7FE", surface: "#FFFFFF", text: "#111C3B", muted: "#54608A", onAccent: "#FFFFFF" },
  rose:       { label: "Rose",            accent: "#DB2777", bg: "#FDF4F8", surface: "#FFFFFF", text: "#3F1024", muted: "#7E4B62", onAccent: "#FFFFFF" },
  slate:      { label: "Slate",           accent: "#334155", bg: "#F6F7F9", surface: "#FFFFFF", text: "#1B222C", muted: "#5B6675", onAccent: "#FFFFFF" },
  sand:       { label: "Sand & gold",     accent: "#B45309", bg: "#FDF9F0", surface: "#FFFFFF", text: "#3A2A10", muted: "#7A6440", onAccent: "#FFFFFF" },
  mono:       { label: "Mono black",      accent: "#111111", bg: "#FFFFFF", surface: "#FAFAFA", text: "#111111", muted: "#666666", onAccent: "#FFFFFF" },
  ocean:      { label: "Ocean",           accent: "#0284C7", bg: "#F0F9FF", surface: "#FFFFFF", text: "#0C2A3D", muted: "#4A6E85", onAccent: "#FFFFFF" },
  plum:       { label: "Plum",            accent: "#7C3AED", bg: "#F8F5FF", surface: "#FFFFFF", text: "#26123F", muted: "#63527E", onAccent: "#FFFFFF" },
  citrus:     { label: "Citrus",          accent: "#EA580C", bg: "#FFF8F3", surface: "#FFFFFF", text: "#3D1D0A", muted: "#7F5539", onAccent: "#FFFFFF" },
  charcoal:   { label: "Charcoal dark",   accent: "#F5F5F5", bg: "#0B0B0C", surface: "#171719", text: "#F5F5F5", muted: "#A1A1A6", onAccent: "#0B0B0C" },
  mint:       { label: "Mint",            accent: "#059669", bg: "#F0FDF7", surface: "#FFFFFF", text: "#0A2B1F", muted: "#4C6F60", onAccent: "#FFFFFF" },
  custom:     { label: "Custom",          accent: "#8BB72C", bg: "#FFFFFF", surface: "#FAFAFA", text: "#111111", muted: "#666666", onAccent: "#FFFFFF" },
};

export const FONTS: Record<FontKey, { label: string; note: string; stack: string; category: "Sans" | "Serif" | "Display" }> = {
  albert:    { label: "Albert Sans",      note: "Clean and neutral. Safe anywhere.",         stack: "var(--font-sans)",      category: "Sans" },
  inter:     { label: "Inter",            note: "The web's workhorse. Very legible small.",  stack: "var(--font-inter)",     category: "Sans" },
  poppins:   { label: "Poppins",          note: "Rounded and friendly. Food and fitness.",   stack: "var(--font-poppins)",   category: "Sans" },
  outfit:    { label: "Outfit",           note: "Geometric and current. Startups.",          stack: "var(--font-outfit)",    category: "Sans" },
  manrope:   { label: "Manrope",          note: "Soft edges, quietly premium.",              stack: "var(--font-manrope)",   category: "Sans" },
  worksans:  { label: "Work Sans",        note: "Sturdy and plain. Trades and services.",    stack: "var(--font-worksans)",  category: "Sans" },
  figtree:   { label: "Figtree",          note: "Warm and open. Clinics and schools.",       stack: "var(--font-figtree)",   category: "Sans" },
  space:     { label: "Space Grotesk",    note: "Technical with character. Studios.",        stack: "var(--font-space)",     category: "Sans" },
  sora:      { label: "Sora",             note: "Confident and modern. Agencies.",           stack: "var(--font-sora)",      category: "Sans" },
  syne:      { label: "Syne",             note: "Unusual and bold. Creative work only.",     stack: "var(--font-syne)",      category: "Display" },
  playfair:  { label: "Playfair Display", note: "Editorial serif. Salons, jewellery.",       stack: "var(--font-playfair)",  category: "Serif" },
  dmserif:   { label: "DM Serif Display", note: "High contrast. Formal and confident.",      stack: "var(--font-dmserif)",   category: "Serif" },
  lora:      { label: "Lora",             note: "Readable serif. Long descriptions.",        stack: "var(--font-lora)",      category: "Serif" },
  cormorant: { label: "Cormorant",        note: "Delicate and luxurious. Fine dining.",      stack: "var(--font-cormorant)", category: "Serif" },
  bebas:     { label: "Bebas Neue",       note: "Tall condensed caps. Gyms and bars.",       stack: "var(--font-bebas)",     category: "Display" },
  zen:       { label: "Zen Dots",         note: "Geometric and technical. Headings only.",   stack: "var(--font-display)",   category: "Display" },
};

export const LAYOUTS: Record<LayoutKey, { label: string; note: string }> = {
  classic:   { label: "Classic",     note: "Logo, name, then a 2×2 grid of actions." },
  cover:     { label: "Cover",       note: "Full-width banner with the logo overlapping it." },
  minimal:   { label: "Minimal",     note: "No grid — actions stack as full-width rows." },
  card:      { label: "Card",        note: "Everything inside one floating card." },
  spotlight: { label: "Spotlight",   note: "One oversized action, the rest secondary." },
  split:     { label: "Split",       note: "Logo beside the name rather than above it." },
  stack:     { label: "Stack",       note: "Tall stacked buttons with icons on the left." },
  gradient:  { label: "Gradient",    note: "Colour-washed background behind everything." },
  editorial: { label: "Editorial",   note: "Large serif name, generous space, understated." },
  grid3:     { label: "Compact grid", note: "Three across — best when you have six or more actions." },
};

export const BUTTONS: Record<ButtonKey, { label: string; note: string }> = {
  solid:   { label: "Solid",   note: "Filled with your accent colour." },
  soft:    { label: "Soft",    note: "Tinted background, accent text." },
  outline: { label: "Outline", note: "Border only. Good over busy covers." },
  glass:   { label: "Glass",   note: "Frosted. Needs a cover image behind it." },
  pill:    { label: "Pill",    note: "Fully rounded, filled." },
  square:  { label: "Square",  note: "Sharp corners. Reads as serious." },
  raised:  { label: "Raised",  note: "Filled with a drop shadow. Very tappable." },
};

export const MOTIONS: Record<MotionKey, { label: string; note: string }> = {
  off:     { label: "None",    note: "Everything appears instantly." },
  subtle:  { label: "Subtle",  note: "Short fade and rise. The default." },
  lively:  { label: "Lively",  note: "Spring entrances and a floating logo." },
  cascade: { label: "Cascade", note: "Sections arrive one after another, top to bottom." },
  zoom:    { label: "Zoom",    note: "Everything scales up into place." },
  slide:   { label: "Slide",   note: "Content slides in from the side." },
};

export const CORNERS: Record<CornerKey, { label: string; radius: number }> = {
  sharp: { label: "Sharp", radius: 2 },
  soft:  { label: "Soft", radius: 14 },
  round: { label: "Round", radius: 24 },
  pill:  { label: "Pill", radius: 999 },
};

/* ------------------------- contrast, measured ------------------------- */

function luminance(hex: string) {
  const m = hex.replace("#", "").match(/.{2}/g);
  if (!m || m.length < 3) return 1;
  const [r, g, b] = m.map((h) => {
    const v = parseInt(h, 16) / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG contrast ratio. Below 4.5 is hard to read at body size. */
export function contrastRatio(a: string, b: string) {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return Number(((l1 + 0.05) / (l2 + 0.05)).toFixed(2));
}

/** Picks black or white for text sitting on a given colour. */
export function readableOn(background: string) {
  return contrastRatio(background, "#FFFFFF") >= contrastRatio(background, "#111111") ? "#FFFFFF" : "#111111";
}

export const INDUSTRY_THEME: Record<string, Partial<ProfileTheme>> = {
  RESTAURANT:  { theme: "terracotta", font: "poppins", headingFont: "playfair", layout: "cover", buttons: "raised" },
  CAFE:        { theme: "sand", font: "poppins", layout: "cover", buttons: "pill" },
  SALON:       { theme: "rose", font: "manrope", headingFont: "playfair", layout: "classic", buttons: "pill" },
  SPA:         { theme: "forest", font: "lora", headingFont: "cormorant", layout: "editorial", buttons: "outline" },
  DOCTOR:      { theme: "royal", font: "figtree", layout: "minimal", buttons: "solid" },
  CLINIC:      { theme: "mint", font: "figtree", layout: "minimal", buttons: "solid" },
  HOSPITAL:    { theme: "royal", font: "inter", layout: "minimal", buttons: "square" },
  GYM:         { theme: "charcoal", font: "worksans", headingFont: "bebas", layout: "spotlight", buttons: "square" },
  REAL_ESTATE: { theme: "slate", font: "manrope", headingFont: "dmserif", layout: "cover", buttons: "square" },
  RETAIL:      { theme: "signature", font: "outfit", layout: "grid3", buttons: "pill" },
  HOTEL:       { theme: "sand", font: "lora", headingFont: "cormorant", layout: "cover", buttons: "outline" },
  AUTOMOBILE:  { theme: "slate", font: "space", headingFont: "bebas", layout: "spotlight", buttons: "square" },
  EDUCATION:   { theme: "ocean", font: "figtree", layout: "classic", buttons: "solid" },
  FREELANCER:  { theme: "mono", font: "space", layout: "split", buttons: "outline" },
  AGENCY:      { theme: "midnight", font: "sora", headingFont: "syne", layout: "card", buttons: "raised" },
  PROFESSIONAL:{ theme: "ivory", font: "worksans", headingFont: "dmserif", layout: "editorial", buttons: "outline" },
  OTHER:       { theme: "signature", font: "albert", layout: "classic", buttons: "solid" },
};

export function resolveTheme(category: string, saved?: Partial<ProfileTheme> | null): ProfileTheme {
  return { ...DEFAULT_THEME, ...(INDUSTRY_THEME[category] ?? {}), ...(saved ?? {}) };
}

export function themeVars(t: ProfileTheme): React.CSSProperties {
  const p = THEMES[t.theme] ?? THEMES.signature;

  const accent = t.accent || p.accent;
  const bg = t.bg || p.bg;
  const surface = t.surface || p.surface;
  const text = t.text || p.text;

  return {
    "--p-accent": accent,
    "--p-on-accent": readableOn(accent),
    "--p-bg": bg,
    "--p-surface": surface,
    "--p-text": text,
    "--p-muted": `color-mix(in srgb, ${text} 62%, ${bg})`,
    "--p-font": FONTS[t.font].stack,
    "--p-heading": FONTS[t.headingFont ?? t.font].stack,
    "--p-accent-soft": `color-mix(in srgb, ${accent} 14%, transparent)`,
    "--p-border": `color-mix(in srgb, ${text} 12%, transparent)`,
    "--p-radius": `${CORNERS[t.corners].radius}px`,
  } as React.CSSProperties;
}

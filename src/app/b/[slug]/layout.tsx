import {
  Playfair_Display, Space_Grotesk, Poppins, DM_Serif_Display, Inter, Outfit,
  Sora, Manrope, Lora, Bebas_Neue, Cormorant_Garamond, Work_Sans, Figtree, Syne,
} from "next/font/google";

/**
 * Profile fonts live here, not in the root layout, so the marketing site and
 * dashboards never download families they don't use.
 *
 * Each call is written out in full rather than sharing an options object.
 * next/font is statically analysed at build time — it reads the literal
 * argument, so a spread or a shared variable fails to compile.
 *
 * `preload: false` on every one matters: with fourteen families preloading,
 * first paint would wait on fonts nobody picked. The browser fetches a file
 * only when a tenant's chosen CSS variable actually references it.
 */
const inter = Inter({
  subsets: ["latin"], display: "swap", preload: false, variable: "--font-inter",
});
const poppins = Poppins({
  subsets: ["latin"], display: "swap", preload: false,
  weight: ["400", "500", "600", "700"], variable: "--font-poppins",
});
const outfit = Outfit({
  subsets: ["latin"], display: "swap", preload: false, variable: "--font-outfit",
});
const manrope = Manrope({
  subsets: ["latin"], display: "swap", preload: false, variable: "--font-manrope",
});
const workSans = Work_Sans({
  subsets: ["latin"], display: "swap", preload: false, variable: "--font-worksans",
});
const figtree = Figtree({
  subsets: ["latin"], display: "swap", preload: false, variable: "--font-figtree",
});
const space = Space_Grotesk({
  subsets: ["latin"], display: "swap", preload: false, variable: "--font-space",
});
const sora = Sora({
  subsets: ["latin"], display: "swap", preload: false, variable: "--font-sora",
});
const syne = Syne({
  subsets: ["latin"], display: "swap", preload: false, variable: "--font-syne",
});
const playfair = Playfair_Display({
  subsets: ["latin"], display: "swap", preload: false, variable: "--font-playfair",
});
const dmSerif = DM_Serif_Display({
  subsets: ["latin"], display: "swap", preload: false,
  weight: "400", variable: "--font-dmserif",
});
const lora = Lora({
  subsets: ["latin"], display: "swap", preload: false, variable: "--font-lora",
});
const cormorant = Cormorant_Garamond({
  subsets: ["latin"], display: "swap", preload: false,
  weight: ["400", "600", "700"], variable: "--font-cormorant",
});
const bebas = Bebas_Neue({
  subsets: ["latin"], display: "swap", preload: false,
  weight: "400", variable: "--font-bebas",
});

const FONT_VARS = [
  inter, poppins, outfit, manrope, workSans, figtree, space, sora, syne,
  playfair, dmSerif, lora, cormorant, bebas,
]
  .map((f) => f.variable)
  .join(" ");

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <div className={FONT_VARS}>{children}</div>;
}

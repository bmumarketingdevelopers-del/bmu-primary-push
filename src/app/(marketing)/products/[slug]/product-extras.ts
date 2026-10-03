import {
  ChartNoAxesColumn,
  IndianRupee,
  Lock,
  MapPin,
  MessageCircle,
  Nfc,
  NotebookText,
  RefreshCw,
  Star,
  type LucideIcon,
} from "lucide-react";

/**
 * Page-only content for the product template, keyed by product slug.
 * The shared product data (lib/products-data.ts) stays the source for names, plans and FAQs;
 * anything here only adds to it or rewords it for this page. Products without an entry
 * get the same layout minus the parts that need this content.
 */

export type ProductExtras = {
  /** Replaces the shared intro paragraph in the hero */
  heroIntro?: string;
  /** Small facts under the hero buttons */
  stats?: { label: string; value: string }[];
  /** Live dashboard card on the right of the hero */
  dashboard?: {
    title: string;
    subtitle: string;
    total: string;
    totalLabel: string;
    rows: { label: string; percent: number; color: string }[];
    feed: { label: string; where: string; when: string }[];
    toast: { title: string; body: string };
  };
  /** "How it works" section with the destinations diagram */
  how?: {
    title: [string, string];
    body: string;
    points: string[];
    left: { title: string; body: string; Icon: LucideIcon }[];
    right: { title: string; body: string; Icon: LucideIcon }[];
  };
  features?: { title: string; body: string; Icon: LucideIcon }[];
  featuresTitle?: string;
  featuresNote?: string;
  pricingNote?: string;
  /** One line per plan, matched by plan name */
  planNotes?: Record<string, string>;
  faqNote?: string;
  /** `body` lines sit on one line on desktop and stack on phones */
  cta?: { eyebrow: string; title: string; body: string[] };
};

export const PRODUCT_EXTRAS: Record<string, ProductExtras> = {
  "bmu-qr": {
    heroIntro:
      "Keep the printed code fixed and the destination editable. A menu change, a moved landing page or an expired offer never means reprinting a thousand standees.",
    stats: [
      { label: "Plans from", value: "₹499/month" },
      { label: "Setup fee", value: "None" },
      { label: "After cancelling", value: "Codes live 30 days" },
    ],
    dashboard: {
      title: "Where your scans go",
      subtitle: "All codes · last 7 days",
      total: "18,402",
      totalLabel: "scans",
      rows: [
        { label: "Digital menu", percent: 45, color: "#8bb72c" },
        { label: "Google reviews", percent: 21, color: "#b9dc6d" },
        { label: "WhatsApp", percent: 15, color: "#6d961f" },
        { label: "UPI payments", percent: 12, color: "#9fcc45" },
        { label: "NFC cards", percent: 7, color: "#eef4e2" },
      ],
      feed: [
        { label: "Dinner menu", where: "Indiranagar · iPhone", when: "just now" },
        { label: "Google review", where: "Koramangala · Android", when: "1 min" },
        { label: "UPI payment", where: "HSR Layout · iPhone", when: "3 min" },
      ],
      toast: { title: "Lunch → Dinner menu", body: "Switched · no reprint" },
    },
    how: {
      title: ["One code.", "Every destination."],
      body: "Print one code and point it wherever you need today: a menu, a review page, a WhatsApp chat or a payment link. Change it tomorrow without touching the print.",
      points: ["Switch destinations in seconds", "No reprints, ever", "Every scan tracked"],
      left: [
        { title: "Digital menu", body: "Dinner · lunch · specials", Icon: NotebookText },
        { title: "Google reviews", body: "One-tap review page", Icon: Star },
        { title: "WhatsApp chat", body: "Pre-filled message", Icon: MessageCircle },
      ],
      right: [
        { title: "UPI payment", body: "Pay at the table", Icon: IndianRupee },
        { title: "Private price list", body: "Passcode protected", Icon: Lock },
        { title: "Feedback form", body: "After every visit", Icon: ChartNoAxesColumn },
      ],
    },
    featuresTitle: "Everything one code can do",
    featuresNote: "Eight tools in one dashboard, from dynamic codes to NFC cards.",
    features: [
      { title: "Dynamic codes", body: "Change the destination any time. The printed code never changes.", Icon: RefreshCw },
      { title: "Restaurant digital menu", body: "Categories, photos, prices and daily specials, editable from your phone.", Icon: NotebookText },
      { title: "Google review collection", body: "Send customers to your review page in one tap, with suggested copy.", Icon: Star },
      { title: "WhatsApp & payment codes", body: "Pre-filled WhatsApp messages and UPI payment links as scannable codes.", Icon: MessageCircle },
      { title: "Scan analytics", body: "Scans by day, location, device and referrer. See which standee works.", Icon: ChartNoAxesColumn },
      { title: "Multi-location management", body: "Group codes by outlet, compare performance, manage users per location.", Icon: MapPin },
      { title: "Password-protected codes", body: "Keep price lists or internal documents behind a passcode.", Icon: Lock },
      { title: "NFC business cards", body: "Tap-to-share cards linked to the same dashboard as your codes.", Icon: Nfc },
    ],
    pricingNote: "Start on a free trial. Upgrade or cancel whenever you like.",
    planNotes: {
      Starter: "For a single outlet getting started.",
      Professional: "For growing businesses with a few locations.",
      Enterprise: "For chains and franchises at scale.",
    },
    faqNote: "Can't find an answer? Ask us on WhatsApp.",
    cta: {
      eyebrow: "Ready when you are",
      title: "Put every code you print\nin one dashboard",
      body: ["From ₹499/month · No setup fee", "Codes live 30 days after cancelling"],
    },
  },
};

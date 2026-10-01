/**
 * Physical QR/NFC products.
 *
 * The hardware is the entry point: someone buys a standee, activates a free
 * account, then upgrades. So the store has to sell the software as much as
 * the object.
 */

export type StoreProduct = {
  slug: string;
  name: string;
  category: "CARD" | "STANDEE" | "STICKER" | "KEYCHAIN" | "KIT";
  tech: "QR" | "NFC" | "BOTH";
  tagline: string;
  description: string;
  price: number; // paise
  compareAt?: number;
  features: string[];
  bestFor: string[];
  leadTime: string;
  isPopular?: boolean;
};

export const STORE_CATEGORIES = [
  { key: "ALL", label: "Everything" },
  { key: "CARD", label: "Cards" },
  { key: "STANDEE", label: "Standees" },
  { key: "STICKER", label: "Stickers" },
  { key: "KEYCHAIN", label: "Keychains" },
  { key: "KIT", label: "Kits" },
] as const;

export const PRODUCTS: StoreProduct[] = [
  {
    slug: "nfc-business-card",
    name: "NFC Business Card",
    category: "CARD",
    tech: "BOTH",
    tagline: "Tap to share everything about you",
    description:
      "Matte PVC card with an embedded NFC chip and a printed QR on the back. One tap opens your digital profile — contact, WhatsApp, socials, payment link. The QR is the fallback for phones without NFC, which is still about a third of Android handsets in India.",
    price: 79900,
    compareAt: 99900,
    features: [
      "Embedded NTAG215 chip",
      "Printed QR fallback on reverse",
      "Your logo and brand colour",
      "Change your profile any time, card never expires",
      "Works without an app on both iPhone and Android",
    ],
    bestFor: ["Founders", "Sales teams", "Consultants", "Real estate agents"],
    leadTime: "Ships in 4–6 working days",
    isPopular: true,
  },
  {
    slug: "google-review-standee",
    name: "Google Review Standee",
    category: "STANDEE",
    tech: "BOTH",
    tagline: "Turn happy customers into reviews at the counter",
    description:
      "Acrylic counter standee with tap and scan. Routes happy customers straight to your Google listing and unhappy ones to a private form that reaches you instead. That routing is why ratings go up rather than sideways.",
    price: 129900,
    compareAt: 159900,
    features: [
      "5mm frosted acrylic, weighted base",
      "NFC tap plus printed QR",
      "Sentiment routing built in",
      "Private feedback lands in your dashboard",
      "Repoint it any time without reprinting",
    ],
    bestFor: ["Restaurants", "Salons", "Clinics", "Retail counters"],
    leadTime: "Ships in 5–7 working days",
    isPopular: true,
  },
  {
    slug: "table-qr-tents",
    name: "Table QR Tents (set of 10)",
    category: "STANDEE",
    tech: "QR",
    tagline: "One code per table, orders arrive knowing where to go",
    description:
      "Ten numbered acrylic tents, each carrying its own code. A scan opens your menu with the table already identified, so nobody types a table number and no order lands in the wrong place.",
    price: 249900,
    features: [
      "Set of 10, individually numbered",
      "Each table tracked separately in analytics",
      "Opens your digital menu and ordering",
      "Wipe-clean acrylic",
      "Add more tables any time",
    ],
    bestFor: ["Restaurants", "Cafes", "Bars", "Cloud kitchens"],
    leadTime: "Ships in 6–8 working days",
  },
  {
    slug: "window-sticker-pack",
    name: "Window Sticker Pack",
    category: "STICKER",
    tech: "QR",
    tagline: "Shopfront, door and counter",
    description:
      "Five weather-resistant vinyl stickers in mixed sizes. Stick them where people already stand — the door while they wait, the counter while they pay.",
    price: 39900,
    features: [
      "5 stickers, UV and rain resistant",
      "Outdoor-rated adhesive",
      "Choose the action per sticker",
      "Scan counts per location",
    ],
    bestFor: ["Retail", "Cafes", "Gyms", "Clinics"],
    leadTime: "Ships in 3–5 working days",
  },
  {
    slug: "nfc-keychain",
    name: "NFC Keychain",
    category: "KEYCHAIN",
    tech: "NFC",
    tagline: "For teams who are never at a desk",
    description:
      "Epoxy keychain with an NFC chip. Field staff, delivery riders and site engineers can share contact details or collect a review without carrying cards.",
    price: 49900,
    features: ["Durable epoxy shell", "Assign to a staff member", "Per-person tap tracking", "Reassign when someone leaves"],
    bestFor: ["Field sales", "Service engineers", "Delivery teams"],
    leadTime: "Ships in 4–6 working days",
  },
  {
    slug: "restaurant-starter-kit",
    name: "Restaurant Starter Kit",
    category: "KIT",
    tech: "BOTH",
    tagline: "Everything a restaurant needs on day one",
    description:
      "Ten table tents, one review standee, three window stickers and a counter card — pre-linked to your menu, your review flow and your WhatsApp. Set up once and the whole floor is live.",
    price: 549900,
    compareAt: 699900,
    features: [
      "10 numbered table tents",
      "1 Google review standee",
      "3 window stickers",
      "1 counter NFC card",
      "Menu built for you from your PDF",
      "3 months of the Business plan included",
    ],
    bestFor: ["New restaurants", "Cafes", "Outlet rollouts"],
    leadTime: "Ships in 7–10 working days",
    isPopular: true,
  },
  {
    slug: "business-starter-kit",
    name: "Business Starter Kit",
    category: "KIT",
    tech: "BOTH",
    tagline: "Card, standee and stickers together",
    description:
      "Two NFC business cards, one review standee and three stickers. The usual first order for a salon, clinic or showroom.",
    price: 279900,
    compareAt: 349900,
    features: [
      "2 NFC business cards",
      "1 Google review standee",
      "3 window stickers",
      "Profile set up for you",
      "3 months of the Business plan included",
    ],
    bestFor: ["Salons", "Clinics", "Showrooms", "Studios"],
    leadTime: "Ships in 6–8 working days",
  },
  {
    slug: "acrylic-name-plate",
    name: "Premium Acrylic Name Plate",
    category: "STANDEE",
    tech: "NFC",
    tagline: "Reception desk, done properly",
    description:
      "Heavier acrylic plate with a brushed finish and an embedded chip. Sits on a reception desk and looks like furniture rather than signage.",
    price: 189900,
    features: ["8mm acrylic, brushed base", "Embedded NFC", "Engraved business name", "Opens your full profile"],
    bestFor: ["Clinics", "Law firms", "Architects", "Hotels"],
    leadTime: "Ships in 7–9 working days",
  },
];

export const FREE_SHIPPING_THRESHOLD = 200000; // ₹2,000
export const SHIPPING_FLAT = 9900; // ₹99
export const GST_RATE = 18;

export type StoreLine = { slug: string; name: string; price: number; quantity: number };

export function storeTotals(lines: StoreLine[]) {
  const subtotal = lines.reduce((s, l) => s + l.price * l.quantity, 0);
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT;
  const count = lines.reduce((n, l) => n + l.quantity, 0);
  // Listed prices are GST-inclusive, so tax is shown as a breakdown, not added on.
  const taxable = Math.round((subtotal + shipping) / (1 + GST_RATE / 100));
  const gst = subtotal + shipping - taxable;
  return { subtotal, shipping, gst, total: subtotal + shipping, count };
}

export const productBySlug = (slug: string) => PRODUCTS.find((p) => p.slug === slug);

export function orderNumber() {
  return `BMU-S-${Math.floor(100000 + Math.random() * 900000)}`;
}

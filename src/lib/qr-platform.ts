/**
 * BMU QR platform: the business-facing product.
 * One QR/NFC identity per business, resolving to a smart profile.
 */

export type LinkType =
  | "PHONE" | "WHATSAPP" | "EMAIL" | "WEBSITE" | "DIRECTIONS"
  | "INSTAGRAM" | "FACEBOOK" | "YOUTUBE" | "LINKEDIN"
  | "GOOGLE_REVIEW" | "PAYMENT" | "BOOKING" | "MENU" | "CATALOGUE" | "BROCHURE" | "CUSTOM";

export type SmartProfile = {
  slug: string;
  name: string;
  category: string;
  tagline: string;
  about: string;
  phone: string;
  whatsapp: string;
  address: string;
  city: string;
  rating: number;
  reviewCount: number;
  brandColor: string;
  gbpUrl: string;
  links: { type: LinkType; label: string; value: string }[];
  services: { name: string; price?: number; note?: string }[];
  offers: { title: string; detail: string }[];
  isPublished: boolean;
  /** Statutory numbers displayed publicly. Empty for trades with none. */
  licences?: {
    fssaiNumber?: string | null;
    gstNumber?: string | null;
    drugLicence?: string | null;
    reraNumber?: string | null;
    clinicRegNo?: string | null;
    otherLicence?: string | null;
  };
};

/**
 * Industry templates — what each business type actually needs on screen.
 * A salon leads with booking; a restaurant leads with the menu.
 */
export const CATEGORY_TEMPLATES: Record<string, { label: string; primary: LinkType[]; sections: string[] }> = {
  RESTAURANT: { label: "Restaurant", primary: ["MENU", "WHATSAPP", "DIRECTIONS", "BOOKING"], sections: ["Menu", "Offers", "Reviews", "Location"] },
  CAFE: { label: "Cafe", primary: ["MENU", "WHATSAPP", "DIRECTIONS", "GOOGLE_REVIEW"], sections: ["Menu", "Offers", "Reviews"] },
  SALON: { label: "Salon", primary: ["BOOKING", "WHATSAPP", "PHONE", "DIRECTIONS"], sections: ["Services", "Offers", "Reviews", "Location"] },
  SPA: { label: "Spa", primary: ["BOOKING", "WHATSAPP", "PHONE"], sections: ["Services", "Offers", "Reviews"] },
  DOCTOR: { label: "Doctor", primary: ["BOOKING", "PHONE", "DIRECTIONS", "WHATSAPP"], sections: ["About", "Services", "Location", "Reviews"] },
  CLINIC: { label: "Clinic", primary: ["BOOKING", "PHONE", "DIRECTIONS"], sections: ["Services", "About", "Location"] },
  GYM: { label: "Gym", primary: ["BOOKING", "WHATSAPP", "PHONE", "DIRECTIONS"], sections: ["Services", "Offers", "Reviews"] },
  REAL_ESTATE: { label: "Real estate", primary: ["BROCHURE", "WHATSAPP", "PHONE", "DIRECTIONS"], sections: ["Projects", "About", "Location"] },
  RETAIL: { label: "Retail", primary: ["CATALOGUE", "WHATSAPP", "PAYMENT", "DIRECTIONS"], sections: ["Products", "Offers", "Reviews"] },
  HOTEL: { label: "Hotel", primary: ["BOOKING", "PHONE", "DIRECTIONS", "WHATSAPP"], sections: ["Services", "Offers", "Location"] },
  AUTOMOBILE: { label: "Automobile", primary: ["BOOKING", "PHONE", "WHATSAPP", "DIRECTIONS"], sections: ["Services", "Offers", "Location"] },
  FREELANCER: { label: "Freelancer", primary: ["WHATSAPP", "EMAIL", "PAYMENT", "LINKEDIN"], sections: ["Services", "About"] },
  OTHER: { label: "Business", primary: ["PHONE", "WHATSAPP", "WEBSITE", "DIRECTIONS"], sections: ["Services", "About", "Location"] },
};

/** Every QR kind the generator supports, grouped as the product sells them. */
export const QR_KINDS = {
  Business: [
    { kind: "PROFILE", label: "Business profile", help: "Opens the full smart profile" },
    { kind: "GOOGLE_REVIEW", label: "Google review", help: "Sentiment-routed review collection" },
    { kind: "WHATSAPP", label: "WhatsApp", help: "Opens a chat with a prefilled message" },
    { kind: "VCARD", label: "Digital card", help: "Saves a contact to the phone" },
    { kind: "MENU", label: "Menu", help: "Digital menu or catalogue" },
    { kind: "PAYMENT", label: "Payment", help: "UPI or payment link" },
    { kind: "BOOKING", label: "Booking", help: "Appointment form" },
  ],
  Marketing: [
    { kind: "LEAD", label: "Lead form", help: "Capture name and number for an offer" },
    { kind: "OFFER", label: "Offer", help: "Coupon or discount landing page" },
    { kind: "CAMPAIGN", label: "Campaign", help: "Tracked with UTM parameters" },
    { kind: "EVENT", label: "Event", help: "Event details and RSVP" },
  ],
  Basic: [
    { kind: "URL", label: "Website URL", help: "Any link" },
    { kind: "WIFI", label: "Wi-Fi", help: "Joins a network on scan" },
    { kind: "LOCATION", label: "Location", help: "Opens maps directions" },
    { kind: "TEXT", label: "Plain text", help: "Shows text on scan" },
  ],
} as const;

/** Demo tenants so /b/{slug} works before a database exists. */
export const DEMO_BUSINESSES: SmartProfile[] = [
  {
    slug: "abc-salon",
    name: "ABC Salon",
    category: "SALON",
    tagline: "Unisex salon · Indiranagar",
    about:
      "Fifteen years on 100 Feet Road. Cuts, colour and bridal work, by appointment or walk-in before 4pm.",
    phone: "+919845000111",
    whatsapp: "919845000111",
    address: "312, 100 Feet Road, Indiranagar, Bengaluru 560038",
    city: "Bengaluru",
    rating: 4.8,
    reviewCount: 1248,
    brandColor: "#8BB72C",
    gbpUrl: "https://g.page/r/abc-salon/review",
    links: [
      { type: "BOOKING", label: "Book appointment", value: "/b/abc-salon/book" },
      { type: "WHATSAPP", label: "WhatsApp", value: "919845000111" },
      { type: "PHONE", label: "Call", value: "+919845000111" },
      { type: "DIRECTIONS", label: "Directions", value: "https://maps.google.com/?q=Indiranagar+Bengaluru" },
      { type: "INSTAGRAM", label: "Instagram", value: "https://instagram.com" },
      { type: "PAYMENT", label: "Pay now", value: "upi://pay?pa=abcsalon@upi" },
    ],
    services: [
      { name: "Haircut & styling", price: 45000, note: "from" },
      { name: "Hair colour", price: 180000, note: "from" },
      { name: "Facial", price: 120000 },
      { name: "Bridal package", price: 1500000, note: "from" },
    ],
    offers: [{ title: "Weekday 20% off", detail: "Monday to Thursday, before 2pm. Show this screen." }],
    isPublished: true,
  },
  {
    slug: "saffron-co",
    name: "Saffron & Co",
    category: "RESTAURANT",
    tagline: "North Indian kitchen · 6 outlets",
    about: "Slow-cooked North Indian, family portions, no MSG. Weekend brunch from 11am.",
    phone: "+918040001122",
    whatsapp: "918040001122",
    address: "14th Main, HSR Layout Sector 6, Bengaluru 560102",
    city: "Bengaluru",
    rating: 4.6,
    reviewCount: 3104,
    brandColor: "#C2410C",
    gbpUrl: "https://g.page/r/saffron-co/review",
    links: [
      { type: "MENU", label: "See the menu", value: "/b/saffron-co/menu" },
      { type: "WHATSAPP", label: "Order on WhatsApp", value: "918040001122" },
      { type: "DIRECTIONS", label: "Directions", value: "https://maps.google.com/?q=HSR+Layout" },
      { type: "BOOKING", label: "Book a table", value: "/b/saffron-co/book" },
      { type: "GOOGLE_REVIEW", label: "Leave a review", value: "https://g.page/r/saffron-co/review" },
    ],
    services: [
      { name: "Weekend brunch", price: 89000, note: "per head" },
      { name: "Family thali", price: 42000 },
      { name: "Party orders", note: "on request" },
    ],
    offers: [{ title: "Brunch for four at ₹2,999", detail: "Saturdays and Sundays, 11am to 3pm." }],
    isPublished: true,
  },
];

export async function getBusiness(slug: string): Promise<SmartProfile | null> {
  if (process.env.DATABASE_URL) {
    try {
      const { prisma } = await import("@/lib/prisma");
      const b = await prisma.business.findUnique({
        where: { slug },
        include: {
          profileLinks: { where: { isActive: true }, orderBy: { sortOrder: "asc" } },
          services: { where: { isActive: true }, orderBy: { sortOrder: "asc" } },
          offers: { where: { isActive: true } },
        },
      });

      if (b) {
        return {
          slug: b.slug,
          name: b.name,
          category: b.category,
          tagline: b.tagline ?? "",
          about: b.about ?? "",
          phone: b.phone ?? "",
          whatsapp: b.whatsapp ?? "",
          address: b.address ?? "",
          city: b.city ?? "",
          rating: 0,
          reviewCount: 0,
          brandColor: b.brandColor,
          gbpUrl: b.gbpPlaceId ? `https://search.google.com/local/writereview?placeid=${b.gbpPlaceId}` : "",
          links: b.profileLinks.map((l) => ({ type: l.type as LinkType, label: l.label, value: l.value })),
          services: b.services.map((s) => ({ name: s.name, price: s.price ?? undefined, note: s.priceNote ?? undefined })),
          offers: b.offers.map((o) => ({ title: o.title, detail: o.detail ?? "" })),
          isPublished: b.isPublished,
        };
      }
      return null;
    } catch (err) {
      console.warn("[qr-platform] database unreachable, using demo businesses:", err);
    }
  }
  // Hand-written demos first, then the generated one per industry.
  if (DEMO_BUSINESSES.some((b) => b.slug === slug)) {
    return DEMO_BUSINESSES.find((b) => b.slug === slug)!;
  }

  const { industryBusinessBySlug } = await import("./demo-businesses");
  return industryBusinessBySlug(slug) ?? null;
}

/** Every demo tenant — the two originals plus one per industry. */
export async function allDemoBusinesses(): Promise<SmartProfile[]> {
  const { DEMO_INDUSTRY_BUSINESSES } = await import("./demo-businesses");
  const seen = new Set(DEMO_BUSINESSES.map((b) => b.slug));
  return [...DEMO_BUSINESSES, ...DEMO_INDUSTRY_BUSINESSES.filter((b) => !seen.has(b.slug))];
}

export function whatsappUrl(number: string, message: string) {
  return `https://wa.me/${number.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(message)}`;
}

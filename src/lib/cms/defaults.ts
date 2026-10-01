/**
 * Fallback content for every CMS block.
 *
 * These are what the site shows before anything is saved in the admin panel,
 * and what it falls back to if the database is unreachable. The public site
 * therefore never renders empty.
 */
import { CONTACT_NEEDS, FAQS, HERO_PILLS, HERO_ROTATIONS, HERO_STATS, PLANS, TESTIMONIALS, TRUSTED_BY } from "@/lib/content";
import { COMPANY, STORY } from "@/lib/company-data";

export const CMS_DEFAULTS: Record<string, Record<string, unknown>> = {
  "home.hero": {
    badge: "Taking on 4 new retainers for Q3",
    headingLine1: "Grow your business with",
    headingLine2: "AI, content and",
    rotations: HERO_ROTATIONS,
    subheading:
      "We bring strategy, creative, Al, technology and performance together to turn attention into meaningful business growth, stronger customer connections and measurable results that move your brand forward.",
    pills: HERO_PILLS,
    primaryCtaLabel: "Book a free consultation",
    primaryCtaHref: "/contact",
    secondaryCtaLabel: "See the work",
    secondaryCtaHref: "/case-studies",
  },
  "home.stats": { items: HERO_STATS },
  "home.trusted": {
    heading: "Trusted by teams across real estate, hospitality, healthcare and retail",
    names: TRUSTED_BY,
  },
  "home.testimonials": { items: TESTIMONIALS },
  "home.faqs": { items: FAQS },
  "pricing.retainers": {
    plans: PLANS.retainer.map((p) => ({ ...p, featured: p.featured ? "yes" : "no" })),
  },
  "contact.details": {
    email: COMPANY.email,
    phone: COMPANY.phone,
    whatsapp: COMPANY.whatsapp,
    address: COMPANY.address,
    hours: COMPANY.hours,
    mapUrl: "",
  },
  "about.story": { sections: STORY },
  "global.brand": {
    siteName: "BMU.Marketing",
    tagline: "AI Powered Growth Partner",
    logoUrl: "",
    primaryColor: "#8BB72C",
    inkColor: "#121F2F",
  },
  "global.footer": {
    blurb:
      "AI-first growth partner for businesses and real estate. Strategy, creative, media and software from one team.",
    instagram: "#",
    linkedin: "#",
    youtube: "#",
    whatsapp: "#",
    copyright: "BMU.Marketing - Bengaluru, India",
  },
  "global.announcement": { message: "", linkLabel: "", linkHref: "" },
  "global.navigation": {
    items: [
      { label: "Services", href: "/services" },
      { label: "Products", href: "/products" },
      { label: "Industries", href: "/industries" },
      { label: "Store", href: "/store" },
      { label: "Pricing", href: "/pricing" },
      { label: "Contact", href: "/contact" },
    ],
    ctaLabel: "Book a call",
    ctaHref: "/contact",
    loginLabel: "Client login",
  },
  "global.theme": {
    primary: "#8BB72C",
    ink: "#121F2F",
    background: "#F8F7F4",
    displayFont: "Zen Dots",
    bodyFont: "Albert Sans",
    radius: "12px",
  },
  "seo.defaults": {
    titleTemplate: "%s · BMU.Marketing",
    defaultTitle: "BMU.Marketing - AI Powered Growth Partner",
    description:
      "AI-first growth agency. Social media, UGC, performance marketing, SEO, websites, apps, automation and real estate marketing.",
    keywords: [
      "digital marketing agency Bengaluru",
      "QR code business platform",
      "NFC business cards India",
      "Google review QR",
    ],
    ogImage: "",
  },
  // Not exposed in the editor yet, but resolvable so pages can migrate to it.
  "contact.needs": { options: CONTACT_NEEDS },
};

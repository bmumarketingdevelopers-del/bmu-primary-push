import { COMPANY } from "@/lib/company-data";
import { SERVICE_DETAILS } from "@/lib/services-data";

const base = () => process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

/** Organization + LocalBusiness — what Google uses for the knowledge panel. */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "ProfessionalService"],
    "@id": `${base()}/#organization`,
    name: "BMU.Marketing",
    url: base(),
    description:
      "AI-first growth agency. Social media, UGC, performance marketing, SEO, websites, apps, automation and real estate marketing.",
    email: COMPANY.email,
    telephone: COMPANY.phone,
    foundingDate: String(COMPANY.founded),
    numberOfEmployees: { "@type": "QuantitativeValue", value: COMPANY.headcount },
    address: {
      "@type": "PostalAddress",
      streetAddress: COMPANY.address,
      addressLocality: COMPANY.city,
      addressRegion: "Karnataka",
      addressCountry: "IN",
    },
    areaServed: { "@type": "Country", name: "India" },
    priceRange: "₹₹₹",
    openingHours: "Mo-Fr 09:30-18:30",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Services",
      itemListElement: SERVICE_DETAILS.map((s) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: s.title, url: `${base()}/services/${s.slug}` },
      })),
    },
  };
}

export function breadcrumbSchema(trail: { href: string; label: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ href: "/", label: "Home" }, ...trail].map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      item: `${base()}${item.href}`,
    })),
  };
}

export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function serviceSchema(service: { title: string; slug: string; tagline: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.tagline,
    url: `${base()}/services/${service.slug}`,
    provider: { "@id": `${base()}/#organization` },
    areaServed: { "@type": "Country", name: "India" },
  };
}

export function articleSchema(post: {
  title: string;
  slug: string;
  excerpt?: string;
  publishedAt?: string;
  author?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    author: { "@type": "Person", name: post.author ?? "BMU.Marketing" },
    publisher: { "@id": `${base()}/#organization` },
    mainEntityOfPage: `${base()}/resources/${post.slug}`,
  };
}

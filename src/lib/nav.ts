import { SERVICE_PAGES, servicePageHref } from "./service-pages-data";
import { PRODUCT_DETAILS, productHref } from "./products-data";
import { INDUSTRY_DETAILS } from "./industries-data";

type NavLink = { href: string; label: string; description?: string };

export type NavItem = {
  href: string;
  label: string;
  children?: (NavLink & {
    /** Opens beside the link on hover (desktop) and nests under it in the mobile menu. */
    submenu?: { href: string; label: string; items: NavLink[] };
  })[];
};

const INDUSTRY_LINKS: NavLink[] = INDUSTRY_DETAILS.map((i) => ({
  href: `/industries/${i.slug}`,
  label: i.name,
  description: i.tagline,
}));

// Products shown in the header's Products menu. Uncomment a slug to bring it back.
const MENU_PRODUCTS = [
  "bmu-qr",
  // "smart-review",
  // "bmu-creators",
  // "ai-studio",
  // "real-estate-suite",
];

export const MAIN_NAV: NavItem[] = [
  // Plain link, no dropdown: the /services page lists every service
  { href: "/services", label: "Services" },
  {
    href: "/products",
    label: "Products",
    children: PRODUCT_DETAILS.filter((p) => MENU_PRODUCTS.includes(p.slug)).map((p) => ({
      href: `/products/${p.slug}`,
      label: p.name,
      description: p.tagline,
      submenu:
        p.slug === "bmu-qr"
          ? { href: "/industries", label: "Industries", items: INDUSTRY_LINKS }
          : undefined,
    })),
  },
  // Industries now sit under Products → BMU QR. Uncomment to give them their own menu again.
  // {
  //   href: "/industries",
  //   label: "Industries",
  //   children: INDUSTRY_LINKS,
  // },
  // Hidden for now. Uncomment to bring Work back into the menu.
  // { href: "/portfolio", label: "Work" },
  { href: "/case-studies", label: "Case studies" },
  // { href: "/store", label: "Store" },
  { href: "/pricing", label: "Pricing" },
  { href: "/resources", label: "Resources" },
  { href: "/about", label: "About" },
];

// Order the six services are listed in both footers
const FOOTER_SERVICE_ORDER = [
  "marketing-and-visibility",
  "social-and-personal-brand",
  "ugc-and-creator-marketing",
  "brand-and-design",
  "content-and-production",
  "web-and-ai",
];

export const FOOTER_SERVICE_LINKS = FOOTER_SERVICE_ORDER.map((slug) => SERVICE_PAGES.find((s) => s.slug === slug)!).map(
  (s) => ({ href: servicePageHref(s), label: s.title }),
);

export const FOOTER_NAV = [
  {
    title: "Services",
    links: FOOTER_SERVICE_LINKS,
  },
  {
    title: "Products",
    links: PRODUCT_DETAILS.map((p) => ({ href: productHref(p), label: p.name })),
  },
  {
    title: "Company",
    links: [
      { href: "/case-studies", label: "Case studies" },
      { href: "/industries", label: "Industries" },
      { href: "/pricing", label: "Pricing" },
      { href: "/resources", label: "Resources" },
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
      { href: "/store", label: "QR & NFC store" },
      { href: "/partners", label: "Partners & white label" },
      { href: "/join", label: "Join as a creator" },
      { href: "/dashboard", label: "Client dashboard" },
    ],
  },
];

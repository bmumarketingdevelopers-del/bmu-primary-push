import { SERVICE_DETAILS } from "./services-data";
import { PRODUCT_DETAILS } from "./products-data";
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
  { href: "/portfolio", label: "Work" },
  { href: "/case-studies", label: "Case studies" },
  // { href: "/store", label: "Store" },
  { href: "/pricing", label: "Pricing" },
  { href: "/resources", label: "Resources" },
  { href: "/about", label: "About" },
];

export const FOOTER_NAV = [
  {
    title: "Services",
    links: SERVICE_DETAILS.map((s) => ({ href: `/services/${s.slug}`, label: s.title })),
  },
  {
    title: "Products",
    links: PRODUCT_DETAILS.map((p) => ({ href: `/products/${p.slug}`, label: p.name })),
  },
  {
    title: "Company",
    links: [
      { href: "/portfolio", label: "Portfolio" },
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

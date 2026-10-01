import type { Field } from "./schema";

/**
 * Editable collections.
 *
 * Everything repeatable on the public site is declared here. The admin list
 * and editor render from these definitions, so adding a content type is a
 * registry entry rather than new UI.
 */
export type CollectionDef = {
  key: string;
  label: string;
  singular: string;
  group: "Website" | "Store" | "People";
  description: string;
  /** Where it appears publicly — used for the "view live" link. */
  publicPath?: (slug: string) => string;
  /** Field shown as the row title in the list view. */
  titleField: string;
  fields: Field[];
};

/* Shared field shapes reused across collections. */
const faqField: Field = {
  name: "faqs", label: "FAQs", type: "repeater",
  fields: [
    { name: "q", label: "Question", type: "text" },
    { name: "a", label: "Answer", type: "textarea" },
  ],
};

const titledBody = (name: string, label: string, help?: string): Field => ({
  name, label, type: "repeater", help,
  fields: [
    { name: "title", label: "Heading", type: "text" },
    { name: "body", label: "Body", type: "textarea" },
  ],
});

export const COLLECTIONS: CollectionDef[] = [
  {
    key: "services",
    label: "Services",
    singular: "Service",
    group: "Website",
    description: "The eight practice areas. Each gets its own page and appears in the nav and sitemap.",
    publicPath: (slug) => `/services/${slug}`,
    titleField: "title",
    fields: [
      { name: "slug", label: "URL slug", type: "text", help: "Lowercase, hyphens only. Changing this breaks existing links." },
      { name: "title", label: "Service name", type: "text" },
      { name: "icon", label: "Icon", type: "text", help: "BarChart3, PlayCircle, Search, Code2, Zap, PenTool, Sparkles or Building2" },
      { name: "tagline", label: "Tagline", type: "text" },
      { name: "summary", label: "One-line summary", type: "textarea" },
      { name: "intro", label: "Opening paragraph", type: "textarea" },
      titledBody("deliverables", "What's delivered"),
      titledBody("process", "How it runs"),
      { name: "outcomes", label: "Outcomes", type: "list" },
      { name: "priceFrom", label: "Price from", type: "text" },
      faqField,
      { name: "related", label: "Related service slugs", type: "list" },
    ],
  },
  {
    key: "products",
    label: "Products",
    singular: "Product",
    group: "Website",
    description: "Software products — BMU QR, Smart Review, Creators, AI Studio, Real Estate Suite.",
    publicPath: (slug) => `/products/${slug}`,
    titleField: "name",
    fields: [
      { name: "slug", label: "URL slug", type: "text" },
      { name: "name", label: "Product name", type: "text" },
      { name: "tag", label: "Badge", type: "text", placeholder: "Flagship" },
      { name: "tagline", label: "Tagline", type: "text" },
      { name: "summary", label: "Summary", type: "textarea" },
      { name: "intro", label: "Opening paragraph", type: "textarea" },
      titledBody("features", "Features"),
      {
        name: "useCases", label: "Who it's for", type: "repeater",
        fields: [
          { name: "who", label: "Who", type: "text" },
          { name: "what", label: "What they use it for", type: "textarea" },
        ],
      },
      faqField,
      { name: "cta", label: "Button label", type: "text" },
    ],
  },
  {
    key: "industries",
    label: "Industries",
    singular: "Industry",
    group: "Website",
    description: "All 27 sectors. Each has its own page with a playbook and metrics.",
    publicPath: (slug) => `/industries/${slug}`,
    titleField: "name",
    fields: [
      { name: "slug", label: "URL slug", type: "text" },
      { name: "name", label: "Industry", type: "text" },
      { name: "tagline", label: "Tagline", type: "text" },
      { name: "summary", label: "Summary", type: "textarea" },
      { name: "intro", label: "Opening paragraph", type: "textarea" },
      titledBody("challenges", "Challenges in this sector"),
      { name: "playbook", label: "Playbook steps", type: "list" },
      {
        name: "metrics", label: "Typical results", type: "repeater",
        fields: [
          { name: "value", label: "Figure", type: "text" },
          { name: "label", label: "What it measures", type: "text" },
        ],
      },
      { name: "services", label: "Relevant services", type: "list" },
    ],
  },
  {
    key: "portfolio",
    label: "Portfolio",
    singular: "Work item",
    group: "Website",
    description: "The filterable work grid on the portfolio page and homepage.",
    publicPath: () => `/portfolio`,
    titleField: "title",
    fields: [
      { name: "slug", label: "Reference", type: "text" },
      { name: "title", label: "Project title", type: "text" },
      { name: "category", label: "Category", type: "text", help: "Drives the filter buttons — reuse existing spellings." },
      { name: "summary", label: "One-line summary", type: "text" },
      { name: "from", label: "Gradient start", type: "text", placeholder: "#121F2F" },
      { name: "to", label: "Gradient end", type: "text", placeholder: "#8BB72C" },
    ],
  },
  {
    key: "case-studies",
    label: "Case studies",
    singular: "Case study",
    group: "Website",
    description: "Full write-ups with the headline metric, approach and results.",
    publicPath: (slug) => `/case-studies/${slug}`,
    titleField: "title",
    fields: [
      { name: "slug", label: "URL slug", type: "text" },
      { name: "title", label: "Title", type: "text" },
      { name: "client", label: "Client", type: "text" },
      { name: "industry", label: "Industry", type: "text" },
      { name: "headline", label: "Headline claim", type: "text" },
      { name: "metric", label: "Headline figure", type: "text", placeholder: "312%" },
      { name: "metricLabel", label: "What the figure measures", type: "text" },
      { name: "summary", label: "Summary", type: "textarea" },
      { name: "challenge", label: "The problem", type: "list", help: "One paragraph per line." },
      titledBody("approach", "What we did"),
      {
        name: "results", label: "Results", type: "repeater",
        fields: [
          { name: "value", label: "Figure", type: "text" },
          { name: "label", label: "What it measures", type: "text" },
        ],
      },
      { name: "services", label: "Services used", type: "list" },
    ],
  },
  {
    key: "posts",
    label: "Articles",
    singular: "Article",
    group: "Website",
    description: "The /resources blog. Unpublished drafts stay out of the sitemap.",
    publicPath: (slug) => `/resources/${slug}`,
    titleField: "title",
    fields: [
      { name: "slug", label: "URL slug", type: "text" },
      { name: "title", label: "Title", type: "text" },
      { name: "excerpt", label: "Excerpt", type: "textarea" },
      { name: "category", label: "Category", type: "text" },
      { name: "readTime", label: "Read time", type: "text", placeholder: "6 min read" },
      { name: "publishedAt", label: "Published date", type: "text", placeholder: "2026-07-28" },
      { name: "author", label: "Author", type: "text" },
      {
        name: "body", label: "Body", type: "repeater",
        help: "One block per section. Leave the heading empty for an untitled opening.",
        fields: [
          { name: "heading", label: "Section heading", type: "text" },
          { name: "paragraphs", label: "Paragraphs", type: "list" },
        ],
      },
    ],
  },
  {
    key: "store-products",
    label: "Store products",
    singular: "Product",
    group: "Store",
    description: "Physical QR and NFC goods sold at /store.",
    publicPath: (slug) => `/store/${slug}`,
    titleField: "name",
    fields: [
      { name: "slug", label: "URL slug", type: "text" },
      { name: "name", label: "Product name", type: "text" },
      { name: "category", label: "Category", type: "text", help: "CARD, STANDEE, STICKER, KEYCHAIN or KIT" },
      { name: "tech", label: "Technology", type: "text", help: "QR, NFC or BOTH" },
      { name: "tagline", label: "Tagline", type: "text" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "price", label: "Price in paise", type: "number", help: "79900 renders as ₹799" },
      { name: "compareAt", label: "Was price in paise", type: "number" },
      { name: "features", label: "What's included", type: "list" },
      { name: "bestFor", label: "Best for", type: "list" },
      { name: "leadTime", label: "Lead time", type: "text" },
      { name: "isPopular", label: "Popular? (yes/no)", type: "text" },
    ],
  },
  {
    key: "team",
    label: "Team",
    singular: "Team member",
    group: "People",
    description: "Shown on the About page.",
    publicPath: () => `/about`,
    titleField: "name",
    fields: [
      { name: "slug", label: "Reference", type: "text" },
      { name: "name", label: "Name", type: "text" },
      { name: "role", label: "Role", type: "text" },
      { name: "focus", label: "Focus area", type: "text" },
    ],
  },
  {
    key: "values",
    label: "Company values",
    singular: "Value",
    group: "People",
    description: "The four principles on the About page.",
    publicPath: () => `/about`,
    titleField: "title",
    fields: [
      { name: "slug", label: "Reference", type: "text" },
      { name: "title", label: "Value", type: "text" },
      { name: "body", label: "Explanation", type: "textarea" },
    ],
  },
];

export const collectionByKey = (key: string) => COLLECTIONS.find((c) => c.key === key);
export const COLLECTION_GROUPS = ["Website", "Store", "People"] as const;

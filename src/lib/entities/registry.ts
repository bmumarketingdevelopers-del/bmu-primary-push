import type { Field } from "@/lib/cms/schema";

/**
 * Every creatable record in the admin panel, declared once.
 *
 * One registry entry per entity means one dialog and one save action serve
 * them all — so a fix to validation, money handling or error messages lands
 * everywhere at once instead of in twelve near-identical forms.
 */
export type EntityDef = {
  label: string;
  singular: string;
  /** Prisma model name used by the generic save action. */
  model: string;
  description: string;
  /** Field that must be filled for the record to be worth saving. */
  titleField: string;
  fields: Field[];
  /** Paths to refresh after a write. */
  revalidate: string[];
};

const money = (name: string, label: string, help = "In rupees. Stored as paise.") =>
  ({ name, label, type: "number", help }) as Field;

export const ENTITIES = {
  client: {
    label: "Clients",
    singular: "Client",
    model: "client",
    titleField: "name",
    description: "A retainer or project account.",
    revalidate: ["/admin/clients", "/admin"],
    fields: [
      { name: "name", label: "Business name", type: "text", placeholder: "Atria Living" },
      { name: "slug", label: "URL slug", type: "text", help: "Leave empty to generate from the name." },
      { name: "industry", label: "Industry", type: "text", placeholder: "Real Estate" },
      { name: "city", label: "City", type: "text" },
      { name: "website", label: "Website", type: "url" },
      { name: "contactName", label: "Main contact", type: "text" },
      { name: "contactEmail", label: "Contact email", type: "text" },
      { name: "contactPhone", label: "Contact phone", type: "text" },
      { name: "gstin", label: "GSTIN", type: "text" },
      money("monthlyRetainer", "Monthly retainer"),
    ] as Field[],
  },

  project: {
    label: "Projects",
    singular: "Project",
    model: "project",
    titleField: "name",
    description: "A piece of delivery work with a budget and a due date.",
    revalidate: ["/admin/projects", "/admin"],
    fields: [
      { name: "name", label: "Project name", type: "text", placeholder: "Tower C launch campaign" },
      { name: "clientId", label: "Client ID", type: "text", help: "Copy it from the clients list." },
      { name: "description", label: "Scope", type: "textarea" },
      { name: "status", label: "Status", type: "text", help: "DISCOVERY, IN_PROGRESS, REVIEW, LIVE, PAUSED or COMPLETED" },
      { name: "progress", label: "Progress %", type: "number" },
      money("budget", "Budget"),
      { name: "startDate", label: "Starts", type: "text", placeholder: "2026-08-01" },
      { name: "dueDate", label: "Due", type: "text", placeholder: "2026-09-15" },
    ] as Field[],
  },

  campaign: {
    label: "Campaigns",
    singular: "Campaign",
    model: "campaign",
    titleField: "name",
    description: "Paid media with a budget and tracked spend.",
    revalidate: ["/admin"],
    fields: [
      { name: "name", label: "Campaign name", type: "text" },
      { name: "clientId", label: "Client ID", type: "text" },
      { name: "platform", label: "Platform", type: "text", help: "meta, google, whatsapp, influencer or email" },
      { name: "status", label: "Status", type: "text", help: "DRAFT, ACTIVE, PAUSED or COMPLETED" },
      money("budget", "Budget"),
      money("spend", "Spend so far"),
      { name: "startDate", label: "Starts", type: "text", placeholder: "2026-08-01" },
      { name: "endDate", label: "Ends", type: "text" },
    ] as Field[],
  },

  invoice: {
    label: "Invoices",
    singular: "Invoice",
    model: "invoice",
    titleField: "number",
    description: "A bill against a client account. The total is calculated, not typed.",
    revalidate: ["/admin/invoices", "/dashboard/invoices", "/admin"],
    fields: [
      { name: "number", label: "Invoice number", type: "text", placeholder: "BMU-2026-0190" },
      { name: "clientId", label: "Client ID", type: "text" },
      { name: "description", label: "What it's for", type: "text", placeholder: "Growth retainer — August" },
      { name: "status", label: "Status", type: "text", help: "DRAFT, SENT, PAID, OVERDUE or VOID" },
      money("subtotal", "Amount before GST"),
      { name: "taxRate", label: "GST %", type: "number", help: "18 for services." },
      { name: "dueAt", label: "Due date", type: "text", placeholder: "2026-08-15" },
      { name: "notes", label: "Notes on the invoice", type: "textarea" },
    ] as Field[],
  },

  partner: {
    label: "Partners",
    singular: "Partner",
    model: "partner",
    titleField: "name",
    description: "An agency, reseller or franchise group selling under their own brand.",
    revalidate: ["/admin/partners"],
    fields: [
      { name: "name", label: "Partner name", type: "text" },
      { name: "slug", label: "Slug", type: "text" },
      { name: "type", label: "Type", type: "text", help: "AGENCY, RESELLER or FRANCHISE" },
      { name: "contactName", label: "Main contact", type: "text" },
      { name: "contactEmail", label: "Email", type: "text" },
      { name: "contactPhone", label: "Phone", type: "text" },
      { name: "city", label: "City", type: "text" },
      { name: "brandName", label: "White-label brand name", type: "text" },
      { name: "customDomain", label: "Custom domain", type: "text", placeholder: "qr.theiragency.com" },
      { name: "primaryColor", label: "Brand colour", type: "text", placeholder: "#8BB72C" },
      { name: "commissionPct", label: "Commission %", type: "number" },
      { name: "wholesaleDiscountPct", label: "Hardware discount %", type: "number" },
      { name: "hideBmuBranding", label: "Hide our branding? (yes/no)", type: "text" },
    ] as Field[],
  },

  business: {
    label: "QR businesses",
    singular: "Business",
    model: "business",
    titleField: "name",
    description: "A BMU QR tenant with its own public profile.",
    revalidate: ["/admin/businesses"],
    fields: [
      { name: "name", label: "Business name", type: "text" },
      { name: "slug", label: "Profile address", type: "text", help: "Becomes /b/{slug}. Don't change it once codes are printed." },
      { name: "category", label: "Category", type: "text", help: "RESTAURANT, CAFE, SALON, SPA, DOCTOR, CLINIC, HOSPITAL, GYM, REAL_ESTATE, RETAIL, HOTEL, AUTOMOBILE, EDUCATION, FREELANCER, AGENCY, PROFESSIONAL or OTHER" },
      { name: "tagline", label: "Tagline", type: "text" },
      { name: "about", label: "About", type: "textarea" },
      { name: "phone", label: "Phone", type: "text" },
      { name: "whatsapp", label: "WhatsApp", type: "text", help: "Country code, no plus." },
      { name: "email", label: "Email", type: "text" },
      { name: "address", label: "Address", type: "textarea" },
      { name: "city", label: "City", type: "text" },
      { name: "gbpMapsUrl", label: "Google Maps link", type: "text", help: "We pull the Place ID out of it automatically." },
    ] as Field[],
  },

  storeProduct: {
    label: "Store products",
    singular: "Product",
    model: "physicalProduct",
    titleField: "name",
    description: "A physical QR or NFC item sold in the store.",
    revalidate: ["/admin/store", "/store"],
    fields: [
      { name: "name", label: "Product name", type: "text" },
      { name: "slug", label: "URL slug", type: "text" },
      { name: "category", label: "Category", type: "text", help: "CARD, STANDEE, STICKER, KEYCHAIN or KIT" },
      { name: "tech", label: "Technology", type: "text", help: "QR, NFC or BOTH" },
      { name: "description", label: "Description", type: "textarea" },
      money("price", "Price"),
      money("compareAt", "Was price"),
      { name: "features", label: "What's included", type: "list" },
    ] as Field[],
  },

  post: {
    label: "Articles",
    singular: "Article",
    model: "post",
    titleField: "title",
    description: "A post on /resources.",
    revalidate: ["/admin/blog", "/resources"],
    fields: [
      { name: "title", label: "Title", type: "text" },
      { name: "slug", label: "URL slug", type: "text" },
      { name: "excerpt", label: "Excerpt", type: "textarea" },
      { name: "body", label: "Body", type: "textarea", help: "Markdown is fine." },
      { name: "tags", label: "Tags", type: "list" },
      { name: "coverUrl", label: "Cover image URL", type: "url" },
      { name: "isPublished", label: "Publish now? (yes/no)", type: "text" },
    ] as Field[],
  },

  creator: {
    label: "Creators",
    singular: "Creator",
    model: "creator",
    titleField: "handle",
    description: "A creator on the roster, with reach and rate card.",
    revalidate: ["/admin/creators"],
    fields: [
      { name: "handle", label: "Handle", type: "text", placeholder: "@blrfoodwalk" },
      { name: "city", label: "City", type: "text" },
      { name: "categories", label: "Categories", type: "list" },
      { name: "followers", label: "Followers", type: "number" },
      { name: "avgViews", label: "Average views", type: "number" },
      money("rateCard", "Rate per deliverable"),
      { name: "isVerified", label: "Verified? (yes/no)", type: "text" },
      { name: "bio", label: "Notes", type: "textarea" },
    ] as Field[],
  },
  offer: {
    label: "Offers",
    singular: "Offer",
    model: "offer",
    titleField: "title",
    description: "A promotion shown on the public profile.",
    revalidate: ["/business/offers", "/b"],
    fields: [
      { name: "title", label: "Offer", type: "text", placeholder: "Weekday 20% off" },
      { name: "detail", label: "Terms", type: "textarea", placeholder: "Monday to Thursday, before 2pm." },
      { name: "code", label: "Coupon code", type: "text" },
      { name: "startsAt", label: "Starts", type: "text", placeholder: "2026-08-01" },
      { name: "endsAt", label: "Ends", type: "text" },
    ] as Field[],
  },

  loyaltyReward: {
    label: "Loyalty rewards",
    singular: "Reward",
    model: "loyaltyReward",
    titleField: "title",
    description: "What customers can trade points for.",
    revalidate: ["/business/loyalty"],
    fields: [
      { name: "title", label: "Reward", type: "text", placeholder: "₹200 off your next visit" },
      { name: "description", label: "Conditions", type: "textarea" },
      { name: "pointsCost", label: "Points required", type: "number" },
    ] as Field[],
  },

  menuItem: {
    label: "Menu items",
    singular: "Menu item",
    model: "menuItem",
    titleField: "name",
    description: "A dish on the digital menu.",
    revalidate: ["/business/menu", "/b"],
    fields: [
      { name: "name", label: "Dish name", type: "text" },
      { name: "categoryId", label: "Category ID", type: "text", help: "Copy it from the menu page." },
      { name: "description", label: "Description", type: "textarea", help: "One line on what it tastes like." },
      money("price", "Price"),
      { name: "foodType", label: "Food type", type: "text", help: "VEG, EGG or NON_VEG — legally required labelling in India." },
      { name: "spiceLevel", label: "Spice level", type: "number", help: "0 to 3." },
      { name: "prepMinutes", label: "Prep time in minutes", type: "number" },
    ] as Field[],
  },

  outlet: {
    label: "Locations",
    singular: "Outlet",
    model: "businessLocation",
    titleField: "name",
    description: "Another branch of this business, with its own codes and numbers.",
    revalidate: ["/business/locations"],
    fields: [
      { name: "name", label: "Outlet name", type: "text", placeholder: "Koramangala" },
      { name: "slug", label: "Slug", type: "text" },
      { name: "code", label: "Internal code", type: "text", placeholder: "BLR-KOR-02" },
      { name: "address", label: "Address", type: "textarea" },
      { name: "city", label: "City", type: "text" },
      { name: "pincode", label: "Pincode", type: "text" },
      { name: "phone", label: "Phone", type: "text" },
      { name: "managerName", label: "Manager", type: "text" },
      { name: "managerPhone", label: "Manager phone", type: "text" },
      { name: "gbpPlaceId", label: "Google Place ID", type: "text", help: "Each outlet has its own listing." },
    ] as Field[],
  },

  qrCampaign: {
    label: "Campaigns",
    singular: "Campaign",
    model: "qrCampaign",
    titleField: "name",
    description: "Ties a QR code, an offer and UTM tracking together.",
    revalidate: ["/business"],
    fields: [
      { name: "name", label: "Campaign name", type: "text" },
      { name: "slug", label: "Slug", type: "text", help: "Becomes the utm_campaign value." },
      { name: "goal", label: "Goal", type: "text", help: "LEADS, REVIEWS, ORDERS or AWARENESS" },
      { name: "landingHeadline", label: "Landing headline", type: "text" },
      { name: "offerText", label: "Offer", type: "text" },
      { name: "couponCode", label: "Coupon code", type: "text" },
      money("budget", "Budget"),
      { name: "startsAt", label: "Starts", type: "text", placeholder: "2026-09-01" },
      { name: "endsAt", label: "Ends", type: "text" },
    ] as Field[],
  },

  profileService: {
    label: "Services",
    singular: "Service",
    model: "profileService",
    titleField: "name",
    description: "A service and price shown on the public profile.",
    revalidate: ["/business/staff", "/b"],
    fields: [
      { name: "name", label: "Service", type: "text", placeholder: "Haircut & styling" },
      money("price", "Price"),
      { name: "priceNote", label: "Price note", type: "text", placeholder: "from" },
      { name: "durationMinutes", label: "Duration in minutes", type: "number" },
    ] as Field[],
  },
  staffCode: {
    label: "Staff codes",
    singular: "Staff code",
    model: "staffCode",
    titleField: "name",
    description: "A code for one person, printed on their badge. Reviews scanned through it are attributed to them.",
    revalidate: ["/business/staff-codes"],
    fields: [
      { name: "name", label: "Name", type: "text", placeholder: "Meena Rao" },
      { name: "code", label: "Code", type: "text", help: "Short — it goes on a lanyard. Uppercase, no spaces." },
      { name: "role", label: "Role", type: "text", placeholder: "Senior stylist" },
      { name: "outletId", label: "Outlet", type: "text", help: "Leave empty if you have one location." },
    ] as Field[],
  },
  arExperience: {
    label: "AR experiences",
    singular: "AR experience",
    model: "arExperience",
    titleField: "name",
    description: "Video that plays over printed artwork when a customer points their camera at it.",
    revalidate: ["/business/ar"],
    fields: [
      { name: "name", label: "Name", type: "text", placeholder: "Brunch menu card" },
      { name: "slug", label: "Address", type: "text", help: "Becomes /ar/{slug}. Don't change it once printed." },
      { name: "targetUrl", label: "Printed artwork", type: "url", help: "The image the camera looks for. Photographs and texture track well; flat colour doesn't." },
      { name: "contentType", label: "What plays", type: "text", help: "VIDEO, IMAGE or MODEL" },
      { name: "contentUrl", label: "Content URL", type: "url", help: "MP4 under 5MB. Longer than 15 seconds and most people walk away." },
      { name: "ctaLabel", label: "Button text", type: "text", placeholder: "Book a table" },
      { name: "ctaUrl", label: "Button link", type: "text" },
    ] as Field[],
  },
} satisfies Record<string, EntityDef>;

export type EntityKey = keyof typeof ENTITIES;

export const entityByKey = (key: string) =>
  (ENTITIES as Record<string, EntityDef>)[key] ?? null;

/** Service lines used across projects. */
export const DISCIPLINES = [
  "Development", "Design", "Branding", "Social media", "Video",
  "SEO", "Performance", "Automation", "Content", "Photography", "Drone",
] as const;

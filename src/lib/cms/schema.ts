/**
 * The CMS registry.
 *
 * Every editable part of the public site is declared here as a block with
 * typed fields. The admin editor renders itself from this — add a field and
 * the form grows, with no new UI code.
 */

export type FieldType = "text" | "textarea" | "number" | "url" | "image" | "list" | "repeater";

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  help?: string;
  placeholder?: string;
  fields?: Field[];
};

export type BlockDef = {
  key: string;
  label: string;
  group: "Home" | "Pages" | "Global" | "SEO";
  description: string;
  fields: Field[];
};

export const CMS_BLOCKS: BlockDef[] = [
  {
    key: "home.hero",
    label: "Homepage hero",
    group: "Home",
    description: "The first thing anyone sees. Headline, rotating phrases, badge and buttons.",
    fields: [
      { name: "badge", label: "Availability badge", type: "text", placeholder: "Taking on 4 new retainers for Q3" },
      { name: "headingLine1", label: "Heading, line 1", type: "text" },
      { name: "headingLine2", label: "Heading, line 2", type: "text" },
      { name: "rotations", label: "Rotating phrases", type: "list", help: "Cycles every 2.6 seconds. Keep each under 30 characters." },
      { name: "subheading", label: "Supporting paragraph", type: "textarea" },
      { name: "pills", label: "Capability pills", type: "list" },
      { name: "primaryCtaLabel", label: "Primary button", type: "text" },
      { name: "primaryCtaHref", label: "Primary button link", type: "text" },
      { name: "secondaryCtaLabel", label: "Secondary button", type: "text" },
      { name: "secondaryCtaHref", label: "Secondary button link", type: "text" }
    ]
  },
  {
    key: "home.stats",
    label: "Headline statistics",
    group: "Home",
    description: "The four numbers under the hero. Also reused on the About page.",
    fields: [
      {
        name: "items", label: "Statistics", type: "repeater",
        fields: [
          { name: "value", label: "Figure", type: "text", placeholder: "140+" },
          { name: "label", label: "Caption", type: "text", placeholder: "Brands launched" }
        ]
      }
    ]
  },
  {
    key: "home.trusted",
    label: "Client logo strip",
    group: "Home",
    description: "Scrolling wordmarks. Replace the placeholders before launch.",
    fields: [
      { name: "heading", label: "Strip caption", type: "text" },
      { name: "names", label: "Client names", type: "list" }
    ]
  },
  {
    key: "home.testimonials",
    label: "Testimonials",
    group: "Home",
    description: "Quotes shown on the homepage.",
    fields: [
      {
        name: "items", label: "Quotes", type: "repeater",
        fields: [
          { name: "quote", label: "Quote", type: "textarea" },
          { name: "author", label: "Name", type: "text" },
          { name: "role", label: "Role and company", type: "text" }
        ]
      }
    ]
  },
  {
    key: "home.faqs",
    label: "Homepage FAQ",
    group: "Home",
    description: "Also feeds FAQPage structured data for Google.",
    fields: [
      {
        name: "items", label: "Questions", type: "repeater",
        fields: [
          { name: "q", label: "Question", type: "text" },
          { name: "a", label: "Answer", type: "textarea" }
        ]
      }
    ]
  },
  {
    key: "pricing.retainers",
    label: "Retainer pricing",
    group: "Pages",
    description: "Agency retainer tiers. Mark exactly one as featured.",
    fields: [
      {
        name: "plans", label: "Plans", type: "repeater",
        fields: [
          { name: "name", label: "Plan name", type: "text" },
          { name: "description", label: "One-line description", type: "text" },
          { name: "price", label: "Price", type: "text", placeholder: "Rs 35,000" },
          { name: "unit", label: "Unit", type: "text", placeholder: "/month" },
          { name: "features", label: "Features", type: "list" },
          { name: "cta", label: "Button label", type: "text" },
          { name: "featured", label: "Featured? (yes/no)", type: "text" }
        ]
      }
    ]
  },
  {
    key: "contact.details",
    label: "Contact details",
    group: "Pages",
    description: "Used on the contact page, in the footer, in emails and in structured data.",
    fields: [
      { name: "email", label: "Email", type: "text" },
      { name: "phone", label: "Phone", type: "text" },
      { name: "whatsapp", label: "WhatsApp number", type: "text" },
      { name: "address", label: "Address", type: "textarea" },
      { name: "hours", label: "Opening hours", type: "text" },
      { name: "mapUrl", label: "Google Maps link", type: "url" }
    ]
  },
  {
    key: "about.story",
    label: "About - story",
    group: "Pages",
    description: "The narrative sections on the About page.",
    fields: [
      {
        name: "sections", label: "Sections", type: "repeater",
        fields: [
          { name: "heading", label: "Heading", type: "text" },
          { name: "body", label: "Body", type: "textarea" }
        ]
      }
    ]
  },
  {
    key: "global.brand",
    label: "Brand and identity",
    group: "Global",
    description: "Name, tagline and the colours used across the site.",
    fields: [
      { name: "siteName", label: "Site name", type: "text" },
      { name: "tagline", label: "Tagline", type: "text" },
      { name: "logoUrl", label: "Logo", type: "image" },
      { name: "primaryColor", label: "Primary colour", type: "text", placeholder: "#8BB72C" },
      { name: "inkColor", label: "Dark colour", type: "text", placeholder: "#121F2F" }
    ]
  },
  {
    key: "global.footer",
    label: "Footer",
    group: "Global",
    description: "Footer blurb, social links and the copyright line.",
    fields: [
      { name: "blurb", label: "Footer paragraph", type: "textarea" },
      { name: "instagram", label: "Instagram URL", type: "url" },
      { name: "linkedin", label: "LinkedIn URL", type: "url" },
      { name: "youtube", label: "YouTube URL", type: "url" },
      { name: "whatsapp", label: "WhatsApp URL", type: "url" },
      { name: "copyright", label: "Copyright line", type: "text" }
    ]
  },
  {
    key: "global.announcement",
    label: "Announcement bar",
    group: "Global",
    description: "Optional strip above the header. Leave the message empty to hide it.",
    fields: [
      { name: "message", label: "Message", type: "text" },
      { name: "linkLabel", label: "Link label", type: "text" },
      { name: "linkHref", label: "Link URL", type: "text" }
    ]
  },
  {
    key: "global.navigation",
    label: "Navigation menu",
    group: "Global",
    description: "The header links and the button on the right. Order here is order on the site.",
    fields: [
      {
        name: "items", label: "Header links", type: "repeater",
        fields: [
          { name: "label", label: "Label", type: "text" },
          { name: "href", label: "Link", type: "text", placeholder: "/services" }
        ]
      },
      { name: "ctaLabel", label: "Header button", type: "text", placeholder: "Book a call" },
      { name: "ctaHref", label: "Header button link", type: "text", placeholder: "/contact" },
      { name: "loginLabel", label: "Login link", type: "text", placeholder: "Client login" }
    ]
  },
  {
    key: "global.theme",
    label: "Colours and type",
    group: "Global",
    description: "Site-wide colours and fonts. Changing these affects every page at once.",
    fields: [
      { name: "primary", label: "Primary colour", type: "text", placeholder: "#8BB72C" },
      { name: "ink", label: "Dark colour", type: "text", placeholder: "#121F2F" },
      { name: "background", label: "Background", type: "text", placeholder: "#F8F7F4" },
      { name: "displayFont", label: "Display font", type: "text", placeholder: "Zen Dots" },
      { name: "bodyFont", label: "Body font", type: "text", placeholder: "Albert Sans" },
      { name: "radius", label: "Corner radius", type: "text", placeholder: "12px" }
    ]
  },
  {
    key: "seo.defaults",
    label: "Default SEO",
    group: "SEO",
    description: "Fallback title and description for pages that do not set their own.",
    fields: [
      { name: "titleTemplate", label: "Title template", type: "text", placeholder: "%s - BMU.Marketing" },
      { name: "defaultTitle", label: "Default title", type: "text" },
      { name: "description", label: "Meta description", type: "textarea" },
      { name: "keywords", label: "Keywords", type: "list" },
      { name: "ogImage", label: "Social share image", type: "image" }
    ]
  }
];

export const blockByKey = (key: string) => CMS_BLOCKS.find((b) => b.key === key);

export const CMS_GROUPS = ["Home", "Pages", "Global", "SEO"] as const;

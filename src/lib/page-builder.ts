import type { Field } from "@/lib/cms/schema";

/**
 * Section types available in the page builder.
 *
 * Deliberately a fixed set rather than free HTML. Every section renders with
 * the site's own type scale and spacing, so a page built here can't end up
 * looking like a different website — which is what happens the moment someone
 * is handed a rich-text box and a font picker.
 */
export type SectionType =
  | "hero" | "heading" | "subheading" | "text" | "image" | "cta"
  | "features" | "stats" | "quote" | "faq" | "columns" | "divider" | "embed";

export type SectionDef = {
  type: SectionType;
  label: string;
  group: "Text" | "Media" | "Layout" | "Conversion";
  description: string;
  icon: string;
  fields: Field[];
};

export const SECTION_TYPES: SectionDef[] = [
  {
    type: "hero",
    label: "Page hero",
    group: "Text",
    icon: "Sparkles",
    description: "Large opening block with an eyebrow, main heading and lead paragraph.",
    fields: [
      { name: "eyebrow", label: "Eyebrow", type: "text", placeholder: "Case study" },
      { name: "heading", label: "Main heading", type: "text" },
      { name: "lede", label: "Lead paragraph", type: "textarea" },
      { name: "ctaLabel", label: "Button text", type: "text" },
      { name: "ctaHref", label: "Button link", type: "text", placeholder: "/contact" },
    ],
  },
  {
    type: "heading",
    label: "Main heading",
    group: "Text",
    icon: "Heading1",
    description: "A section title, with an optional line beneath it.",
    fields: [
      { name: "eyebrow", label: "Eyebrow", type: "text" },
      { name: "heading", label: "Heading", type: "text" },
      { name: "lede", label: "Supporting line", type: "textarea" },
      { name: "align", label: "Alignment", type: "text", help: "left or center" },
    ],
  },
  {
    type: "subheading",
    label: "Subheading",
    group: "Text",
    icon: "Heading2",
    description: "A smaller heading for breaking up a long page.",
    fields: [{ name: "heading", label: "Subheading", type: "text" }],
  },
  {
    type: "text",
    label: "Paragraphs",
    group: "Text",
    icon: "AlignLeft",
    description: "Body copy. One paragraph per line.",
    fields: [
      { name: "paragraphs", label: "Paragraphs", type: "list", help: "One per line. Blank lines are ignored." },
      { name: "width", label: "Width", type: "text", help: "narrow or full" },
    ],
  },
  {
    type: "image",
    label: "Image",
    group: "Media",
    icon: "Image",
    description: "A full-width image with an optional caption.",
    fields: [
      { name: "url", label: "Image URL", type: "url" },
      { name: "alt", label: "Alt text", type: "text", help: "Describe it for screen readers and search." },
      { name: "caption", label: "Caption", type: "text" },
    ],
  },
  {
    type: "features",
    label: "Feature grid",
    group: "Layout",
    icon: "LayoutGrid",
    description: "Three-across cards, each with a title and a line of detail.",
    fields: [
      { name: "heading", label: "Section heading", type: "text" },
      {
        name: "items", label: "Features", type: "repeater",
        fields: [
          { name: "title", label: "Title", type: "text" },
          { name: "body", label: "Detail", type: "textarea" },
        ],
      },
    ],
  },
  {
    type: "columns",
    label: "Two columns",
    group: "Layout",
    icon: "Columns2",
    description: "Text on one side, an image on the other.",
    fields: [
      { name: "heading", label: "Heading", type: "text" },
      { name: "body", label: "Body", type: "textarea" },
      { name: "imageUrl", label: "Image URL", type: "url" },
      { name: "imageSide", label: "Image side", type: "text", help: "left or right" },
    ],
  },
  {
    type: "stats",
    label: "Numbers",
    group: "Layout",
    icon: "TrendingUp",
    description: "A row of figures with labels.",
    fields: [
      {
        name: "items", label: "Figures", type: "repeater",
        fields: [
          { name: "value", label: "Figure", type: "text", placeholder: "312%" },
          { name: "label", label: "What it measures", type: "text" },
        ],
      },
    ],
  },
  {
    type: "quote",
    label: "Quote",
    group: "Text",
    icon: "Quote",
    description: "A pulled quote with attribution.",
    fields: [
      { name: "quote", label: "Quote", type: "textarea" },
      { name: "author", label: "Who said it", type: "text" },
      { name: "role", label: "Their role", type: "text" },
    ],
  },
  {
    type: "faq",
    label: "FAQ",
    group: "Text",
    icon: "MessageCircleQuestion",
    description: "Expandable questions and answers.",
    fields: [
      { name: "heading", label: "Section heading", type: "text" },
      {
        name: "items", label: "Questions", type: "repeater",
        fields: [
          { name: "q", label: "Question", type: "text" },
          { name: "a", label: "Answer", type: "textarea" },
        ],
      },
    ],
  },
  {
    type: "cta",
    label: "Call to action",
    group: "Conversion",
    icon: "MousePointerClick",
    description: "A dark band with a heading and a button.",
    fields: [
      { name: "heading", label: "Heading", type: "text" },
      { name: "body", label: "Supporting line", type: "textarea" },
      { name: "ctaLabel", label: "Button text", type: "text" },
      { name: "ctaHref", label: "Button link", type: "text" },
    ],
  },
  {
    type: "divider",
    label: "Divider",
    group: "Layout",
    icon: "Minus",
    description: "A horizontal rule with space around it.",
    fields: [],
  },
  {
    type: "embed",
    label: "Video embed",
    group: "Media",
    icon: "Video",
    description: "A YouTube or Vimeo video.",
    fields: [
      { name: "url", label: "Video URL", type: "url", help: "Paste the normal watch link — we convert it." },
      { name: "caption", label: "Caption", type: "text" },
    ],
  },
];

export const sectionByType = (t: string) => SECTION_TYPES.find((s) => s.type === t) ?? null;

export const SECTION_GROUPS = ["Text", "Media", "Layout", "Conversion"] as const;

export type PageSection = {
  id: string;
  type: SectionType;
  data: Record<string, unknown>;
};

/** Turns a watch link into something an iframe accepts. */
export function embedUrl(raw: string): string | null {
  if (!raw) return null;
  const yt = raw.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const vimeo = raw.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  if (raw.includes("/embed/") || raw.includes("player.")) return raw;
  return null;
}

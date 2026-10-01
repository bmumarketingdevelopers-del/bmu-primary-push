import type { Field } from "@/lib/cms/schema";

/** Buttons and links on the public profile, in display order. */
export const PROFILE_LINK_FIELDS: Field[] = [
  {
    name: "links",
    label: "Buttons and links",
    type: "repeater",
    help: "The first four that match your category become the big buttons. Drag order is the order shown.",
    fields: [
      {
        name: "type", label: "Type", type: "text",
        placeholder: "WHATSAPP",
        help: "PHONE, WHATSAPP, EMAIL, WEBSITE, DIRECTIONS, INSTAGRAM, FACEBOOK, YOUTUBE, LINKEDIN, GOOGLE_REVIEW, PAYMENT, BOOKING, MENU, CATALOGUE, BROCHURE or CUSTOM",
      },
      { name: "label", label: "Button text", type: "text", placeholder: "WhatsApp us" },
      { name: "value", label: "Where it goes", type: "text", placeholder: "919845000111 or https://…" },
    ],
  },
];

/** Service and price list shown under the buttons. */
export const PROFILE_SERVICE_FIELDS: Field[] = [
  {
    name: "services",
    label: "Services and prices",
    type: "repeater",
    fields: [
      { name: "name", label: "Service", type: "text", placeholder: "Haircut & styling" },
      { name: "price", label: "Price in paise", type: "number", help: "45000 shows as ₹450. Leave empty for 'on request'." },
      { name: "note", label: "Price note", type: "text", placeholder: "from" },
    ],
  },
];

/** Promotional boxes. */
export const PROFILE_OFFER_FIELDS: Field[] = [
  {
    name: "offers",
    label: "Offers",
    type: "repeater",
    help: "Shown in a dashed box near the top. Remove one and it disappears from the live page immediately.",
    fields: [
      { name: "title", label: "Offer", type: "text", placeholder: "Weekday 20% off" },
      { name: "detail", label: "Terms", type: "textarea", placeholder: "Monday to Thursday, before 2pm." },
    ],
  },
];

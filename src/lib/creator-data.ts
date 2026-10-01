/** Creator portal demo data. Shapes mirror Creator and CreatorBooking. */

export const CREATOR_PROFILE = {
  handle: "@blrfoodwalk",
  name: "Nandita Prakash",
  city: "Bengaluru",
  categories: ["Food", "Restaurants", "Cafes"],
  followers: 184000,
  avgViews: 62000,
  rateCard: 3_50_000,
  isVerified: true,
  bio: "Bengaluru food and cafe content. Reels-first, one collab a week, no alcohol brands.",
};

export const CREATOR_KPIS = [
  { label: "Earned this quarter", value: "₹2.4L", delta: 31.5, sub: "across 7 campaigns", icon: "IndianRupee" },
  { label: "Active bookings", value: "3", delta: 50, sub: "2 briefs need a response", icon: "Clapperboard" },
  { label: "Avg views delivered", value: "62K", delta: 12.8, sub: "last 10 deliverables", icon: "Eye" },
  { label: "On-time delivery", value: "96%", delta: 4, sub: "27 of 28 deliverables", icon: "CircleCheck" },
];

export type Booking = {
  id: string;
  campaign: string;
  brand: string;
  deliverables: string;
  fee: number;
  status: "INVITED" | "BOOKED" | "IN_PRODUCTION" | "SUBMITTED" | "APPROVED" | "PAID";
  dueAt: string;
};

export const BOOKINGS: Booking[] = [
  { id: "BK-412", campaign: "Weekend brunch launch", brand: "Saffron & Co", deliverables: "1 reel + 3 stories", fee: 3_50_000, status: "INVITED", dueAt: "2026-08-18" },
  { id: "BK-408", campaign: "Monsoon staycation", brand: "Blue Harbour Resorts", deliverables: "2 reels + 1 carousel", fee: 6_20_000, status: "IN_PRODUCTION", dueAt: "2026-08-14" },
  { id: "BK-401", campaign: "New menu tasting", brand: "Saffron & Co", deliverables: "1 reel", fee: 3_50_000, status: "SUBMITTED", dueAt: "2026-08-08" },
  { id: "BK-396", campaign: "Cafe opening day", brand: "Meraki Studio", deliverables: "1 reel + 5 stories", fee: 2_80_000, status: "APPROVED", dueAt: "2026-07-28" },
  { id: "BK-388", campaign: "Festive hamper", brand: "Saffron & Co", deliverables: "1 carousel", fee: 1_60_000, status: "PAID", dueAt: "2026-07-11" },
];

export const BRIEFS = [
  {
    id: "BK-412",
    brand: "Saffron & Co",
    campaign: "Weekend brunch launch",
    fee: 3_50_000,
    respondBy: "2026-08-09",
    summary: "Launch the new weekend brunch menu across the Indiranagar outlet. Shoot on a Saturday between 10am and 1pm for natural light.",
    mustInclude: [
      "The truffle eggs and the filter coffee, both by name",
      "Outlet tagged in-frame and in caption",
      "Booking link in the story sticker",
    ],
    avoid: ["No alcohol in frame", "No competitor cafes in the same reel"],
  },
  {
    id: "BK-408",
    brand: "Blue Harbour Resorts",
    campaign: "Monsoon staycation",
    fee: 6_20_000,
    respondBy: "2026-08-10",
    summary: "Two-night stay covered. Show the monsoon, not the sun — the whole point is that the coast is better in the rain.",
    mustInclude: [
      "Sea-facing room and the breakfast spread",
      "Discount code MONSOON26 in the caption",
    ],
    avoid: ["No drone footage — the property has its own", "Don't name the room rate"],
  },
];

export const PAYOUTS = [
  { id: "PO-118", period: "July 2026", bookings: 2, gross: 4_40_000, tds: 44_000, net: 3_96_000, status: "PAID", paidAt: "2026-08-02" },
  { id: "PO-114", period: "June 2026", bookings: 3, gross: 8_60_000, tds: 86_000, net: 7_74_000, status: "PAID", paidAt: "2026-07-03" },
  { id: "PO-121", period: "August 2026", bookings: 2, gross: 9_70_000, tds: 97_000, net: 8_73_000, status: "PENDING", paidAt: null },
];

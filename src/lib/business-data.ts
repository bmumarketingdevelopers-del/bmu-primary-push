/**
 * Tenant dashboard demo data — what one business owner sees about their own
 * account. Scoped by clientId on the session, which for BUSINESS users holds
 * the business slug.
 */

export const BUSINESS_KPIS = [
  { label: "Profile views", value: "3,842", delta: 22.4, sub: "from QR and NFC scans", icon: "Eye" },
  { label: "Reviews collected", value: "218", delta: 31.1, sub: "4.8 average on Google", icon: "Star" },
  { label: "WhatsApp clicks", value: "946", delta: 18.7, sub: "32% of all profile views", icon: "MessageCircle" },
  { label: "Leads captured", value: "74", delta: -4.2, sub: "12 unread", icon: "Users" },
];

export const SCAN_TREND = [
  { day: "Mon", scans: 412, unique: 318 },
  { day: "Tue", scans: 388, unique: 291 },
  { day: "Wed", scans: 451, unique: 344 },
  { day: "Thu", scans: 508, unique: 402 },
  { day: "Fri", scans: 694, unique: 561 },
  { day: "Sat", scans: 902, unique: 748 },
  { day: "Sun", scans: 487, unique: 381 },
];

export const ACTION_SPLIT = [
  { name: "WhatsApp", value: 946, color: "#8BB72C" },
  { name: "Book appointment", value: 612, color: "#1F3B56" },
  { name: "Call", value: 488, color: "#6D961F" },
  { name: "Directions", value: 341, color: "#C2C2C2" },
  { name: "Pay now", value: 129, color: "#203348" },
];

export type BusinessQr = {
  id: string;
  code: string;
  label: string;
  kind: string;
  destination: string;
  scans: number;
  isActive: boolean;
  placement: string;
};

export const BUSINESS_QRS: BusinessQr[] = [
  { id: "SQ-01", code: "abc-salon", label: "Reception standee", kind: "PROFILE", destination: "/b/abc-salon", scans: 1842, isActive: true, placement: "Front desk" },
  { id: "SQ-02", code: "abc-review", label: "Billing counter — review card", kind: "GOOGLE_REVIEW", destination: "/r/abc-salon", scans: 1104, isActive: true, placement: "Counter" },
  { id: "SQ-03", code: "abc-wa", label: "Window sticker — WhatsApp", kind: "WHATSAPP", destination: "https://wa.me/919845000111", scans: 621, isActive: true, placement: "Shopfront" },
  { id: "SQ-04", code: "abc-pay", label: "UPI payment", kind: "PAYMENT", destination: "upi://pay?pa=abcsalon@upi", scans: 275, isActive: true, placement: "Counter" },
  { id: "SQ-05", code: "abc-diwali", label: "Diwali offer (ended)", kind: "OFFER", destination: "/b/abc-salon", scans: 88, isActive: false, placement: "Mirror stations" },
];

export const NFC_CARDS = [
  { serial: "NFC-88214", holder: "Meena Rao (Owner)", taps: 412, status: "ACTIVE" },
  { serial: "NFC-88215", holder: "Front desk card", taps: 1180, status: "ACTIVE" },
  { serial: "NFC-88216", holder: "Unassigned", taps: 0, status: "UNASSIGNED" },
];

export type Feedback = {
  id: string;
  sentiment: "POSITIVE" | "NEUTRAL" | "NEGATIVE";
  comment: string | null;
  name: string | null;
  phone: string | null;
  routedToGoogle: boolean;
  isResolved: boolean;
  createdAt: string;
};

export const FEEDBACK: Feedback[] = [
  { id: "F-311", sentiment: "NEGATIVE", comment: "Waited 40 minutes past my appointment slot and nobody said anything.", name: "Sridhar K.", phone: "+91 98450 22114", routedToGoogle: false, isResolved: false, createdAt: "2026-08-06" },
  { id: "F-310", sentiment: "NEUTRAL", comment: "Cut was fine but the place was very noisy on a Saturday.", name: "Anon", phone: null, routedToGoogle: false, isResolved: false, createdAt: "2026-08-05" },
  { id: "F-309", sentiment: "POSITIVE", comment: null, name: null, phone: null, routedToGoogle: true, isResolved: true, createdAt: "2026-08-05" },
  { id: "F-308", sentiment: "NEGATIVE", comment: "Colour came out darker than what I asked for.", name: "Divya M.", phone: "+91 99001 77220", routedToGoogle: false, isResolved: true, createdAt: "2026-08-03" },
  { id: "F-307", sentiment: "POSITIVE", comment: null, name: null, phone: null, routedToGoogle: true, isResolved: true, createdAt: "2026-08-03" },
];

export const BUSINESS_LEADS = [
  { id: "BL-92", name: "Kavya Suresh", phone: "+91 98860 11223", source: "QR", message: "Bridal package pricing?", status: "NEW", createdAt: "2026-08-06" },
  { id: "BL-91", name: "Arun Pillai", phone: "+91 97418 55031", source: "WHATSAPP", message: "Do you do beard styling?", status: "NEW", createdAt: "2026-08-06" },
  { id: "BL-90", name: "Nisha B.", phone: "+91 90350 88712", source: "OFFER", message: "Claiming the weekday 20% off", status: "CONTACTED", createdAt: "2026-08-05" },
  { id: "BL-88", name: "Rakesh Jain", phone: "+91 88670 44190", source: "QR", message: "Membership plans", status: "CONVERTED", createdAt: "2026-08-02" },
];

export const CONTACTS = [
  { id: "CT-14", name: "Nisha B.", phone: "+91 90350 88712", visits: 9, points: 840, lastSeen: "2026-08-05", tags: ["VIP", "Repeat"] },
  { id: "CT-11", name: "Sridhar K.", phone: "+91 98450 22114", visits: 4, points: 320, lastSeen: "2026-08-06", tags: ["Repeat"] },
  { id: "CT-08", name: "Divya M.", phone: "+91 99001 77220", visits: 2, points: 140, lastSeen: "2026-08-03", tags: ["New"] },
  { id: "CT-05", name: "Arun Pillai", phone: "+91 97418 55031", visits: 1, points: 60, lastSeen: "2026-08-06", tags: ["New"] },
];

export const BUSINESS_OFFERS = [
  { id: "OF-4", title: "Weekday 20% off", detail: "Monday to Thursday, before 2pm.", code: "WEEK20", claims: 68, isActive: true, endsAt: "2026-09-30" },
  { id: "OF-3", title: "Refer a friend — ₹300 credit", detail: "Both of you get credit on the next visit.", code: "REFER300", claims: 24, isActive: true, endsAt: null },
  { id: "OF-2", title: "Diwali bundle", detail: "Facial plus haircut at ₹1,499.", code: "DIWALI", claims: 141, isActive: false, endsAt: "2025-11-05" },
];

export const PLANS = [
  { tier: "FREE", name: "Free", price: 0, qr: "1 QR", features: ["Basic profile", "Basic analytics"] },
  { tier: "STARTER", name: "Starter", price: 49900, qr: "5 QR", features: ["Dynamic QR", "Digital profile", "WhatsApp button", "Social links", "Analytics"] },
  { tier: "BUSINESS", name: "Business", price: 149900, qr: "Unlimited QR", features: ["Everything in Starter", "Lead capture", "Review booster", "Offers", "Customer CRM", "Custom branding"], popular: true },
  { tier: "PRO", name: "Pro", price: 399900, qr: "Unlimited QR", features: ["Everything in Business", "Menu and ordering", "Bookings", "WhatsApp automation", "AI assistant", "Advanced analytics"] },
];

export const CURRENT_SUBSCRIPTION = {
  tier: "BUSINESS",
  status: "ACTIVE",
  renewsAt: "2027-02-14",
  amount: 149900,
};

/** Drives the completeness meter — the single best nudge for activation. */
export const PROFILE_CHECKLIST = [
  { label: "Business name and category", done: true },
  { label: "Logo uploaded", done: true },
  { label: "Phone and WhatsApp", done: true },
  { label: "Address and map location", done: true },
  { label: "Google review link connected", done: true },
  { label: "Services with prices", done: true },
  { label: "Opening hours", done: false },
  { label: "Cover photo", done: false },
  { label: "At least one offer", done: true },
];

/* ---------------------------- Bookings ---------------------------- */

export type BookingRow = {
  reference: string;
  customer: string;
  phone: string;
  service: string;
  staff: string;
  startsAt: string; // ISO-ish "2026-08-07T11:00"
  duration: number;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
  source: string;
};

export const BOOKINGS: BookingRow[] = [
  { reference: "BK-8H2K1P", customer: "Kavya Suresh", phone: "+91 98860 11223", service: "Bridal trial", staff: "Meena Rao", startsAt: "2026-08-07T11:00", duration: 180, status: "CONFIRMED", source: "QR" },
  { reference: "BK-3PQ90A", customer: "Nisha B.", phone: "+91 90350 88712", service: "Hair colour", staff: "Meena Rao", startsAt: "2026-08-07T15:30", duration: 120, status: "CONFIRMED", source: "QR" },
  { reference: "BK-77LZ2C", customer: "Arun Pillai", phone: "+91 97418 55031", service: "Haircut & styling", staff: "Farhan Q.", startsAt: "2026-08-07T12:30", duration: 45, status: "PENDING", source: "WHATSAPP" },
  { reference: "BK-51MDX8", customer: "Divya M.", phone: "+91 99001 77220", service: "Facial", staff: "Latha S.", startsAt: "2026-08-08T13:00", duration: 60, status: "CONFIRMED", source: "PROFILE" },
  { reference: "BK-2AA419", customer: "Sridhar K.", phone: "+91 98450 22114", service: "Haircut & styling", staff: "Farhan Q.", startsAt: "2026-08-06T17:00", duration: 45, status: "COMPLETED", source: "QR" },
  { reference: "BK-9WE013", customer: "Rakesh Jain", phone: "+91 88670 44190", service: "Facial", staff: "Latha S.", startsAt: "2026-08-05T11:30", duration: 60, status: "NO_SHOW", source: "QR" },
];

export const STAFF_ROSTER = [
  { id: "st-1", name: "Meena Rao", role: "Senior stylist · colour specialist", days: "Mon–Sat", hours: "10:00–19:00", breakAt: "14:00–14:45", bookingsThisWeek: 24, isBookable: true },
  { id: "st-2", name: "Farhan Q.", role: "Stylist", days: "Mon–Sat", hours: "11:00–20:00", breakAt: "15:00–15:30", bookingsThisWeek: 31, isBookable: true },
  { id: "st-3", name: "Latha S.", role: "Beauty therapist", days: "Sun, Tue, Thu, Sat", hours: "10:00–17:00", breakAt: "—", bookingsThisWeek: 12, isBookable: true },
];

export const TABLES = [
  { label: "Table 1", seats: 2, scans: 214, isActive: true },
  { label: "Table 2", seats: 4, scans: 388, isActive: true },
  { label: "Table 7", seats: 6, scans: 302, isActive: true },
  { label: "Terrace 1", seats: 4, scans: 156, isActive: true },
  { label: "Terrace 2", seats: 4, scans: 141, isActive: false },
];

/* ------------------------- Orders (restaurant) ------------------------- */

export type KitchenOrder = {
  id: string;
  reference: string;
  table: string | null;
  channel: "DINE_IN" | "TAKEAWAY";
  status: "PLACED" | "ACCEPTED" | "PREPARING" | "READY" | "SERVED" | "COMPLETED";
  placedAt: string;
  minutesAgo: number;
  isPaid: boolean;
  total: number;
  lines: { name: string; quantity: number; note?: string }[];
};

export const KITCHEN_ORDERS: KitchenOrder[] = [
  {
    id: "demo-4821", reference: "#4821", table: "Table 7", channel: "DINE_IN", status: "PLACED",
    placedAt: "20:14", minutesAgo: 2, isPaid: false, total: 132300,
    lines: [
      { name: "Butter chicken", quantity: 1 },
      { name: "Dal makhani", quantity: 1 },
      { name: "Butter naan", quantity: 4 },
      { name: "Jeera rice", quantity: 1, note: "Less oil" },
    ],
  },
  {
    id: "demo-4820", reference: "#4820", table: "Terrace 2", channel: "DINE_IN", status: "PREPARING",
    placedAt: "20:06", minutesAgo: 10, isPaid: false, total: 86100,
    lines: [
      { name: "Paneer tikka", quantity: 1 },
      { name: "Hyderabadi biryani", quantity: 1, note: "Extra raita" },
    ],
  },
  {
    id: "demo-4819", reference: "#4819", table: null, channel: "TAKEAWAY", status: "READY",
    placedAt: "19:58", minutesAgo: 18, isPaid: true, total: 54600,
    lines: [{ name: "Rogan josh", quantity: 1 }, { name: "Laccha paratha", quantity: 2 }],
  },
  {
    id: "demo-4818", reference: "#4818", table: "Table 2", channel: "DINE_IN", status: "SERVED",
    placedAt: "19:41", minutesAgo: 35, isPaid: false, total: 71400,
    lines: [{ name: "Murgh malai kebab", quantity: 1 }, { name: "Kadhai paneer", quantity: 1 }],
  },
];

export const MENU_STATS = {
  ordersToday: 184,
  salesToday: 2845000,
  averageOrder: 15462,
  topItem: "Butter chicken",
  peakHour: "8–9 PM",
  pending: 2,
};

/* ------------------------------ Loyalty ------------------------------- */

export const LOYALTY_PROGRAM = {
  isActive: true,
  mode: "POINTS" as "POINTS" | "VISITS",
  pointsPerRupee: 0.01, // 1 point per ₹100
  visitsForReward: 7,
  expiryMonths: 12,
  members: 214,
  pointsIssued: 48620,
  pointsRedeemed: 12400,
};

export const LOYALTY_REWARDS = [
  { id: "lr-1", title: "₹200 off your next visit", pointsCost: 200, redeemed: 41, isActive: true },
  { id: "lr-2", title: "Free head massage", pointsCost: 350, redeemed: 27, isActive: true },
  { id: "lr-3", title: "Complimentary facial", pointsCost: 900, redeemed: 8, isActive: true },
  { id: "lr-4", title: "Diwali gift box", pointsCost: 600, redeemed: 62, isActive: false },
];

export const LOYALTY_LEDGER = [
  { id: "lt-9", customer: "Nisha B.", kind: "REDEEM", points: -350, note: "Free head massage", createdAt: "2026-08-06" },
  { id: "lt-8", customer: "Sridhar K.", kind: "EARN", points: 45, note: "Haircut · ₹4,500", createdAt: "2026-08-06" },
  { id: "lt-7", customer: "Nisha B.", kind: "EARN", points: 180, note: "Hair colour · ₹18,000", createdAt: "2026-08-05" },
  { id: "lt-6", customer: "Divya M.", kind: "EARN", points: 120, note: "Facial · ₹12,000", createdAt: "2026-08-03" },
  { id: "lt-5", customer: "Arun Pillai", kind: "ADJUST", points: 60, note: "Goodwill after delay", createdAt: "2026-08-02" },
];

/* ------------------------------ Partners ------------------------------ */

export const PARTNERS = [
  { id: "PT-06", slug: "northline-digital", name: "Northline Digital", type: "AGENCY", city: "Bengaluru", clients: 34, mrr: 4_20_000, commissionPct: 20, whiteLabel: true, domain: "qr.northline.in", isActive: true },
  { id: "PT-05", slug: "coastal-media", name: "Coastal Media", type: "AGENCY", city: "Mangaluru", clients: 18, mrr: 2_16_000, commissionPct: 20, whiteLabel: true, domain: "smart.coastalmedia.co", isActive: true },
  { id: "PT-04", slug: "vyapar-solutions", name: "Vyapar Solutions", type: "RESELLER", city: "Hubballi", clients: 47, mrr: 3_84_000, commissionPct: 25, whiteLabel: false, domain: null, isActive: true },
  { id: "PT-03", slug: "deccan-print", name: "Deccan Print House", type: "RESELLER", city: "Pune", clients: 12, mrr: 96_000, commissionPct: 25, whiteLabel: false, domain: null, isActive: true },
  { id: "PT-02", slug: "spice-route-fnb", name: "Spice Route F&B Group", type: "FRANCHISE", city: "Chennai", clients: 22, mrr: 2_64_000, commissionPct: 15, whiteLabel: true, domain: "qr.spiceroute.in", isActive: true },
  { id: "PT-01", slug: "orbit-agency", name: "Orbit Agency", type: "AGENCY", city: "Kochi", clients: 3, mrr: 24_000, commissionPct: 20, whiteLabel: false, domain: null, isActive: false },
];

export const PARTNER_PAYOUTS = [
  { id: "PP-31", partner: "Northline Digital", period: "July 2026", gross: 4_20_000, commission: 84_000, status: "PAID", paidAt: "2026-08-03" },
  { id: "PP-30", partner: "Vyapar Solutions", period: "July 2026", gross: 3_84_000, commission: 96_000, status: "PAID", paidAt: "2026-08-03" },
  { id: "PP-29", partner: "Coastal Media", period: "July 2026", gross: 2_16_000, commission: 43_200, status: "PENDING", paidAt: null },
  { id: "PP-28", partner: "Spice Route F&B Group", period: "July 2026", gross: 2_64_000, commission: 39_600, status: "PENDING", paidAt: null },
];

/* --------------------------- Multi-location --------------------------- */

export type Outlet = {
  id: string;
  slug: string;
  name: string;
  code: string;
  city: string;
  address: string;
  manager: string;
  managerPhone: string;
  isHeadOffice: boolean;
  isActive: boolean;
  openedAt: string;
  // Current month
  scans: number;
  reviews: number;
  rating: number;
  leads: number;
  orders: number;
  revenue: number; // paise
};

export const OUTLETS: Outlet[] = [
  { id: "OL-01", slug: "indiranagar", name: "Indiranagar", code: "BLR-IND-01", city: "Bengaluru", address: "312, 100 Feet Road, Indiranagar 560038", manager: "Meena Rao", managerPhone: "+91 98450 00111", isHeadOffice: true, isActive: true, openedAt: "2019-04-12", scans: 4821, reviews: 96, rating: 4.8, leads: 34, orders: 612, revenue: 94_20_000 },
  { id: "OL-02", slug: "koramangala", name: "Koramangala", code: "BLR-KOR-02", city: "Bengaluru", address: "18, 5th Block, Koramangala 560095", manager: "Farhan Q.", managerPhone: "+91 98450 00222", isHeadOffice: false, isActive: true, openedAt: "2021-09-01", scans: 3910, reviews: 74, rating: 4.6, leads: 28, orders: 548, revenue: 81_40_000 },
  { id: "OL-03", slug: "whitefield", name: "Whitefield", code: "BLR-WHF-03", city: "Bengaluru", address: "Ground Floor, Forum Value Mall Road 560066", manager: "Latha S.", managerPhone: "+91 98450 00333", isHeadOffice: false, isActive: true, openedAt: "2023-02-18", scans: 2764, reviews: 41, rating: 4.3, leads: 19, orders: 388, revenue: 56_80_000 },
  { id: "OL-04", slug: "mysuru", name: "Mysuru", code: "MYS-CTY-04", city: "Mysuru", address: "44, Sayyaji Rao Road, Mysuru 570001", manager: "Girish N.", managerPhone: "+91 98450 00444", isHeadOffice: false, isActive: true, openedAt: "2024-11-05", scans: 1489, reviews: 22, rating: 4.1, leads: 11, orders: 204, revenue: 28_60_000 },
  { id: "OL-05", slug: "hubballi", name: "Hubballi", code: "HBL-CTY-05", city: "Hubballi", address: "Near Gokul Road, Hubballi 580030", manager: "Pooja D.", managerPhone: "+91 98450 00555", isHeadOffice: false, isActive: false, openedAt: "2025-06-20", scans: 402, reviews: 6, rating: 3.9, leads: 3, orders: 61, revenue: 8_10_000 },
];

export const OUTLET_TREND = [
  { month: "Mar", Indiranagar: 3810, Koramangala: 3020, Whitefield: 1980, Mysuru: 900 },
  { month: "Apr", Indiranagar: 4020, Koramangala: 3210, Whitefield: 2140, Mysuru: 1040 },
  { month: "May", Indiranagar: 4180, Koramangala: 3390, Whitefield: 2360, Mysuru: 1180 },
  { month: "Jun", Indiranagar: 4460, Koramangala: 3610, Whitefield: 2540, Mysuru: 1290 },
  { month: "Jul", Indiranagar: 4821, Koramangala: 3910, Whitefield: 2764, Mysuru: 1489 },
];

/* ---------------------------- Campaigns ------------------------------- */

export type BusinessCampaign = {
  id: string;
  slug: string;
  name: string;
  goal: "LEADS" | "REVIEWS" | "ORDERS" | "AWARENESS";
  status: "DRAFT" | "ACTIVE" | "PAUSED" | "ENDED";
  offerText: string | null;
  couponCode: string | null;
  outlets: string[];
  scans: number;
  visitors: number;
  claims: number;
  leads: number;
  conversions: number;
  revenue: number;
  startsAt: string;
  endsAt: string | null;
};

export const BUSINESS_CAMPAIGNS: BusinessCampaign[] = [
  { id: "CP-14", slug: "monsoon-midweek", name: "Monsoon midweek offer", goal: "LEADS", status: "ACTIVE", offerText: "20% off Monday to Thursday before 2pm", couponCode: "MONSOON20", outlets: ["Indiranagar", "Koramangala"], scans: 8421, visitors: 7893, claims: 1842, leads: 648, conversions: 219, revenue: 1_84_20_000, startsAt: "2026-07-01", endsAt: "2026-08-31" },
  { id: "CP-13", slug: "review-drive", name: "Review drive — all outlets", goal: "REVIEWS", status: "ACTIVE", offerText: null, couponCode: null, outlets: ["Indiranagar", "Koramangala", "Whitefield", "Mysuru"], scans: 3117, visitors: 2984, claims: 0, leads: 0, conversions: 218, revenue: 0, startsAt: "2026-06-15", endsAt: null },
  { id: "CP-11", slug: "whitefield-opening", name: "Whitefield opening week", goal: "AWARENESS", status: "ENDED", offerText: "Free head massage with any service", couponCode: "OPENWHF", outlets: ["Whitefield"], scans: 2210, visitors: 2064, claims: 704, leads: 288, conversions: 141, revenue: 47_60_000, startsAt: "2026-02-18", endsAt: "2026-02-28" },
  { id: "CP-15", slug: "festive-hampers", name: "Festive hampers", goal: "ORDERS", status: "DRAFT", offerText: "Gift hampers from ₹1,499", couponCode: "FESTIVE", outlets: ["Indiranagar"], scans: 0, visitors: 0, claims: 0, leads: 0, conversions: 0, revenue: 0, startsAt: "2026-10-01", endsAt: "2026-11-15" },
];


/* --------------------- Staff attribution (demo) ---------------------- */

export type StaffScore = {
  id: string;
  code: string;
  name: string;
  role: string;
  scans: number;
  reviews: number;
  positive: number;
  negative: number;
  repeatCustomers: number;
  isActive: boolean;
};

/**
 * One code per person, printed on their badge.
 *
 * The negative column is deliberately shown. A leaderboard that hides it
 * turns into a popularity contest, and the owner loses the one signal worth
 * acting on — someone with high volume and rising complaints.
 */
export const STAFF_SCORES: StaffScore[] = [
  { id: "SC-01", code: "MEENA", name: "Meena Rao", role: "Senior stylist", scans: 412, reviews: 86, positive: 81, negative: 5, repeatCustomers: 54, isActive: true },
  { id: "SC-02", code: "FARHAN", name: "Farhan Q.", role: "Stylist", scans: 388, reviews: 71, positive: 64, negative: 7, repeatCustomers: 41, isActive: true },
  { id: "SC-03", code: "LATHA", name: "Latha S.", role: "Beautician", scans: 296, reviews: 62, positive: 60, negative: 2, repeatCustomers: 38, isActive: true },
  { id: "SC-04", code: "ARJUN", name: "Arjun B.", role: "Stylist", scans: 341, reviews: 38, positive: 29, negative: 9, repeatCustomers: 12, isActive: true },
  { id: "SC-05", code: "POOJA", name: "Pooja D.", role: "Front desk", scans: 204, reviews: 44, positive: 42, negative: 2, repeatCustomers: 19, isActive: true },
  { id: "SC-06", code: "GIRISH", name: "Girish N.", role: "Stylist", scans: 88, reviews: 9, positive: 8, negative: 1, repeatCustomers: 4, isActive: false },
];

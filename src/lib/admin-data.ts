/**
 * Agency-side admin data (all clients, all projects, all money).
 *
 * Shapes mirror the Prisma models so each page can swap its import for a
 * prisma query without changing the JSX. Money is in paise.
 */

export const ADMIN_USER = {
  name: "BMU",
  email: "divya@bmu.marketing",
  role: "OWNER" as const,
};

export const AGENCY_KPIS = [
  { label: "Monthly recurring revenue", value: "₹11.4L", delta: 9.2, sub: "across 14 retainers", icon: "IndianRupee" },
  { label: "Active clients", value: "14", delta: 7.7, sub: "2 onboarding this month", icon: "Building2" },
  { label: "Ad spend managed", value: "₹42.6L", delta: 14.1, sub: "this month, all accounts", icon: "Megaphone" },
  { label: "Overdue receivables", value: "₹3.1L", delta: 22.4, sub: "4 invoices past due", icon: "AlertTriangle", inverse: true },
];

export const REVENUE_TREND = [
  { month: "Feb", retainer: 820000, projects: 310000, saas: 64000 },
  { month: "Mar", retainer: 875000, projects: 190000, saas: 71000 },
  { month: "Apr", retainer: 940000, projects: 420000, saas: 83000 },
  { month: "May", retainer: 1010000, projects: 265000, saas: 96000 },
  { month: "Jun", retainer: 1085000, projects: 380000, saas: 108000 },
  { month: "Jul", retainer: 1140000, projects: 295000, saas: 124000 },
];

export const SPEND_BY_CLIENT = [
  { client: "Atria Living", spend: 282000 },
  { client: "Northview", spend: 244000 },
  { client: "Saffron & Co", spend: 118000 },
  { client: "Kesar Motors", spend: 96000 },
  { client: "Verde Clinics", spend: 74000 },
  { client: "Form & Fit", spend: 51000 },
];

export const UTILISATION = [
  { team: "Performance", booked: 92 },
  { team: "Creative", booked: 78 },
  { team: "Development", booked: 86 },
  { team: "SEO", booked: 61 },
  { team: "Video", booked: 74 },
];

export type AdminClient = {
  id: string;
  name: string;
  slug: string;
  industry: string;
  city: string;
  plan: string;
  retainer: number;
  manager: string;
  health: "GOOD" | "WATCH" | "AT_RISK";
  leadsThisMonth: number;
  onboardedAt: string;
  isActive: boolean;
};

export const CLIENTS: AdminClient[] = [
  { id: "C-014", name: "Atria Living", slug: "atria-living", industry: "Real Estate", city: "Bengaluru", plan: "Growth", retainer: 8_500_000, manager: "Divya Nair", health: "GOOD", leadsThisMonth: 412, onboardedAt: "2024-11-04", isActive: true },
  { id: "C-013", name: "Northview Developers", slug: "northview", industry: "Real Estate", city: "Bengaluru", plan: "Scale", retainer: 21_000_000, manager: "Divya Nair", health: "GOOD", leadsThisMonth: 366, onboardedAt: "2024-06-18", isActive: true },
  { id: "C-012", name: "Saffron & Co", slug: "saffron-co", industry: "Restaurants", city: "Bengaluru", plan: "Growth", retainer: 8_500_000, manager: "Nikita Shenoy", health: "WATCH", leadsThisMonth: 88, onboardedAt: "2025-02-09", isActive: true },
  { id: "C-011", name: "Verde Clinics", slug: "verde-clinics", industry: "Healthcare", city: "Mysuru", plan: "Launch", retainer: 3_500_000, manager: "Imran Sait", health: "GOOD", leadsThisMonth: 141, onboardedAt: "2025-05-22", isActive: true },
  { id: "C-010", name: "Kesar Motors", slug: "kesar-motors", industry: "Automobile", city: "Hubballi", plan: "Growth", retainer: 8_500_000, manager: "Sana Fernandes", health: "AT_RISK", leadsThisMonth: 54, onboardedAt: "2024-09-30", isActive: true },
  { id: "C-009", name: "Form & Fit", slug: "form-fit", industry: "Fitness", city: "Bengaluru", plan: "Launch", retainer: 3_500_000, manager: "Nikita Shenoy", health: "GOOD", leadsThisMonth: 97, onboardedAt: "2025-07-11", isActive: true },
  { id: "C-008", name: "Meraki Studio", slug: "meraki-studio", industry: "Interior Design", city: "Bengaluru", plan: "Launch", retainer: 3_500_000, manager: "Rahul Prabhu", health: "WATCH", leadsThisMonth: 33, onboardedAt: "2025-09-02", isActive: true },
  { id: "C-006", name: "Blue Harbour Resorts", slug: "blue-harbour", industry: "Hotels", city: "Udupi", plan: "Growth", retainer: 8_500_000, manager: "Divya Nair", health: "GOOD", leadsThisMonth: 176, onboardedAt: "2025-01-15", isActive: true },
];

export const CLIENT_DETAIL_EXTRAS: Record<
  string,
  { contact: string; email: string; phone: string; gstin?: string; services: string[]; notes: string }
> = {
  "atria-living": {
    contact: "Rohan Shetty",
    email: "rohan@atrialiving.in",
    phone: "+91 98450 11223",
    gstin: "29AAACA1234M1Z5",
    services: ["Meta Ads", "Google Ads", "Landing pages", "Drone", "WhatsApp automation", "Local SEO"],
    notes: "Tower C launch is the priority through August. Sales team responds fastest on WhatsApp, not calls.",
  },
  "northview": {
    contact: "Girish Kamath",
    email: "girish@northview.in",
    phone: "+91 98450 22334",
    gstin: "29AABCN5678P1Z2",
    services: ["Meta Ads", "Google Ads", "Drone", "Brand films"],
    notes: "Two projects handing over in September. Wants weekly numbers, not monthly.",
  },
  "saffron-co": {
    contact: "Imran Sheikh",
    email: "imran@saffronco.in",
    phone: "+91 98450 33445",
    gstin: "29AACCS9012Q1Z8",
    services: ["Social media", "UGC", "Food photography", "QR menus"],
    notes: "Six outlets. Brunch launch is the current focus.",
  },
  "kesar-motors": {
    contact: "Sameer Ali",
    email: "sameer@kesarmotors.in",
    phone: "+91 98450 77889",
    // Hubballi is Karnataka, but this group's registration is in Maharashtra
    // (27) — inter-state from us, so their invoices carry IGST not CGST/SGST.
    gstin: "27AAGCK4567U1Z9",
    services: ["Local SEO", "Google Business", "Service booking"],
    notes: "Registered in Maharashtra. Billing is inter-state — check the GSTR-1 place of supply.",
  },
  "blue-harbour": {
    contact: "Kiran Shetty",
    email: "kiran@blueharbour.in",
    phone: "+91 98450 44556",
    gstin: "29AADCB3456R1Z4",
    services: ["Social media", "Drone", "Booking funnel"],
    notes: "Monsoon rates run June to September. Peak booking window is April.",
  },
  "verde-clinics": {
    contact: "Dr. Sneha Iyer",
    email: "sneha@verdeclinics.in",
    phone: "+91 98450 66778",
    gstin: "29AAECV7890S1Z1",
    services: ["Local SEO", "Google Business", "Review management"],
    notes: "Three locations. Appointment volume is the only metric they care about.",
  },
};

export type AdminProject = {
  id: string;
  name: string;
  client: string;
  status: "DISCOVERY" | "IN_PROGRESS" | "REVIEW" | "LIVE" | "PAUSED" | "COMPLETED";
  progress: number;
  owner: string;
  dueAt: string;
  budget: number;
};

export const ADMIN_PROJECTS: AdminProject[] = [
  { id: "P-118", name: "Tower C launch campaign", client: "Atria Living", status: "IN_PROGRESS", progress: 68, owner: "Divya Nair", dueAt: "2026-08-28", budget: 45_00_000 },
  { id: "P-117", name: "Phase 2 microsite", client: "Northview Developers", status: "IN_PROGRESS", progress: 44, owner: "Aditya Kulkarni", dueAt: "2026-09-05", budget: 62_00_000 },
  { id: "P-116", name: "Sales microsite rebuild", client: "Atria Living", status: "REVIEW", progress: 91, owner: "Aditya Kulkarni", dueAt: "2026-08-12", budget: 38_00_000 },
  { id: "P-115", name: "Menu QR rollout, 6 outlets", client: "Saffron & Co", status: "LIVE", progress: 100, owner: "Nikita Shenoy", dueAt: "2026-07-30", budget: 12_00_000 },
  { id: "P-114", name: "Service booking app", client: "Kesar Motors", status: "PAUSED", progress: 37, owner: "Aditya Kulkarni", dueAt: "2026-10-02", budget: 88_00_000 },
  { id: "P-113", name: "Clinic local SEO sprint", client: "Verde Clinics", status: "IN_PROGRESS", progress: 55, owner: "Imran Sait", dueAt: "2026-08-22", budget: 18_00_000 },
  { id: "P-121", name: "Monsoon campaign creative", client: "Blue Harbour Resorts", status: "DISCOVERY", progress: 12, owner: "Rahul Prabhu", dueAt: "2026-09-14", budget: 26_00_000 },
  { id: "P-112", name: "Brand identity refresh", client: "Meraki Studio", status: "REVIEW", progress: 84, owner: "Rahul Prabhu", dueAt: "2026-08-16", budget: 21_00_000 },
];

export type AdminLead = {
  id: string;
  name: string;
  client: string;
  source: string;
  status: "NEW" | "CONTACTED" | "QUALIFIED" | "SITE_VISIT" | "PROPOSAL" | "WON" | "LOST";
  value: number;
  owner: string;
  createdAt: string;
};

export const ADMIN_LEADS: AdminLead[] = [
  { id: "L-2841", name: "Priya Raghavan", client: "Atria Living", source: "META_ADS", status: "SITE_VISIT", value: 9_50_00_000, owner: "Client team", createdAt: "2026-08-05" },
  { id: "L-2840", name: "Karthik Menon", client: "Atria Living", source: "GOOGLE_ADS", status: "QUALIFIED", value: 7_20_00_000, owner: "Client team", createdAt: "2026-08-05" },
  { id: "L-2839", name: "Deepa Suresh", client: "Northview Developers", source: "META_ADS", status: "NEW", value: 0, owner: "Unassigned", createdAt: "2026-08-05" },
  { id: "L-2838", name: "Arjun Bhat", client: "Northview Developers", source: "REFERRAL", status: "PROPOSAL", value: 1_20_00_00_000, owner: "Client team", createdAt: "2026-08-04" },
  { id: "L-2837", name: "Fatima Sheikh", client: "Verde Clinics", source: "ORGANIC", status: "CONTACTED", value: 0, owner: "Client team", createdAt: "2026-08-04" },
  { id: "L-2836", name: "Vikram Desai", client: "Blue Harbour Resorts", source: "QR_SCAN", status: "WON", value: 2_40_000, owner: "Client team", createdAt: "2026-08-03" },
  { id: "L-2835", name: "Ananya Rao", client: "Kesar Motors", source: "META_ADS", status: "LOST", value: 0, owner: "Client team", createdAt: "2026-08-02" },
  { id: "L-2834", name: "Imran Qureshi", client: "Form & Fit", source: "WHATSAPP", status: "QUALIFIED", value: 4_50_000, owner: "Client team", createdAt: "2026-08-02" },
];

export type AdminCampaign = {
  id: string;
  name: string;
  client: string;
  platform: "Meta" | "Google" | "WhatsApp" | "Influencer";
  status: "ACTIVE" | "PAUSED" | "COMPLETED" | "DRAFT";
  budget: number;
  spend: number;
  leads: number;
};

export const CAMPAIGNS: AdminCampaign[] = [
  { id: "CM-341", name: "Tower C — site visit push", client: "Atria Living", platform: "Meta", status: "ACTIVE", budget: 18_00_000, spend: 14_20_000, leads: 214 },
  { id: "CM-338", name: "Whitefield search — 3BHK", client: "Atria Living", platform: "Google", status: "ACTIVE", budget: 12_00_000, spend: 9_80_000, leads: 121 },
  { id: "CM-336", name: "Phase 2 pre-launch interest", client: "Northview Developers", platform: "Meta", status: "ACTIVE", budget: 24_00_000, spend: 19_40_000, leads: 288 },
  { id: "CM-330", name: "Weekend brunch reach", client: "Saffron & Co", platform: "Meta", status: "ACTIVE", budget: 6_00_000, spend: 4_10_000, leads: 62 },
  { id: "CM-327", name: "Monsoon staycation creators", client: "Blue Harbour Resorts", platform: "Influencer", status: "ACTIVE", budget: 9_00_000, spend: 6_50_000, leads: 88 },
  { id: "CM-319", name: "Service reminder broadcast", client: "Kesar Motors", platform: "WhatsApp", status: "PAUSED", budget: 2_00_000, spend: 1_10_000, leads: 24 },
];

export type Creator = {
  id: string;
  handle: string;
  name: string;
  city: string;
  category: string;
  followers: number;
  avgViews: number;
  rate: number;
  verified: boolean;
};

export const CREATORS: Creator[] = [
  { id: "CR-88", handle: "@blrfoodwalk", name: "Nandita P.", city: "Bengaluru", category: "Food", followers: 184000, avgViews: 62000, rate: 3_50_000, verified: true },
  { id: "CR-84", handle: "@homesbyanvi", name: "Anvi M.", city: "Bengaluru", category: "Interiors", followers: 96000, avgViews: 41000, rate: 2_20_000, verified: true },
  { id: "CR-81", handle: "@coastal.kiran", name: "Kiran Shetty", city: "Mangaluru", category: "Travel", followers: 241000, avgViews: 88000, rate: 4_80_000, verified: true },
  { id: "CR-77", handle: "@liftwithrhea", name: "Rhea D.", city: "Bengaluru", category: "Fitness", followers: 71000, avgViews: 34000, rate: 1_60_000, verified: false },
  { id: "CR-74", handle: "@motorsandmore", name: "Sameer A.", city: "Hubballi", category: "Automobile", followers: 129000, avgViews: 55000, rate: 2_80_000, verified: true },
  { id: "CR-70", handle: "@thecalmskin", name: "Ishita R.", city: "Mumbai", category: "Beauty", followers: 312000, avgViews: 104000, rate: 6_20_000, verified: true },
];

export type AdminInvoice = {
  number: string;
  client: string;
  status: "PAID" | "SENT" | "OVERDUE" | "DRAFT" | "PARTIALLY_PAID" | "VOID";
  total: number;
  issuedAt: string;
  dueAt: string;
};

export const ADMIN_INVOICES: AdminInvoice[] = [
  { number: "BMU-2026-0186", client: "Northview Developers", status: "SENT", total: 2_47_80_000, issuedAt: "2026-08-01", dueAt: "2026-08-15" },
  { number: "BMU-2026-0184", client: "Atria Living", status: "SENT", total: 1_00_30_000, issuedAt: "2026-08-01", dueAt: "2026-08-15" },
  { number: "BMU-2026-0182", client: "Kesar Motors", status: "OVERDUE", total: 1_00_30_000, issuedAt: "2026-07-01", dueAt: "2026-07-15" },
  { number: "BMU-2026-0179", client: "Meraki Studio", status: "OVERDUE", total: 41_30_000, issuedAt: "2026-06-28", dueAt: "2026-07-12" },
  { number: "BMU-2026-0176", client: "Saffron & Co", status: "PAID", total: 1_00_30_000, issuedAt: "2026-07-01", dueAt: "2026-07-15" },
  { number: "BMU-2026-0174", client: "Verde Clinics", status: "PAID", total: 41_30_000, issuedAt: "2026-07-01", dueAt: "2026-07-15" },
  { number: "BMU-2026-0188", client: "Blue Harbour Resorts", status: "DRAFT", total: 1_00_30_000, issuedAt: "2026-08-06", dueAt: "2026-08-20" },
];

/** Ageing is measured from sentAt — time in our own queue isn't client delay. */
export const APPROVAL_QUEUE = [
  { id: "A-77", title: "Tower C — walkthrough reel", client: "Atria Living", type: "Reel", owner: "Rahul Prabhu", scheduledFor: "2026-08-09", status: "PENDING", sentAt: "2026-08-04", revision: 1, comments: 2, escalatedTo: null },
  { id: "A-76", title: "Amenities carousel (5 slides)", client: "Atria Living", type: "Carousel", owner: "Rahul Prabhu", scheduledFor: "2026-08-10", status: "PENDING", sentAt: "2026-08-09", revision: 1, comments: 0, escalatedTo: null },
  { id: "A-75", title: "Brunch menu launch post", client: "Saffron & Co", type: "Post", owner: "Nikita Shenoy", scheduledFor: "2026-08-11", status: "CHANGES_REQUESTED", sentAt: "2026-07-29", revision: 4, comments: 9, escalatedTo: "Divya Nair" },
  { id: "A-73", title: "Monsoon offer banner", client: "Blue Harbour Resorts", type: "Banner", owner: "Rahul Prabhu", scheduledFor: "2026-08-13", status: "PENDING", sentAt: "2026-08-01", revision: 2, comments: 3, escalatedTo: null },
  { id: "A-72", title: "Founder interview cutdown", client: "Meraki Studio", type: "Video", owner: "Nikita Shenoy", scheduledFor: "2026-08-16", status: "APPROVED" },
];

export const ADMIN_QR = [
  { id: "Q-4411", slug: "atria-brochure", label: "Sales lounge — brochure", client: "Atria Living", type: "CATALOGUE", target: "https://example.com/brochure.pdf", scans: 6421, active: true },
  { id: "Q-4408", slug: "atria-hoarding", label: "Site hoarding — ORR", client: "Atria Living", type: "URL", target: "https://example.com/atria-living", scans: 4880, active: true },
  { id: "Q-4405", slug: "saffron-menu", label: "Table tents (all outlets)", client: "Saffron & Co", type: "MENU", target: "https://example.com/menu", scans: 11240, active: true },
  { id: "Q-4402", slug: "saffron-review", label: "Review request card", client: "Saffron & Co", type: "GOOGLE_REVIEW", target: "https://g.page/r/example/review", scans: 3117, active: true },
  { id: "Q-4399", slug: "verde-feedback", label: "Reception feedback", client: "Verde Clinics", type: "FEEDBACK", target: "https://example.com/feedback", scans: 1902, active: true },
  { id: "Q-4396", slug: "northview-pricing", label: "Price list (protected)", client: "Northview Developers", type: "URL", target: "https://example.com/pricing", scans: 742, active: true },
  { id: "Q-4390", slug: "harbour-payment", label: "Booking payment link", client: "Blue Harbour Resorts", type: "PAYMENT", target: "https://example.com/pay", scans: 981, active: true },
  { id: "Q-4381", slug: "kesar-diwali", label: "Diwali offer (expired)", client: "Kesar Motors", type: "OFFER", target: "https://example.com/diwali", scans: 399, active: false },
];

export const BLOG_POSTS = [
  { id: "B-19", title: "What a real estate launch funnel actually costs in 2026", author: "Divya Nair", status: "PUBLISHED", views: 4210, updatedAt: "2026-08-02" },
  { id: "B-18", title: "Menu QR codes: the four mistakes restaurants keep making", author: "Nikita Shenoy", status: "PUBLISHED", views: 3180, updatedAt: "2026-07-24" },
  { id: "B-17", title: "AI product photography — where it works and where it fails", author: "Rahul Prabhu", status: "PUBLISHED", views: 2640, updatedAt: "2026-07-11" },
  { id: "B-20", title: "Local SEO for multi-location clinics", author: "Imran Sait", status: "DRAFT", views: 0, updatedAt: "2026-08-05" },
  { id: "B-21", title: "How we structure WhatsApp follow-up inside 90 seconds", author: "Sana Fernandes", status: "REVIEW", views: 0, updatedAt: "2026-08-04" },
];

export const TEAM_MEMBERS = [
  { id: "U-01", name: "Divya Nair", email: "divya@bmu.marketing", role: "OWNER", clients: 4, status: "ACTIVE" },
  { id: "U-02", name: "Aditya Kulkarni", email: "aditya@bmu.marketing", role: "ADMIN", clients: 3, status: "ACTIVE" },
  { id: "U-03", name: "Sana Fernandes", email: "sana@bmu.marketing", role: "MANAGER", clients: 5, status: "ACTIVE" },
  { id: "U-04", name: "Rahul Prabhu", email: "rahul@bmu.marketing", role: "MANAGER", clients: 4, status: "ACTIVE" },
  { id: "U-05", name: "Nikita Shenoy", email: "nikita@bmu.marketing", role: "MANAGER", clients: 3, status: "ACTIVE" },
  { id: "U-06", name: "Imran Sait", email: "imran@bmu.marketing", role: "STAFF", clients: 2, status: "ACTIVE" },
  { id: "U-07", name: "Priyanka B.", email: "priyanka@bmu.marketing", role: "STAFF", clients: 0, status: "INVITED" },
];

export const INTEGRATIONS = [
  { name: "Meta Business", detail: "6 ad accounts connected", connected: true },
  { name: "Google Ads", detail: "5 accounts connected", connected: true },
  { name: "Google Business Profile", detail: "22 locations managed", connected: true },
  { name: "Razorpay", detail: "Live keys — invoices and subscriptions", connected: true },
  { name: "WhatsApp Business Platform", detail: "2 numbers, 8 templates approved", connected: true },
  { name: "Resend", detail: "Transactional email not configured", connected: false },
  { name: "Cloudflare R2", detail: "Media bucket not configured", connected: false },
];


/* --------------------- Section analytics (demo) ---------------------- */

/** QR scans over the last 12 weeks, split by what the code does. */
export const QR_SCAN_TREND = [
  { week: "W1", profile: 820, review: 410, menu: 1180, payment: 96 },
  { week: "W2", profile: 910, review: 452, menu: 1240, payment: 104 },
  { week: "W3", profile: 880, review: 498, menu: 1310, payment: 118 },
  { week: "W4", profile: 1020, review: 540, menu: 1402, payment: 131 },
  { week: "W5", profile: 1140, review: 611, menu: 1488, payment: 142 },
  { week: "W6", profile: 1210, review: 664, menu: 1602, payment: 158 },
];

export const QR_BY_CITY = [
  { city: "Bengaluru", scans: 18420, share: 62 },
  { city: "Mysuru", scans: 4180, share: 14 },
  { city: "Hubballi", scans: 3110, share: 10 },
  { city: "Udupi", scans: 2340, share: 8 },
  { city: "Mangaluru", scans: 1790, share: 6 },
];

export const QR_BY_DEVICE = [
  { name: "Android", value: 68, color: "#8BB72C" },
  { name: "iPhone", value: 27, color: "#1F3B56" },
  { name: "Other", value: 5, color: "#C2C2C2" },
];

/** Hardware sales — asked for as a store breakdown. */
export const STORE_SALES_TREND = [
  { month: "Mar", revenue: 184000, orders: 21 },
  { month: "Apr", revenue: 226000, orders: 27 },
  { month: "May", revenue: 291000, orders: 34 },
  { month: "Jun", revenue: 268000, orders: 31 },
  { month: "Jul", revenue: 342000, orders: 41 },
  { month: "Aug", revenue: 138000, orders: 16 },
];

export const STORE_BY_PRODUCT = [
  { product: "Restaurant starter kit", units: 34, revenue: 1869660 },
  { product: "Google review standee", units: 88, revenue: 1143120 },
  { product: "NFC business card", units: 141, revenue: 1126590 },
  { product: "Business starter kit", units: 26, revenue: 727740 },
  { product: "Table QR tents ×10", units: 19, revenue: 474810 },
  { product: "Window sticker pack", units: 52, revenue: 207480 },
];

/** Which hardware leads to a paying subscription — the flywheel, measured. */
export const STORE_TO_SUBSCRIPTION = [
  { product: "Restaurant starter kit", buyers: 34, upgraded: 27, rate: 79 },
  { product: "Business starter kit", buyers: 26, upgraded: 18, rate: 69 },
  { product: "Google review standee", buyers: 88, upgraded: 41, rate: 47 },
  { product: "NFC business card", buyers: 141, upgraded: 38, rate: 27 },
  { product: "Window sticker pack", buyers: 52, upgraded: 9, rate: 17 },
];

/** Article performance. */
export const BLOG_TRAFFIC = [
  { month: "Mar", views: 3120, reads: 1480 },
  { month: "Apr", views: 4260, reads: 2010 },
  { month: "May", views: 5180, reads: 2640 },
  { month: "Jun", views: 6440, reads: 3120 },
  { month: "Jul", views: 8210, reads: 4180 },
];

export const BLOG_TOP_POSTS = [
  { title: "What a real estate launch funnel actually costs in 2026", views: 4210, avgTime: "4m 12s", leads: 38 },
  { title: "Menu QR codes: the four mistakes restaurants keep making", views: 3180, avgTime: "3m 40s", leads: 24 },
  { title: "AI product photography — where it works and where it fails", views: 2640, avgTime: "5m 02s", leads: 19 },
  { title: "Local SEO for multi-location clinics", views: 1810, avgTime: "3m 08s", leads: 11 },
];


/* ----------------------- Project detail (demo) ----------------------- */

export type ProjectTask = {
  id: string; title: string; discipline: string; status: string;
  assignee: string; weight: number; dueDate: string; completedAt: string | null;
};

export const PROJECT_TASKS: Record<string, ProjectTask[]> = {
  default: [
    { id: "T-01", title: "Brand audit and competitor scan", discipline: "Branding", status: "DONE", assignee: "Sana Fernandes", weight: 3, dueDate: "2026-06-14", completedAt: "2026-06-12" },
    { id: "T-02", title: "Wireframes — 9 templates", discipline: "Design", status: "DONE", assignee: "Aditya Kulkarni", weight: 5, dueDate: "2026-06-28", completedAt: "2026-06-30" },
    { id: "T-03", title: "Design system and component library", discipline: "Design", status: "DONE", assignee: "Aditya Kulkarni", weight: 5, dueDate: "2026-07-12", completedAt: "2026-07-11" },
    { id: "T-04", title: "Front-end build — marketing pages", discipline: "Development", status: "IN_PROGRESS", assignee: "Rahul Prabhu", weight: 8, dueDate: "2026-08-20", completedAt: null },
    { id: "T-05", title: "CMS integration", discipline: "Development", status: "IN_PROGRESS", assignee: "Rahul Prabhu", weight: 5, dueDate: "2026-08-25", completedAt: null },
    { id: "T-06", title: "Launch film — 90 seconds", discipline: "Video", status: "REVIEW", assignee: "Nikita Shenoy", weight: 5, dueDate: "2026-08-14", completedAt: null },
    { id: "T-07", title: "Drone shoot — Tower C exterior", discipline: "Drone", status: "BLOCKED", assignee: "Nikita Shenoy", weight: 3, dueDate: "2026-08-08", completedAt: null },
    { id: "T-08", title: "SEO migration plan", discipline: "SEO", status: "TODO", assignee: "Sana Fernandes", weight: 3, dueDate: "2026-09-02", completedAt: null },
    { id: "T-09", title: "Meta campaign build", discipline: "Performance", status: "TODO", assignee: "Rahul Prabhu", weight: 5, dueDate: "2026-09-08", completedAt: null },
    { id: "T-10", title: "WhatsApp automation flows", discipline: "Automation", status: "TODO", assignee: "Aditya Kulkarni", weight: 3, dueDate: "2026-09-12", completedAt: null },
  ],
};

export type ProjectUpdate = {
  id: string; kind: string; title: string; body: string; author: string; createdAt: string;
};

export const PROJECT_UPDATES: Record<string, ProjectUpdate[]> = {
  default: [
    { id: "U-08", kind: "BLOCKER", title: "Drone permission still pending", body: "Airport authority clearance requested 8 Aug. Shoot cannot be scheduled until it lands; launch film needs this footage.", author: "Nikita Shenoy", createdAt: "2026-08-09" },
    { id: "U-07", kind: "DELIVERY", title: "Launch film first cut sent", body: "90-second cut delivered for client review. Awaiting sign-off.", author: "Nikita Shenoy", createdAt: "2026-08-07" },
    { id: "U-06", kind: "MILESTONE", title: "Design system signed off", body: "All 9 templates approved without changes.", author: "Aditya Kulkarni", createdAt: "2026-07-11" },
    { id: "U-05", kind: "NOTE", title: "Scope addition agreed", body: "Client added two extra landing pages. Budget revised by ₹1,20,000, timeline unchanged.", author: "Divya Nair", createdAt: "2026-07-03" },
    { id: "U-04", kind: "MILESTONE", title: "Wireframes approved", body: "Two rounds of revisions, closed 30 June.", author: "Aditya Kulkarni", createdAt: "2026-06-30" },
  ],
};


/* -------------------------- Media library ---------------------------- */

export type MediaAsset = {
  id: string;
  filename: string;
  url: string;
  mimeType: string;
  sizeBytes: number;
  folder: string;
  tags: string[];
  client: string | null;
  altText: string | null;
  uploadedBy: string;
  createdAt: string;
  isArchived: boolean;
};

export const MEDIA_ASSETS: MediaAsset[] = [
  { id: "M-31", filename: "tower-c-drone-golden-hour.mp4", url: "#", mimeType: "video/mp4", sizeBytes: 184_320_000, folder: "atria-living/tower-c/drone", tags: ["drone", "hero", "approved"], client: "Atria Living", altText: "Tower C exterior at sunset", uploadedBy: "Nikita Shenoy", createdAt: "2026-08-07", isArchived: false },
  { id: "M-30", filename: "tower-c-amenities-01.jpg", url: "#", mimeType: "image/jpeg", sizeBytes: 4_210_000, folder: "atria-living/tower-c/stills", tags: ["amenities", "carousel"], client: "Atria Living", altText: "Rooftop pool deck", uploadedBy: "Aditya Kulkarni", createdAt: "2026-08-06", isArchived: false },
  { id: "M-29", filename: "tower-c-amenities-02.jpg", url: "#", mimeType: "image/jpeg", sizeBytes: 3_980_000, folder: "atria-living/tower-c/stills", tags: ["amenities", "carousel"], client: "Atria Living", altText: "Clubhouse interior", uploadedBy: "Aditya Kulkarni", createdAt: "2026-08-06", isArchived: false },
  { id: "M-28", filename: "atria-brand-guidelines-v3.pdf", url: "#", mimeType: "application/pdf", sizeBytes: 12_400_000, folder: "atria-living/brand", tags: ["brand", "reference"], client: "Atria Living", altText: null, uploadedBy: "Divya Nair", createdAt: "2026-07-28", isArchived: false },
  { id: "M-27", filename: "brunch-hero-final.jpg", url: "#", mimeType: "image/jpeg", sizeBytes: 5_610_000, folder: "saffron-co/brunch-launch", tags: ["food", "hero", "approved"], client: "Saffron & Co", altText: "Weekend brunch spread", uploadedBy: "Nikita Shenoy", createdAt: "2026-08-05", isArchived: false },
  { id: "M-26", filename: "brunch-hero-v1.jpg", url: "#", mimeType: "image/jpeg", sizeBytes: 5_480_000, folder: "saffron-co/brunch-launch", tags: ["food", "rejected"], client: "Saffron & Co", altText: null, uploadedBy: "Nikita Shenoy", createdAt: "2026-08-02", isArchived: true },
  { id: "M-25", filename: "menu-shoot-raw.zip", url: "#", mimeType: "application/zip", sizeBytes: 842_000_000, folder: "saffron-co/brunch-launch/raw", tags: ["raw", "archive"], client: "Saffron & Co", altText: null, uploadedBy: "Nikita Shenoy", createdAt: "2026-07-30", isArchived: false },
  { id: "M-24", filename: "monsoon-offer-banner.png", url: "#", mimeType: "image/png", sizeBytes: 1_840_000, folder: "blue-harbour/monsoon", tags: ["banner", "offer"], client: "Blue Harbour Resorts", altText: "Monsoon rate offer banner", uploadedBy: "Aditya Kulkarni", createdAt: "2026-08-01", isArchived: false },
  { id: "M-23", filename: "resort-walkthrough.mp4", url: "#", mimeType: "video/mp4", sizeBytes: 296_000_000, folder: "blue-harbour/video", tags: ["video", "approved"], client: "Blue Harbour Resorts", altText: "Property walkthrough", uploadedBy: "Nikita Shenoy", createdAt: "2026-07-22", isArchived: false },
  { id: "M-22", filename: "bmu-logo-lockup.svg", url: "#", mimeType: "image/svg+xml", sizeBytes: 84_000, folder: "internal/brand", tags: ["brand", "logo"], client: null, altText: "BMU.Marketing logo", uploadedBy: "Divya Nair", createdAt: "2026-06-14", isArchived: false },
  { id: "M-21", filename: "case-study-template.docx", url: "#", mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", sizeBytes: 640_000, folder: "internal/templates", tags: ["template"], client: null, altText: null, uploadedBy: "Sana Fernandes", createdAt: "2026-05-30", isArchived: false },
  { id: "M-20", filename: "verde-clinic-exterior.jpg", url: "#", mimeType: "image/jpeg", sizeBytes: 3_120_000, folder: "verde-clinics/stills", tags: ["clinic", "approved"], client: "Verde Clinics", altText: "Clinic entrance", uploadedBy: "Aditya Kulkarni", createdAt: "2026-07-18", isArchived: false },
];


/* --------------------- Creator application funnel -------------------- */

export const APPLICATION_TREND = [
  { month: "Mar", received: 34, approved: 9 },
  { month: "Apr", received: 48, approved: 14 },
  { month: "May", received: 61, approved: 16 },
  { month: "Jun", received: 72, approved: 21 },
  { month: "Jul", received: 96, approved: 24 },
];

export const APPLICATION_SOURCES = [
  { source: "Instagram bio link", count: 118, approvedPct: 31 },
  { source: "Word of mouth", count: 64, approvedPct: 48 },
  { source: "Google search", count: 51, approvedPct: 22 },
  { source: "Creator referral", count: 38, approvedPct: 61 },
  { source: "Paid ads", count: 40, approvedPct: 9 },
];

export const APPLICATION_CATEGORIES = [
  { category: "Food & dining", count: 82 },
  { category: "Fashion & beauty", count: 71 },
  { category: "Fitness", count: 44 },
  { category: "Travel", count: 39 },
  { category: "Tech & gadgets", count: 28 },
  { category: "Home & interiors", count: 21 },
];


/* ------------------- QR platform analytics (demo) -------------------- */

/** Scans by country. Most Indian businesses see a long domestic tail plus
 *  diaspora and tourist scans — worth knowing before promising "local only". */
export const QR_BY_COUNTRY = [
  { country: "India", code: "IN", scans: 29840, accounts: 214 },
  { country: "United Arab Emirates", code: "AE", scans: 1420, accounts: 9 },
  { country: "United States", code: "US", scans: 980, accounts: 6 },
  { country: "United Kingdom", code: "GB", scans: 610, accounts: 4 },
  { country: "Singapore", code: "SG", scans: 412, accounts: 3 },
  { country: "Australia", code: "AU", scans: 288, accounts: 2 },
  { country: "Saudi Arabia", code: "SA", scans: 194, accounts: 1 },
];

/** Subscription mix — which plan actually carries the revenue. */
export const QR_PLANS = [
  { plan: "Free", price: 0, accounts: 412, revenue: 0 },
  { plan: "Starter", price: 49900, accounts: 186, revenue: 92_81_400 },
  { plan: "Business", price: 149900, accounts: 124, revenue: 1_85_87_600 },
  { plan: "Pro", price: 399900, accounts: 58, revenue: 2_31_94_200 },
  { plan: "Enterprise", price: 1200000, accounts: 11, revenue: 1_32_00_000 },
];

/** Hardware orders alongside the software, so the flywheel is visible. */
export const QR_STORE_SUMMARY = {
  ordersThisMonth: 41,
  ordersLastMonth: 34,
  unitsShipped: 386,
  topProduct: "Restaurant starter kit",
  hardwareRevenue: 3_42_000_00,
};

/** Newest tenants, for the date-sorted account list the brief asked for. */
export const QR_ACCOUNTS = [
  { id: "B-214", name: "ABC Salon", slug: "salons", city: "Bengaluru", country: "India", plan: "Pro", codes: 6, scans: 4821, createdAt: "2026-08-06", isActive: true },
  { id: "B-213", name: "Saffron & Co", slug: "restaurants", city: "Bengaluru", country: "India", plan: "Pro", codes: 14, scans: 8940, createdAt: "2026-08-04", isActive: true },
  { id: "B-212", name: "Iron & Oak", slug: "gyms", city: "Bengaluru", country: "India", plan: "Business", codes: 4, scans: 2140, createdAt: "2026-08-02", isActive: true },
  { id: "B-211", name: "Blue Harbour Resorts", slug: "resorts", city: "Udupi", country: "India", plan: "Pro", codes: 9, scans: 3610, createdAt: "2026-07-29", isActive: true },
  { id: "B-210", name: "Verde Clinics", slug: "clinics", city: "Mysuru", country: "India", plan: "Business", codes: 3, scans: 1480, createdAt: "2026-07-27", isActive: true },
  { id: "B-209", name: "Kanaka Jewellers", slug: "jewellery", city: "Bengaluru", country: "India", plan: "Business", codes: 5, scans: 1920, createdAt: "2026-07-24", isActive: true },
  { id: "B-208", name: "Gulf Spice Kitchen", slug: "gulf-spice", city: "Dubai", country: "United Arab Emirates", plan: "Starter", codes: 8, scans: 1420, createdAt: "2026-07-21", isActive: true },
  { id: "B-207", name: "Kesar Motors", slug: "automobile", city: "Hubballi", country: "India", plan: "Starter", codes: 2, scans: 780, createdAt: "2026-07-18", isActive: true },
  { id: "B-206", name: "Aasha Foundation", slug: "ngos", city: "Bengaluru", country: "India", plan: "Free", codes: 1, scans: 240, createdAt: "2026-07-14", isActive: true },
  { id: "B-205", name: "Orbit Studio", slug: "orbit-studio", city: "Kochi", country: "India", plan: "Free", codes: 1, scans: 86, createdAt: "2026-07-09", isActive: false },
];


/* ------------------- QR tenant health (demo) ------------------------- */

export type TenantAccount = {
  id: string;
  name: string;
  slug: string;
  city: string;
  plan: string;
  mrr: number;
  daysSinceLastScan: number;
  scansLast30: number;
  scansPrev30: number;
  reviewsLast30: number;
  activeCodes: number;
  profileCompleteness: number;
  unresolvedComplaints: number;
  daysToRenewal: number;
  loggedInLast30: boolean;
};

/**
 * Deliberately includes the awkward cases: an account that looks fine on
 * volume but hasn't been touched in six weeks, and one with a huge drop that
 * still has healthy absolute numbers.
 */
export const TENANT_ACCOUNTS: TenantAccount[] = [
  { id: "B-214", name: "ABC Salon", slug: "salons", city: "Bengaluru", plan: "Pro", mrr: 33300, daysSinceLastScan: 0, scansLast30: 1240, scansPrev30: 1180, reviewsLast30: 34, activeCodes: 6, profileCompleteness: 100, unresolvedComplaints: 0, daysToRenewal: 210, loggedInLast30: true },
  { id: "B-213", name: "Saffron & Co", slug: "restaurants", city: "Bengaluru", plan: "Pro", mrr: 33300, daysSinceLastScan: 1, scansLast30: 3840, scansPrev30: 4020, reviewsLast30: 88, activeCodes: 14, profileCompleteness: 92, unresolvedComplaints: 2, daysToRenewal: 118, loggedInLast30: true },
  { id: "B-212", name: "Iron & Oak", slug: "gyms", city: "Bengaluru", plan: "Business", mrr: 12500, daysSinceLastScan: 18, scansLast30: 96, scansPrev30: 410, reviewsLast30: 0, activeCodes: 2, profileCompleteness: 78, unresolvedComplaints: 1, daysToRenewal: 26, loggedInLast30: false },
  { id: "B-211", name: "Blue Harbour", slug: "resorts", city: "Udupi", plan: "Pro", mrr: 33300, daysSinceLastScan: 3, scansLast30: 620, scansPrev30: 1140, reviewsLast30: 12, activeCodes: 9, profileCompleteness: 88, unresolvedComplaints: 0, daysToRenewal: 64, loggedInLast30: true },
  { id: "B-210", name: "Verde Clinics", slug: "clinics", city: "Mysuru", plan: "Business", mrr: 12500, daysSinceLastScan: 52, scansLast30: 4, scansPrev30: 180, reviewsLast30: 0, activeCodes: 3, profileCompleteness: 64, unresolvedComplaints: 0, daysToRenewal: 41, loggedInLast30: false },
  { id: "B-209", name: "Kanaka Jewellers", slug: "jewellery", city: "Bengaluru", plan: "Business", mrr: 12500, daysSinceLastScan: 6, scansLast30: 210, scansPrev30: 196, reviewsLast30: 8, activeCodes: 5, profileCompleteness: 96, unresolvedComplaints: 0, daysToRenewal: 152, loggedInLast30: true },
  { id: "B-208", name: "Kesar Motors", slug: "automobile", city: "Hubballi", plan: "Starter", mrr: 4160, daysSinceLastScan: 34, scansLast30: 11, scansPrev30: 88, reviewsLast30: 0, activeCodes: 1, profileCompleteness: 52, unresolvedComplaints: 3, daysToRenewal: 12, loggedInLast30: false },
  { id: "B-206", name: "Aasha Foundation", slug: "ngos", city: "Bengaluru", plan: "Free", mrr: 0, daysSinceLastScan: 9, scansLast30: 62, scansPrev30: 54, reviewsLast30: 2, activeCodes: 1, profileCompleteness: 70, unresolvedComplaints: 0, daysToRenewal: 999, loggedInLast30: true },
];

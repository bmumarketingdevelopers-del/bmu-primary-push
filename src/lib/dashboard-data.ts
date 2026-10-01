/**
 * Dashboard demo data.
 *
 * The dashboard runs with zero database configured so you can `npm run dev`
 * immediately. Each export below maps 1:1 onto a Prisma model — when your
 * DATABASE_URL is live, replace the import in each page with a prisma query
 * of the same shape. Money values are in paise, matching the schema.
 */

export const CURRENT_CLIENT = {
  name: "Atria Living",
  industry: "Real Estate",
  city: "Bengaluru",
  plan: "Growth retainer",
  manager: "Divya Nair",
  monthlyRetainer: 8_500_000,
};

export const CURRENT_USER = {
  name: "Rohan Shetty",
  email: "rohan@atrialiving.in",
  role: "CLIENT" as const,
};

export type Kpi = {
  label: string;
  value: string;
  delta: number;
  sub: string;
  icon: "Users" | "IndianRupee" | "Megaphone" | "QrCode";
  inverse?: boolean;
};

export const KPIS: Kpi[] = [
  { label: "Leads this month", value: "412", delta: 18.4, sub: "vs 348 last month", icon: "Users" },
  { label: "Cost per lead", value: "₹684", delta: -12.1, sub: "vs ₹778 last month", icon: "IndianRupee", inverse: true },
  { label: "Ad spend", value: "₹2.82L", delta: 4.2, sub: "of ₹3.00L budget", icon: "Megaphone" },
  { label: "QR scans", value: "18,402", delta: 26.7, sub: "across 6 locations", icon: "QrCode" },
];

export const LEADS_TREND = [
  { month: "Feb", leads: 188, spend: 172000, cpl: 915 },
  { month: "Mar", leads: 214, spend: 196000, cpl: 916 },
  { month: "Apr", leads: 268, spend: 224000, cpl: 836 },
  { month: "May", leads: 301, spend: 240000, cpl: 797 },
  { month: "Jun", leads: 348, spend: 271000, cpl: 778 },
  { month: "Jul", leads: 412, spend: 282000, cpl: 684 },
];

export const CHANNEL_SPLIT = [
  { name: "Meta Ads", value: 186, color: "#8BB72C" },
  { name: "Google Ads", value: 121, color: "#1F3B56" },
  { name: "Organic", value: 61, color: "#C2C2C2" },
  { name: "QR / walk-in", value: 44, color: "#6D961F" },
];

export const FUNNEL = [
  { stage: "New", count: 412 },
  { stage: "Contacted", count: 337 },
  { stage: "Qualified", count: 198 },
  { stage: "Site visit", count: 96 },
  { stage: "Proposal", count: 41 },
  { stage: "Won", count: 17 },
];

export type LeadRow = {
  id: string;
  name: string;
  phone: string;
  source: string;
  status: "NEW" | "CONTACTED" | "QUALIFIED" | "SITE_VISIT" | "PROPOSAL" | "WON" | "LOST";
  value: number;
  createdAt: string;
};

export const LEADS: LeadRow[] = [
  { id: "L-2841", name: "Priya Raghavan", phone: "+91 98450 11223", source: "META_ADS", status: "SITE_VISIT", value: 9_50_00_000, createdAt: "2026-08-05" },
  { id: "L-2840", name: "Karthik Menon", phone: "+91 99001 88342", source: "GOOGLE_ADS", status: "QUALIFIED", value: 7_20_00_000, createdAt: "2026-08-05" },
  { id: "L-2839", name: "Sneha Iyer", phone: "+91 80888 21190", source: "QR_SCAN", status: "NEW", value: 0, createdAt: "2026-08-04" },
  { id: "L-2838", name: "Arjun Bhat", phone: "+91 97418 30012", source: "META_ADS", status: "PROPOSAL", value: 1_20_00_00_000, createdAt: "2026-08-04" },
  { id: "L-2837", name: "Fatima Sheikh", phone: "+91 90350 77821", source: "ORGANIC", status: "CONTACTED", value: 0, createdAt: "2026-08-03" },
  { id: "L-2836", name: "Vikram Desai", phone: "+91 98860 44510", source: "REFERRAL", status: "WON", value: 1_45_00_00_000, createdAt: "2026-08-02" },
  { id: "L-2835", name: "Ananya Rao", phone: "+91 91480 65039", source: "META_ADS", status: "LOST", value: 0, createdAt: "2026-08-01" },
  { id: "L-2834", name: "Imran Qureshi", phone: "+91 88670 90124", source: "WHATSAPP", status: "QUALIFIED", value: 8_80_00_000, createdAt: "2026-08-01" },
];

export type ProjectRow = {
  id: string;
  name: string;
  status: "DISCOVERY" | "IN_PROGRESS" | "REVIEW" | "LIVE" | "PAUSED" | "COMPLETED";
  progress: number;
  manager: string;
  dueAt: string;
  services: string[];
};

export const PROJECTS: ProjectRow[] = [
  { id: "P-118", name: "Tower C launch campaign", status: "IN_PROGRESS", progress: 68, manager: "Divya Nair", dueAt: "2026-08-28", services: ["Meta Ads", "Landing page", "Drone"] },
  { id: "P-116", name: "Sales microsite rebuild", status: "REVIEW", progress: 91, manager: "Aditya Kulkarni", dueAt: "2026-08-12", services: ["Next.js", "SEO", "CRM"] },
  { id: "P-114", name: "Walkthrough film — 3BHK", status: "LIVE", progress: 100, manager: "Divya Nair", dueAt: "2026-07-22", services: ["Videography", "Editing"] },
  { id: "P-121", name: "WhatsApp follow-up automation", status: "DISCOVERY", progress: 15, manager: "Sana Fernandes", dueAt: "2026-09-04", services: ["Automation", "CRM"] },
  { id: "P-109", name: "Brand guidelines refresh", status: "PAUSED", progress: 42, manager: "Aditya Kulkarni", dueAt: "2026-09-18", services: ["Branding", "Design"] },
];

export type QrRow = {
  id: string;
  label: string;
  type: string;
  location: string;
  scans: number;
  trend: number;
  active: boolean;
};

export const QR_CODES: QrRow[] = [
  { id: "Q-4411", label: "Sales lounge — brochure", type: "CATALOGUE", location: "Whitefield", scans: 6421, trend: 22, active: true },
  { id: "Q-4408", label: "Site hoarding — Outer Ring Rd", type: "URL", location: "Marathahalli", scans: 4880, trend: 31, active: true },
  { id: "Q-4402", label: "Review request card", type: "GOOGLE_REVIEW", location: "Whitefield", scans: 3117, trend: 9, active: true },
  { id: "Q-4399", label: "Site visit WhatsApp", type: "WHATSAPP", location: "All", scans: 2604, trend: 44, active: true },
  { id: "Q-4390", label: "Booking payment link", type: "PAYMENT", location: "Head office", scans: 981, trend: -6, active: true },
  { id: "Q-4381", label: "Diwali offer (expired)", type: "OFFER", location: "All", scans: 399, trend: -71, active: false },
];

export const SCAN_TREND = [
  { day: "Mon", scans: 2140 },
  { day: "Tue", scans: 2480 },
  { day: "Wed", scans: 2311 },
  { day: "Thu", scans: 2902 },
  { day: "Fri", scans: 3390 },
  { day: "Sat", scans: 3810 },
  { day: "Sun", scans: 1369 },
];

export type InvoiceRow = {
  number: string;
  status: "PAID" | "SENT" | "OVERDUE" | "DRAFT" | "PARTIALLY_PAID" | "VOID";
  total: number;
  issuedAt: string;
  dueAt: string;
  description: string;
};

export const INVOICES: InvoiceRow[] = [
  { number: "BMU-2026-0184", status: "SENT", total: 1_00_30_000, issuedAt: "2026-08-01", dueAt: "2026-08-15", description: "Growth retainer — August" },
  { number: "BMU-2026-0171", status: "PAID", total: 1_00_30_000, issuedAt: "2026-07-01", dueAt: "2026-07-15", description: "Growth retainer — July" },
  { number: "BMU-2026-0169", status: "PAID", total: 35_40_000, issuedAt: "2026-06-28", dueAt: "2026-07-12", description: "Drone film — Tower C" },
  { number: "BMU-2026-0158", status: "OVERDUE", total: 17_70_000, issuedAt: "2026-06-05", dueAt: "2026-06-19", description: "Landing page build" },
  { number: "BMU-2026-0142", status: "PAID", total: 1_00_30_000, issuedAt: "2026-06-01", dueAt: "2026-06-15", description: "Growth retainer — June" },
];

export const APPROVALS = [
  { id: "A-77", title: "Tower C — walkthrough reel", type: "Reel", scheduledFor: "2026-08-09", status: "PENDING" },
  { id: "A-76", title: "Amenities carousel (5 slides)", type: "Carousel", scheduledFor: "2026-08-10", status: "PENDING" },
  { id: "A-75", title: "Festive offer banner", type: "Banner", scheduledFor: "2026-08-14", status: "CHANGES_REQUESTED" },
  { id: "A-74", title: "Founder interview cutdown", type: "Video", scheduledFor: "2026-08-16", status: "APPROVED" },
];

export const RANKINGS = [
  { keyword: "3bhk apartments whitefield", position: 3, previous: 7, volume: 2400 },
  { keyword: "new projects outer ring road", position: 5, previous: 5, volume: 1900 },
  { keyword: "ready to move flats bangalore east", position: 9, previous: 14, volume: 3600 },
  { keyword: "atria living reviews", position: 1, previous: 2, volume: 720 },
  { keyword: "luxury villas whitefield", position: 12, previous: 9, volume: 1500 },
];

export const NOTIFICATIONS = [
  { id: "N-9", title: "2 creatives waiting for your approval", href: "/dashboard/approvals", time: "20m ago", unread: true },
  { id: "N-8", title: "Invoice BMU-2026-0184 was sent", href: "/dashboard/invoices", time: "2h ago", unread: true },
  { id: "N-7", title: "July report is ready to download", href: "/dashboard/reports", time: "1d ago", unread: false },
];

export const TICKETS = [
  { id: "T-2210", subject: "Add a second number to WhatsApp routing", status: "IN_PROGRESS", priority: "MEDIUM", updatedAt: "2026-08-05" },
  { id: "T-2204", subject: "Brochure QR points to old floor plan", status: "RESOLVED", priority: "HIGH", updatedAt: "2026-08-02" },
  { id: "T-2199", subject: "Request: weekly lead export to email", status: "OPEN", priority: "LOW", updatedAt: "2026-07-30" },
];

export const REPORTS = [
  { id: "R-31", title: "July 2026 performance report", period: "1–31 Jul 2026", summary: "412 leads at ₹684 CPL. Meta creative refresh drove the drop." },
  { id: "R-30", title: "June 2026 performance report", period: "1–30 Jun 2026", summary: "348 leads at ₹778 CPL. Google search share grew to 29%." },
  { id: "R-29", title: "May 2026 performance report", period: "1–31 May 2026", summary: "301 leads at ₹797 CPL. Landing page rebuild lifted form rate to 11%." },
];

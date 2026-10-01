/**
 * What a business of each type actually gets when it's onboarded.
 *
 * The point of segmenting by industry isn't cosmetic — a salon needs booking
 * and a restaurant needs a menu, and shipping both to everyone makes the
 * product feel bloated to both.
 */
import { INDUSTRY_TO_CATEGORY } from "./review-suggestions";

export type ModuleKey =
  | "profile" | "review" | "whatsapp" | "leads" | "offers" | "loyalty"
  | "menu" | "orders" | "booking" | "catalogue" | "payments" | "brochure"
  | "campaigns" | "locations" | "social" | "ai" | "ar";

export const MODULE_LABEL: Record<ModuleKey, string> = {
  profile: "Smart profile", review: "Review booster", whatsapp: "WhatsApp",
  leads: "Lead capture", offers: "Offers", loyalty: "Loyalty",
  menu: "Digital menu", orders: "Ordering", booking: "Bookings",
  catalogue: "Catalogue", payments: "Payments", brochure: "Brochure",
  campaigns: "Campaigns", locations: "Multi-location", social: "Social", ai: "AI assistant",
  ar: "Augmented reality",
};

/** What the tenant's overview leads with. Keys map to KPI_LIBRARY below. */
export type KpiKey =
  | "views" | "reviews" | "whatsapp" | "leads" | "bookings" | "orders"
  | "sales" | "scans" | "calls" | "directions" | "payments" | "donations"
  | "enquiries" | "siteVisits" | "trials" | "admissions" | "repeat";

export const KPI_LIBRARY: Record<KpiKey, { label: string; sub: string; icon: string }> = {
  views:      { label: "Profile views", sub: "from QR and NFC scans", icon: "Eye" },
  scans:      { label: "QR scans", sub: "all codes combined", icon: "QrCode" },
  reviews:    { label: "Reviews collected", sub: "routed to Google", icon: "Star" },
  whatsapp:   { label: "WhatsApp clicks", sub: "chats opened", icon: "MessageCircle" },
  calls:      { label: "Calls started", sub: "tapped to dial", icon: "Phone" },
  directions: { label: "Directions opened", sub: "people who set off", icon: "MapPin" },
  leads:      { label: "Leads captured", sub: "forms and offers", icon: "Users" },
  enquiries:  { label: "Enquiries", sub: "trade and general", icon: "Users" },
  bookings:   { label: "Appointments", sub: "booked this month", icon: "CalendarCheck" },
  siteVisits: { label: "Site visits", sub: "booked this month", icon: "CalendarCheck" },
  trials:     { label: "Trials booked", sub: "first sessions", icon: "CalendarCheck" },
  admissions: { label: "Admission enquiries", sub: "this intake", icon: "Users" },
  orders:     { label: "Orders", sub: "dine-in and takeaway", icon: "Receipt" },
  sales:      { label: "Sales today", sub: "across all channels", icon: "IndianRupee" },
  payments:   { label: "Payments taken", sub: "via QR", icon: "IndianRupee" },
  donations:  { label: "Donations", sub: "this month", icon: "IndianRupee" },
  repeat:     { label: "Repeat customers", sub: "seen more than once", icon: "Repeat" },
};

export type IndustrySetup = {
  slug: string;
  name: string;
  /** Which review voice and profile template it inherits. */
  category: string;
  /** Big buttons on the profile, in order. */
  primaryActions: string[];
  /** Turned on at onboarding. */
  modules: ModuleKey[];
  /** Plan where this configuration becomes available. */
  plan: "STARTER" | "BUSINESS" | "PRO";
  /** Hardware that usually goes with it. */
  kit: string[];
  /** What the business is actually trying to increase. */
  primaryGoal: string;
  /** The metric worth putting first on their dashboard. */
  heroMetric: string;
  /** Exactly four KPI cards, in order. */
  kpis: KpiKey[];
};

const base: ModuleKey[] = ["profile", "review", "whatsapp", "offers", "social", "ai"];

export const INDUSTRY_SETUPS: IndustrySetup[] = [
  { slug: "real-estate", name: "Real Estate", category: "REAL_ESTATE", primaryActions: ["Brochure", "WhatsApp", "Call", "Site visit"], modules: [...base, "ar", "leads", "brochure", "booking", "campaigns"], plan: "PRO", kit: ["Site hoarding QR", "Sales lounge standee", "NFC cards for sales team"], primaryGoal: "Site visits booked", heroMetric: "Site visits this month", kpis: ["siteVisits", "leads", "whatsapp", "views"] },
  { slug: "builders", name: "Builders", category: "REAL_ESTATE", primaryActions: ["Projects", "WhatsApp", "Call", "Directions"], modules: [...base, "ar", "leads", "brochure", "campaigns"], plan: "PRO", kit: ["Project hoarding QR", "NFC cards"], primaryGoal: "Qualified enquiries", heroMetric: "Enquiries this month", kpis: ["enquiries", "leads", "whatsapp", "views"] },
  { slug: "architects", name: "Architects", category: "PROFESSIONAL", primaryActions: ["Portfolio", "WhatsApp", "Email", "Call"], modules: [...base, "leads", "brochure"], plan: "BUSINESS", kit: ["NFC business cards", "Studio standee"], primaryGoal: "Consultation requests", heroMetric: "Enquiries this month", kpis: ["enquiries", "views", "whatsapp", "reviews"] },
  { slug: "interior-designers", name: "Interior Designers", category: "PROFESSIONAL", primaryActions: ["Portfolio", "WhatsApp", "Book consult", "Instagram"], modules: [...base, "ar", "leads", "booking", "catalogue"], plan: "BUSINESS", kit: ["NFC cards", "Showroom standee"], primaryGoal: "Consultations", heroMetric: "Consults booked", kpis: ["enquiries", "bookings", "whatsapp", "views"] },
  { slug: "restaurants", name: "Restaurants", category: "RESTAURANT", primaryActions: ["Menu", "WhatsApp", "Directions", "Book a table"], modules: [...base, "ar", "menu", "orders", "booking", "loyalty", "payments"], plan: "PRO", kit: ["Table tents ×10", "Review standee", "Window stickers"], primaryGoal: "Orders and covers", heroMetric: "Sales today", kpis: ["sales", "orders", "reviews", "scans"] },
  { slug: "cafes", name: "Cafes", category: "CAFE", primaryActions: ["Menu", "WhatsApp", "Directions", "Leave a review"], modules: [...base, "ar", "menu", "orders", "loyalty", "payments"], plan: "PRO", kit: ["Table tents ×6", "Counter standee"], primaryGoal: "Repeat visits", heroMetric: "Repeat customers", kpis: ["sales", "orders", "repeat", "reviews"] },
  { slug: "hotels", name: "Hotels", category: "HOTEL", primaryActions: ["Book a room", "Call", "Directions", "WhatsApp"], modules: [...base, "ar", "booking", "menu", "payments", "locations"], plan: "PRO", kit: ["Room QR cards", "Reception name plate", "Review standee"], primaryGoal: "Direct bookings", heroMetric: "Direct bookings", kpis: ["bookings", "reviews", "views", "directions"] },
  { slug: "resorts", name: "Resorts", category: "HOTEL", primaryActions: ["Book a stay", "WhatsApp", "Directions", "Offers"], modules: [...base, "ar", "booking", "payments", "campaigns"], plan: "PRO", kit: ["Room QR cards", "Lobby standee"], primaryGoal: "Direct bookings", heroMetric: "Direct bookings", kpis: ["bookings", "reviews", "whatsapp", "views"] },
  { slug: "travel", name: "Travel", category: "HOTEL", primaryActions: ["Packages", "WhatsApp", "Call", "Pay deposit"], modules: [...base, "ar", "leads", "payments", "brochure"], plan: "BUSINESS", kit: ["Counter standee", "NFC cards"], primaryGoal: "Package enquiries", heroMetric: "Enquiries this month", kpis: ["enquiries", "whatsapp", "views", "payments"] },
  { slug: "hospitals", name: "Hospitals", category: "HOSPITAL", primaryActions: ["Book appointment", "Call", "Directions", "Departments"], modules: [...base, "booking", "leads", "locations"], plan: "PRO", kit: ["Reception standees", "Department QR plates"], primaryGoal: "Appointments", heroMetric: "Appointments booked", kpis: ["bookings", "calls", "directions", "reviews"] },
  { slug: "clinics", name: "Clinics", category: "CLINIC", primaryActions: ["Book appointment", "Call", "Directions"], modules: [...base, "booking", "leads"], plan: "BUSINESS", kit: ["Reception standee", "Feedback card"], primaryGoal: "Appointments", heroMetric: "Appointments booked", kpis: ["bookings", "calls", "reviews", "views"] },
  { slug: "doctors", name: "Doctors", category: "DOCTOR", primaryActions: ["Book appointment", "Call", "Directions", "WhatsApp"], modules: [...base, "booking"], plan: "BUSINESS", kit: ["Desk name plate", "NFC card"], primaryGoal: "Appointments", heroMetric: "Appointments booked", kpis: ["bookings", "calls", "reviews", "views"] },
  { slug: "schools", name: "Schools", category: "EDUCATION", primaryActions: ["Admissions", "Call", "Directions", "Prospectus"], modules: [...base, "leads", "brochure", "campaigns"], plan: "BUSINESS", kit: ["Gate standee", "Admission desk QR"], primaryGoal: "Admission enquiries", heroMetric: "Admission enquiries", kpis: ["admissions", "calls", "views", "directions"] },
  { slug: "colleges", name: "Colleges", category: "EDUCATION", primaryActions: ["Apply", "Call", "Prospectus", "Directions"], modules: [...base, "ar", "leads", "brochure", "campaigns", "locations"], plan: "PRO", kit: ["Campus standees", "Event badges"], primaryGoal: "Applications", heroMetric: "Applications started", kpis: ["admissions", "enquiries", "views", "reviews"] },
  { slug: "education", name: "Education", category: "EDUCATION", primaryActions: ["Courses", "Book a demo", "WhatsApp", "Call"], modules: [...base, "leads", "booking", "payments"], plan: "BUSINESS", kit: ["Reception standee", "NFC cards"], primaryGoal: "Demo classes booked", heroMetric: "Demos booked", kpis: ["admissions", "bookings", "whatsapp", "views"] },
  { slug: "gyms", name: "Gyms", category: "GYM", primaryActions: ["Book a trial", "WhatsApp", "Call", "Directions"], modules: [...base, "booking", "leads", "loyalty", "payments"], plan: "PRO", kit: ["Entrance standee", "Locker room stickers"], primaryGoal: "Trials booked", heroMetric: "Trials booked", kpis: ["trials", "leads", "reviews", "repeat"] },
  { slug: "fitness-centers", name: "Fitness Centers", category: "GYM", primaryActions: ["Book a trial", "Plans", "WhatsApp", "Directions"], modules: [...base, "booking", "leads", "loyalty"], plan: "PRO", kit: ["Entrance standee", "Trainer NFC cards"], primaryGoal: "Trials booked", heroMetric: "Trials booked", kpis: ["trials", "bookings", "repeat", "reviews"] },
  { slug: "salons", name: "Salons", category: "SALON", primaryActions: ["Book appointment", "WhatsApp", "Call", "Directions"], modules: [...base, "booking", "loyalty", "payments", "leads"], plan: "PRO", kit: ["Reception standee", "Mirror station stickers", "Review card"], primaryGoal: "Appointments and rebooking", heroMetric: "Appointments this week", kpis: ["bookings", "reviews", "repeat", "whatsapp"] },
  { slug: "beauty-brands", name: "Beauty Brands", category: "SPA", primaryActions: ["Catalogue", "WhatsApp", "Pay", "Instagram"], modules: [...base, "ar", "catalogue", "payments", "loyalty", "campaigns"], plan: "BUSINESS", kit: ["Product stickers", "Counter card"], primaryGoal: "Repeat purchases", heroMetric: "Repeat purchase rate", kpis: ["payments", "repeat", "reviews", "views"] },
  { slug: "jewellery", name: "Jewellery", category: "RETAIL", primaryActions: ["Catalogue", "WhatsApp", "Book a viewing", "Directions"], modules: [...base, "ar", "catalogue", "booking", "leads"], plan: "BUSINESS", kit: ["Display case QR", "Premium acrylic standee"], primaryGoal: "Store visits", heroMetric: "Viewings booked", kpis: ["bookings", "views", "whatsapp", "directions"] },
  { slug: "retail", name: "Retail", category: "RETAIL", primaryActions: ["Catalogue", "WhatsApp", "Pay", "Directions"], modules: [...base, "catalogue", "payments", "loyalty"], plan: "BUSINESS", kit: ["Counter standee", "Window stickers", "Shelf stickers"], primaryGoal: "Repeat footfall", heroMetric: "Repeat customers", kpis: ["repeat", "payments", "reviews", "directions"] },
  { slug: "ecommerce", name: "Ecommerce", category: "RETAIL", primaryActions: ["Shop", "WhatsApp", "Track order", "Instagram"], modules: [...base, "ar", "catalogue", "payments", "campaigns", "loyalty"], plan: "BUSINESS", kit: ["Parcel insert cards", "Review request stickers"], primaryGoal: "Reviews and repeat orders", heroMetric: "Reviews collected", kpis: ["reviews", "repeat", "payments", "views"] },
  { slug: "automobile", name: "Automobile", category: "AUTOMOBILE", primaryActions: ["Book a service", "Call", "WhatsApp", "Directions"], modules: [...base, "ar", "booking", "leads", "payments"], plan: "PRO", kit: ["Service desk standee", "Vehicle stickers", "Keychain tags"], primaryGoal: "Service bookings", heroMetric: "Services booked", kpis: ["bookings", "calls", "reviews", "repeat"] },
  { slug: "finance", name: "Finance", category: "PROFESSIONAL", primaryActions: ["Book a consult", "Call", "Email", "LinkedIn"], modules: [...base, "leads", "booking"], plan: "BUSINESS", kit: ["NFC cards", "Desk name plate"], primaryGoal: "Consultations", heroMetric: "Consults booked", kpis: ["bookings", "enquiries", "calls", "views"] },
  { slug: "manufacturing", name: "Manufacturing", category: "OTHER", primaryActions: ["Catalogue", "Enquiry", "Call", "Email"], modules: [...base, "catalogue", "leads", "brochure"], plan: "BUSINESS", kit: ["Exhibition standee", "NFC cards", "Product tags"], primaryGoal: "Trade enquiries", heroMetric: "Enquiries this month", kpis: ["enquiries", "views", "calls", "scans"] },
  { slug: "ngos", name: "NGOs", category: "OTHER", primaryActions: ["Donate", "Volunteer", "WhatsApp", "About"], modules: [...base, "payments", "leads", "campaigns"], plan: "STARTER", kit: ["Collection box QR", "Event standees"], primaryGoal: "Donations and volunteers", heroMetric: "Donations this month", kpis: ["donations", "leads", "views", "scans"] },
  { slug: "startups", name: "Startups", category: "AGENCY", primaryActions: ["Website", "Book a demo", "LinkedIn", "Email"], modules: [...base, "leads", "booking", "campaigns"], plan: "STARTER", kit: ["NFC cards", "Event badges"], primaryGoal: "Demo requests", heroMetric: "Demos booked", kpis: ["bookings", "leads", "views", "whatsapp"] },
];

export const setupBySlug = (slug: string) => INDUSTRY_SETUPS.find((i) => i.slug === slug);

/** Sanity check — every industry on the site must have a review voice. */
export const unmappedIndustries = () =>
  INDUSTRY_SETUPS.filter((i) => !INDUSTRY_TO_CATEGORY[i.slug]).map((i) => i.slug);

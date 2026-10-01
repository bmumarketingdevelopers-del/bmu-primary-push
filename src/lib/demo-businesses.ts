/**
 * A working demo tenant for every one of the 27 industries.
 *
 * Generated from INDUSTRY_SETUPS rather than hand-written, so adding a 28th
 * industry produces a working /b/{slug} automatically and the two can never
 * drift apart.
 */
import { INDUSTRY_SETUPS, type IndustrySetup } from "./industry-setup";
import type { LinkType, SmartProfile } from "./qr-platform";

type Extras = {
  name: string;
  tagline: string;
  about: string;
  city: string;
  area: string;
  color: string;
  rating: number;
  reviews: number;
  services: { name: string; price?: number; note?: string }[];
  offer?: { title: string; detail: string };
};

/** Per-industry flavour. Names are invented; replace before any live demo. */
const EXTRAS: Record<string, Extras> = {
  "real-estate": { name: "Atria Living", tagline: "3 & 4BHK residences · Whitefield", about: "Ready-to-move towers off Outer Ring Road. RERA approved, possession from March.", city: "Bengaluru", area: "Whitefield", color: "#1F3B56", rating: 4.6, reviews: 412, services: [{ name: "3BHK · 1,840 sq ft", price: 12_50_00_000, note: "from" }, { name: "4BHK · 2,410 sq ft", price: 18_90_00_000, note: "from" }, { name: "Site visit", note: "free" }], offer: { title: "No floor-rise charges this month", detail: "On bookings confirmed before the 31st." } },
  builders: { name: "Northview Developers", tagline: "Building in Bengaluru since 2004", about: "Nine delivered projects, three under construction. Handover on schedule is the whole pitch.", city: "Bengaluru", area: "Hebbal", color: "#203348", rating: 4.4, reviews: 268, services: [{ name: "Residential projects", note: "browse" }, { name: "Commercial spaces", note: "enquire" }, { name: "Joint development", note: "on request" }] },
  architects: { name: "Meraki Studio", tagline: "Architecture & interiors", about: "Residential and boutique commercial work. We take four projects a year.", city: "Bengaluru", area: "Indiranagar", color: "#121F2F", rating: 4.9, reviews: 64, services: [{ name: "Design consultation", price: 1500000 }, { name: "Full architectural service", note: "% of build" }, { name: "Interior packages", price: 45000000, note: "from" }] },
  "interior-designers": { name: "Form & Space", tagline: "Interiors for homes that get lived in", about: "Turnkey interiors with a fixed quote before work starts. No surprise variations.", city: "Bengaluru", area: "Koramangala", color: "#6D961F", rating: 4.7, reviews: 118, services: [{ name: "2BHK turnkey", price: 6_50_000_00, note: "from" }, { name: "Modular kitchen", price: 2_20_000_00, note: "from" }, { name: "Consultation", price: 500000 }], offer: { title: "Free 3D walkthrough", detail: "On any turnkey booking this quarter." } },
  restaurants: { name: "Saffron & Co", tagline: "North Indian kitchen · 6 outlets", about: "Slow-cooked North Indian, family portions, no MSG. Weekend brunch from 11am.", city: "Bengaluru", area: "HSR Layout", color: "#C2410C", rating: 4.6, reviews: 3104, services: [{ name: "Weekend brunch", price: 89000, note: "per head" }, { name: "Family thali", price: 42000 }, { name: "Party orders", note: "on request" }], offer: { title: "Brunch for four at ₹2,999", detail: "Saturdays and Sundays, 11am to 3pm." } },
  cafes: { name: "Third Wave Corner", tagline: "Filter, pour-over and a quiet corner", about: "Single-origin beans roasted weekly. Plug points at every table, which is the actual reason people come.", city: "Bengaluru", area: "Jayanagar", color: "#7C4A21", rating: 4.7, reviews: 892, services: [{ name: "Filter coffee", price: 12000 }, { name: "Pour-over", price: 22000 }, { name: "All-day breakfast", price: 34000, note: "from" }], offer: { title: "Second coffee half price", detail: "Weekdays before noon." } },
  hotels: { name: "The Ivory House", tagline: "42 rooms · city centre", about: "Business hotel five minutes from MG Road. Breakfast included, late checkout when we can.", city: "Bengaluru", area: "MG Road", color: "#1F3B56", rating: 4.5, reviews: 1420, services: [{ name: "Deluxe room", price: 4_20_000, note: "per night" }, { name: "Executive suite", price: 7_80_000, note: "per night" }, { name: "Conference hall", price: 12_00_000, note: "per day" }] },
  resorts: { name: "Blue Harbour Resorts", tagline: "Coastal stays · Udupi", about: "Sea-facing rooms, a kitchen that does proper Mangalorean fish, and no piped music.", city: "Udupi", area: "Malpe", color: "#0E7490", rating: 4.8, reviews: 976, services: [{ name: "Sea-facing room", price: 6_50_000, note: "per night" }, { name: "Garden villa", price: 9_20_000, note: "per night" }, { name: "Day picnic", price: 1_80_000, note: "per head" }], offer: { title: "Monsoon rate — 30% off", detail: "June through September, minimum two nights." } },
  travel: { name: "Deccan Trails", tagline: "Curated trips across South India", about: "Small-group and custom itineraries. We book what we've actually been to.", city: "Bengaluru", area: "Basavanagudi", color: "#8BB72C", rating: 4.6, reviews: 341, services: [{ name: "Coorg weekend", price: 12_50_000, note: "per head" }, { name: "Kerala backwaters, 5 nights", price: 38_00_000, note: "from" }, { name: "Custom itinerary", note: "on request" }] },
  hospitals: { name: "Verde Multispeciality", tagline: "24×7 emergency · 180 beds", about: "Cardiology, orthopaedics, paediatrics and general medicine under one roof.", city: "Mysuru", area: "Vijayanagar", color: "#0F766E", rating: 4.3, reviews: 1806, services: [{ name: "General consultation", price: 60000 }, { name: "Specialist consultation", price: 90000 }, { name: "Full health check", price: 3_50_000, note: "from" }] },
  clinics: { name: "Verde Clinics", tagline: "Family clinic · walk-ins welcome", about: "General practice with same-day appointments. Lab collection on site.", city: "Mysuru", area: "Saraswathipuram", color: "#0F766E", rating: 4.7, reviews: 486, services: [{ name: "Consultation", price: 50000 }, { name: "Vaccination", price: 80000, note: "from" }, { name: "Blood work", price: 45000, note: "from" }] },
  doctors: { name: "Dr. Anjali Rao", tagline: "Dermatologist · MD (Derm)", about: "Fourteen years in clinical and cosmetic dermatology. Appointments run to time.", city: "Bengaluru", area: "Malleshwaram", color: "#1E40AF", rating: 4.9, reviews: 322, services: [{ name: "Consultation", price: 80000 }, { name: "Acne treatment plan", price: 2_50_000, note: "from" }, { name: "Follow-up", price: 40000 }] },
  schools: { name: "Silverleaf School", tagline: "CBSE · Nursery to Class 12", about: "Two-acre campus, 22 students per class, transport across east Bengaluru.", city: "Bengaluru", area: "Marathahalli", color: "#1D4ED8", rating: 4.4, reviews: 214, services: [{ name: "Admission enquiry", note: "open" }, { name: "Campus tour", note: "by appointment" }, { name: "Transport", price: 1_80_000, note: "per year" }] },
  colleges: { name: "Deccan Institute", tagline: "Engineering & management", about: "AICTE approved. Placement cell with 180+ recruiting companies.", city: "Hubballi", area: "Gokul Road", color: "#4338CA", rating: 4.2, reviews: 640, services: [{ name: "B.E. programmes", note: "apply" }, { name: "MBA", note: "apply" }, { name: "Campus visit", note: "book" }] },
  education: { name: "Nexus Learning", tagline: "Coaching for JEE & NEET", about: "Batches capped at 30. Weekly parent reports, not just term results.", city: "Bengaluru", area: "Rajajinagar", color: "#7C3AED", rating: 4.6, reviews: 428, services: [{ name: "Demo class", note: "free" }, { name: "Two-year programme", price: 1_40_000_00, note: "from" }, { name: "Crash course", price: 45_000_00 }], offer: { title: "Early bird — 15% off", detail: "Enrolments before the 30th." } },
  gyms: { name: "Iron & Oak", tagline: "Strength training · Indiranagar", about: "Free weights, proper coaching, no lock-in contracts.", city: "Bengaluru", area: "Indiranagar", color: "#DC2626", rating: 4.8, reviews: 712, services: [{ name: "Monthly membership", price: 3_00_000 }, { name: "Quarterly", price: 7_50_000 }, { name: "Personal training", price: 1_20_000, note: "per session" }], offer: { title: "First week free", detail: "Full access, no card needed." } },
  "fitness-centers": { name: "Form & Fit", tagline: "Group classes & functional training", about: "HIIT, yoga, strength and mobility. Twelve classes a day.", city: "Bengaluru", area: "Whitefield", color: "#EA580C", rating: 4.7, reviews: 534, services: [{ name: "Class pack of 10", price: 4_50_000 }, { name: "Unlimited monthly", price: 3_80_000 }, { name: "Trial class", note: "free" }] },
  salons: { name: "ABC Salon", tagline: "Unisex salon · Indiranagar", about: "Fifteen years on 100 Feet Road. Cuts, colour and bridal work, by appointment or walk-in before 4pm.", city: "Bengaluru", area: "Indiranagar", color: "#8BB72C", rating: 4.8, reviews: 1248, services: [{ name: "Haircut & styling", price: 45000, note: "from" }, { name: "Hair colour", price: 180000, note: "from" }, { name: "Facial", price: 120000 }, { name: "Bridal package", price: 1500000, note: "from" }], offer: { title: "Weekday 20% off", detail: "Monday to Thursday, before 2pm. Show this screen." } },
  "beauty-brands": { name: "Kaya Naturals", tagline: "Small-batch skincare", about: "Made in Bengaluru, no parabens, everything under 12 ingredients.", city: "Bengaluru", area: "Sadashivanagar", color: "#DB2777", rating: 4.7, reviews: 1890, services: [{ name: "Face serum", price: 145000 }, { name: "Cleanser", price: 68000 }, { name: "Gift set", price: 320000 }], offer: { title: "Free shipping over ₹999", detail: "Across India, 3–5 working days." } },
  jewellery: { name: "Kanaka Jewellers", tagline: "Gold & diamond · since 1972", about: "BIS hallmarked, transparent making charges, buyback at published rates.", city: "Bengaluru", area: "Chickpet", color: "#B45309", rating: 4.6, reviews: 928, services: [{ name: "Gold jewellery", note: "current rate" }, { name: "Diamond collection", note: "certified" }, { name: "Private viewing", note: "by appointment" }] },
  retail: { name: "Northline Stores", tagline: "Home & kitchen essentials", about: "Four aisles of things you actually need, priced without the mall markup.", city: "Bengaluru", area: "Banashankari", color: "#0369A1", rating: 4.3, reviews: 412, services: [{ name: "Home essentials", note: "in store" }, { name: "Kitchenware", note: "in store" }, { name: "Bulk orders", note: "on request" }] },
  ecommerce: { name: "Wickham & Co", tagline: "Online-first home goods", about: "Direct-to-door across India. Returns accepted for 14 days, no questions.", city: "Bengaluru", area: "Online", color: "#4F46E5", rating: 4.5, reviews: 2610, services: [{ name: "Shop the catalogue", note: "browse" }, { name: "Track an order", note: "enter order ID" }, { name: "Returns", note: "14 days" }] },
  automobile: { name: "Kesar Motors", tagline: "Multi-brand service · Hubballi", about: "Estimates given before work starts, and the bill matches them.", city: "Hubballi", area: "Gokul Road", color: "#334155", rating: 4.5, reviews: 786, services: [{ name: "General service", price: 3_50_000, note: "from" }, { name: "Bodywork & paint", price: 8_00_000, note: "from" }, { name: "Pickup & drop", note: "free" }], offer: { title: "Free wheel alignment", detail: "With any full service this month." } },
  finance: { name: "Meridian Advisors", tagline: "Tax, audit & advisory", about: "Chartered accountants for founders and small businesses. Filing done properly, once.", city: "Bengaluru", area: "Richmond Town", color: "#155E75", rating: 4.8, reviews: 156, services: [{ name: "ITR filing", price: 3_50_000, note: "from" }, { name: "GST compliance", price: 5_00_000, note: "monthly" }, { name: "Consultation", price: 2_50_000 }] },
  manufacturing: { name: "Vyapar Industries", tagline: "Precision components · since 1988", about: "CNC machining and sheet metal for automotive and industrial clients.", city: "Hubballi", area: "Industrial Area", color: "#475569", rating: 4.4, reviews: 62, services: [{ name: "CNC machining", note: "per drawing" }, { name: "Sheet metal fabrication", note: "per drawing" }, { name: "Sample run", note: "on request" }] },
  ngos: { name: "Aasha Foundation", tagline: "Education for children in Bengaluru", about: "After-school programmes for 640 children across nine centres. 80(G) registered.", city: "Bengaluru", area: "Bommanahalli", color: "#059669", rating: 4.9, reviews: 208, services: [{ name: "Sponsor a child", price: 1_20_000, note: "per year" }, { name: "One-time donation", note: "any amount" }, { name: "Volunteer", note: "weekends" }], offer: { title: "80(G) tax exemption", detail: "Receipt issued within 48 hours of any donation." } },
  startups: { name: "Loopcraft", tagline: "Workflow automation for SMBs", about: "Connect the tools you already use. Live in a day, not a quarter.", city: "Bengaluru", area: "Koramangala", color: "#7C3AED", rating: 4.7, reviews: 94, services: [{ name: "Starter", price: 2_40_000, note: "per year" }, { name: "Growth", price: 7_20_000, note: "per year" }, { name: "Demo", note: "30 minutes" }] },
};

/** Turns a setup's primary actions into working profile links. */
function linksFor(setup: IndustrySetup, e: Extras) {
  const phone = "+919845000111";
  const wa = "919845000111";

  const MAP: Record<string, { type: LinkType; label: string; value: string }> = {
    "Book appointment": { type: "BOOKING", label: "Book appointment", value: `/b/${setup.slug}/book` },
    "Book a trial": { type: "BOOKING", label: "Book a trial", value: `/b/${setup.slug}/book` },
    "Book a room": { type: "BOOKING", label: "Book a room", value: `/b/${setup.slug}/book` },
    "Book a stay": { type: "BOOKING", label: "Book a stay", value: `/b/${setup.slug}/book` },
    "Book a table": { type: "BOOKING", label: "Book a table", value: `/b/${setup.slug}/book` },
    "Book a service": { type: "BOOKING", label: "Book a service", value: `/b/${setup.slug}/book` },
    "Book a viewing": { type: "BOOKING", label: "Book a viewing", value: `/b/${setup.slug}/book` },
    "Book a demo": { type: "BOOKING", label: "Book a demo", value: `/b/${setup.slug}/book` },
    "Book consult": { type: "BOOKING", label: "Book a consultation", value: `/b/${setup.slug}/book` },
    "Book a consult": { type: "BOOKING", label: "Book a consultation", value: `/b/${setup.slug}/book` },
    "Site visit": { type: "BOOKING", label: "Book a site visit", value: `/b/${setup.slug}/book` },
    "Campus tour": { type: "BOOKING", label: "Book a campus tour", value: `/b/${setup.slug}/book` },
    Menu: { type: "MENU", label: "See the menu", value: `/b/${setup.slug}/menu` },
    WhatsApp: { type: "WHATSAPP", label: "WhatsApp", value: wa },
    Call: { type: "PHONE", label: "Call", value: phone },
    Directions: { type: "DIRECTIONS", label: "Directions", value: `https://maps.google.com/?q=${encodeURIComponent(`${e.area} ${e.city}`)}` },
    Brochure: { type: "BROCHURE", label: "Download brochure", value: "https://example.com/brochure.pdf" },
    Prospectus: { type: "BROCHURE", label: "Prospectus", value: "https://example.com/prospectus.pdf" },
    Catalogue: { type: "CATALOGUE", label: "Catalogue", value: "https://example.com/catalogue" },
    Portfolio: { type: "CATALOGUE", label: "Portfolio", value: "https://example.com/portfolio" },
    Projects: { type: "CATALOGUE", label: "Our projects", value: "https://example.com/projects" },
    Courses: { type: "CATALOGUE", label: "Courses", value: "https://example.com/courses" },
    Packages: { type: "CATALOGUE", label: "Packages", value: "https://example.com/packages" },
    Plans: { type: "CATALOGUE", label: "Membership plans", value: "https://example.com/plans" },
    Departments: { type: "CATALOGUE", label: "Departments", value: "https://example.com/departments" },
    Shop: { type: "WEBSITE", label: "Shop online", value: "https://example.com/shop" },
    Website: { type: "WEBSITE", label: "Website", value: "https://example.com" },
    Pay: { type: "PAYMENT", label: "Pay now", value: "upi://pay?pa=demo@upi" },
    "Pay deposit": { type: "PAYMENT", label: "Pay deposit", value: "upi://pay?pa=demo@upi" },
    Donate: { type: "PAYMENT", label: "Donate", value: "upi://pay?pa=demo@upi" },
    Email: { type: "EMAIL", label: "Email", value: "hello@example.com" },
    Instagram: { type: "INSTAGRAM", label: "Instagram", value: "https://instagram.com" },
    LinkedIn: { type: "LINKEDIN", label: "LinkedIn", value: "https://linkedin.com" },
    Offers: { type: "CUSTOM", label: "Offers", value: `/b/${setup.slug}` },
    About: { type: "CUSTOM", label: "About us", value: `/b/${setup.slug}` },
    Admissions: { type: "BOOKING", label: "Admission enquiry", value: `/b/${setup.slug}/book` },
    Apply: { type: "BOOKING", label: "Apply now", value: `/b/${setup.slug}/book` },
    Enquiry: { type: "WHATSAPP", label: "Send an enquiry", value: wa },
    Volunteer: { type: "WHATSAPP", label: "Volunteer", value: wa },
    "Track order": { type: "WEBSITE", label: "Track your order", value: "https://example.com/track" },
    "Leave a review": { type: "GOOGLE_REVIEW", label: "Leave a review", value: `/r/${setup.slug}` },
  };

  const primary = setup.primaryActions
    .map((a) => MAP[a])
    .filter(Boolean) as { type: LinkType; label: string; value: string }[];

  // Always reachable, even when the template doesn't lead with them.
  const fallback = [
    { type: "WHATSAPP" as LinkType, label: "WhatsApp", value: wa },
    { type: "PHONE" as LinkType, label: "Call", value: phone },
    { type: "GOOGLE_REVIEW" as LinkType, label: "Leave a review", value: `/r/${setup.slug}` },
  ];

  const seen = new Set(primary.map((l) => l.type));
  return [...primary, ...fallback.filter((f) => !seen.has(f.type))];
}

export const DEMO_INDUSTRY_BUSINESSES: SmartProfile[] = INDUSTRY_SETUPS.map((setup) => {
  const e = EXTRAS[setup.slug];
  if (!e) throw new Error(`No demo content for industry "${setup.slug}"`);

  // Licences a trade must display. Empty for trades with no obligation.
  const LICENCES: Record<string, Record<string, string>> = {
    restaurants: { fssaiNumber: "11223344556677", gstNumber: "29AACCS9012Q1Z8" },
    cafes: { fssaiNumber: "11223344556688", gstNumber: "29AABCC1234D1Z9" },
    hotels: { fssaiNumber: "11223344556699", gstNumber: "29AAECH5678E1Z3" },
    hospitals: { clinicRegNo: "KA/CEA/2024/01234", drugLicence: "KA-B-20/12345" },
    clinics: { clinicRegNo: "KA/CEA/2024/05678" },
    doctors: { clinicRegNo: "KA/CEA/2024/09012" },
    "real-estate": { reraNumber: "PRM/KA/RERA/1251/446/PR/123456", gstNumber: "29AAACA1234M1Z5" },
    builders: { reraNumber: "PRM/KA/RERA/1251/446/PR/654321" },
    retail: { gstNumber: "29AAFCR2345T1Z7" },
    jewellery: { gstNumber: "29AAGCJ6789F1Z2" },
    automobile: { gstNumber: "29AAHCK3456G1Z6" },
    salons: { gstNumber: "29AAICS7890H1Z4" },
  };

  return {
    slug: setup.slug,
    name: e.name,
    licences: LICENCES[setup.slug] ?? {},
    category: setup.category,
    tagline: e.tagline,
    about: e.about,
    phone: "+919845000111",
    whatsapp: "919845000111",
    address: `${e.area}, ${e.city}`,
    city: e.city,
    rating: e.rating,
    reviewCount: e.reviews,
    brandColor: e.color,
    gbpUrl: `https://g.page/r/${setup.slug}/review`,
    links: linksFor(setup, e),
    services: e.services,
    offers: e.offer ? [e.offer] : [],
    isPublished: true,
  };
});

export const industryBusinessBySlug = (slug: string) =>
  DEMO_INDUSTRY_BUSINESSES.find((b) => b.slug === slug);

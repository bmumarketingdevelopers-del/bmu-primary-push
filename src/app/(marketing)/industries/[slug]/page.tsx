import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  Bot,
  CalendarDays,
  Camera,
  Check,
  CodeXml,
  DoorOpen,
  Eye,
  FlaskConical,
  GraduationCap,
  Heart,
  LayoutGrid,
  MapPin,
  Megaphone,
  MessageCircle,
  ReceiptText,
  RefreshCw,
  Search,
  ShieldCheck,
  Star,
  Users,
  Video,
  X,
  type LucideIcon,
} from "lucide-react";
// industry-page reveal: replays on every visit and staggers the cards inside (see reveal-on-view.tsx)
import { Reveal } from "./reveal-on-view";
import { ServiceIcon } from "@/components/marketing/service-icon";
import { INDUSTRY_DETAILS, getIndustry, type IndustryDetail } from "@/lib/industries-data";
import { getService, type IconName } from "@/lib/services-data";
import { cn } from "@/lib/utils";
import { HeroStats } from "./hero-stats";
import { RestaurantVisual } from "./restaurant-visual";
import styles from "./page.module.css";

export function generateStaticParams() {
  return INDUSTRY_DETAILS.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const industry = getIndustry(slug);
  if (!industry) return {};
  return { title: `${industry.name} marketing`, description: industry.summary };
}

/* =========================================
   Page content. One layout for all 8 industries; an industry with its own entry in PAGES uses
   the copy from its design, the rest are filled from the shared industries data until their
   designs arrive (see pageFor). Kept here so the shared data stays untouched.
   ========================================= */

type Tool = {
  kind: "Service" | "Product";
  title: string;
  body: string;
  href: string;
  /** a lucide icon, or a ServiceIcon name for the data-driven fallback */
  Icon?: LucideIcon;
  serviceIcon?: IconName;
};

type IndustryPage = {
  pill: string;
  /** a [line 1, line 2] pair breaks exactly where the design does */
  title: string | [string, string];
  /** a pair breaks between the two sentences from tablet up; phones wrap naturally */
  intro: string | [string, string];
  /**
   * Hero layout. With `stats` the text is centred and the numbers run in a row underneath
   * (real estate). Without, the text sits left and a visual right: "restaurant" draws the Maps
   * search mock, anything else shows the industry's numbers in a glass panel.
   */
  stats?: { value: string; label: string; sub: string }[];
  /** numbers centred in their columns (default) or left-aligned as in the hotels design */
  statsAlign?: "left";
  visual?: "restaurant";
  /** hero row of 4 icon features (healthcare); like `stats`, it switches the hero to centred */
  features?: { Icon: LucideIcon; title: string; sub: string }[];
  /** second hero button; defaults to "See the playbook" → #playbook */
  secondaryCta?: { label: string; href: string };
  /** sections are shown only when the industry has them */
  problems?: { problem: string; fix: string }[];
  /** patient-journey style timeline: icon circles on a line, one step filled green */
  journey?: {
    eyebrow: string;
    title: string;
    active: number;
    steps: { Icon: LucideIcon; title: string; body: string }[];
  };
  playbookTitle?: string;
  playbook?: { title: string; body?: string }[];
  /** dark band of icon cards (healthcare "careful by design") */
  careful?: { eyebrow: string; title: string; cards: { Icon: LucideIcon; title: string; body: string }[] };
  /** year timeline (education): progress line with dots over phase cards; `active` is the dark
   *  "peak" card, the line is green up to just past it */
  phases?: {
    eyebrow: string;
    title: string;
    active: number;
    badge: string;
    items: { Icon: LucideIcon; label: string; title: string; body: string }[];
  };
  /** numbered beige cards on a white band (education "how we do it") */
  how?: { eyebrow: string; title: string; cards: { Icon: LucideIcon; title: string; body: string }[] };
  /** "eyebrow" shows the hero label as a green dashed line instead of the pill (ecommerce) */
  pillStyle?: "eyebrow";
  /** row of ✓ items under the hero buttons (ecommerce); switches the hero to centred */
  checks?: string[];
  /** centred heading + columns split by thin lines, each with a "Fix:" pill (ecommerce) */
  causes?: {
    eyebrow: string;
    title: string;
    items: { Icon: LucideIcon; title: string; body: string; fix: string }[];
  };
  /** intro + button left, numbered list right (ecommerce "what we run for you") */
  run?: {
    eyebrow: string;
    title: string;
    body: string;
    items: { Icon: LucideIcon; title: string; body: string }[];
  };
  /** circles joined by arrows with a dashed "repeat" curve back to the start (ecommerce) */
  /** white band of numbered steps with a bar on top, the first bar green (automobile) */
  start?: { eyebrow: string; title: string; steps: { title: string; body: string }[] };
  loop?: {
    eyebrow: string;
    title: string;
    active: number;
    repeat: string;
    steps: { Icon: LucideIcon; title: string; sub: string }[];
  };
  toolsTitle?: string;
  /** "list" shows the tools as rows in one white card (hotels); default is a row of cards */
  toolsLayout?: "list";
  tools?: Tool[];
  ctaTitle: [string, string];
  ctaBody?: string;
  /** small line above the closing title; false hides it (healthcare) */
  ctaEyebrow?: string | false;
};

const DEFAULT_CTA_BODY = "A 30-minute call, a look at your numbers and a written plan in three working days.";

const PAGES: Record<string, IndustryPage> = {
  restaurants: {
    pill: "Restaurants & cafes · Fuller tables",
    title: "Marketing for restaurants & cafes",
    intro:
      "For most restaurants, the highest-leverage marketing isn't ads. It's the Google rating and the photos attached to it. We fix both before spending anything on paid.",
    visual: "restaurant",
    problems: [
      {
        problem: "Rating stuck below 4.2",
        fix: "Table QR codes route happy diners to Google and complaints to the manager's phone.",
      },
      {
        problem: "Invisible in Maps searches",
        fix: "Google Business Profile optimisation, category strategy and review velocity.",
      },
      {
        problem: "Food photos don't sell the dish",
        fix: "Batch food shoots and AI menu imagery, refreshed with every menu change.",
      },
      {
        problem: "No idea which outlet drives what",
        fix: "Per-location QR analytics and rating dashboards for every outlet.",
      },
    ],
    playbookTitle: "What an engagement looks like",
    playbook: [
      { title: "Fix the profile", body: "Google Business Profile audit and rebuild for every outlet." },
      { title: "Collect reviews", body: "Table and bill QR codes that route diners to Google." },
      { title: "Feed the feed", body: "A monthly food photo and reels content calendar." },
      { title: "Own local search", body: "Local SEO for delivery-area and nearby searches." },
      { title: "Fill tables", body: "Offer campaigns on Meta with footfall tracking." },
    ],
    toolsTitle: "What we bring to the table",
    tools: [
      {
        kind: "Service",
        title: "Marketing and Visibility",
        body: "Local SEO, Google Business Profile and Meta offer campaigns.",
        href: "/services/marketing-and-visibility",
        Icon: MapPin,
      },
      {
        kind: "Service",
        title: "Content & Production",
        body: "Food shoots, reels and menu imagery your diners want to share.",
        href: "/services/content-and-production",
        Icon: Video,
      },
      {
        kind: "Service",
        title: "Social and Personal Brand",
        body: "An always-on feed that keeps regulars coming back.",
        href: "/services/social-and-personal-brand",
        Icon: LayoutGrid,
      },
      {
        kind: "Product",
        title: "BMU QR",
        body: "Table and bill codes for menus, reviews and payments.",
        href: "/products/bmu-qr",
        Icon: ReceiptText,
      },
      {
        kind: "Product",
        title: "Smart Review",
        body: "Happy diners to Google, unhappy ones to your inbox.",
        href: "/products/smart-review",
        Icon: Star,
      },
    ],
    ctaTitle: ["Let's fill more tables", "at your restaurant"],
  },

  "real-estate": {
    pill: "Real estate · More site visits",
    title: ["Marketing that books", "site visits"],
    intro: [
      "For most projects, the leak isn't the ads. It's the enquiry that waits hours for a reply.",
      "We fix the follow-up first, then scale the campaigns that book site visits.",
    ],
    stats: [
      { value: "+312%", label: "More site visits", sub: "booked after the rebuild" },
      { value: "<60s", label: "First reply", sub: "on every enquiry" },
      { value: "11%", label: "Form conversion", sub: "on the project microsite" },
      { value: "−38%", label: "Cost per visit", sub: "lower acquisition cost" },
    ],
    problems: [
      {
        problem: "Leads go cold before anyone calls",
        fix: "WhatsApp automation and CRM routing that reply to every enquiry in under 60 seconds.",
      },
      {
        problem: "Ads bring enquiries, not site visits",
        fix: "Campaigns optimised for booked site visits and qualified buyers, not cheap form fills.",
      },
      {
        problem: "Visuals don't sell the project",
        fix: "Drone films, walkthroughs and virtual tours, ready before the show flat is.",
      },
      {
        problem: "No idea which hoarding works",
        fix: "Tracked QR codes on hoardings and brochures, reported by source and site.",
      },
    ],
    playbookTitle: "What an engagement looks like",
    playbook: [
      {
        title: "Fix the follow-up",
        body: "WhatsApp flows and CRM routing so every enquiry gets a reply in seconds.",
      },
      { title: "Show the project", body: "Drone films, walkthroughs and virtual tours of the site." },
      { title: "Build the microsite", body: "A fast project microsite designed to book visits." },
      { title: "Launch campaigns", body: "Meta and Google campaigns optimised for booked site visits." },
      { title: "Track every source", body: "QR codes on hoardings and brochures, reported by source." },
    ],
    toolsTitle: "What we bring to the table",
    tools: [
      {
        kind: "Service",
        title: "Marketing and Visibility",
        body: "Meta and Google campaigns built around booked site visits.",
        href: "/services/marketing-and-visibility",
        Icon: Megaphone,
      },
      {
        kind: "Service",
        title: "Content & Production",
        body: "Drone films, walkthroughs and project shoots.",
        href: "/services/content-and-production",
        Icon: Video,
      },
      {
        kind: "Service",
        title: "Web & AI",
        body: "Project microsites and AI chatbots that answer buyers instantly.",
        href: "/services/web-and-ai",
        Icon: CodeXml,
      },
      {
        kind: "Product",
        title: "Real Estate Suite",
        body: "Launch, enquiry and site-visit tools for every project.",
        href: "/products/real-estate-suite",
        Icon: DoorOpen,
      },
      {
        kind: "Product",
        title: "BMU QR",
        body: "Hoarding and brochure codes, tracked by site and source.",
        href: "/products/bmu-qr",
        Icon: RefreshCw,
      },
    ],
    ctaTitle: ["Let's book more site", "visits for your project"],
    ctaBody: "A 30-minute call, a look at your current funnel and a written plan in three working days.",
  },

  "hotels-resorts": {
    pill: "Hotels & resorts · More direct bookings",
    title: ["Marketing that wins", "direct bookings"],
    intro: [
      "Every OTA booking costs you commission. We build the content, search and booking funnel",
      "that bring guests to your own website first, and keep them coming back.",
    ],
    statsAlign: "left",
    stats: [
      { value: "+34%", label: "Direct booking share", sub: "lift over OTA bookings" },
      { value: "24/7", label: "Guest replies", sub: "on WhatsApp and website chat" },
      { value: "1", label: "Booking website", sub: "with a clear book-direct offer" },
      { value: "Monthly", label: "Reporting", sub: "bookings, enquiries and spend" },
    ],
    problems: [
      {
        problem: "Too many bookings through OTAs",
        fix: "A direct booking website, book-direct offers and retargeting that bring guests to you.",
      },
      {
        problem: "Invisible in nearby searches",
        fix: "Google Business Profile, local SEO and hotel listings that show up when guests search.",
      },
      {
        problem: "Photos don't sell the stay",
        fix: "Room, food and experience shoots, plus drone films of the property.",
      },
      {
        problem: "Guest enquiries go unanswered",
        fix: "WhatsApp automation and an AI chatbot that reply to guests instantly, day or night.",
      },
    ],
    playbookTitle: "What an engagement looks like",
    playbook: [
      { title: "Fix the listings", body: "Google Business Profile and OTA listings, cleaned up and consistent." },
      { title: "Show the stay", body: "Room, food and drone shoots that sell the experience." },
      { title: "Build direct booking", body: "A fast website with a clear book-direct offer." },
      { title: "Answer every guest", body: "WhatsApp and AI chatbot replies, around the clock." },
      { title: "Bring guests back", body: "Retargeting and offers that turn past guests into direct bookings." },
    ],
    toolsTitle: "What we bring",
    toolsLayout: "list",
    tools: [
      {
        kind: "Service",
        title: "Marketing and Visibility",
        body: "Local SEO, hotel listings and direct-booking campaigns",
        href: "/services/marketing-and-visibility",
        Icon: MapPin,
      },
      {
        kind: "Service",
        title: "Content & Production",
        body: "Room, food, experience and drone shoots",
        href: "/services/content-and-production",
        Icon: Video,
      },
      {
        kind: "Service",
        title: "Web & AI",
        body: "Booking websites and AI chat for guest questions",
        href: "/services/web-and-ai",
        Icon: Bot,
      },
      {
        kind: "Product",
        title: "Smart Review",
        body: "Happy guests to Google, feedback to your inbox",
        href: "/products/smart-review",
        Icon: Star,
      },
      {
        kind: "Product",
        title: "BMU QR",
        body: "In-room codes for menus, reviews and offers",
        href: "/products/bmu-qr",
        Icon: ReceiptText,
      },
    ],
    ctaTitle: ["Let's win more direct", "bookings for your property"],
    ctaBody: "A 30-minute call, a look at your booking mix and a written plan in three working days.",
  },

  healthcare: {
    pill: "Hospitals & clinics · More appointments",
    title: ["More appointments,", "handled carefully"],
    intro: [
      "Patient acquisition that respects medical advertising rules and patient privacy,",
      "from local search to appointment reminders.",
    ],
    features: [
      { Icon: Search, title: "Found locally", sub: "Doctor and speciality searches" },
      { Icon: MessageCircle, title: "Fast replies", sub: "WhatsApp and AI chat, 24/7" },
      { Icon: CalendarDays, title: "Easy booking", sub: "Online appointments in a few taps" },
      { Icon: ShieldCheck, title: "Careful by design", sub: "Ad rules and patient privacy" },
    ],
    secondaryCta: { label: "See how we work", href: "#journey" },
    journey: {
      eyebrow: "The patient journey",
      title: "Where we help at every step",
      active: 2,
      steps: [
        { Icon: Search, title: "Search", body: "Show up for “doctor near me” and speciality searches." },
        { Icon: Star, title: "Compare", body: "Doctor profiles and genuine reviews that build trust." },
        { Icon: CalendarDays, title: "Book", body: "Online booking, WhatsApp and AI chat for questions." },
        { Icon: RefreshCw, title: "Return", body: "Reminders, follow-ups and review requests after visits." },
      ],
    },
    careful: {
      eyebrow: "Careful by design",
      title: "Marketing that respects patients",
      cards: [
        {
          Icon: ShieldCheck,
          title: "Ad rules respected",
          body: "Every claim checked against medical advertising rules before it goes live.",
        },
        {
          Icon: Eye,
          title: "Patient privacy",
          body: "Patient details kept private, with access limited to your team.",
        },
        {
          Icon: Heart,
          title: "The right tone",
          body: "Clear, calm messaging for sensitive specialities and treatments.",
        },
      ],
    },
    toolsTitle: "What we bring",
    toolsLayout: "list",
    tools: [
      {
        kind: "Service",
        title: "Marketing and Visibility",
        body: "Local SEO, Google Business Profile and compliant campaigns",
        href: "/services/marketing-and-visibility",
        Icon: MapPin,
      },
      {
        kind: "Service",
        title: "Content & Production",
        body: "Doctor videos and patient education content",
        href: "/services/content-and-production",
        Icon: Video,
      },
      {
        kind: "Service",
        title: "Web & AI",
        body: "Booking websites and AI chat for patient questions",
        href: "/services/web-and-ai",
        Icon: Bot,
      },
      {
        kind: "Product",
        title: "Smart Review",
        body: "Happy patients to Google, feedback to your inbox",
        href: "/products/smart-review",
        Icon: Star,
      },
      {
        kind: "Product",
        title: "BMU QR",
        body: "Clinic codes for feedback, reviews and payments",
        href: "/products/bmu-qr",
        Icon: ReceiptText,
      },
    ],
    ctaTitle: ["Let's grow appointments", "at your clinic"],
    ctaBody: "A 30-minute call, a look at your patient flow and a written plan in three working days.",
    ctaEyebrow: false,
  },

  education: {
    pill: "Schools & colleges · More admissions",
    title: ["More admissions,", "season after season"],
    intro: [
      "Enquiry generation and nurture built around the admission cycle,",
      "so interested families turn into applications.",
    ],
    stats: [
      { value: "+41%", label: "Enquiry to application", sub: "after the rebuild" },
      { value: "24/7", label: "Parent replies", sub: "on WhatsApp and website chat" },
      { value: "12", label: "Months of visibility", sub: "not just admission season" },
      { value: "1", label: "Dashboard", sub: "for every campus and source" },
    ],
    statsAlign: "left",
    secondaryCta: { label: "See the admission year", href: "#phases" },
    phases: {
      eyebrow: "The admission year",
      title: "What we do in each phase",
      active: 2,
      badge: "Peak season",
      items: [
        {
          Icon: Megaphone,
          label: "Before admissions",
          title: "Build visibility",
          body: "Search, social and campus content so families know you before they start looking.",
        },
        {
          Icon: GraduationCap,
          label: "Open days",
          title: "Fill campus visits",
          body: "Campaigns and reminders that turn interest into booked campus tours.",
        },
        {
          Icon: ReceiptText,
          label: "Admission window",
          title: "Convert to applications",
          body: "Fast replies, simple forms and follow-ups until the application is in.",
        },
        {
          Icon: Heart,
          label: "After admissions",
          title: "Keep families engaged",
          body: "Parent communication and reviews that bring referrals next year.",
        },
      ],
    },
    how: {
      eyebrow: "How we do it",
      title: "Four things that grow admissions",
      cards: [
        {
          Icon: Search,
          title: "Get found first",
          body: "Google Business Profile and SEO for “best school near me” searches.",
        },
        {
          Icon: Camera,
          title: "Show the campus",
          body: "Campus films, student stories and faculty content that build trust.",
        },
        {
          Icon: MessageCircle,
          title: "Make enquiring easy",
          body: "Admission pages, WhatsApp and AI chat for parent questions.",
        },
        {
          Icon: RefreshCw,
          title: "Nurture to application",
          body: "Reminders and follow-ups through the whole admission cycle.",
        },
      ],
    },
    toolsTitle: "What we bring",
    toolsLayout: "list",
    tools: [
      {
        kind: "Service",
        title: "Marketing and Visibility",
        body: "Local SEO and admission campaigns built around your cycle",
        href: "/services/marketing-and-visibility",
        Icon: MapPin,
      },
      {
        kind: "Service",
        title: "Content & Production",
        body: "Campus films, student stories and faculty videos",
        href: "/services/content-and-production",
        Icon: Video,
      },
      {
        kind: "Service",
        title: "Web & AI",
        body: "Admission pages and AI chat for parent questions",
        href: "/services/web-and-ai",
        Icon: Bot,
      },
      {
        kind: "Service",
        title: "Social and Personal Brand",
        body: "A campus feed that parents and students follow",
        href: "/services/social-and-personal-brand",
        Icon: LayoutGrid,
      },
      {
        kind: "Product",
        title: "BMU QR",
        body: "Brochure and banner codes, tracked by source",
        href: "/products/bmu-qr",
        Icon: ReceiptText,
      },
    ],
    ctaTitle: ["Let's fill your next", "admission season"],
    ctaBody: "A 30-minute call, a look at your enquiry flow and a written plan in three working days.",
    ctaEyebrow: false,
  },

  automobile: {
    pill: "Automobile · More test drives",
    title: ["More test drives,", "more service bookings"],
    intro: [
      "Dealership marketing for showroom footfall, test drives and service retention,",
      "from the first local search to the reminder before every service.",
    ],
    features: [
      { Icon: RefreshCw, title: "Found locally", sub: "Every showroom on Google" },
      { Icon: MessageCircle, title: "Instant replies", sub: "WhatsApp and AI chat" },
      { Icon: DoorOpen, title: "Test drives booked", sub: "Online, with reminders" },
      { Icon: Star, title: "Owners return", sub: "Service reminders and offers" },
    ],
    problems: [
      {
        problem: "Leads go cold before sales calls back",
        fix: "Instant WhatsApp replies with a link to book a test drive.",
      },
      {
        problem: "Buyers find the dealer down the road",
        fix: "Google Business Profile and local SEO for every showroom.",
      },
      {
        problem: "Ads bring calls, not test drives",
        fix: "Campaigns optimised for booked test drives, not cheap leads.",
      },
      {
        problem: "Owners stop servicing after year two",
        fix: "Service reminders, offers and review requests after each visit.",
      },
    ],
    playbookTitle: "What an engagement looks like",
    playbook: [
      { title: "Fix the follow-up", body: "WhatsApp replies and test drive links for every enquiry." },
      { title: "Own local search", body: "Google Business Profile for every showroom and workshop." },
      { title: "Show the cars", body: "Walkarounds, reels and launch videos for every model." },
      { title: "Book test drives", body: "Campaigns optimised for booked test drives." },
      { title: "Bring owners back", body: "Service reminders and offers that keep the bay busy." },
    ],
    start: {
      eyebrow: "How we start",
      title: "Three steps to a busier showroom",
      steps: [
        {
          title: "Audit your leads",
          body: "We look at where enquiries come from and how fast they're answered.",
        },
        {
          title: "Fix the follow-up",
          body: "WhatsApp replies, test drive booking and service reminders go live.",
        },
        {
          title: "Scale what works",
          body: "Budget moves to the channels that bring test drives and services.",
        },
      ],
    },
    ctaTitle: ["Let's fill your showroom", "and service bay"],
    ctaBody: "A 30-minute call, a look at your lead flow and a written plan in three working days.",
  },

  "fitness-beauty": {
    pill: "Fitness & Beauty",
    pillStyle: "eyebrow",
    title: ["Turn first visits", "into regulars"],
    intro: [
      "Local visibility, content and booking automation for gyms, studios",
      "and salons, so trials become members and visits become routines.",
    ],
    secondaryCta: { label: "How it works", href: "#loop" },
    checks: ["Found on Google nearby", "Booking in a few taps", "Trials that convert", "Reminders that rebook"],
    journey: {
      eyebrow: "The client journey",
      title: "Where we help at every step",
      active: 2,
      steps: [
        { Icon: Search, title: "Discover", body: "Show up when people search for gyms and salons nearby." },
        { Icon: Star, title: "Choose", body: "Results, reviews and reels that build trust." },
        { Icon: CalendarDays, title: "Book", body: "Trials and appointments booked in a few taps." },
        { Icon: RefreshCw, title: "Return", body: "Reminders and offers that turn visits into routines." },
      ],
    },
    run: {
      eyebrow: "What we run for you",
      title: "From first search to routine",
      body: "Everything a gym, studio or salon needs to fill slots and keep clients coming back.",
      items: [
        { Icon: Search, title: "Local search", body: "Google Business Profile and SEO for every branch." },
        {
          Icon: Camera,
          title: "Studio content",
          body: "Reels, transformation stories and trainer or stylist videos.",
        },
        { Icon: Users, title: "Personal brand", body: "Founder and trainer profiles that build a following." },
        {
          Icon: MessageCircle,
          title: "Instant replies",
          body: "WhatsApp and AI chat for prices, slots and packages.",
        },
        { Icon: CalendarDays, title: "Online booking", body: "Trials and appointments booked in a few taps." },
        {
          Icon: RefreshCw,
          title: "Rebooking",
          body: "Reminders, offers and review requests after every visit.",
        },
      ],
    },
    loop: {
      eyebrow: "The client loop",
      title: "From first visit to routine",
      active: 2,
      repeat: "Every week",
      steps: [
        { Icon: Search, title: "Discover", sub: "Found nearby" },
        { Icon: CalendarDays, title: "Try", sub: "Trial or first visit" },
        { Icon: Users, title: "Join", sub: "Membership or package" },
        { Icon: RefreshCw, title: "Return", sub: "Rebooked regularly" },
      ],
    },
    ctaTitle: ["Let's fill your classes", "and chairs"],
    ctaBody: "A 30-minute call, a look at your bookings and a written plan in three working days.",
    ctaEyebrow: false,
  },

  "ecommerce-d2c": {
    pill: "Ecommerce & D2C",
    pillStyle: "eyebrow",
    title: ["Creative that sells,", "at a CAC that works"],
    intro: [
      "Catalogue imagery, creative testing and full-funnel campaigns,",
      "so new products launch faster and ads keep converting.",
    ],
    secondaryCta: { label: "How it works", href: "#loop" },
    checks: ["Fresh creative every month", "AI catalogue imagery", "Full-funnel campaigns", "UGC that converts"],
    causes: {
      eyebrow: "The creative gap",
      title: "Why D2C ads stop working",
      items: [
        {
          Icon: RefreshCw,
          title: "Creative fatigue",
          body: "Shoots happen every few months, but ads tire within weeks.",
          fix: "Fix: Fresh creative every month.",
        },
        {
          Icon: Camera,
          title: "Slow catalogue",
          body: "New products wait days for photos, so launches slip.",
          fix: "Fix: AI imagery in days, not weeks.",
        },
        {
          Icon: FlaskConical,
          title: "Guesswork on spend",
          body: "Without testing, budget follows hunches, not results.",
          fix: "Fix: Structured tests before scaling.",
        },
      ],
    },
    run: {
      eyebrow: "What we run for you",
      title: "From product shot to repeat order",
      body: "Everything your brand needs to launch, sell and sell again, run by one team.",
      items: [
        {
          Icon: Camera,
          title: "Catalogue imagery",
          body: "AI product photography and lifestyle shots, no shoot day needed.",
        },
        { Icon: Users, title: "UGC and creators", body: "Creator videos made for ads, reels and product pages." },
        { Icon: FlaskConical, title: "Creative testing", body: "New hooks, formats and offers tested every month." },
        { Icon: Megaphone, title: "Performance campaigns", body: "Meta and Google campaigns across the full funnel." },
        { Icon: RefreshCw, title: "Retention", body: "WhatsApp, email and retargeting that bring repeat orders." },
        {
          Icon: ReceiptText,
          title: "Clear reporting",
          body: "One monthly report on spend, CAC and return on ad spend.",
        },
      ],
    },
    loop: {
      eyebrow: "The growth loop",
      title: "Always testing, always shipping",
      active: 2,
      repeat: "Repeat every month",
      steps: [
        { Icon: Camera, title: "Shoot", sub: "Fresh product creative" },
        { Icon: FlaskConical, title: "Test", sub: "Find the winning ads" },
        { Icon: Megaphone, title: "Scale", sub: "Budget behind winners" },
        { Icon: RefreshCw, title: "Retain", sub: "Buyers become regulars" },
      ],
    },
    ctaTitle: ["Let's make your creative", "work harder"],
    ctaBody: "A 30-minute call, a look at your ad account and a written plan in three working days.",
    ctaEyebrow: false,
  },
};

/** The industry's own page copy, or one built from the shared data until its design arrives. */
function pageFor(industry: IndustryDetail): IndustryPage {
  const own = PAGES[industry.slug];
  if (own) return own;

  const name = industry.name.toLowerCase();
  return {
    pill: `${industry.name} · ${industry.tagline}`,
    title: `Marketing for ${name}`,
    intro: industry.intro,
    problems: industry.challenges.map((c) => ({ problem: c.title, fix: c.body })),
    playbookTitle: "What an engagement looks like",
    playbook: industry.playbook.map((step) => ({ title: step })),
    toolsTitle: "What we bring to the table",
    tools: industry.services
      .map(getService)
      .filter((s): s is NonNullable<typeof s> => Boolean(s))
      .map((s) => ({
        kind: "Service" as const,
        title: s.title,
        body: s.tagline,
        href: `/services/${s.slug}`,
        serviceIcon: s.icon,
      })),
    ctaTitle: ["Let's talk about your", `${name} pipeline`],
  };
}

export default async function IndustryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const industry = getIndustry(slug);
  if (!industry) notFound();

  const page = pageFor(industry);
  const centred = Boolean(page.stats || page.features || page.checks);
  const secondary = page.secondaryCta ?? { label: "See the playbook", href: "#playbook" };

  return (
    <>
      {/* Hero: dark band under the header. With stats or features: centred text + a row
          underneath; otherwise text left, visual right */}
      <section className={cn(styles.hero, centred && styles.heroCentered)}>
        <div className={cn("container", centred ? styles.heroCenter : styles.heroGrid)}>
          <div className={cn(centred && styles.heroCenterText)}>
            {page.pillStyle === "eyebrow" ? (
              <span className={cn("eyebrow", styles.heroEyebrow)}>{page.pill}</span>
            ) : (
              <p className={styles.heroPill}>
                <span className={styles.heroPillDot} aria-hidden="true" />
                {page.pill}
              </p>
            )}
            <h1 className={cn("display", styles.heroTitle)}>
              {Array.isArray(page.title) ? (
                <>
                  {page.title[0]}
                  <br />
                  {page.title[1]}
                </>
              ) : (
                page.title
              )}
            </h1>
            <p className={styles.heroLede}>
              {Array.isArray(page.intro) ? (
                <>
                  {page.intro[0]} <br className={styles.ledeBreak} />
                  {page.intro[1]}
                </>
              ) : (
                page.intro
              )}
            </p>
            <div className={styles.heroActions}>
              <Link href="/contact" className={styles.btnPrimary}>
                Book a free consultation <ArrowRight aria-hidden="true" />
              </Link>
              <a href={secondary.href} className={styles.btnOutline}>
                {secondary.label}
              </a>
            </div>
            {page.checks && (
              <ul className={styles.heroChecks}>
                {page.checks.map((c) => (
                  <li key={c} className={styles.heroCheck}>
                    <span className={styles.heroCheckIcon} aria-hidden="true">
                      <Check />
                    </span>
                    {c}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {page.stats ? (
            // numbers count up from 0 each time the row comes into view
            <HeroStats stats={page.stats} left={page.statsAlign === "left"} />
          ) : page.features ? (
            <ul className={styles.heroFeatures}>
              {page.features.map(({ Icon, title, sub }) => (
                <li key={title} className={styles.heroFeature}>
                  <span className={styles.heroFeatureIcon} aria-hidden="true">
                    <Icon />
                  </span>
                  <span>
                    <span className={styles.heroFeatureTitle}>{title}</span>
                    <span className={styles.heroFeatureSub}>{sub}</span>
                  </span>
                </li>
              ))}
            </ul>
          ) : page.visual === "restaurant" ? (
            <RestaurantVisual />
          ) : centred ? null : (
            // numbers panel only for side-by-side heroes without their own visual yet
            <MetricsVisual industry={industry} />
          )}
        </div>
      </section>

      {/* Problems: one table, problem left → fix right */}
      {page.problems && (
        <section className="section">
          <div className="container">
            <Reveal>
              <span className="eyebrow">What usually goes wrong</span>
              <h2 className={cn("display", styles.sectionTitle)}>The problems we&apos;re called in for</h2>
            </Reveal>
            <Reveal delay={0.1}>
              <div className={styles.problems}>
                <div className={styles.problemsHead} aria-hidden="true">
                  <span>The problem</span>
                  <span className={styles.problemsHeadFix}>How we fix it</span>
                </div>
                <ul className={styles.problemList}>
                  {page.problems.map((p) => (
                    <li key={p.problem} className={styles.problemRow}>
                      <span className={styles.problemCell}>
                        <span className={styles.problemX} aria-hidden="true">
                          <X />
                        </span>
                        <span className={styles.problemTitle}>{p.problem}</span>
                      </span>
                      <span className={styles.problemArrow} aria-hidden="true">
                        <ArrowRight />
                      </span>
                      <span className={styles.fixCell}>
                        <span className={styles.fixCheck} aria-hidden="true">
                          <Check />
                        </span>
                        <span className={styles.fixText}>{p.fix}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* Journey: icon circles on one line, one step filled green */}
      {page.journey && (
        <section id="journey" className="section">
          <div className="container">
            <Reveal>
              <span className="eyebrow">{page.journey.eyebrow}</span>
              <h2 className={cn("display", styles.sectionTitle)}>{page.journey.title}</h2>
            </Reveal>
            <Reveal delay={0.1}>
              <ol className={styles.journey}>
                {page.journey.steps.map(({ Icon, title, body }, i) => (
                  <li key={title} className={styles.journeyStep}>
                    <span
                      className={cn(styles.journeyIcon, i === page.journey!.active && styles.journeyIconActive)}
                      aria-hidden="true"
                    >
                      <Icon />
                    </span>
                    <span className={styles.journeyText}>
                      <span className={cn("display", styles.journeyNum)}>{String(i + 1).padStart(2, "0")}</span>
                      <span className={cn("display", styles.journeyTitle)}>{title}</span>
                      <span className={styles.journeyBody}>{body}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>
        </section>
      )}

      {/* Phases: progress line with dots, a card under each dot; the active card is dark */}
      {page.phases && (
        <section id="phases" className="section">
          <div className="container">
            <Reveal>
              <span className="eyebrow">{page.phases.eyebrow}</span>
              <h2 className={cn("display", styles.sectionTitle)}>{page.phases.title}</h2>
            </Reveal>
            <Reveal delay={0.1}>
              <ol className={styles.phases}>
                {page.phases.items.map(({ Icon, label, title, body }, i) => {
                  const active = page.phases!.active;
                  return (
                    <li
                      key={title}
                      className={cn(
                        styles.phase,
                        i < active && styles.phaseDone,
                        i === active && styles.phaseCurrent,
                      )}
                    >
                      <span className={styles.phaseMarker} aria-hidden="true">
                        <span className={cn(styles.phaseDot, i <= active && styles.phaseDotOn)} />
                      </span>
                      <div className={cn(styles.phaseCard, i === active && styles.phaseCardActive)}>
                        <span className={styles.phaseTop}>
                          <span className={styles.phaseIcon} aria-hidden="true">
                            <Icon />
                          </span>
                          {i === active && <span className={styles.phaseBadge}>{page.phases!.badge}</span>}
                        </span>
                        <span className={styles.phaseLabel}>{label}</span>
                        <span className={styles.phaseTitle}>{title}</span>
                        <span className={styles.phaseBody}>{body}</span>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </Reveal>
          </div>
        </section>
      )}

      {/* How we do it: numbered beige cards on a white band */}
      {page.how && (
        <section className={cn("section", styles.howSection)}>
          <div className="container">
            <Reveal>
              <span className="eyebrow">{page.how.eyebrow}</span>
              <h2 className={cn("display", styles.sectionTitle)}>{page.how.title}</h2>
            </Reveal>
            <div className={styles.howCards}>
              {page.how.cards.map(({ Icon, title, body }, i) => (
                <Reveal key={title} delay={(i % 4) * 0.06}>
                  <div className={styles.howCard}>
                    <span className={styles.howTop}>
                      <span className={styles.howIcon} aria-hidden="true">
                        <Icon />
                      </span>
                      <span className={cn("display", styles.howNum)}>{String(i + 1).padStart(2, "0")}</span>
                    </span>
                    <span className={styles.howTitle}>{title}</span>
                    <span className={styles.howBody}>{body}</span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Causes: centred heading, columns split by thin lines, each with a "Fix:" pill */}
      {page.causes && (
        <section className="section">
          <div className="container">
            <Reveal className={styles.centerHead}>
              <span className={styles.centerEyebrow}>{page.causes.eyebrow}</span>
              <h2 className={cn("display", styles.sectionTitle)}>{page.causes.title}</h2>
            </Reveal>
            <Reveal delay={0.1}>
              <ul className={styles.causes}>
                {page.causes.items.map(({ Icon, title, body, fix }) => (
                  <li key={title} className={styles.cause}>
                    <span className={styles.causeIcon} aria-hidden="true">
                      <Icon />
                    </span>
                    <span className={styles.causeTitle}>{title}</span>
                    <span className={styles.causeBody}>{body}</span>
                    <span className={styles.causeFix}>{fix}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>
      )}

      {/* What we run: intro + button left, numbered list right */}
      {page.run && (
        <section className="section">
          <div className={cn("container", styles.run)}>
            <Reveal>
              <span className="eyebrow">{page.run.eyebrow}</span>
              <h2 className={cn("display", styles.runTitle)}>{page.run.title}</h2>
              <p className={styles.runBody}>{page.run.body}</p>
              <Link href="/contact" className={styles.runButton}>
                Book a free consultation <ArrowRight aria-hidden="true" />
              </Link>
            </Reveal>
            <Reveal delay={0.1}>
              <ol className={styles.runList}>
                {page.run.items.map(({ Icon, title, body }, i) => (
                  <li key={title} className={styles.runRow}>
                    <span className={styles.runIcon} aria-hidden="true">
                      <Icon />
                    </span>
                    <span className={styles.runText}>
                      <span className={styles.runRowTitle}>{title}</span>
                      <span className={styles.runRowBody}>{body}</span>
                    </span>
                    <span className={cn("display", styles.runNum)}>{String(i + 1).padStart(2, "0")}</span>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>
        </section>
      )}

      {/* Growth loop: circles joined by arrows, dashed "repeat" curve back to the start */}
      {page.loop && (
        <section id="loop" className="section">
          <div className="container">
            <Reveal className={styles.centerHead}>
              <span className={styles.centerEyebrow}>{page.loop.eyebrow}</span>
              <h2 className={cn("display", styles.sectionTitle)}>{page.loop.title}</h2>
            </Reveal>
            <Reveal delay={0.1}>
              <div className={styles.loop}>
                <ol className={styles.loopSteps}>
                  {page.loop.steps.map(({ Icon, title, sub }, i) => (
                    <li key={title} className={styles.loopStep}>
                      <span
                        className={cn(styles.loopNode, i === page.loop!.active && styles.loopNodeActive)}
                        aria-hidden="true"
                      >
                        <Icon />
                      </span>
                      {i < page.loop!.steps.length - 1 && <span className={styles.loopLink} aria-hidden="true" />}
                      <span className={cn("display", styles.loopTitle)}>{title}</span>
                      <span className={styles.loopSub}>{sub}</span>
                    </li>
                  ))}
                </ol>
                <div className={styles.loopRepeat}>
                  <svg viewBox="0 0 1000 56" preserveAspectRatio="none" className={styles.loopCurve} aria-hidden="true">
                    <path d="M875 2 C 875 50, 125 50, 125 2" />
                  </svg>
                  <span className={styles.loopRepeatArrow} aria-hidden="true" />
                  <span className={styles.loopRepeatLabel}>{page.loop.repeat}</span>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* Playbook: dark band, numbered steps joined by arrows */}
      {page.playbook && (
        <section id="playbook" className={styles.playbook}>
          <div className={cn("container", styles.playbookInner)}>
            <Reveal className={styles.playbookHead}>
              <div>
                <span className="eyebrow">The playbook</span>
                <h2 className={cn("display", styles.playbookTitle)}>{page.playbookTitle}</h2>
              </div>
              <p className={styles.playbookNote}>Sequenced, not simultaneous.</p>
            </Reveal>
            <Reveal delay={0.1}>
              <ol className={styles.playSteps}>
                {page.playbook.map((s, i) => (
                  <li key={s.title} className={styles.playStep}>
                    <span className={cn("display", styles.playNum)}>{String(i + 1).padStart(2, "0")}</span>
                    <span className={styles.playTitle}>{s.title}</span>
                    {s.body && <span className={styles.playBody}>{s.body}</span>}
                    {i < page.playbook!.length - 1 && (
                      <span className={styles.playArrow} aria-hidden="true">
                        <ArrowRight />
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>
        </section>
      )}

      {/* How we start: white band, numbered steps with a bar on top (first one green) */}
      {page.start && (
        <section className={cn("section", styles.startSection)}>
          <div className="container">
            <Reveal>
              <span className="eyebrow">{page.start.eyebrow}</span>
              <h2 className={cn("display", styles.sectionTitle)}>{page.start.title}</h2>
            </Reveal>
            <Reveal delay={0.1}>
              <ol className={styles.startSteps}>
                {page.start.steps.map((s, i) => (
                  <li key={s.title} className={styles.startStep}>
                    <span className={cn("display", styles.startNum)}>{String(i + 1).padStart(2, "0")}</span>
                    <span className={styles.startTitle}>{s.title}</span>
                    <span className={styles.startBody}>{s.body}</span>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>
        </section>
      )}

      {/* Careful by design: dark band (same look as the playbook) with icon cards */}
      {page.careful && (
        <section className={styles.playbook}>
          <div className={cn("container", styles.playbookInner)}>
            <Reveal>
              <span className="eyebrow">{page.careful.eyebrow}</span>
              <h2 className={cn("display", styles.playbookTitle)}>{page.careful.title}</h2>
            </Reveal>
            <Reveal delay={0.1}>
              <ul className={styles.careCards}>
                {page.careful.cards.map(({ Icon, title, body }) => (
                  <li key={title} className={styles.careCard}>
                    <span className={styles.careHead}>
                      <span className={styles.careIcon} aria-hidden="true">
                        <Icon />
                      </span>
                      <span className={styles.careTitle}>{title}</span>
                    </span>
                    <span className={styles.careBody}>{body}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>
      )}

      {/* Services and tools: a row of cards, or (toolsLayout "list") rows in one white card;
          each with a service or product badge */}
      {page.tools && (
        <section className="section">
          <div className="container">
            <Reveal>
              <span className="eyebrow">Services and tools</span>
              <h2 className={cn("display", styles.sectionTitle)}>{page.toolsTitle}</h2>
            </Reveal>
            {page.toolsLayout === "list" ? (
              <Reveal delay={0.1}>
                <ul className={styles.toolList}>
                  {page.tools.map(({ kind, title, body, href, Icon, serviceIcon }) => (
                    <li key={title}>
                      <Link href={href} className={styles.toolRow}>
                        <span className={cn(styles.toolIcon, styles.toolRowIcon)}>
                          {Icon ? <Icon aria-hidden="true" /> : <ServiceIcon name={serviceIcon!} />}
                        </span>
                        <span className={styles.toolRowTitle}>{title}</span>
                        <span className={styles.toolRowBody}>{body}</span>
                        <span
                          className={cn(
                            styles.toolBadge,
                            styles.toolRowBadge,
                            kind === "Product" && styles.toolBadgeProduct,
                          )}
                        >
                          {kind}
                        </span>
                        <span className={styles.toolRowArrow} aria-hidden="true">
                          <ArrowRight />
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </Reveal>
            ) : (
              <div className={styles.tools}>
                {page.tools.map(({ kind, title, body, href, Icon, serviceIcon }, i) => (
                  <Reveal key={title} delay={(i % 5) * 0.05}>
                    <Link href={href} className={styles.tool}>
                      <span className={styles.toolTop}>
                        <span className={styles.toolIcon}>
                          {Icon ? <Icon aria-hidden="true" /> : <ServiceIcon name={serviceIcon!} />}
                        </span>
                        <span className={cn(styles.toolBadge, kind === "Product" && styles.toolBadgeProduct)}>
                          {kind}
                        </span>
                      </span>
                      <span className={styles.toolTitle}>{title}</span>
                      <span className={styles.toolBody}>{body}</span>
                      <span className={styles.toolMore}>
                        Learn more <ArrowRight aria-hidden="true" />
                      </span>
                    </Link>
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Closing band (replaces the shared CtaBand on this page) */}
      <section className={styles.ctaSection}>
        <div className="container">
          <Reveal>
            <div className={styles.cta}>
              <div className={styles.ctaText}>
                {page.ctaEyebrow !== false && (
                  <span className={styles.ctaEyebrow}>{page.ctaEyebrow ?? "Ready when you are"}</span>
                )}
                <h2 className={cn("display", styles.ctaTitle)}>
                  {page.ctaTitle[0]}
                  <br />
                  {page.ctaTitle[1]}
                </h2>
                <p className={styles.ctaBody}>{page.ctaBody ?? DEFAULT_CTA_BODY}</p>
              </div>
              <div className={styles.ctaActions}>
                <Link href="/contact" className={styles.ctaPrimary}>
                  Book a free consultation <ArrowRight aria-hidden="true" />
                </Link>
                <Link href="/industries" className={styles.ctaSecondary}>
                  All industries
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

/** Other industries (until their own visual is designed): their headline numbers in the same glass panel. */
function MetricsVisual({ industry }: { industry: IndustryDetail }) {
  return (
    <div className={styles.visual}>
      <div className={styles.mapsPanel}>
        <p className={styles.metricsLabel}>Results we&apos;ve delivered</p>
        <ul className={styles.metricsList}>
          {industry.metrics.map((m) => (
            <li key={m.label} className={styles.metricsItem}>
              <span className={cn("display", styles.metricsValue)}>{m.value}</span>
              <span className={styles.metricsText}>{m.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

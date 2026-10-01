/**
 * Marketing site content. Swap any of this for Prisma / Sanity queries later —
 * the components only ever read from these exported shapes.
 */

export const NAV_LINKS = [
  { href: "#services", label: "Services" },
  { href: "#products", label: "Products" },
  { href: "#industries", label: "Industries" },
  { href: "#work", label: "Work" },
  { href: "#results", label: "Results" },
  { href: "#pricing", label: "Pricing" },
  { href: "#contact", label: "Contact" },
] as const;

export const HERO_ROTATIONS = [
  "performance marketing.",
  "real estate funnels.",
  "search visibility.",
  "automation.",
];

export const HERO_PILLS = [
  "Social media",
  "UGC",
  "AI creative",
  "SEO",
  "Websites",
  "Apps",
  "Automation",

];

export const HERO_STATS = [
  { value: "140+", label: "Brands launched" },
  { value: "₹38Cr", label: "Ad spend managed" },
  { value: "9", label: "Cities served" },
  { value: "4.9", label: "Average client rating" },
];

export const TRUSTED_BY = [
  "NORTHVIEW",
  "ATRIA LIVING",
  "SAFFRON & CO",
  "VERDE CLINICS",
  "MERAKI STUDIO",
  "KESAR MOTORS",
  "BLUE HARBOUR",
  "FORM & FIT",
];

export type ServiceCard = {
  title: string;
  icon:
  | "BarChart3"
  | "PlayCircle"
  | "Search"
  | "Code2"
  | "Zap"
  | "PenTool"
  | "Sparkles"
  | "Building2";
  items: string[];
  meta: string;
};

export const SERVICES: ServiceCard[] = [
  {
    title: "Performance marketing",
    icon: "BarChart3",
    items: ["Meta Ads", "Google Ads", "Lead campaigns", "Retargeting", "Budget planning"],
    meta: "7 capabilities",
  },
  {
    title: "Social & content",
    icon: "PlayCircle",
    items: ["Social media management", "UGC content", "Reels production", "Photography", "Drone shoots"],
    meta: "11 capabilities",
  },
  {
    title: "SEO & local search",
    icon: "Search",
    items: ["Technical SEO", "Local SEO", "Google Maps ranking", "Keyword research", "Business profile"],
    meta: "8 capabilities",
  },
  {
    title: "Web & app development",
    icon: "Code2",
    items: ["Websites", "Ecommerce", "Web apps", "Android & iOS", "Admin dashboards"],
    meta: "9 capabilities",
  },
  {
    title: "Automation & CRM",
    icon: "Zap",
    items: ["WhatsApp chatbots", "AI calling agents", "CRM integration", "Lead routing", "Appointment booking"],
    meta: "7 capabilities",
  },
  {
    title: "Branding & design",
    icon: "PenTool",
    items: ["Logo & identity", "Brand guidelines", "Packaging", "UI/UX", "Pitch decks"],
    meta: "12 capabilities",
  },
  {
    title: "AI creative",
    icon: "Sparkles",
    items: ["AI product photography", "AI fashion models", "AI video", "Ad creative at scale", "Voice generation"],
    meta: "6 capabilities",
  },
  {
    title: "Real estate marketing",
    icon: "Building2",
    items: ["Drone & walkthroughs", "Virtual tours", "Sales landing pages", "Lead funnels", "Project branding"],
    meta: "7 capabilities",
  },
];

export type Product = {
  tag: string;
  name: string;
  blurb: string;
  features: string[];
  cta: string;
  price?: { amount: string; note: string };
  lead?: boolean;
};

export const PRODUCTS: Product[] = [
  {
    tag: "Flagship",
    name: "BMU QR",
    blurb:
      "One dashboard for every code your business prints. Change what a QR points to without reprinting a single menu, standee or card - and see exactly who scanned, where and when.",
    features: [
      "Dynamic, editable codes",
      "Restaurant digital menu",
      "Google review collection",
      "WhatsApp & payment codes",
      "Digital catalogue",
      "Scan analytics",
      "Multi-location management",
      "NFC business cards",
      "Password-protected codes",
      "Offer & campaign codes",
    ],
    cta: "See plans",
    price: { amount: "₹499/mo", note: "Starter · 3 tiers available" },
    lead: true,
  },
  {
    tag: "Reputation",
    name: "Smart Review",
    blurb: "Route happy customers to Google and unhappy ones to your inbox, before the star rating drops.",
    features: [
      "Feedback landing pages",
      "Suggested review copy with local keywords",
      "Negative feedback routing",
      "Weekly review reports",
    ],
    cta: "Request a demo",
  },
  {
    tag: "Marketplace",
    name: "BMU Connect",
    blurb: "Find creators by city, category and budget, brief them and track the campaign in one dashboard.",
    features: [
      "Vetted creator profiles",
      "Location, niche and budget filters",
      "Brief and approval flow",
      "Campaign performance tracking",
    ],
    cta: "Join the waitlist",
  },
  {
    tag: "AI Studio",
    name: "BMU AI Studio",
    blurb: "Catalogue-ready imagery without a shoot day. Products on models, food on plates, furniture in rooms.",
    features: [
      "AI fashion and beauty models",
      "Food and product photography",
      "Virtual staging for property",
      "Background replacement at scale",
    ],
    cta: "See samples",
  },
  {
    tag: "Real estate",
    name: "Real Estate Suite",
    blurb: "Drone to walkthrough to landing page to CRM - the full pre-launch stack for a project.",
    features: [
      "Drone shoots and virtual tours",
      "Sales landing pages and funnels",
      "Meta and Google lead campaigns",
      "WhatsApp follow-up automation",
    ],
    cta: "Plan a launch",
  },
];

export const INDUSTRIES = [
  "Real Estate", "Restaurants", "Hotels", "Resorts", "Cafes", "Hospitals", "Clinics",
  "Doctors", "Schools", "Colleges", "Builders", "Architects", "Interior Designers",
  "Gyms", "Fitness Centers", "Salons", "Beauty Brands", "Jewellery", "Retail",
  "Ecommerce", "Automobile", "Finance", "Education", "Travel", "Manufacturing",
  "NGOs", "Startups",
];

export type WorkItem = {
  category: string;
  title: string;
  summary: string;
  from: string;
  to: string;
};

export const WORK: WorkItem[] = [
  { category: "Real Estate", title: "Atria Living launch film", summary: "Drone film, walkthrough and sales funnel", from: "#121F2F", to: "#1F3B56" },
  { category: "Websites", title: "Verde Clinics site rebuild", summary: "Next.js site with appointment booking", from: "#1F3B56", to: "#8BB72C" },
  { category: "AI", title: "Beauty catalogue, no shoot day", summary: "420 AI model images in one week", from: "#203348", to: "#6D961F" },
  { category: "Branding", title: "Saffron & Co identity", summary: "Logo, menu system and packaging", from: "#121F2F", to: "#6D961F" },
  { category: "Social", title: "Form & Fit content engine", summary: "90 reels a quarter, four creators", from: "#1F3B56", to: "#121F2F" },
  { category: "Apps", title: "Kesar Motors service app", summary: "Flutter app with booking and CRM", from: "#203348", to: "#1F3B56" },
  { category: "Drone", title: "Blue Harbour aerial series", summary: "Coastline resort campaign films", from: "#121F2F", to: "#8BB72C" },
  { category: "Websites", title: "Northview sales microsite", summary: "Single-project site, 11% form rate", from: "#1F3B56", to: "#6D961F" },
  { category: "Social", title: "Meraki Studio launch month", summary: "UGC-led launch across three cities", from: "#203348", to: "#121F2F" },
];

export const RESULTS = [
  {
    who: "Real estate · Bengaluru",
    metric: "312%",
    headline: "More site visits booked in one launch quarter",
    body: "Drone film, walkthrough, a single-purpose landing page and WhatsApp follow-up inside 90 seconds of a form fill.",
    tags: ["Meta Ads", "Drone", "Landing pages", "Automation"],
  },
  {
    who: "Restaurant group · 6 outlets",
    metric: "4.8★",
    headline: "Google rating lifted from 3.9 across every location",
    body: "Table QR codes routed happy diners to Google and complaints straight to the operations lead instead of the public feed.",
    tags: ["BMU QR", "Smart Review", "Local SEO"],
  },
  {
    who: "D2C beauty · Pan-India",
    metric: "−41%",
    headline: "Lower cost per acquisition on the same monthly budget",
    body: "AI-generated model shots replaced quarterly studio days, so creative refreshed weekly instead of seasonally.",
    tags: ["AI Studio", "Performance", "UGC"],
  },
];

export const TESTIMONIALS = [
  {
    quote:
      "They rebuilt our enquiry flow in the first fortnight. Same ad budget, but the sales team stopped chasing dead numbers because leads now arrive with a WhatsApp reply already sent.",
    author: "Rohan S.",
    role: "Sales Head, residential developer",
  },
  {
    quote:
      "The QR dashboard settled an argument we'd had for two years - we finally know which outlet and which table actually drive reviews.",
    author: "Anita K.",
    role: "Director, restaurant group",
  },
  {
    quote:
      "What I value most is the reporting. It's one page, it's honest, and when something underperformed they say so before I have to ask.",
    author: "Meera V.",
    role: "Founder, D2C beauty brand",
  },
];

export type Plan = {
  name: string;
  description: string;
  price: string;
  unit: string;
  features: string[];
  cta: string;
  featured?: boolean;
};

export const PLANS: Record<"retainer" | "qr", Plan[]> = {
  retainer: [
    {
      name: "Launch",
      description: "For single-location businesses getting consistent online.",
      price: "₹35,000",
      unit: "/month",
      features: [
        "2 ad platforms managed",
        "12 creatives a month",
        "Google Business optimisation",
        "Monthly performance report",
        "WhatsApp support",
      ],
      cta: "Start with Launch",
    },
    {
      name: "Growth",
      description: "For brands scaling spend across channels and cities.",
      price: "₹85,000",
      unit: "/month",
      features: [
        "Everything in Launch",
        "4 platforms + retargeting",
        "30 creatives incl. UGC",
        "Full SEO retainer",
        "Landing pages and funnels",
        "Automation and CRM setup",
        "Fortnightly strategy call",
      ],
      cta: "Start with Growth",
      featured: true,
    },
    {
      name: "Scale",
      description: "For multi-location groups and property developers.",
      price: "Custom",
      unit: "from ₹2L/month",
      features: [
        "Everything in Growth",
        "Dedicated account team",
        "Drone and video production",
        "AI Studio access",
        "Client dashboard and reporting",
        "Priority turnaround",
      ],
      cta: "Request a proposal",
    },
  ],
  qr: [
    {
      name: "Starter",
      description: "One location, the essentials, live in an afternoon.",
      price: "₹499",
      unit: "/month",
      features: [
        "10 dynamic QR codes",
        "Digital menu or catalogue",
        "Google review collection",
        "Basic scan analytics",
        "1 user",
      ],
      cta: "Start free trial",
    },
    {
      name: "Professional",
      description: "For growing businesses that print a lot of codes.",
      price: "₹1,499",
      unit: "/month",
      features: [
        "Unlimited dynamic codes",
        "Up to 5 locations",
        "Smart Review included",
        "Full campaign analytics",
        "Password-protected codes",
        "5 users, 2 NFC cards",
      ],
      cta: "Start free trial",
      featured: true,
    },
    {
      name: "Enterprise",
      description: "For chains, franchises and white-label partners.",
      price: "Custom",
      unit: "billed annually",
      features: [
        "Unlimited locations and users",
        "White-label domain and branding",
        "API access",
        "Bulk code generation",
        "SSO and role permissions",
        "Dedicated success manager",
      ],
      cta: "Talk to sales",
    },
  ],
};

export const FAQS = [
  {
    q: "How quickly do campaigns go live?",
    a: "Onboarding takes five working days: access, audit, creative brief and tracking setup. Ads usually go live in week two, once the first creative batch is approved.",
  },
  {
    q: "Is there a lock-in period?",
    a: "Ninety days, because performance work needs a full learning cycle to judge fairly. After that it's monthly, cancel with 30 days' notice.",
  },
  {
    q: "Do we own the accounts and data?",
    a: "Yes. Ad accounts, pixels, domains, CRM records and QR data are created under your ownership from day one. If you leave, nothing needs migrating.",
  },
  {
    q: "Can we buy the software without a retainer?",
    a: "Yes. BMU QR, Smart Review and AI Studio are sold as standalone subscriptions. Retainer clients get them bundled.",
  },
  {
    q: "Who actually does the work?",
    a: "An in-house team in Bengaluru - strategist, media buyer, designer, editor and developer. Drone pilots and creators are contracted per project and briefed by us.",
  },
  {
    q: "What does reporting look like?",
    a: "One dashboard plus a monthly written report covering spend, leads, cost per lead, ranking movement and what we're changing next month.",
  },
];

export const CONTACT_NEEDS = [
  "Performance marketing",
  "Website or app",
  "SEO and local search",
  "Real estate launch",
  "UGC and creators",
  "BMU QR software",
];

export type IndustryDetail = {
  slug: string;
  name: string;
  tagline: string;
  summary: string;
  intro: string;
  challenges: { title: string; body: string }[];
  playbook: string[];
  metrics: { label: string; value: string }[];
  services: string[];
};

export const INDUSTRY_DETAILS: IndustryDetail[] = [
  {
    slug: "real-estate",
    name: "Real Estate",
    tagline: "Site visits, not form fills",
    summary: "Launch marketing for developers, from aerial films to WhatsApp follow-up.",
    intro:
      "A property enquiry has a shelf life of about ten minutes. Everything we build for developers is designed around closing that gap between interest and a human conversation.",
    challenges: [
      { title: "Leads go cold before anyone calls", body: "Automated WhatsApp response inside 60 seconds, then routed to a named pre-sales executive." },
      { title: "No way to tell which hoarding works", body: "Trackable QR codes per site, so board spend can be judged like digital spend." },
      { title: "Buyers can't picture the location", body: "Drone films that show connectivity and surroundings, not just the elevation." },
      { title: "Channel partner leads overlap", body: "Shared CRM visibility with source attribution so credit disputes stop." },
    ],
    playbook: [
      "Pre-launch positioning and pricing narrative",
      "Drone film, walkthrough and stills in one production window",
      "Single-project microsite with floor plans and enquiry",
      "Meta and Google campaigns optimised for site visits",
      "WhatsApp automation and CRM routing",
      "Weekly reporting on cost per site visit",
    ],
    metrics: [
      { label: "More site visits booked", value: "312%" },
      { label: "First response time", value: "<60s" },
      { label: "Form conversion on microsites", value: "11%" },
    ],
    services: ["real-estate-marketing", "performance-marketing", "automation-crm", "web-app-development"],
  },
  {
    slug: "restaurants",
    name: "Restaurants & Cafes",
    tagline: "Fuller tables, better ratings",
    summary: "Local search, food content and QR-driven review collection across outlets.",
    intro:
      "For most restaurants, the highest-leverage marketing isn't ads — it's the Google rating and the photos attached to it. We work on both before spending anything on paid.",
    challenges: [
      { title: "Rating stuck below 4.2", body: "Table QR codes route happy diners to Google and complaints to the manager's phone." },
      { title: "Invisible in Maps searches", body: "Google Business Profile optimisation, category strategy and review velocity." },
      { title: "Food photos don't sell the dish", body: "Batch food shoots and AI-generated menu imagery refreshed with the menu." },
      { title: "No idea which outlet drives what", body: "Per-location QR analytics and rating dashboards." },
    ],
    playbook: [
      "Google Business Profile audit and rebuild for every outlet",
      "Table and bill QR codes for review collection",
      "Monthly food and reels content calendar",
      "Local SEO for delivery-area searches",
      "Offer campaigns on Meta with footfall tracking",
    ],
    metrics: [
      { label: "Average rating achieved", value: "4.8★" },
      { label: "Review volume increase", value: "6×" },
      { label: "Outlets managed from one dashboard", value: "All" },
    ],
    services: ["seo-local-search", "social-content", "ai-creative", "performance-marketing"],
  },
  {
    slug: "hotels-resorts",
    name: "Hotels & Resorts",
    tagline: "Direct bookings over OTA commission",
    summary: "Content, search visibility and booking funnels that reduce dependence on aggregators.",
    intro:
      "Every booking through an aggregator costs 15 to 25 percent. The work here is making the direct channel good enough — and visible enough — that guests choose it.",
    challenges: [
      { title: "OTAs take the margin", body: "Direct booking funnels with rate parity messaging and a better on-site experience." },
      { title: "Property looks like every other property", body: "Drone and lifestyle content that shows the location, not just the room." },
      { title: "Reviews arrive after the guest leaves", body: "Checkout feedback that catches problems while they're still fixable." },
      { title: "Seasonality swings hard", body: "Campaign calendars planned around your occupancy curve, not a generic one." },
    ],
    playbook: [
      "Drone and property content library",
      "Direct booking landing pages and offers",
      "Google Business Profile and Maps visibility",
      "Checkout feedback and review routing",
      "Seasonal campaign calendar with budget pacing",
    ],
    metrics: [
      { label: "Direct booking share lift", value: "+34%" },
      { label: "Cost per direct booking", value: "−28%" },
      { label: "Content refresh cadence", value: "Monthly" },
    ],
    services: ["social-content", "seo-local-search", "web-app-development", "performance-marketing"],
  },
  {
    slug: "healthcare",
    name: "Hospitals & Clinics",
    tagline: "Appointments, handled carefully",
    summary: "Patient acquisition that respects medical advertising rules and patient privacy.",
    intro:
      "Healthcare marketing has rules, and getting them wrong is expensive. We work within advertising norms and medical council guidance while still building a pipeline of appointments.",
    challenges: [
      { title: "Advertising restrictions", body: "Creative and copy reviewed against medical advertising norms before anything runs." },
      { title: "Patients search but don't book", body: "Appointment booking on the site and via WhatsApp, not just a phone number." },
      { title: "Doctor profiles are invisible", body: "Individual practitioner pages built for name and speciality searches." },
      { title: "Feedback stays offline", body: "Post-appointment feedback routed privately, reviews requested appropriately." },
    ],
    playbook: [
      "Local SEO for speciality and locality searches",
      "Practitioner profile pages with schema markup",
      "Appointment booking and WhatsApp reminders",
      "Compliant paid campaigns for elective services",
      "Feedback collection and reputation management",
    ],
    metrics: [
      { label: "Appointment enquiries", value: "+180%" },
      { label: "No-show reduction", value: "−22%" },
      { label: "Speciality keywords in local pack", value: "14" },
    ],
    services: ["seo-local-search", "automation-crm", "web-app-development", "performance-marketing"],
  },
  {
    slug: "education",
    name: "Schools & Colleges",
    tagline: "Admissions, season after season",
    summary: "Enquiry generation and nurture built around the admission cycle.",
    intro:
      "Education marketing lives and dies by the calendar. Campaigns are planned backwards from admission deadlines, with nurture sequences that keep a parent engaged for the months in between.",
    challenges: [
      { title: "All spend crammed into two months", body: "Year-round awareness with spend weighted to the enquiry window." },
      { title: "Parents research for months", body: "Nurture sequences over email and WhatsApp until the decision point." },
      { title: "Campus doesn't come across online", body: "Drone and walkthrough films, student testimonial content." },
      { title: "Counsellors lose track of enquiries", body: "CRM with stage tracking and automatic follow-up reminders." },
    ],
    playbook: [
      "Admission-cycle campaign calendar",
      "Campus film and student content",
      "Enquiry landing pages by programme",
      "Long-cycle nurture over WhatsApp and email",
      "Counsellor CRM with follow-up automation",
    ],
    metrics: [
      { label: "Enquiry to application rate", value: "+41%" },
      { label: "Cost per application", value: "−26%" },
      { label: "Nurture sequence length", value: "90 days" },
    ],
    services: ["performance-marketing", "automation-crm", "social-content", "web-app-development"],
  },
  {
    slug: "ecommerce-d2c",
    name: "Ecommerce & D2C",
    tagline: "Creative velocity at a workable CAC",
    summary: "Catalogue imagery, creative testing and full-funnel campaigns for online brands.",
    intro:
      "D2C economics come down to creative refresh rate and cost of acquisition. AI-generated catalogue imagery lets us test weekly instead of quarterly, which is usually where the CAC improvement comes from.",
    challenges: [
      { title: "Creative fatigues in two weeks", body: "AI Studio produces new variants faster than a studio schedule allows." },
      { title: "CAC creeping up", body: "Structured creative testing and funnel-stage budget allocation." },
      { title: "Shoot costs eat the margin", body: "Catalogue imagery generated and retouched at a fraction of studio cost." },
      { title: "No post-purchase loop", body: "Review collection, repeat-purchase flows and WhatsApp broadcasts." },
    ],
    playbook: [
      "Catalogue imagery via AI Studio",
      "Weekly creative testing rounds",
      "Full-funnel Meta and Google structure",
      "UGC and creator seeding",
      "Retention flows over email and WhatsApp",
    ],
    metrics: [
      { label: "Cost per acquisition", value: "−41%" },
      { label: "Creative refresh", value: "Weekly" },
      { label: "Images per batch", value: "420" },
    ],
    services: ["ai-creative", "performance-marketing", "social-content", "web-app-development"],
  },
  {
    slug: "automobile",
    name: "Automobile",
    tagline: "Test drives and service bookings",
    summary: "Dealership marketing for showroom footfall, test drives and service retention.",
    intro:
      "Dealerships have two very different funnels — a slow considered purchase and a recurring service relationship. We run them separately, because the same campaign can't do both.",
    challenges: [
      { title: "Enquiries never reach the sales floor", body: "Lead routing to individual sales executives with escalation timers." },
      { title: "Service customers churn to local garages", body: "Automated service reminders and offers over WhatsApp." },
      { title: "Stock changes weekly", body: "Inventory-aware landing pages and offer creative refreshed on schedule." },
      { title: "No attribution for walk-ins", body: "QR codes on print and showroom collateral tied to campaigns." },
    ],
    playbook: [
      "Test-drive campaigns with instant WhatsApp confirmation",
      "Service reminder automation by vehicle age",
      "Inventory and offer landing pages",
      "Local SEO for dealership and service searches",
      "Showroom QR attribution",
    ],
    metrics: [
      { label: "Test drives booked", value: "+96%" },
      { label: "Service retention", value: "+31%" },
      { label: "Response time", value: "<2 min" },
    ],
    services: ["performance-marketing", "automation-crm", "seo-local-search", "social-content"],
  },
  {
    slug: "fitness-beauty",
    name: "Fitness & Beauty",
    tagline: "Memberships and repeat bookings",
    summary: "Local visibility, content and booking automation for gyms, studios and salons.",
    intro:
      "These are proximity businesses — almost every customer lives or works within a few kilometres. That makes local search and social proof do more work than broad awareness ever will.",
    challenges: [
      { title: "Competing on price alone", body: "Content that shows results, trainers and atmosphere rather than discounts." },
      { title: "Trial visitors don't convert", body: "Post-trial WhatsApp sequences with a clear membership offer." },
      { title: "Bookings happen over phone", body: "Online booking with reminders and rescheduling." },
      { title: "Reviews skew negative", body: "Feedback collection at checkout, routed by sentiment." },
    ],
    playbook: [
      "Google Business Profile and local pack optimisation",
      "Trainer and transformation content, monthly",
      "Trial-to-membership automation",
      "Online booking and reminders",
      "Review collection via QR at checkout",
    ],
    metrics: [
      { label: "Trial to membership", value: "+38%" },
      { label: "No-show reduction", value: "−25%" },
      { label: "Local pack keywords", value: "Top 3" },
    ],
    services: ["seo-local-search", "social-content", "automation-crm", "performance-marketing"],
  },
];

/** Everything we serve. Featured ones have their own page. */
export const ALL_INDUSTRIES = [
  "Real Estate", "Restaurants", "Hotels", "Resorts", "Cafes", "Hospitals", "Clinics",
  "Doctors", "Schools", "Colleges", "Builders", "Architects", "Interior Designers",
  "Gyms", "Fitness Centers", "Salons", "Beauty Brands", "Jewellery", "Retail",
  "Ecommerce", "Automobile", "Finance", "Education", "Travel", "Manufacturing",
  "NGOs", "Startups",
];

export const getIndustry = (slug: string) => INDUSTRY_DETAILS.find((i) => i.slug === slug);

export type ProductDetail = {
  slug: string;
  name: string;
  tag: string;
  status: "live" | "coming-soon";
  tagline: string;
  summary: string;
  intro: string;
  features: { title: string; body: string }[];
  useCases: { who: string; what: string }[];
  plans?: { name: string; price: string; unit: string; features: string[]; featured?: boolean }[];
  faqs: { q: string; a: string }[];
  cta: string;
  accent: [string, string];
};

export const PRODUCT_DETAILS: ProductDetail[] = [
  {
    slug: "bmu-qr",
    name: "BMU QR",
    tag: "Flagship",
    status: "live",
    tagline: "Every code your business prints, in one dashboard",
    summary: "Dynamic QR codes you can re-point without reprinting, with scan analytics by location.",
    intro:
      "A printed QR code is permanent. What it points to shouldn't be. BMU QR keeps the code fixed and the destination editable, so a menu change, a moved landing page or an expired offer never means reprinting a thousand standees.",
    features: [
      { title: "Dynamic codes", body: "Change the destination any time. The printed code never changes." },
      { title: "Restaurant digital menu", body: "A hosted menu with categories, photos, prices and daily specials — editable from your phone." },
      { title: "Google review collection", body: "Route customers to your review page in one tap, with suggested copy." },
      { title: "WhatsApp and payment codes", body: "Pre-filled WhatsApp messages and UPI payment links as scannable codes." },
      { title: "Scan analytics", body: "Scans by day, location, device and referrer. Know which standee actually works." },
      { title: "Multi-location management", body: "Group codes by outlet, compare performance and manage users per location." },
      { title: "Password-protected codes", body: "Gate price lists or internal documents behind a passcode." },
      { title: "NFC business cards", body: "Tap-to-share cards linked to the same dashboard as your codes." },
    ],
    useCases: [
      { who: "Restaurants", what: "Table menus, review cards and offer codes across every outlet." },
      { who: "Real estate", what: "Brochure codes on hoardings, tracked by site so you know which board pulls." },
      { who: "Retail", what: "Shelf codes for catalogues, warranty registration and payment." },
      { who: "Clinics", what: "Appointment booking, feedback forms and prescription downloads." },
    ],
    plans: [
      { name: "Starter", price: "₹499", unit: "/month", features: ["10 dynamic QR codes", "Digital menu or catalogue", "Google review collection", "Basic scan analytics", "1 user"] },
      { name: "Professional", price: "₹1,499", unit: "/month", features: ["Unlimited dynamic codes", "Up to 5 locations", "Smart Review included", "Full campaign analytics", "Password-protected codes", "5 users, 2 NFC cards"], featured: true },
      { name: "Enterprise", price: "Custom", unit: "billed annually", features: ["Unlimited locations and users", "White-label domain and branding", "API access", "Bulk code generation", "SSO and role permissions", "Dedicated success manager"] },
    ],
    faqs: [
      { q: "Do codes stop working if we cancel?", a: "Codes stay live for 30 days after cancellation so you have time to migrate or export. We'll warn you before anything breaks." },
      { q: "Can we use our own domain?", a: "On Enterprise, yes — codes resolve through your domain rather than ours." },
      { q: "Is there an API?", a: "Yes, on Enterprise. Create, update and pull scan data programmatically." },
    ],
    cta: "Start a free trial",
    accent: ["#121F2F", "#8BB72C"],
  },
  {
    slug: "smart-review",
    name: "Smart Review",
    tag: "Reputation",
    status: "coming-soon",
    tagline: "Catch the complaint before it becomes a one-star review",
    summary: "Route happy customers to Google and unhappy ones to your inbox.",
    intro:
      "The gap between a 3.9 and a 4.6 rating is rarely the food or the service — it's who gets asked to review, and when. Smart Review asks everyone, then sends the feedback where it belongs.",
    features: [
      { title: "Feedback landing pages", body: "Branded pages that ask one question first: how did it go?" },
      { title: "Negative feedback routing", body: "Anything below your threshold goes to your operations lead, privately, immediately." },
      { title: "Suggested review copy", body: "Happy customers get a prompt with local keywords they can edit or post as-is." },
      { title: "Business-specific templates", body: "Question sets tuned for restaurants, clinics, salons, hotels and retail." },
      { title: "Review analytics", body: "Rating trend by outlet, response rate and recurring complaint themes." },
      { title: "Weekly reports", body: "A Monday email with the week's feedback and anything that needs attention." },
    ],
    useCases: [
      { who: "Restaurant groups", what: "Table cards and bill QR codes feeding a single rating dashboard." },
      { who: "Clinics", what: "Post-appointment SMS asking for feedback before the patient forgets." },
      { who: "Hotels", what: "Checkout feedback that catches problems before the OTA review lands." },
    ],
    faqs: [
      { q: "Is filtering reviews allowed?", a: "We don't filter reviews. Everyone gets the same chance to post publicly — we just make sure complaints also reach you privately, which platforms permit." },
      { q: "Does it work without BMU QR?", a: "Yes. It works over SMS, email or WhatsApp links too." },
    ],
    cta: "Request a demo",
    accent: ["#1F3B56", "#6D961F"],
  },
  {
    slug: "bmu-creators",
    name: "BMU Connect",
    tag: "Marketplace",
    status: "coming-soon",
    tagline: "Find, brief and track creators in one place",
    summary: "A vetted creator marketplace with campaign management built in.",
    intro:
      "Influencer campaigns usually die in the coordination — fifty DMs, unclear deliverables, no way to compare performance. BMU Creators puts discovery, briefing and reporting in one dashboard.",
    features: [
      { title: "Vetted creator profiles", body: "Real audience data, past work and rate cards. No inflated follower counts." },
      { title: "Location and niche filters", body: "Search by city, category, audience size and budget." },
      { title: "Budget planning", body: "Build a campaign roster against a fixed budget before you commit." },
      { title: "Brief and approval flow", body: "Send one brief to many creators, approve drafts before they publish." },
      { title: "Campaign tracking", body: "Reach, engagement and link clicks per creator, in one view." },
      { title: "Barter and paid", body: "Manage product-seeding and paid collaborations side by side." },
    ],
    useCases: [
      { who: "D2C brands", what: "Seeding campaigns across dozens of micro creators without the spreadsheet." },
      { who: "Restaurants", what: "Local food creators booked for launches and menu changes." },
      { who: "Real estate", what: "Lifestyle creators covering project launches and locality guides." },
    ],
    faqs: [
      { q: "Is it open to brands directly?", a: "It's currently in private beta for retainer clients. Join the waitlist and we'll open access in batches." },
      { q: "How are creators vetted?", a: "We check audience authenticity, past brand work and delivery reliability before a profile goes live." },
    ],
    cta: "Join the waitlist",
    accent: ["#203348", "#8BB72C"],
  },
  {
    slug: "ai-studio",
    name: "BMU AI Studio",
    tag: "AI Studio",
    status: "coming-soon",
    tagline: "Product imagery without booking a studio",
    summary: "AI models, lifestyle product photography, virtual staging and background work at scale.",
    intro:
      "The bottleneck in ecommerce creative is rarely ideas — it's shoot days. AI Studio generates catalogue-ready imagery in hours, with human art direction and retouching on every delivered frame.",
    features: [
      { title: "AI fashion and beauty models", body: "Diverse models matched to your target market, wearing your catalogue." },
      { title: "Food photography", body: "Your dishes plated and lit in scenes that match your brand." },
      { title: "Furniture and interiors", body: "Products placed in styled rooms without renting a set." },
      { title: "Virtual staging", body: "Empty property interiors furnished digitally for listings." },
      { title: "Background replacement", body: "Bulk cutouts and scene swaps for entire catalogues." },
      { title: "AI video and voice", body: "Short vertical video and voiceover across Indian languages." },
    ],
    useCases: [
      { who: "Fashion and D2C", what: "Full catalogue shoots without model booking or studio hire." },
      { who: "Restaurants", what: "Menu photography refreshed whenever the menu changes." },
      { who: "Real estate", what: "Staged interiors for unsold, unfurnished inventory." },
    ],
    faqs: [
      { q: "How accurate is the product?", a: "The product is composited from your real photography and retouched by hand. Only the surrounding scene is generated." },
      { q: "What's the turnaround?", a: "Typically three to five working days for a batch of 40 to 60 images." },
    ],
    cta: "See samples",
    accent: ["#121F2F", "#6D961F"],
  },
  {
    slug: "real-estate-suite",
    name: "Real Estate Suite",
    tag: "Real estate",
    status: "coming-soon",
    tagline: "The whole launch stack, one team",
    summary: "Drone, walkthroughs, microsites, campaigns, CRM and WhatsApp follow-up as one package.",
    intro:
      "Built for developers running project launches, not generic marketing. Everything from the aerial film to the follow-up message is delivered and reported by the same team.",
    features: [
      { title: "Drone and virtual tours", body: "Licensed aerial capture, gimbal walkthroughs and 360 tours." },
      { title: "Project microsites", body: "Single-project sites with floor plans, pricing enquiry and locality context." },
      { title: "Lead campaigns", body: "Meta and Google campaigns optimised for site visits, not form fills." },
      { title: "CRM and lead management", body: "Pipeline configured for pre-sales teams with channel partner visibility." },
      { title: "WhatsApp automation", body: "First response in seconds, reminders before site visits, follow-up after." },
      { title: "Launch reporting", body: "Daily numbers in week one, weekly through the campaign." },
    ],
    useCases: [
      { who: "Developers", what: "Pre-launch through to sold-out, with one accountable team." },
      { who: "Channel partners", what: "Shared lead visibility and attribution across sources." },
      { who: "Plotted developments", what: "Aerial context that photographs can't convey." },
    ],
    faqs: [
      { q: "Do you work per project or on retainer?", a: "Either. Launches are usually project-priced; ongoing inventory sales work better on retainer." },
      { q: "Can you handle multiple projects at once?", a: "Yes, with a dedicated account team on the Scale plan." },
    ],
    cta: "Plan a launch",
    accent: ["#1F3B56", "#121F2F"],
  },
];

export const getProduct = (slug: string) => PRODUCT_DETAILS.find((p) => p.slug === slug);

/**
 * Where a product links to, or null while it's coming soon. Coming-soon products are shown as
 * plain text everywhere (footers, cards, "Other products"); setting status to "live" restores the links.
 */
export const productHref = (p: Pick<ProductDetail, "slug" | "status">) =>
  p.status === "live" ? `/products/${p.slug}` : null;

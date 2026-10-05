export type IconName =
  | "BarChart3" | "PlayCircle" | "Search" | "Code2"
  | "Zap" | "PenTool" | "Sparkles" | "Building2";

export type ServiceDetail = {
  slug: string;
  title: string;
  icon: IconName;
  tagline: string;
  summary: string;
  intro: string;
  deliverables: { title: string; body: string }[];
  process: { title: string; body: string }[];
  outcomes: string[];
  priceFrom: string;
  faqs: { q: string; a: string }[];
  related: string[];
};

export const SERVICE_DETAILS: ServiceDetail[] = [
  {
    slug: "performance-marketing",
    title: "Performance marketing",
    icon: "BarChart3",
    tagline: "Spend that reports back",
    summary: "Meta and Google campaigns built around cost per qualified lead, not impressions.",
    intro:
      "Most ad accounts we inherit are optimising for the wrong event. We rebuild tracking first, then structure campaigns so the platform learns from qualified leads rather than form fills that never answer the phone.",
    deliverables: [
      { title: "Account audit and rebuild", body: "Pixel, conversions API, offline conversion imports and a campaign structure your budget can actually support." },
      { title: "Creative testing", body: "Between 12 and 30 assets a month depending on the plan, tested in structured rounds instead of all at once." },
      { title: "Audience and bidding strategy", body: "Cold, warm and retargeting layers with budgets set by stage, reviewed weekly." },
      { title: "Landing pages", body: "Purpose-built pages for each offer, because sending paid traffic to a homepage wastes about a third of the spend." },
      { title: "Lead routing", body: "Leads pushed into your CRM or WhatsApp within seconds, with source and campaign attached." },
    ],
    process: [
      { title: "Audit", body: "We look at the last 90 days of spend, your close rate by source, and what your sales team actually does with a lead." },
      { title: "Rebuild tracking", body: "Nothing launches until conversions fire correctly and we can tie a rupee of spend to a named lead." },
      { title: "Launch and learn", body: "Two weeks of structured testing at a controlled budget before we scale anything." },
      { title: "Scale and report", body: "Budget moves to what works. You get a monthly report that says plainly what did and didn't." },
    ],
    outcomes: [
      "Cost per qualified lead, tracked month over month",
      "Clear channel attribution for every enquiry",
      "Creative refreshed before fatigue, not after",
    ],
<<<<<<< HEAD
    priceFrom: "₹35,000/month",
=======
    priceFrom: "₹35,000/month + ad spend",
>>>>>>> e2f5f07 (hp test)
    faqs: [
      { q: "Do you charge a percentage of ad spend?", a: "No. It's a flat monthly fee, so our incentive isn't to talk you into a bigger budget." },
      { q: "Who pays the platforms?", a: "You do, directly. Cards stay on your ad accounts and we never touch the money." },
    ],
    related: ["seo-local-search", "web-app-development", "automation-crm"],
  },
  {
    slug: "social-content",
    title: "Social & content",
    icon: "PlayCircle",
    tagline: "A feed that earns attention",
    summary: "Reels, UGC, photography and drone work produced on a monthly calendar you approve in advance.",
    intro:
      "Consistency beats occasional brilliance on social. We plan a month at a time, shoot in batches, and put every asset in front of you for approval before it publishes.",
    deliverables: [
      { title: "Monthly content calendar", body: "Planned around your offers, festivals and launches - approved by you before anything is shot." },
      { title: "Reels and short video", body: "Scripted, shot and edited in batches. Vertical-first, captioned, sized for every placement." },
      { title: "UGC and creator content", body: "Briefed creators producing native-feeling content that performs in paid as well as organic." },
      { title: "Photography and drone", body: "Product, food, interior, property and event coverage, licensed to you outright." },
      { title: "Community management", body: "Comment and DM response inside working hours, with escalation rules you set." },
    ],
    process: [
      { title: "Brand immersion", body: "Half a day with your team to understand the voice, the offers and what's off-limits." },
      { title: "Calendar", body: "A month of concepts, delivered on the 20th for the month ahead." },
      { title: "Batch production", body: "One or two shoot days a month rather than constant small asks on your team." },
      { title: "Approve and publish", body: "Everything lands in your dashboard for sign-off. Nothing goes live unapproved." },
    ],
    outcomes: [
      "A month of content in hand before the month starts",
      "Assets that work in both organic and paid",
      "Full usage rights to every file we shoot",
    ],
    priceFrom: "₹45,000/month",
    faqs: [
      { q: "Do you travel outside Bengaluru?", a: "Yes. Travel and stay are billed at cost for shoots beyond city limits." },
      { q: "Can we use the footage in ads?", a: "Always. You own everything we produce, including raw files on request." },
    ],
    related: ["ai-creative", "performance-marketing", "branding-design"],
  },
  {
    slug: "seo-local-search",
    title: "SEO & local search",
    icon: "Search",
    tagline: "Show up where people are already looking",
    summary: "Technical fixes, local ranking, content and Google Business Profile work that compounds.",
    intro:
      "SEO is slow, so we start with the fastest wins: local pack visibility and technical debt. Content and links follow once the foundation holds.",
    deliverables: [
      { title: "Technical audit and fixes", body: "Crawlability, site speed, schema, indexation and Core Web Vitals - implemented, not just reported." },
      { title: "Local SEO", body: "Google Business Profile optimisation, category strategy, service areas, photos and review velocity." },
      { title: "Keyword and content plan", body: "Mapped to search intent and to what your sales team actually gets asked." },
      { title: "On-page and content production", body: "Landing pages and articles written for humans first, structured for search second." },
      { title: "Link acquisition", body: "Digital PR, local citations and industry listings. No purchased link farms." },
    ],
    process: [
      { title: "Baseline", body: "Where you rank today, who outranks you, and what's technically blocking you." },
      { title: "Fix the foundation", body: "Technical issues and Google Business Profile in the first 30 days." },
      { title: "Build", body: "Content and links on a monthly cadence against the keyword map." },
      { title: "Report", body: "Ranking movement, traffic and - where it can be traced - leads from organic." },
    ],
    outcomes: [
      "Local pack visibility for the searches that convert",
      "Ranking movement reported against a fixed keyword set",
      "Technical health that stays fixed",
    ],
    priceFrom: "₹30,000/month",
    faqs: [
      { q: "How long before we see movement?", a: "Local pack changes can show in six to eight weeks. Competitive organic terms take six months or more, and we'll say so upfront." },
      { q: "Do you guarantee rankings?", a: "No, and be careful of anyone who does. We commit to the work and report the movement honestly." },
    ],
    related: ["web-app-development", "performance-marketing", "branding-design"],
  },
  {
    slug: "web-app-development",
    title: "Web & app development",
    icon: "Code2",
    tagline: "Sites built to convert and to last",
    summary: "Next.js websites, ecommerce, web apps and mobile apps - fast, accessible, and yours to own.",
    intro:
      "We build on Next.js and TypeScript so the site stays fast, ranks well and doesn't need rebuilding in two years. Everything ships to a repository you own.",
    deliverables: [
      { title: "Marketing websites", body: "Design, build and launch on Next.js with a CMS your team can actually edit." },
      { title: "Ecommerce", body: "Shopify or headless commerce with Razorpay, logistics and inventory integrated." },
      { title: "Web applications", body: "Dashboards, portals and internal tools with authentication and role permissions." },
      { title: "Mobile apps", body: "Flutter or React Native for Android and iOS, with a shared backend." },
      { title: "Maintenance", body: "Optional retainer for updates, monitoring, backups and small changes." },
    ],
    process: [
      { title: "Scope and wireframe", body: "Sitemap, page templates and functionality agreed in writing before design starts." },
      { title: "Design", body: "Desktop and mobile designs for every template, revised twice as standard." },
      { title: "Build", body: "Weekly staging links so you see progress instead of waiting for a reveal." },
      { title: "Launch and handover", body: "Repository access, documentation and a training session for your team." },
    ],
    outcomes: [
      "90+ Lighthouse scores on launch",
      "Code and hosting in your own accounts",
      "A CMS your marketing team can run without us",
    ],
    priceFrom: "₹1,20,000 per project",
    faqs: [
      { q: "Do we own the code?", a: "Yes. Repository, domain and hosting are all created under your ownership from day one." },
      { q: "Can you work with our existing site?", a: "Often, yes. If the platform is holding you back we'll tell you rather than patch around it." },
    ],
    related: ["seo-local-search", "automation-crm", "branding-design"],
  },
  {
    slug: "automation-crm",
    title: "Automation & CRM",
    icon: "Zap",
    tagline: "Follow up before the lead cools",
    summary: "WhatsApp flows, CRM setup, lead routing and AI calling agents that answer in seconds.",
    intro:
      "Most lost leads aren't a marketing problem, they're a response-time problem. We automate the first touch so nobody waits for a callback that comes tomorrow.",
    deliverables: [
      { title: "WhatsApp Business setup", body: "Verified account, templates, and automated first response within seconds of a form fill." },
      { title: "CRM implementation", body: "Pipeline stages, fields, ownership rules and reporting configured to how your team actually sells." },
      { title: "Lead routing", body: "Round-robin or rule-based assignment with escalation when a lead goes untouched." },
      { title: "AI calling agents", body: "Voice agents that qualify inbound leads and book site visits or appointments." },
      { title: "Appointment booking", body: "Calendar links, reminders and no-show follow-ups, all automated." },
    ],
    process: [
      { title: "Map the current flow", body: "We follow a real lead through your process and find where it stalls." },
      { title: "Design the automation", body: "Written flow diagrams you approve before anything is built." },
      { title: "Build and test", body: "Tested with your team on live numbers before it touches real leads." },
      { title: "Monitor", body: "Response times and drop-off tracked monthly, flows tuned accordingly." },
    ],
    outcomes: [
      "First response measured in seconds, not hours",
      "Every lead assigned to a named person",
      "A pipeline your sales head can read at a glance",
    ],
    priceFrom: "₹60,000 setup + ₹15,000/month",
    faqs: [
      { q: "Which CRMs do you work with?", a: "HubSpot, Zoho, Salesforce and Kylas most often. We can also build a lightweight one into your dashboard." },
      { q: "Is WhatsApp automation compliant?", a: "Yes, when done on the official WhatsApp Business Platform with approved templates. We don't use unofficial workarounds." },
    ],
    related: ["performance-marketing", "web-app-development", "real-estate-marketing"],
  },
  {
    slug: "branding-design",
    title: "Branding & design",
    icon: "PenTool",
    tagline: "A brand that holds up in every format",
    summary: "Identity, guidelines, packaging, UI/UX and pitch decks built as one coherent system.",
    intro:
      "A logo isn't a brand. We build the system around it - type, colour, layout rules, tone - so everything your business produces afterwards looks like it came from the same company.",
    deliverables: [
      { title: "Brand identity", body: "Logo suite, colour system, typography and iconography with usage rules." },
      { title: "Brand guidelines", body: "A document your printers, agencies and internal team can all work from." },
      { title: "Packaging and print", body: "Dielines, mockups and print-ready artwork with vendor coordination." },
      { title: "UI/UX design", body: "Product and app interfaces designed as a component system, not one-off screens." },
      { title: "Presentations", body: "Investor decks and sales presentations designed to be presented, not read." },
    ],
    process: [
      { title: "Discovery", body: "Workshops with founders and a look at where you sit against competitors." },
      { title: "Direction", body: "Two or three distinct territories, presented as mood and application, not just logos." },
      { title: "Refine", body: "One direction taken to completion across every application you'll actually use." },
      { title: "Systemise", body: "Guidelines and asset library handed over in editable source files." },
    ],
    outcomes: [
      "A complete asset library in editable formats",
      "Guidelines that stop the brand drifting",
      "Consistency across print, digital and packaging",
    ],
    priceFrom: "₹85,000 per project",
    faqs: [
      { q: "How many logo options do we see?", a: "Two or three fully-developed directions, not fifty thumbnails. Depth beats volume." },
      { q: "Do we get source files?", a: "Yes - Figma, Illustrator and exported formats, all handed over on completion." },
    ],
    related: ["web-app-development", "social-content", "ai-creative"],
  },
  {
    slug: "ai-creative",
    title: "AI creative",
    icon: "Sparkles",
    tagline: "Catalogue imagery without a shoot day",
    summary: "AI product photography, fashion and beauty models, virtual staging and ad creative at scale.",
    intro:
      "Studio days are expensive and slow, which is why most brands refresh creative quarterly instead of weekly. AI generation changes that maths - with human art direction on every frame.",
    deliverables: [
      { title: "AI product photography", body: "Your product placed in lifestyle scenes, lit consistently, in any number of variations." },
      { title: "Fashion and beauty models", body: "Diverse AI models wearing your catalogue, matched to your target demographic." },
      { title: "Virtual staging", body: "Empty property interiors furnished digitally for listings and brochures." },
      { title: "Ad creative at scale", body: "Dozens of variants from one concept for structured testing." },
      { title: "AI video and voice", body: "Short-form video and voiceover in multiple Indian languages." },
    ],
    process: [
      { title: "Reference and art direction", body: "We agree the look first - lighting, mood, styling - the same as a real shoot." },
      { title: "Generate and curate", body: "We produce widely and show you only what's usable. You never sort through failures." },
      { title: "Retouch", body: "Every delivered image is human-retouched for product accuracy." },
      { title: "Deliver", body: "Web and print resolutions, named and organised for your catalogue." },
    ],
    outcomes: [
      "Creative refreshed weekly instead of seasonally",
      "A fraction of the cost of repeated studio days",
      "Product accuracy checked by a human before delivery",
    ],
    priceFrom: "₹25,000 per batch",
    faqs: [
      { q: "Will customers know it's AI?", a: "Well-directed AI product imagery is difficult to distinguish, but we advise disclosing AI models where your market expects it." },
      { q: "Is my product rendered accurately?", a: "The product itself is composited from real photography and retouched by hand. Only the scene is generated." },
    ],
    related: ["social-content", "performance-marketing", "branding-design"],
  },
  {
    slug: "real-estate-marketing",
    title: "Real estate marketing",
    icon: "Building2",
    tagline: "From drone to site visit",
    summary: "The full pre-launch stack: aerial films, walkthroughs, funnels, campaigns and follow-up.",
    intro:
      "Property marketing fails at the handoff. Great films get paired with a slow enquiry form and a callback two days later. We build the whole chain so the lead reaches a human while they're still interested.",
    deliverables: [
      { title: "Drone and aerial films", body: "Licensed pilots, cinematic edits, and the location context buyers actually want to see." },
      { title: "Walkthroughs and virtual tours", body: "Gimbal walkthroughs and 360 tours embedded on the project microsite." },
      { title: "Project branding", body: "Name, identity, brochure and signage as one system." },
      { title: "Sales microsites and funnels", body: "Single-project sites built to convert, with floor plans, pricing enquiry and location." },
      { title: "Lead campaigns and follow-up", body: "Meta and Google campaigns feeding straight into WhatsApp and your CRM." },
    ],
    process: [
      { title: "Pre-launch plan", body: "Positioning, pricing narrative and channel mix agreed six to eight weeks before launch." },
      { title: "Produce", body: "Drone, walkthrough and stills captured in a single production window." },
      { title: "Build the funnel", body: "Microsite, forms, WhatsApp automation and CRM live before the first rupee of spend." },
      { title: "Launch and optimise", body: "Daily monitoring in week one, then weekly optimisation against site visits booked." },
    ],
    outcomes: [
      "Site visits booked, not just form fills",
      "Every enquiry answered within a minute",
      "One team accountable for the whole chain",
    ],
    priceFrom: "₹2,00,000 per project launch",
    faqs: [
      { q: "Do you handle RERA compliance in creative?", a: "We include the required disclosures and registration numbers, but sign-off stays with your legal team." },
      { q: "Can you work with our existing channel partners?", a: "Yes. We often run the digital layer while channel partners handle walk-ins, with shared lead visibility." },
    ],
    related: ["performance-marketing", "automation-crm", "social-content"],
  },
];

export const getService = (slug: string) => SERVICE_DETAILS.find((s) => s.slug === slug);

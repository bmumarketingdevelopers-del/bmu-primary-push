import {
  AppWindow,
  BarChart3,
  Blend,
  Bot,
  CalendarClock,
  CalendarDays,
  CircleCheck,
  Clock3,
  CodeXml,
  Copy,
  FileText,
  Film,
  Gem,
  IdCard,
  Layers,
  LayoutGrid,
  MapPin,
  Megaphone,
  MessageSquare,
  MessageSquareMore,
  Mic,
  Network,
  Pencil,
  RefreshCw,
  SearchCheck,
  Shapes,
  Smartphone,
  Store,
  Target,
  Ticket,
  TrendingUp,
  UserRoundCheck,
  UserRoundPlus,
  Users,
  Video,
  type LucideIcon,
} from "lucide-react";

/*
 * The six services shown on /services. Each one appears as a card there;
 * a service with `detail` also gets its own page at /services/<slug>
 * (rendered by components/marketing/service-detail).
 */

export type ServiceOffering = {
  /** URL segment under its service, e.g. /services/marketing-and-visibility/digital-marketing */
  slug: string;
  icon: LucideIcon;
  title: string;
  body: string;
  priceFrom: string;
  /** An offering with `detail` gets its own page (components/marketing/offering-detail) */
  detail?: OfferingDetail;
};

export type OfferingDetail = {
  /** What the package includes; shown in the hero card and the "Everything in the package" list */
  included: { title: string; body: string }[];
};

export type ServiceStat = {
  icon: LucideIcon;
  value: string;
  label: string;
  body: string;
};

export type ServicePhase = {
  title: string;
  items: string[];
};

export type ServicePageDetail = {
  lede: string;
  /** Icon in the middle of the hero diagram; defaults to the service's card icon */
  heroIcon?: LucideIcon;
  /** Two to four labels placed around the hero icon (see NODE_ANGLES in service-hero.tsx) */
  heroNodes: string[];
  /** Short notes beside the section titles; a section without one shows the title alone */
  notes?: { reasons?: string; offerings?: string; results?: string };
  offerings: ServiceOffering[];
  processChecks: string[];
  stats: ServiceStat[];
  phases: ServicePhase[];
  /** Line under "From kickoff to results"; defaults to "How a <title> engagement runs, step by step." */
  roadmapLede?: string;
  /** Closing band; falls back to the general "Tell us what you're trying to grow" copy */
  cta?: { title: string; body: string };
};

export type ServicePage = {
  slug: string;
  icon: LucideIcon;
  tagline: string;
  title: string;
  summary: string;
  chips: string[];
  priceFrom: string;
  /** Where the /services card links while the service has no detail page of its own */
  fallbackHref?: string;
  detail?: ServicePageDetail;
};

/* ---- shared across every service detail page */

export const SERVICE_PROMISES: { icon: LucideIcon; title: string; body: string }[] = [
  { icon: Clock3, title: "Reply within one working day", body: "Every enquiry gets a named person" },
  { icon: FileText, title: "Written plan in 3 working days", body: "Yours to keep, whether or not we work together" },
  { icon: BarChart3, title: "One monthly report", body: "What worked, what didn't and what's next" },
];

export const SERVICE_REASONS: { title: string; body: string }[] = [
  { title: "One team, every channel", body: "Strategy, creative and media under one roof, working from the same plan." },
  { title: "Plans before spend", body: "Nothing launches until goals and budgets are agreed in writing." },
  { title: "Numbers you can read", body: "Plain-language reporting on the results that matter to you." },
];

/* ---- shared across every offering page */

export const OFFERING_FACTS: { label: string; value: string }[] = [
  { label: "Written plan", value: "3 working days" },
  { label: "Reporting", value: "Every month" },
];

export const OFFERING_STEPS: { title: string; body: string }[] = [
  { title: "Free call", body: "A 30-minute call about your goals and current numbers." },
  { title: "Written plan", body: "A clear plan in three working days. Yours either way." },
  { title: "Build and launch", body: "We set up and launch the work agreed in your plan." },
  { title: "Report and review", body: "One monthly report and review, in plain language." },
];

export const SERVICE_PROCESS: { title: string; body: string }[] = [
  { title: "Free call", body: "A 30-minute call to understand your goals and current numbers." },
  { title: "Written plan", body: "A clear plan within three working days. It's yours either way." },
  { title: "Build and launch", body: "We set up and launch the work agreed in your plan." },
  { title: "Report and review", body: "One monthly report and review, so you always know what's working." },
];

/* ---- the six services */

export const SERVICE_PAGES: ServicePage[] = [
  {
    slug: "marketing-and-visibility",
    icon: TrendingUp,
    tagline: "Be seen by the right people",
    title: "Marketing and Visibility",
    summary: "Paid campaigns, SEO and local search planned around qualified leads, so the right people find you first.",
    chips: ["Digital Marketing", "ChatGPT Ads", "Google Business Profile"],
    priceFrom: "₹35,000/month + ad spend",
    detail: {
      lede: "Paid campaigns, SEO and local search planned around qualified leads, so the right people find you first.",
      heroNodes: ["Digital Marketing", "ChatGPT Ads", "Google Business Profile", "SEO"],
      notes: {
        reasons: "One team for strategy, creative and execution, so nothing gets lost between agencies.",
        offerings: "Pick one or combine a few. Every service comes with a monthly report and review.",
        results:
          "What you get with Marketing and Visibility: the services, cadence and support behind every result we deliver.",
      },
      offerings: [
        {
          slug: "digital-marketing",
          icon: Megaphone,
          title: "Digital Marketing",
          body: "Meta and Google campaigns planned around cost per qualified lead, optimised every week.",
          priceFrom: "₹25,000",
          detail: {
            included: [
              { title: "Campaign setup", body: "Meta and Google campaigns structured around your goals." },
              { title: "Creative testing", body: "New ad creatives tested every month." },
              { title: "Weekly optimisation", body: "Budgets and bids adjusted based on results." },
            ],
          },
        },
        {
          slug: "chatgpt-ads",
          icon: MessageSquare,
          title: "ChatGPT Ads",
          body: "Show up where people now ask AI assistants for recommendations in your category.",
          priceFrom: "₹20,000",
          detail: {
            included: [
              { title: "Placement strategy", body: "Where and how your brand appears in AI answers." },
              { title: "Ad copy and offers", body: "Clear, useful messaging written for AI-led search." },
              { title: "Performance tracking", body: "Clicks, leads and cost reported monthly." },
            ],
          },
        },
        {
          slug: "seo",
          icon: SearchCheck,
          title: "SEO",
          body: "Technical fixes, keyword plans and content that build rankings month after month.",
          priceFrom: "₹15,000",
          detail: {
            included: [
              { title: "Technical audit", body: "Speed, indexing and site health fixed first." },
              { title: "Keyword plan", body: "The searches your customers actually make." },
              { title: "Content and links", body: "Pages and articles that build rankings over time." },
            ],
          },
        },
        {
          slug: "google-business-profile",
          icon: MapPin,
          title: "Google Business Profile",
          body: "Setup, posts, photos and review replies that lift your local search visibility.",
          priceFrom: "₹7,500",
          detail: {
            included: [
              { title: "Profile setup", body: "Categories, hours, services and photos done right." },
              { title: "Posts and updates", body: "Regular posts that keep your listing active." },
              { title: "Review management", body: "Timely replies that build trust locally." },
            ],
          },
        },
      ],
      processChecks: [
        "Goals agreed before any work starts",
        "One monthly report, in plain language",
        "The written plan is yours either way",
      ],
      stats: [
        { icon: Network, value: "4", label: "Channels covered", body: "Meta, Google, ChatGPT and local search" },
        { icon: RefreshCw, value: "Weekly", label: "Optimisation", body: "Budgets, bids and creative reviewed" },
        { icon: CalendarClock, value: "3 days", label: "Written plan", body: "Strategy agreed before any spend" },
        { icon: BarChart3, value: "Monthly", label: "Reporting", body: "What worked and what's next" },
      ],
      phases: [
        {
          title: "Audit and set up",
          items: ["Ad account and tracking audit", "Google Business Profile cleanup", "Keyword and audience research"],
        },
        {
          title: "Launch",
          items: ["Meta and Google campaigns live", "SEO fixes and first content", "ChatGPT Ads test"],
        },
        {
          title: "Scale",
          items: ["Budget moved to what works", "Local ranking and review push", "Monthly report and next plan"],
        },
      ],
    },
  },
  {
    slug: "brand-and-design",
    icon: Gem,
    tagline: "One system, every format",
    title: "Brand & design",
    summary: "Identity, guidelines, packaging, UI/UX and pitch decks designed as one coherent system.",
    chips: ["Complete Branding", "Logo & Brand Kit", "Graphic Designing"],
    priceFrom: "₹1,20,000 per project",
    detail: {
      lede: "Identity, guidelines, packaging, UI/UX and pitch decks designed as one coherent system.",
      heroNodes: ["Complete Branding", "Graphic Designing", "Logo & Brand Kit"],
      offerings: [
        {
          slug: "complete-branding",
          icon: Gem,
          title: "Complete Branding",
          body: "Strategy, identity, guidelines and brand assets built as one coherent system.",
          priceFrom: "₹40,000",
          detail: {
            included: [
              { title: "Brand strategy", body: "Positioning, audience and personality defined." },
              { title: "Visual identity", body: "Logo, colours, type and imagery as one system." },
              { title: "Brand guidelines", body: "Rules your team can follow everywhere." },
            ],
          },
        },
        {
          slug: "logo-and-brand-kit",
          icon: Shapes,
          title: "Logo & Brand Kit",
          body: "A logo with colours, typography and ready-to-use files for every format.",
          priceFrom: "₹15,000",
          detail: {
            included: [
              { title: "Logo design", body: "Concepts, refinements and a final mark." },
              { title: "Colour and type", body: "A palette and fonts that fit your brand." },
              { title: "Ready-to-use files", body: "Every format for print, web and social." },
            ],
          },
        },
        {
          slug: "graphic-designing",
          icon: Pencil,
          title: "Graphic Designing",
          body: "Social posts, ads, brochures and print material designed on brand.",
          priceFrom: "₹10,000",
          detail: {
            included: [
              { title: "Social creatives", body: "Posts, stories and carousels on brand." },
              { title: "Ad designs", body: "Static ads sized for every platform." },
              { title: "Print material", body: "Brochures, flyers and packaging artwork." },
            ],
          },
        },
      ],
      processChecks: [
        "Goals agreed before any work starts",
        "One monthly report, in plain language",
        "The written plan is yours either way",
      ],
      stats: [
        { icon: Layers, value: "3", label: "Design services", body: "Branding, brand kits and graphics" },
        { icon: Gem, value: "1", label: "Brand system", body: "One identity across every format" },
        { icon: Shapes, value: "All", label: "Formats covered", body: "Social, ads, packaging and print" },
        { icon: FileText, value: "3 days", label: "Written plan", body: "Scope agreed before design starts" },
      ],
      phases: [
        {
          title: "Discover",
          items: ["Brand and competitor audit", "Positioning and audience", "Moodboards and direction"],
        },
        {
          title: "Design",
          items: ["Logo and identity routes", "Colour and type system", "Brand kit files"],
        },
        {
          title: "Roll out",
          items: ["Brand guidelines", "Social, ads and print templates", "Handover and launch support"],
        },
      ],
      cta: {
        title: "Ready for a brand people remember?",
        body: "Tell us where your brand is today. We'll share a direction and a written plan within three working days.",
      },
    },
  },
  {
    slug: "web-and-ai",
    icon: AppWindow,
    tagline: "Built to convert and scale",
    title: "Web & AI",
    summary: "Fast websites and web apps, plus AI creative, chatbots and automation that save your team hours.",
    chips: ["Website Design & Development", "AI Chatbots"],
    priceFrom: "₹85,000 per project",
    detail: {
      lede: "Fast websites and web apps, plus AI creative, chatbots and automation that save your team hours.",
      heroIcon: CodeXml,
      heroNodes: ["Website Design & Development", "AI Chatbots"],
      offerings: [
        {
          slug: "website-design-and-development",
          icon: AppWindow,
          title: "Website Design & Development",
          body: "Fast, responsive websites and stores built to convert and easy to update.",
          priceFrom: "₹25,000",
          detail: {
            included: [
              { title: "UX and design", body: "Layouts planned around how visitors buy." },
              { title: "Development", body: "Fast, responsive builds that are easy to update." },
              { title: "Launch and tracking", body: "Go live with analytics and lead tracking set up." },
            ],
          },
        },
        {
          slug: "ai-chatbots",
          icon: Bot,
          title: "AI Chatbots",
          body: "Website and WhatsApp chatbots that answer questions and capture leads around the clock.",
          priceFrom: "₹10,000",
          detail: {
            included: [
              { title: "Chatbot setup", body: "On your website and WhatsApp." },
              { title: "Custom answers", body: "Trained on your services, pricing and FAQs." },
              { title: "Lead capture", body: "Names and numbers sent straight to your team." },
            ],
          },
        },
      ],
      processChecks: [
        "Goals agreed before any work starts",
        "One monthly report, in plain language",
        "The written plan is yours either way",
      ],
      stats: [
        { icon: Layers, value: "2", label: "Core services", body: "Websites and AI chatbots" },
        { icon: MessageSquareMore, value: "24/7", label: "Lead capture", body: "Chatbots that reply around the clock" },
        { icon: Smartphone, value: "Mobile", label: "First design", body: "Fast and responsive on every screen" },
        { icon: BarChart3, value: "Monthly", label: "Reporting", body: "Traffic, leads and what's next" },
      ],
      phases: [
        {
          title: "Plan",
          items: ["Sitemap and user flows", "Content and wireframes", "Chatbot use cases"],
        },
        {
          title: "Build",
          items: ["Design and development", "AI chatbot setup", "Speed and mobile testing"],
        },
        {
          title: "Launch",
          items: ["Go live with tracking", "Team handover", "Monthly improvements"],
        },
      ],
      cta: {
        title: "Ready for a site that works while you sleep?",
        body: "Tell us what your website needs to do. We'll review your current site and send a written plan within three working days.",
      },
    },
  },
  {
    slug: "social-and-personal-brand",
    icon: UserRoundPlus,
    tagline: "A voice people follow",
    title: "Social and Personal Brand",
    summary: "Social media management and founder-led personal branding that builds trust before the first call.",
    chips: ["Social media management", "Brands/Influencers", "Personal Branding"],
    priceFrom: "₹45,000/month",
    detail: {
      lede: "Social media management and founder-led personal branding that builds trust before the first call.",
      heroNodes: [
        "Social Media Management",
        "Social Media Management — Brands",
        "Personal Branding",
        "Social Media Management — Influencers",
      ],
      notes: {
        reasons: "One team for strategy, creative and execution, so nothing gets lost between agencies.",
        offerings: "Pick one or combine a few. Every service comes with a monthly report and review.",
        results:
          "What you get with Social and Personal Brand: the services, cadence and support behind every result we deliver.",
      },
      offerings: [
        {
          slug: "social-media-management",
          icon: LayoutGrid,
          title: "Social Media Management",
          body: "Content calendar, posting, community replies and monthly reporting across channels.",
          priceFrom: "₹25,000",
          detail: {
            included: [
              { title: "Content calendar", body: "A monthly plan you approve in advance." },
              { title: "Posting and replies", body: "Consistent posting and community management." },
              { title: "Monthly report", body: "Reach, engagement and what's next." },
            ],
          },
        },
        {
          slug: "social-media-management-brands",
          icon: Store,
          title: "Social Media Management — Brands",
          body: "Always-on social for businesses: campaigns, launches and a consistent voice.",
          priceFrom: "₹25,000",
          detail: {
            included: [
              { title: "Brand voice", body: "A consistent tone across every channel." },
              { title: "Campaigns and launches", body: "Content planned around your key moments." },
              { title: "Always-on posting", body: "A steady presence your audience expects." },
            ],
          },
        },
        {
          slug: "social-media-management-influencers",
          icon: UserRoundCheck,
          title: "Social Media Management — Influencers",
          body: "Content planning, posting and growth support for creators and public figures.",
          priceFrom: "₹25,000",
          detail: {
            included: [
              { title: "Content planning", body: "Formats and ideas that suit your audience." },
              { title: "Posting support", body: "Scheduling, captions and hashtags handled." },
              { title: "Growth strategy", body: "Collaborations and trends that build reach." },
            ],
          },
        },
        {
          slug: "personal-branding",
          icon: IdCard,
          title: "Personal Branding",
          body: "Founder and leadership profiles on LinkedIn and Instagram that build trust.",
          priceFrom: "₹20,000",
          detail: {
            included: [
              { title: "Profile makeover", body: "LinkedIn and Instagram profiles that build trust." },
              { title: "Founder content", body: "Posts and scripts written in your voice." },
              { title: "Thought leadership", body: "Ideas and stories that grow your reputation." },
            ],
          },
        },
      ],
      processChecks: [
        "Goals agreed before any work starts",
        "One monthly report, in plain language",
        "The written plan is yours either way",
      ],
      stats: [
        { icon: Layers, value: "4", label: "Service tracks", body: "Brands, influencers and founders" },
        { icon: CalendarDays, value: "Planned", label: "Content calendar", body: "Approved by you before it goes live" },
        { icon: Smartphone, value: "2", label: "Key platforms", body: "LinkedIn and Instagram growth" },
        { icon: BarChart3, value: "Monthly", label: "Reporting", body: "Reach, engagement and next steps" },
      ],
      phases: [
        {
          title: "Plan",
          items: ["Audit of current profiles", "Content pillars and voice", "Monthly calendar for approval"],
        },
        {
          title: "Create",
          items: ["Posts, reels and stories", "Founder content and scripts", "Community replies"],
        },
        {
          title: "Grow",
          items: ["Engagement and follower growth", "Profile optimisation", "Monthly report"],
        },
      ],
      cta: {
        title: "Ready to build an audience that stays?",
        body: "Share your profiles and goals. We'll review what's working and send a written content plan within three working days.",
      },
    },
  },
  {
    slug: "content-and-production",
    icon: Video,
    tagline: "Shot, edited, ready to post",
    title: "Content & Production",
    summary: "Photography, reels, drone and video production, planned on a calendar and delivered ready to publish.",
    chips: ["Video Editing", "Business Video Shoots", "Podcast Shoots"],
    priceFrom: "₹60,000",
    detail: {
      lede: "Photography, reels, drone and video production, planned on a calendar and delivered ready to publish.",
      heroNodes: ["Video Editing", "Podcast Shoots", "Business Video Shoots"],
      notes: {
        reasons: "One team for strategy, creative and execution, so nothing gets lost between agencies.",
        offerings: "Pick one or combine a few. Every service comes with a monthly report and review.",
        results:
          "What you get with Content & Production: the services, cadence and support behind every result we deliver.",
      },
      offerings: [
        {
          slug: "video-editing",
          icon: Film,
          title: "Video Editing",
          body: "Reels, ads and long-form edits with captions, sound design and quick turnaround.",
          priceFrom: "₹12,000",
          detail: {
            included: [
              { title: "Reels and shorts", body: "Fast-paced edits made for the feed." },
              { title: "Ad edits", body: "Hooks, captions and cuts built to convert." },
              { title: "Long-form", body: "YouTube and brand videos with sound design." },
            ],
          },
        },
        {
          slug: "business-video-shoots",
          icon: Video,
          title: "Business Video Shoots",
          // Non-breaking hyphen keeps "in-house" on one line
          body: "Brand films, product videos and testimonials shot by our in‑house crew.",
          priceFrom: "₹12,000",
          detail: {
            included: [
              { title: "Concept and script", body: "A clear story before the camera rolls." },
              { title: "Shoot day", body: "Crew, lighting and direction handled." },
              { title: "Final edits", body: "Delivered in every format you need." },
            ],
          },
        },
        {
          slug: "podcast-shoots",
          icon: Mic,
          title: "Podcast Shoots",
          body: "Multi-camera podcast recording, editing and short clips for every platform.",
          priceFrom: "₹15,000",
          detail: {
            included: [
              { title: "Studio recording", body: "Multi-camera setup with clean audio." },
              { title: "Full episode edit", body: "Polished video and audio ready to publish." },
              { title: "Short clips", body: "Highlights cut for reels and shorts." },
            ],
          },
        },
      ],
      processChecks: [
        "Goals agreed before any work starts",
        "One monthly report, in plain language",
        "The written plan is yours either way",
      ],
      stats: [
        { icon: Layers, value: "3", label: "Production services", body: "Editing, business shoots and podcasts" },
        { icon: Video, value: "In-house", label: "Crew", body: "Shoots handled by our own team" },
        { icon: Mic, value: "Multi-cam", label: "Podcast setup", body: "Recorded, edited and clipped" },
        { icon: Copy, value: "All", label: "Formats", body: "Cut for reels, ads and long-form" },
      ],
      phases: [
        {
          title: "Pre-production",
          items: ["Brief and creative concept", "Scripts and shot list", "Location and crew planning"],
        },
        {
          title: "Production",
          items: ["Shoot or podcast recording", "Multi-camera capture", "Behind-the-scenes content"],
        },
        {
          title: "Post-production",
          items: ["Editing, captions and sound", "Cuts for reels, ads, long-form", "Delivered ready to post"],
        },
      ],
      cta: {
        title: "Got a story worth shooting?",
        body: "Tell us what you want to make. We'll come back with a concept, shot list and a written plan within three working days.",
      },
    },
  },
  {
    slug: "ugc-and-creator-marketing",
    icon: Users,
    tagline: "Real people, real reach",
    title: "UGC & Creator Marketing",
    summary: "Creator partnerships and user-generated videos that feel native to the feed and perform like ads.",
    chips: ["UGC Content", "UGC Outsourcing", "Brand Collaborations"],
    priceFrom: "₹30,000/month",
    detail: {
      lede: "Creator partnerships and user-generated videos that feel native to the feed and perform like ads.",
      heroNodes: ["UGC Content", "UGC Ads", "UGC Promotions", "UGC Outsourcing"],
      notes: {
        reasons: "One team for strategy, creative and execution, so nothing gets lost between agencies.",
        offerings: "Pick one or combine a few. Every service comes with a monthly report and review.",
        results:
          "What you get with UGC & Creator Marketing: the services, cadence and support behind every result we deliver.",
      },
      offerings: [
        {
          slug: "ugc-content",
          icon: Smartphone,
          title: "UGC Content",
          body: "Authentic videos from real creators, made for your ads and social feeds.",
          priceFrom: "₹15,000",
          detail: {
            included: [
              { title: "Creator matching", body: "Creators who fit your product and audience." },
              { title: "Scripts and briefs", body: "Clear direction so every video lands." },
              { title: "Ready-to-post videos", body: "Authentic content for feeds and ads." },
            ],
          },
        },
        {
          slug: "ugc-ads",
          icon: Target,
          title: "UGC Ads",
          body: "Creator-led ads scripted for strong hooks and tested across Meta and YouTube.",
          priceFrom: "₹15,000",
          detail: {
            included: [
              { title: "Hook scripting", body: "Openers written to stop the scroll." },
              { title: "Ad variations", body: "Multiple cuts to test what works." },
              { title: "Performance testing", body: "Winning ads scaled across Meta and YouTube." },
            ],
          },
        },
        {
          slug: "ugc-outsourcing",
          icon: Users,
          title: "UGC Outsourcing",
          body: "We source, brief and manage creators so you get content without the admin.",
          priceFrom: "₹10,000",
          detail: {
            included: [
              { title: "Creator sourcing", body: "We find and vet the right creators." },
              { title: "Briefs and approvals", body: "Every video reviewed before it reaches you." },
              { title: "Delivery and rights", body: "Content delivered with usage rights agreed." },
            ],
          },
        },
        {
          slug: "ugc-promotions",
          icon: TrendingUp,
          title: "UGC Promotions",
          body: "Creators post about your brand on their own channels to reach new audiences.",
          priceFrom: "₹25,000",
          detail: {
            included: [
              { title: "Creator network", body: "Creators who post to their own audiences." },
              { title: "Campaign briefs", body: "Key messages, dos and don'ts." },
              { title: "Reach reporting", body: "Views, clicks and engagement tracked." },
            ],
          },
        },
        {
          slug: "brand-collaborations",
          icon: Blend,
          title: "Brand Collaborations",
          body: "Partnerships with creators and brands that match your audience and goals.",
          priceFrom: "₹25,000",
          detail: {
            included: [
              { title: "Partner matching", body: "Creators and brands aligned with your goals." },
              { title: "Deal management", body: "Terms, deliverables and timelines handled." },
              { title: "Campaign reporting", body: "Results shared after every collaboration." },
            ],
          },
        },
        {
          slug: "experiential-ads",
          icon: Ticket,
          title: "Experiential Ads",
          body: "On-ground activations and events, captured as content for social and ads.",
          priceFrom: "₹25,000",
          detail: {
            included: [
              { title: "Activation planning", body: "Events and pop-ups designed around your brand." },
              { title: "On-ground execution", body: "Setup, staffing and coordination handled." },
              { title: "Content capture", body: "Photos and videos turned into social and ads." },
            ],
          },
        },
      ],
      processChecks: [
        "Goals agreed before any work starts",
        "One monthly report, in plain language",
        "The written plan is yours either way",
      ],
      stats: [
        { icon: Layers, value: "6", label: "Creator services", body: "From UGC ads to experiential" },
        { icon: Users, value: "Real", label: "Creators", body: "Authentic voices your audience trusts" },
        { icon: CircleCheck, value: "Managed", label: "End to end", body: "Sourcing, briefs and approvals" },
        { icon: BarChart3, value: "Monthly", label: "Reporting", body: "Views, clicks and cost per result" },
      ],
      phases: [
        {
          title: "Brief",
          items: ["Goals, audience and hooks", "Creator shortlist", "Scripts and guidelines"],
        },
        {
          title: "Create",
          items: ["Creator shoots", "Review and revisions", "Usage rights agreed"],
        },
        {
          title: "Launch",
          items: ["Ads and organic posts", "Hook and format testing", "Report on cost per result"],
        },
      ],
      roadmapLede: "How this engagement runs, step by step.",
      cta: {
        title: "Ready to give your brand a voice?",
        body: "Tell us your product and audience. We'll suggest creators, hooks and a written plan within three working days.",
      },
    },
  },
];

export type ServicePageWithDetail = ServicePage & { detail: ServicePageDetail };

export const getServicePage = (slug: string) =>
  SERVICE_PAGES.find((s): s is ServicePageWithDetail => s.slug === slug && !!s.detail);

export const servicePageHref = (s: ServicePage) => (s.detail ? `/services/${s.slug}` : (s.fallbackHref ?? "/services"));

export type OfferingPage = { service: ServicePageWithDetail; offering: ServiceOffering & { detail: OfferingDetail } };

export const getOfferingPage = (serviceSlug: string, offeringSlug: string): OfferingPage | undefined => {
  const service = getServicePage(serviceSlug);
  const offering = service?.detail.offerings.find((o) => o.slug === offeringSlug);
  return service && offering?.detail ? { service, offering: { ...offering, detail: offering.detail } } : undefined;
};

/** An offering's own page when it has one, otherwise the contact form. */
export const offeringHref = (service: ServicePage, offering: ServiceOffering) =>
  offering.detail ? `/services/${service.slug}/${offering.slug}` : "/contact";

export type CaseStudyDetail = {
  slug: string;
  title: string;
  client: string;
  industry: string;
  headline: string;
  metric: string;
  metricLabel: string;
  summary: string;
  challenge: string[];
  approach: { title: string; body: string }[];
  results: { value: string; label: string }[];
  quote?: { text: string; author: string; role: string };
  services: string[];
  accent: [string, string];
};

export const CASE_STUDIES: CaseStudyDetail[] = [
  {
    slug: "atria-living-tower-c",
    title: "Turning a tower launch into booked site visits",
    client: "Atria Living",
    industry: "Real estate · Bengaluru",
    headline: "312% more site visits booked in one launch quarter",
    metric: "312%",
    metricLabel: "More site visits booked",
    summary:
      "A residential developer with strong inventory and a broken enquiry process. We rebuilt the whole chain from aerial film to first WhatsApp message.",
    challenge: [
      "Atria Living was spending steadily on Meta and generating a healthy volume of form fills. The problem showed up further down: fewer than one in fifteen enquiries turned into an actual site visit.",
      "Two things were causing it. Enquiries landed in a shared inbox checked twice a day, so the average first response was over eleven hours. And the ads pointed at the corporate homepage, where a buyer had to hunt for the project among four others.",
    ],
    approach: [
      { title: "Rebuilt the tracking first", body: "Conversions API, offline conversion imports from the CRM, and a definition of 'lead' that meant a contactable person rather than a submitted form." },
      { title: "Produced the film in one window", body: "Drone, gimbal walkthrough and stills captured across two days, cut into a launch film and fifteen short vertical edits." },
      { title: "Built a single-project microsite", body: "Floor plans, pricing enquiry, locality context and a form that asked for three fields instead of seven." },
      { title: "Automated the first response", body: "WhatsApp confirmation inside 60 seconds, then routing to a named pre-sales executive with a two-hour escalation timer." },
      { title: "Optimised against site visits", body: "Campaigns judged on cost per booked visit, not cost per lead - which changed which creative won." },
    ],
    results: [
      { value: "312%", label: "More site visits booked" },
      { value: "<60s", label: "First response time" },
      { value: "11%", label: "Microsite form conversion" },
      { value: "−38%", label: "Cost per booked visit" },
    ],
    quote: {
      text: "They rebuilt our enquiry flow in the first fortnight. Same ad budget, but the sales team stopped chasing dead numbers because leads now arrive with a WhatsApp reply already sent.",
      author: "Rohan S.",
      role: "Sales Head, residential developer",
    },
    services: ["real-estate-marketing", "performance-marketing", "automation-crm", "web-app-development"],
    accent: ["#121F2F", "#1F3B56"],
  },
  {
    slug: "restaurant-group-ratings",
    title: "Lifting six outlets from 3.9 to 4.8 stars",
    client: "Restaurant group",
    industry: "Hospitality · 6 outlets",
    headline: "Google rating lifted across every location",
    metric: "4.8★",
    metricLabel: "Average rating achieved",
    summary:
      "A six-outlet group losing delivery and discovery traffic to a rating that didn't reflect the food. We changed who got asked to review, and when.",
    challenge: [
      "The group's rating had sat around 3.9 for two years. Management assumed it was a service problem, but the pattern told a different story: satisfied diners left quietly, while anyone with a complaint went straight to Google.",
      "Nobody was asking happy customers to review, and complaints reached the outlet manager days later - if at all.",
    ],
    approach: [
      { title: "Table and bill QR codes", body: "A code on every table and printed on the bill, asking one question: how did it go?" },
      { title: "Split the routes", body: "Positive feedback got a Google prompt with editable suggested copy. Anything below four stars went to the outlet manager's phone immediately." },
      { title: "Per-outlet dashboards", body: "Ratings, response rates and complaint themes broken out by location, so the group could see which kitchen needed attention." },
      { title: "Google Business Profile rebuild", body: "Categories, attributes, service areas and a photo library refreshed monthly." },
      { title: "Weekly operations report", body: "A Monday email listing every complaint from the previous week and whether it was resolved." },
    ],
    results: [
      { value: "4.8★", label: "Average rating, all outlets" },
      { value: "6×", label: "Review volume increase" },
      { value: "+52%", label: "Maps discovery views" },
      { value: "2 days", label: "To resolve a complaint, from 9" },
    ],
    quote: {
      text: "The QR dashboard settled an argument we'd had for two years - we finally know which outlet and which table actually drive reviews.",
      author: "Anita K.",
      role: "Director, restaurant group",
    },
    services: ["seo-local-search", "social-content"],
    accent: ["#1F3B56", "#8BB72C"],
  },
  {
    slug: "d2c-beauty-creative-velocity",
    title: "Cutting acquisition cost by refreshing creative weekly",
    client: "D2C beauty brand",
    industry: "Ecommerce · Pan-India",
    headline: "41% lower cost per acquisition on the same budget",
    metric: "−41%",
    metricLabel: "Cost per acquisition",
    summary:
      "A beauty brand shooting quarterly and wondering why performance decayed every six weeks. We replaced the shoot calendar with a generation pipeline.",
    challenge: [
      "The brand ran two studio days a quarter, producing around 60 usable images. By week six of each quarter, creative fatigue had pushed CPA up by a third, and there was nothing new to rotate in.",
      "Shooting more often wasn't viable - model booking, studio hire and retouching made each day expensive enough that quarterly was already a stretch.",
    ],
    approach: [
      { title: "Built an AI generation pipeline", body: "Products composited from real photography into generated lifestyle scenes, art-directed to the brand's existing look." },
      { title: "Human retouching on every frame", body: "Product accuracy checked and corrected by a retoucher before anything shipped to the ad account." },
      { title: "Structured weekly testing", body: "Four new concepts a week in controlled tests rather than dumping variants into one ad set." },
      { title: "Winner scaling rules", body: "Written thresholds for when a creative graduates to the scaling campaign and when it retires." },
      { title: "Seeded the winners to creators", body: "Concepts that worked in paid were briefed to creators for UGC versions." },
    ],
    results: [
      { value: "−41%", label: "Cost per acquisition" },
      { value: "420", label: "Images in the first batch" },
      { value: "Weekly", label: "Creative refresh cadence" },
      { value: "3 days", label: "Concept to live ad" },
    ],
    quote: {
      text: "What I value most is the reporting. It's one page, it's honest, and when something underperformed they say so before I have to ask.",
      author: "Meera V.",
      role: "Founder, D2C beauty brand",
    },
    services: ["ai-creative", "performance-marketing", "social-content"],
    accent: ["#203348", "#6D961F"],
  },
];

export const getCaseStudy = (slug: string) => CASE_STUDIES.find((c) => c.slug === slug);

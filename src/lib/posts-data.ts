export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  publishedAt: string;
  author: string;
  body: { heading?: string; paragraphs: string[] }[];
};

export const POSTS: Post[] = [
  {
    slug: "why-your-leads-go-cold",
    title: "Why your leads go cold in the first hour",
    excerpt:
      "Response time predicts conversion better than almost anything else in the funnel, and most businesses measure it in hours rather than seconds.",
    category: "Automation",
    readTime: "6 min read",
    publishedAt: "2026-07-28",
    author: "Divya Nair",
    body: [
      {
        paragraphs: [
          "When we audit a new client's funnel, the first number we look for isn't cost per lead. It's the gap between a form submission and the first human contact. In roughly four out of five accounts we inherit, that gap is measured in hours.",
          "That single number explains more lost revenue than creative quality, targeting or budget ever does.",
        ],
      },
      {
        heading: "Interest has a half-life",
        paragraphs: [
          "Someone filling in an enquiry form is usually doing it while comparing options. They have three or four tabs open. Whoever responds first gets the conversation, and often the sale, regardless of who had the better offer.",
          "By the time a callback arrives the next morning, the buyer has either moved on or already spoken to a competitor. The lead still exists in the CRM, but the moment is gone.",
        ],
      },
      {
        heading: "Automate the first touch, not the whole conversation",
        paragraphs: [
          "The fix isn't a chatbot that tries to close the deal. It's an immediate acknowledgement that a real person is coming, sent within seconds, on a channel the buyer actually reads.",
          "In India that's WhatsApp. A confirmation message with the enquiry details, the name of the executive who'll call, and a rough timeframe does most of the work. It buys you the two hours your sales team actually needs.",
        ],
      },
      {
        heading: "Then measure it",
        paragraphs: [
          "Add first-response time to your weekly sales review alongside lead volume. If it isn't measured, it drifts back within a month.",
          "Set an escalation rule as well: any lead untouched after a fixed window reassigns automatically. Not as punishment, but because unassigned leads are the ones that quietly disappear.",
        ],
      },
    ],
  },
  {
    slug: "google-rating-is-marketing",
    title: "Your Google rating is a marketing channel",
    excerpt:
      "For proximity businesses, the difference between 3.9 and 4.6 stars affects discovery more than any campaign you can buy.",
    category: "Local SEO",
    readTime: "5 min read",
    publishedAt: "2026-07-14",
    author: "Aditya Kulkarni",
    body: [
      {
        paragraphs: [
          "Restaurants, clinics, salons and showrooms all share a trait: almost every customer is deciding between options within a few kilometres. The comparison happens on Google Maps, and it takes about four seconds.",
          "In those four seconds, the rating does nearly all the work.",
        ],
      },
      {
        heading: "The rating isn't a measure of quality",
        paragraphs: [
          "It's a measure of who was asked. Satisfied customers rarely review unprompted. Dissatisfied ones almost always do. Left alone, that asymmetry pulls every business toward a rating lower than it deserves.",
          "The businesses sitting at 4.6 aren't necessarily better. They're the ones that ask everybody.",
        ],
      },
      {
        heading: "Ask everyone, route by sentiment",
        paragraphs: [
          "The approach that works is simple and permitted: ask every customer for feedback, then send happy ones toward a public review and route complaints to your own inbox.",
          "This isn't filtering - everyone can still post publicly. You're just making sure a complaint reaches the person who can fix it, rather than only reaching future customers.",
        ],
      },
      {
        heading: "Photos matter more than most people think",
        paragraphs: [
          "Profiles with recent, high-quality photos get materially more discovery views. Most businesses upload once at launch and never again.",
          "A monthly photo refresh costs almost nothing and keeps the profile active in a way the algorithm notices.",
        ],
      },
    ],
  },
  {
    slug: "ai-imagery-what-still-needs-humans",
    title: "AI product imagery: what still needs a human",
    excerpt:
      "Generation solves the shoot-day bottleneck. It doesn't solve art direction, product accuracy or knowing which image to ship.",
    category: "AI",
    readTime: "7 min read",
    publishedAt: "2026-06-30",
    author: "Sana Fernandes",
    body: [
      {
        paragraphs: [
          "We generate a lot of catalogue imagery. It has genuinely changed what's economically possible for a D2C brand - weekly creative refresh instead of quarterly. But the tooling has created a specific failure mode worth naming.",
          "The failure isn't bad images. It's plausible images that misrepresent the product.",
        ],
      },
      {
        heading: "The product must be real",
        paragraphs: [
          "We never generate the product itself. Every delivered image composites the actual product photography into a generated scene, then a retoucher checks colour, proportion, texture and label accuracy against the physical item.",
          "A generated bottle that's subtly the wrong shade is a returns problem and, depending on the claim, a legal one.",
        ],
      },
      {
        heading: "Art direction is still the job",
        paragraphs: [
          "Given no direction, generation tools converge on the same glossy, over-lit look. Fifty images that all feel like stock photography aren't more useful than five that look like your brand.",
          "We start every batch the same way we'd start a physical shoot: references, lighting notes, styling, mood. The tool changes the production step, not the thinking step.",
        ],
      },
      {
        heading: "Curation is where the value sits",
        paragraphs: [
          "Generating widely is cheap. Knowing which twelve images out of two hundred are worth putting behind media spend is not.",
          "That judgement - which frames read as authentic, which will fatigue quickly, which fit the funnel stage - is the part that still takes a person who has watched a lot of ad accounts.",
        ],
      },
    ],
  },
  {
    slug: "what-a-monthly-report-should-say",
    title: "What a marketing report should actually say",
    excerpt:
      "Most agency reports are dashboards with commentary. A useful report answers three questions and admits when something failed.",
    category: "Reporting",
    readTime: "4 min read",
    publishedAt: "2026-06-16",
    author: "Divya Nair",
    body: [
      {
        paragraphs: [
          "A monthly report shouldn't take forty slides. If it does, it's usually hiding something in the volume.",
          "Three questions matter, and they're the same every month.",
        ],
      },
      {
        heading: "What did we spend, and what came back?",
        paragraphs: [
          "Spend, leads, cost per lead, and - wherever the CRM allows it - revenue attributed. Compared to last month and to the same month last year if the data exists.",
          "If attribution is incomplete, say which part is estimated rather than presenting a clean number that isn't.",
        ],
      },
      {
        heading: "What didn't work?",
        paragraphs: [
          "Every month has something that underperformed. A report with no failures in it is a report that isn't testing anything, or isn't being honest.",
          "Naming the failure and what it taught you is more useful to a client than another chart trending up.",
        ],
      },
      {
        heading: "What changes next month?",
        paragraphs: [
          "A short list of specific decisions with owners and dates. Not 'continue optimising' - that isn't a decision.",
          "If the client reads only this section, they should still know exactly what they're paying for over the next thirty days.",
        ],
      },
    ],
  },
];

export const getPost = (slug: string) => POSTS.find((p) => p.slug === slug);

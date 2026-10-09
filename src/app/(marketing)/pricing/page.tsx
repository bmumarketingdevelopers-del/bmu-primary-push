import type { Metadata } from "next";
import styles from "./page.module.css";
import { PlanExplorer, type PlanService } from "./plan-explorer";
import { PageHero } from "@/components/marketing/page-hero";
import { cn } from "@/lib/utils";

/* ---- New pricing plans (page-only, from the design). Every service has the same three plans;
   each price is [Starter, Growth, Premium]: monthly fee, 6-month "Now @" price, crossed-out price.
   More categories will be added here one by one. */

const PLANS = [
  { name: "Starter", desc: "Essential execution to start or test the channel.", featured: false },
  { name: "Growth", desc: "Consistent execution for businesses actively scaling.", featured: true },
  { name: "Premium", desc: "High-volume, high-touch execution for established brands.", featured: false },
];

// Social Media Management (and its Brands / Influencers versions): same prices, own feature lists
const SOCIAL_MEDIA: { name: string; features: [string[], string[], string[]] }[] = [
  {
    name: "Social Media Management",
    features: [
      [
        "3 platforms",
        "4 posts",
        "8 reels",
        "8 stories",
        "captions",
        "hashtag research",
        "content calendar",
        "basic engagement",
        "monthly report",
      ],
      [
        "3 platforms",
        "8 posts",
        "16 reels",
        "16 stories",
        "content strategy",
        "calendar",
        "captions",
        "hashtag strategy",
        "community management",
        "trend research",
        "competitor analysis",
        "strategy call",
        "detailed report",
      ],
      [
        "3 platforms",
        "16 posts",
        "30 reels",
        "30 stories",
        "advanced strategy",
        "community management",
        "trend content",
        "campaigns",
        "optimization",
        "competitor monitoring",
        "shoot coordination",
        "weekly reporting",
        "account manager",
      ],
    ],
  },
  {
    name: "Social Media Management - Brands",
    features: [
      [
        "1 platform",
        "upto 4 posts",
        "upto 8 reels",
        "calendar",
        "captions",
        "hashtags",
        "basic community management",
        "brand positioning",
      ],
      [
        "Instagram + LinkedIn/YouTube",
        "upto 8 posts",
        "upto 16 reels",
        "stories",
        "positioning",
        "strategy",
        "community management",
        "collaboration strategy",
        "analytics",
        "campaign content",
      ],
      [
        "3-4 platforms",
        "upto 16 posts",
        "upto 30 reels",
        "stories",
        "strategy",
        "positioning",
        "community management",
        "influencer/brand collaborations",
        "campaigns",
        "weekly reporting",
        "brand campaigns",
      ],
    ],
  },
  {
    name: "Social Media Management - Influencers",
    features: [
      [
        "1 platform",
        "upto 4 posts",
        "upto 8 reels",
        "calendar",
        "captions",
        "hashtags",
        "basic community management",
        "creator positioning",
      ],
      [
        "Instagram + LinkedIn/YouTube",
        "upto 8 posts",
        "upto 16 reels",
        "stories",
        "positioning",
        "strategy",
        "community management",
        "collaboration strategy",
        "analytics",
        "brand collaboration outreach",
      ],
      [
        "3-4 platforms",
        "upto 16 posts",
        "upto 30 reels",
        "stories",
        "strategy",
        "positioning",
        "community management",
        "influencer/brand collaborations",
        "campaigns",
        "weekly reporting",
        "collaboration pipeline management",
      ],
    ],
  },
];

// A service with `features` ([Starter, Growth, Premium] lists) expands on "Explore".
// `need` is its "What do you need first?" option on the Contact form (pre-filled from the plan).
const CATEGORIES: { title: string; services: PlanService[] }[] = [
  {
    title: "Marketing & Visibility",
    services: [
      {
        name: "Digital Marketing",
        need: "Marketing and Visibility - Digital Marketing",
        prices: [
          { monthly: "23,800", now: "1,42,800", was: "1,52,800" },
          { monthly: "47,500", now: "2,85,000", was: "2,95,000" },
          { monthly: "95,000", now: "5,70,000", was: "5,80,000" },
        ],
        features: [
          [
            "Digital strategy",
            "basic social management",
            "basic SEO",
            "GMB",
            "basic lead generation",
            "Analytics",
            "monthly reporting",
          ],
          [
            "Complete digital strategy",
            "SEO",
            "SMM",
            "Google Ads management",
            "Meta Ads management",
            "lead generation",
            "landing-page strategy",
            "remarketing",
            "conversion tracking",
            "competitor analysis",
            "monthly strategy",
          ],
          [
            "Complete growth strategy",
            "SEO",
            "SMM",
            "Google Ads",
            "Meta Ads",
            "lead generation",
            "retargeting",
            "conversion optimization",
            "landing pages",
            "automation",
            "analytics dashboard",
            "funnel optimization",
            "weekly reviews",
            "ChatGPT ads",
            "Jio ads",
          ],
        ],
      },
      {
        name: "ChatGPT Ads",
        need: "Marketing and Visibility - ChatGPT Ads",
        prices: [
          { monthly: "19,000", now: "1,14,000", was: "1,24,000" },
          { monthly: "38,000", now: "2,28,000", was: "2,38,000" },
          { monthly: "71,200", now: "4,27,200", was: "4,37,200" },
        ],
        features: [
          [
            "account and campaign setup",
            "audience and intent targeting",
            "ad copy",
            "landing-page alignment",
            "conversion tracking",
            "monthly report",
          ],
          [
            "campaign strategy",
            "multiple campaigns",
            "creative and copy variations",
            "audience testing",
            "bid and budget management",
            "conversion tracking",
            "optimisation",
            "monthly strategy",
            "performance report",
          ],
          [
            "full-funnel strategy",
            "campaign management",
            "creative testing",
            "advanced intent targeting",
            "retargeting",
            "conversion optimisation",
            "alignment with Google and Meta campaigns",
            "analytics dashboard",
            "weekly reviews",
          ],
        ],
      },
      {
        name: "SEO",
        need: "Marketing and Visibility - SEO",
        prices: [
          { monthly: "14,200", now: "85,200", was: "95,200" },
          { monthly: "28,500", now: "1,71,000", was: "1,81,000" },
          { monthly: "57,000", now: "3,42,000", was: "3,52,000" },
        ],
        features: [
          [
            "SEO audit",
            "5 keywords",
            "on-page SEO",
            "meta titles/descriptions",
            "basic technical SEO",
            "Search Console",
            "Analytics",
            "5 backlinks",
            "monthly report",
            "5 blogs",
          ],
          [
            "Complete audit",
            "15 keywords",
            "on-page + technical SEO",
            "content optimization",
            "15 backlinks",
            "competitor analysis",
            "local SEO",
            "internal linking",
            "Search Console",
            "monthly strategy",
            "ranking report",
            "15 blogs",
            "AEO (answer engine optimisation)",
            "GEO (generative engine optimisation)",
          ],
          [
            "30+ keywords",
            "advanced technical SEO",
            "30+ backlinks",
            "content strategy",
            "competitor SEO",
            "local SEO",
            "conversion-focused SEO",
            "schema",
            "authority building",
            "strategy",
            "detailed report",
            "30 blogs",
            "AEO (answer engine optimisation)",
            "GEO (generative engine optimisation)",
            "e-commerce SEO",
          ],
        ],
      },
      {
        name: "Google Business Profile",
        need: "Marketing and Visibility - Google Business Profile",
        prices: [
          { monthly: "7,100", now: "42,600", was: "52,600" },
          { monthly: "14,200", now: "85,200", was: "95,200" },
          { monthly: "23,800", now: "1,42,800", was: "1,52,800" },
        ],
        features: [
          [
            "Profile optimization",
            "category optimization",
            "business information",
            "4 posts",
            "review monitoring",
            "basic local SEO",
            "monthly report",
          ],
          [
            "Complete GMB optimization",
            "8 posts",
            "review management",
            "local keywords",
            "competitor analysis",
            "photo/content optimization",
            "Q&A",
            "monthly report",
            "1-3 location targeting",
            "2-4 keyword targeting",
          ],
          [
            "Complete local SEO",
            "GMB management",
            "12+ posts",
            "review strategy",
            "responses",
            "competitor monitoring",
            "local citations",
            "local ranking strategy",
            "multi-location support",
            "advanced reporting",
            "4-5 location targeting",
            "5-6 keyword targeting",
          ],
        ],
      },
    ],
  },
  {
    title: "Brand & Design",
    services: [
      {
        // one-time project prices (no monthly fee or 6-month price); Premium starts "From"
        name: "Complete Branding",
        need: "Brand & design - Complete Branding",
        prices: [
          { monthly: "38,000", oneTime: true },
          { monthly: "71,200", oneTime: true },
          { monthly: "1,42,500", oneTime: true, from: true },
        ],
        features: [
          [
            "Brand discovery",
            "logo",
            "colours",
            "typography",
            "business card",
            "social profile branding",
            "basic guide",
          ],
          [
            "Brand strategy",
            "logo system",
            "colour system",
            "typography",
            "elements",
            "stationery",
            "social kit",
            "marketing collateral",
            "brand guidelines",
          ],
          [
            "Brand strategy",
            "positioning",
            "logo system",
            "colour/typography",
            "iconography",
            "patterns",
            "packaging direction",
            "social identity",
            "collateral",
            "stationery",
            "brand book",
            "launch creative direction",
          ],
        ],
      },
      {
        // one-time project prices (match the brochure)
        name: "Logo & Brand Kit",
        need: "Brand & design - Logo & Brand Kit",
        prices: [
          { monthly: "14,200", oneTime: true },
          { monthly: "28,500", oneTime: true },
          { monthly: "57,000", oneTime: true },
        ],
        features: [
          ["2 logo concepts", "2 revisions", "primary logo", "secondary logo", "colour palette", "typography", "PNG/JPG files"],
          [
            "3 logo concepts",
            "3 revisions",
            "primary/secondary logo",
            "icon/mark",
            "colour palette",
            "typography",
            "brand elements",
            "social profile kit",
            "business card",
            "basic brand guide",
          ],
          [
            "Complete logo exploration",
            "multiple concepts",
            "reasonable revisions",
            "primary/secondary logo",
            "logo mark",
            "colour system",
            "typography",
            "patterns",
            "iconography",
            "social kit",
            "stationery",
            "brand guidelines",
          ],
        ],
      },
      {
        // prices match the brochure (Premium 6-month ₹2,28,000 = 6 × ₹38,000)
        name: "Graphic Designing",
        need: "Brand & design - Graphic Designing",
        prices: [
          { monthly: "9,500", now: "57,000", was: "67,000" },
          { monthly: "19,000", now: "1,14,000", was: "1,24,000" },
          { monthly: "38,000", now: "2,28,000", was: "2,38,000" },
        ],
        features: [
          ["10 designs", "social posts", "promotional creatives", "2 revisions/design", "basic creative direction"],
          [
            "20 designs",
            "social creatives",
            "carousels",
            "promotional designs",
            "festival creatives",
            "ad creatives",
            "2-3 revisions",
            "creative strategy",
          ],
          [
            "40 designs",
            "social creatives",
            "ad creatives",
            "carousels",
            "campaign creatives",
            "marketing collateral",
            "promotional material",
            "advanced design direction",
            "priority delivery",
          ],
        ],
      },
    ],
  },
  {
    title: "Web & AI",
    services: [
      {
        // one-time project prices (match the brochure); Premium starts "From"
        name: "Website Design & Development",
        need: "Web & AI - Website Design & Development",
        prices: [
          { monthly: "23,800", oneTime: true },
          { monthly: "57,000", oneTime: true },
          { monthly: "1,18,800", oneTime: true, from: true },
        ],
        features: [
          [
            "1-4 pages",
            "responsive design",
            "contact form",
            "WhatsApp button",
            "basic SEO",
            "Analytics",
            "basic speed optimization",
            "no custom dashboard",
          ],
          [
            "Up to 7 pages",
            "custom UI/UX",
            "responsive design",
            "forms",
            "WhatsApp",
            "basic CMS",
            "SEO setup",
            "Analytics",
            "Search Console",
            "speed optimization",
            "custom dashboard",
            "AI integration",
            "website maintenance – 1 year free",
          ],
          [
            "10-20+ pages",
            "custom UI/UX",
            "CMS",
            "advanced forms",
            "WhatsApp",
            "payment integration",
            "booking",
            "advanced SEO",
            "Analytics",
            "conversion optimization",
            "integrations",
            "advanced dashboard",
            "website maintenance – 1 year free",
          ],
        ],
      },
      {
        // one-time project prices (match the brochure); Premium starts "From"
        name: "AI Chatbots",
        need: "Web & AI - AI Chatbots",
        prices: [
          { monthly: "9,500", oneTime: true },
          { monthly: "23,800", oneTime: true },
          { monthly: "47,500", oneTime: true, from: true },
        ],
        features: [
          ["Basic chatbot", "FAQs", "lead collection", "website integration", "basic flow"],
          [
            "Advanced chatbot",
            "lead qualification",
            "multiple flows",
            "WhatsApp",
            "website",
            "Sheets/CRM integration",
            "automated follow-ups",
          ],
          [
            "AI chatbot",
            "advanced conversational flows",
            "lead qualification",
            "WhatsApp automation",
            "CRM/API integrations",
            "follow-ups",
            "booking flow",
            "analytics",
            "optimization",
          ],
        ],
      },
    ],
  },
  {
    title: "Social & Personal Brand",
    services: [
      // the three Social Media Management services share the same prices (match the brochure);
      // each card has a without-shoot and a with-shoot price, and its own feature lists
      ...SOCIAL_MEDIA.map(
        ({ name, features }): PlanService => ({
          name: name.replace(" - ", " — "),
          need: `Social and Personal Brand - ${name}`,
          prices: [
            { monthly: "23,800", six: "1,42,800", withShoot: { monthly: "33,200", six: "1,99,200", sessions: 1 } },
            { monthly: "42,800", six: "2,56,800", withShoot: { monthly: "52,200", six: "3,13,200", sessions: 2 } },
            { monthly: "61,800", six: "3,70,800", withShoot: { monthly: "71,200", six: "4,27,200", sessions: 3 } },
          ],
          features,
        }),
      ),
      {
        // prices match the brochure (Premium ₹71,200/m, 6-month ₹4,27,200)
        name: "Personal Branding",
        need: "Social and Personal Brand - Personal Branding",
        prices: [
          { monthly: "19,000", now: "1,14,000", was: "1,24,000" },
          { monthly: "38,000", now: "2,28,000", was: "2,38,000" },
          { monthly: "71,200", now: "4,27,200", was: "4,37,200" },
        ],
        features: [
          [
            "Personal brand strategy",
            "3 platforms",
            "profile optimization",
            "content pillars",
            "4 posts",
            "8 reels",
            "caption support",
            "basic calendar",
          ],
          [
            "Brand strategy",
            "founder positioning",
            "3 platforms",
            "8 posts",
            "16 reels",
            "calendar",
            "scripting",
            "profile optimization",
            "monthly analytics",
          ],
          [
            "Complete strategy",
            "founder positioning",
            "Instagram",
            "LinkedIn",
            "YouTube strategy",
            "30 reels",
            "thought leadership",
            "video/podcast content",
            "founder shoots",
            "collaborations",
            "weekly strategy",
          ],
        ],
      },
    ],
  },
  {
    title: "Content & Production",
    services: [
      {
        // prices match the brochure
        name: "Video Editing",
        need: "Content & Production - Video Editing",
        prices: [
          { monthly: "11,400", now: "68,400", was: "78,400" },
          { monthly: "23,800", now: "1,42,800", was: "1,52,800" },
          { monthly: "47,500", now: "2,85,000", was: "2,95,000" },
        ],
        features: [
          ["8 short-form videos", "basic cuts", "music", "captions", "basic transitions", "basic colour correction"],
          [
            "15 short-form videos",
            "advanced editing",
            "motion graphics",
            "captions",
            "sound design",
            "colour correction",
            "trending formats",
            "thumbnail support",
          ],
          [
            "30 short-form videos",
            "advanced motion graphics",
            "cinematic editing",
            "sound design",
            "advanced colour grading",
            "storytelling",
            "YouTube videos",
            "reels",
            "ads",
            "priority editing",
          ],
        ],
      },
      {
        // priced per shoot (no "/m"), match the brochure; Premium starts "From"
        name: "Business Video Shoots",
        need: "Content & Production - Business Video Shoots",
        prices: [
          { monthly: "11,400", perShoot: true },
          { monthly: "23,800", perShoot: true },
          { monthly: "47,500", perShoot: true, from: true },
        ],
        features: [
          ["Up to 2 hours", "basic camera", "1 location", "3 edited reels", "basic photography", "colour correction"],
          [
            "Up to 4 hours",
            "professional camera",
            "lighting",
            "1 location",
            "6 reels",
            "product/service shots",
            "photography",
            "advanced editing",
          ],
          [
            "Full-day production",
            "multiple cameras",
            "professional lighting",
            "creative direction",
            "cinematic shots",
            "10-15 reels",
            "promotional video",
            "photography",
            "drone where applicable",
            "advanced editing",
          ],
        ],
      },
      {
        // priced per 3-hour session (no "/m"), match the brochure; Premium starts "From"
        // (the design showed ₹47,000, the brochure says From ₹47,500)
        name: "Podcast Shoots",
        need: "Content & Production - Podcast Shoots",
        prices: [
          { monthly: "14,200", perSession: "3 hrs" },
          { monthly: "28,500", perSession: "3 hrs" },
          { monthly: "47,500", perSession: "3 hrs", from: true },
        ],
        features: [
          ["1 camera", "basic lighting", "audio", "shoot", "basic edit", "2 clips"],
          [
            "2 cameras",
            "professional lighting/audio",
            "multi-camera setup",
            "full episode edit",
            "5 clips",
            "thumbnail",
            "basic graphics",
          ],
          [
            "3 cameras",
            "premium lighting/audio",
            "multi-camera production",
            "full episode edit",
            "10+ clips",
            "motion graphics",
            "thumbnail",
            "YouTube optimization",
            "podcast branding",
          ],
        ],
      },
    ],
  },
  {
    title: "UGC & Creator Marketing",
    services: [
      {
        // prices match the brochure
        name: "UGC Content",
        need: "UGC & Creator Marketing - UGC Content",
        prices: [
          { monthly: "14,200", now: "85,200", was: "95,200" },
          { monthly: "28,500", now: "1,71,000", was: "1,81,000" },
          { monthly: "57,000", now: "3,42,000", was: "3,52,000" },
        ],
        features: [
          ["3 UGC videos", "creator sourcing", "basic scripts", "product/service briefing", "editing", "1 revision/video"],
          [
            "6 UGC videos",
            "multiple creators",
            "scripts",
            "hooks",
            "demos",
            "testimonials",
            "editing",
            "captions",
            "2 revisions/video",
          ],
          [
            "12-15 UGC videos",
            "multiple creators",
            "multiple concepts",
            "advanced scripts",
            "hooks/CTAs",
            "demos",
            "testimonials",
            "ad variations",
            "editing",
            "creative strategy",
            "iteration",
          ],
        ],
      },
      {
        // prices match the brochure (Premium 6-month ₹3,42,000 = 6 × ₹57,000)
        name: "UGC Ads",
        need: "UGC & Creator Marketing - UGC Ads",
        prices: [
          { monthly: "14,200", now: "85,200", was: "95,200" },
          { monthly: "28,500", now: "1,71,000", was: "1,81,000" },
          { monthly: "57,000", now: "3,42,000", was: "3,52,000" },
        ],
        features: [
          ["3 UGC ad creatives", "hooks", "basic scripts", "editing", "CTA variations"],
          [
            "6 UGC ad creatives",
            "multiple hooks",
            "CTAs",
            "2-3 concepts",
            "creator coordination",
            "ad-ready editing",
            "creative testing",
          ],
          [
            "12 UGC ad creatives",
            "multiple creators",
            "concepts",
            "hook/CTA testing",
            "A/B variations",
            "ad editing",
            "performance analysis",
            "optimization",
          ],
        ],
      },
      {
        // prices match the brochure
        name: "UGC Outsourcing",
        need: "UGC & Creator Marketing - UGC Outsourcing",
        prices: [
          { monthly: "9,500", now: "57,000", was: "67,000" },
          { monthly: "19,000", now: "1,14,000", was: "1,24,000" },
          { monthly: "38,000", now: "2,28,000", was: "2,38,000" },
        ],
        features: [
          ["Creator research", "7 creator options", "outreach", "negotiation support", "campaign coordination"],
          [
            "15 creator options",
            "outreach",
            "negotiation",
            "briefs",
            "coordination",
            "content collection",
            "campaign tracking",
          ],
          [
            "30+ creator options",
            "large-scale outreach",
            "negotiations",
            "strategy",
            "briefing",
            "contracts/coordination support",
            "tracking",
            "performance analysis",
            "reporting",
          ],
        ],
      },
      {
        // prices match the brochure
        name: "UGC Promotions",
        need: "UGC & Creator Marketing - UGC Promotions",
        prices: [
          { monthly: "23,800", now: "1,42,800", was: "1,52,800" },
          { monthly: "38,000", now: "2,28,000", was: "2,38,000" },
          { monthly: "76,000", now: "4,56,000", was: "4,66,000" },
        ],
        features: [
          ["5 creators", "outreach", "product/service briefing", "content coordination", "basic campaign management"],
          [
            "10 creators",
            "sourcing",
            "campaign strategy",
            "briefing",
            "content collection",
            "posting coordination",
            "performance tracking",
          ],
          [
            "15 creators",
            "large-scale strategy",
            "creator management",
            "multiple formats",
            "paid + organic UGC",
            "performance tracking",
            "optimization",
            "reporting",
          ],
        ],
      },
      {
        // priced per campaign (no "/m"), match the brochure; Premium starts "From"
        // (the design showed Starter ₹23,000, the brochure says ₹23,800)
        name: "Brand Collaborations",
        need: "UGC & Creator Marketing - Brand Collaborations",
        prices: [
          { monthly: "23,800", perCampaign: true },
          { monthly: "38,000", perCampaign: true },
          { monthly: "76,000", perCampaign: true, from: true },
        ],
        features: [
          ["Collaboration strategy", "10 potential brands", "outreach", "negotiation support", "campaign coordination"],
          [
            "20 potential brands",
            "outreach",
            "negotiation",
            "proposals",
            "coordination",
            "content coordination",
            "performance report",
          ],
          [
            "30 target brands",
            "partnerships",
            "outreach",
            "negotiation",
            "campaign management",
            "cross-promotions",
            "influencer integration",
            "content coordination",
            "reporting",
          ],
        ],
      },
      {
        // priced per campaign (no "/m"), match the brochure; Premium starts "From"
        name: "Experiential Ads",
        need: "UGC & Creator Marketing - Experiential Ads",
        prices: [
          { monthly: "23,800", perCampaign: true },
          { monthly: "47,500", perCampaign: true },
          { monthly: "95,000", perCampaign: true, from: true },
        ],
        features: [
          [
            "Campaign idea",
            "audience research",
            "creative concept",
            "local activation strategy",
            "basic campaign plan",
            "social amplification, 2 creators",
          ],
          [
            "Campaign strategy",
            "creative concept",
            "on-ground activation plan",
            "influencer integration",
            "social amplification",
            "content plan",
            "campaign management",
            "report, 4 creators",
          ],
          [
            "360° campaign strategy",
            "creative concept",
            "on-ground activation",
            "influencer integration",
            "UGC",
            "video production",
            "social amplification",
            "event content",
            "paid advertising strategy",
            "management",
            "performance analysis",
            "6-10 creators",
          ],
        ],
      },
    ],
  },
];

export const metadata: Metadata = {
  title: "Pricing",
  description: "Marketing retainers from ₹35,000/month and BMU QR software from ₹499/month. No setup fees, no lock-in past 90 days.",
};

export default function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title="Flat monthly fees, no percentage of your ad spend"
        lede="We charge for the work, not a cut of the budget - so nobody has an incentive to talk you into spending more than the pipeline needs."
      />

      {/* Plans by category → service → Starter / Growth / Premium (replaces the shared Pricing
          cards on this page only; the landing page still uses them) */}
      <section className={cn("section", styles.plans)}>
        <div className="container">
          {CATEGORIES.map((category) => (
            <div key={category.title} className={styles.category}>
              <h2 className={cn("display", styles.categoryTitle)}>{category.title}</h2>

              {/* "One Time" is shown but switched off until its prices are ready */}
              <div className={styles.toggle} role="tablist" aria-label={`${category.title} pricing`}>
                <span role="tab" aria-selected="true" className={cn(styles.toggleOption, styles.toggleActive)}>
                  Monthly Retainers
                </span>
                <span role="tab" aria-selected="false" aria-disabled="true" className={styles.toggleOption}>
                  One Time
                </span>
              </div>

              {/* each service's 3 cards; services with feature lists open the focused view */}
              {category.services.map((service) => (
                <PlanExplorer key={service.name} service={service} plans={PLANS} />
              ))}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

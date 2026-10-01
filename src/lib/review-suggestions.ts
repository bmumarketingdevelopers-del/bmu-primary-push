/**
 * Review suggestions.
 *
 * After a customer says their experience was good, writing the review is the
 * real barrier — most people abandon at the blank Google text box. This
 * generates three drafts they can pick from and edit.
 *
 * Two rules are deliberate and load-bearing:
 *  1. Suggestions are only *drafted* for customers who said the visit went
 *     well. Handing a five-star draft to someone who was unhappy would be
 *     putting words in their mouth. Everyone can still reach Google — the
 *     public link is on every screen — they just write their own text.
 *  2. Drafts are starting points the customer edits and submits themselves.
 *     Nothing is auto-posted, and nothing is offered in exchange.
 * Google prohibits both fake reviews and gating, so this offers help without
 * filtering who is allowed to post.
 */

export type ReviewTone = "SHORT" | "DETAILED" | "SPECIFIC";

export type SuggestionInput = {
  businessName: string;
  category: string;
  city?: string;
  services?: string[];
  staffName?: string;
  keywords?: string[];
};

/**
 * Per-industry vocabulary. The point of segmenting this is SEO: a review
 * that says "3BHK site visit in Whitefield" ranks the listing for terms a
 * generic "great service!" review never touches.
 */
type CategoryVoice = {
  label: string;
  /** What customers actually did. */
  actions: string[];
  /** What good looks like in this sector. */
  praise: string[];
  /** Search terms worth appearing in the text. */
  keywords: string[];
  /** What they'd say at the end. */
  closers: string[];
};

export const CATEGORY_VOICE: Record<string, CategoryVoice> = {
  RESTAURANT: {
    label: "Restaurant",
    actions: ["had dinner here", "came in for lunch", "ordered a takeaway", "booked a table for four"],
    praise: ["food came out hot and fresh", "portions were generous", "the staff were attentive without hovering", "everything arrived quicker than expected"],
    keywords: ["North Indian food", "family restaurant", "dinner", "takeaway", "best restaurant"],
    closers: ["Will be back", "Booking again next weekend", "Worth the trip", "Recommending this to friends"],
  },
  CAFE: {
    label: "Cafe",
    actions: ["stopped in for coffee", "worked here for a couple of hours", "came for breakfast"],
    praise: ["the coffee is genuinely good", "quiet enough to actually work", "the staff remembered my order", "seating was comfortable"],
    keywords: ["coffee shop", "cafe", "work-friendly cafe", "breakfast", "filter coffee"],
    closers: ["My regular spot now", "Coming back with my laptop", "Easily the best coffee nearby"],
  },
  SALON: {
    label: "Salon",
    actions: ["got a haircut", "had my hair coloured", "booked a facial", "came in for a bridal trial"],
    praise: ["they listened to what I actually wanted", "the finish was clean", "no upselling at all", "the salon was spotless"],
    keywords: ["unisex salon", "haircut", "hair colour", "bridal makeup", "salon near me"],
    closers: ["Booked my next appointment already", "Found my regular salon", "Sending my sister here"],
  },
  SPA: {
    label: "Spa",
    actions: ["booked a massage", "came in for a body treatment"],
    praise: ["the therapist knew exactly where the tension was", "genuinely relaxing atmosphere", "clean and calm throughout"],
    keywords: ["spa", "massage", "body massage", "wellness centre"],
    closers: ["Already planning the next one", "Best spa I've been to here"],
  },
  DOCTOR: {
    label: "Doctor",
    actions: ["consulted for a persistent issue", "came in for a follow-up", "brought my father for a check-up"],
    praise: ["explained the diagnosis in plain language", "didn't rush the consultation", "prescribed only what was needed", "the appointment ran on time"],
    keywords: ["doctor", "consultation", "clinic", "specialist"],
    closers: ["Glad I found this clinic", "Will be going back", "Recommending to family"],
  },
  CLINIC: {
    label: "Clinic",
    actions: ["came in for a consultation", "had tests done here", "brought my child in"],
    praise: ["reception was organised", "barely any waiting", "the staff explained everything", "hygiene was clearly taken seriously"],
    keywords: ["clinic", "consultation", "medical centre", "walk-in clinic"],
    closers: ["Our regular clinic now", "Recommending it locally"],
  },
  HOSPITAL: {
    label: "Hospital",
    actions: ["was admitted here", "came in through emergency", "brought a family member in"],
    praise: ["nursing staff checked in regularly", "the doctors kept us informed", "billing was transparent"],
    keywords: ["hospital", "emergency care", "multi-speciality hospital"],
    closers: ["Grateful for the care", "Would trust them again"],
  },
  GYM: {
    label: "Gym",
    actions: ["joined last month", "took a trial session", "trained with a coach here"],
    praise: ["equipment is well maintained", "never had to wait for a machine", "the trainers correct your form", "no pushy membership sales"],
    keywords: ["gym", "fitness centre", "personal training", "gym near me"],
    closers: ["Sticking with this one", "Best gym in the area"],
  },
  REAL_ESTATE: {
    label: "Real estate",
    actions: ["did a site visit", "enquired about a 3BHK", "booked a unit here"],
    praise: ["the sales team knew the project properly", "no pressure tactics", "answered questions about approvals directly", "the walkthrough was thorough"],
    keywords: ["site visit", "3BHK apartment", "new project", "property", "flats"],
    closers: ["Straightforward to deal with", "Worth visiting if you're looking"],
  },
  RETAIL: {
    label: "Retail",
    actions: ["shopped here", "picked up a few things", "came in to exchange something"],
    praise: ["good range for the size of the shop", "prices were fair", "the exchange was handled without fuss", "staff actually helped"],
    keywords: ["store", "shop", "shopping", "collection"],
    closers: ["Will shop here again", "My go-to nearby"],
  },
  HOTEL: {
    label: "Hotel",
    actions: ["stayed two nights", "booked a weekend stay", "stayed here for work"],
    praise: ["the room was clean and quiet", "check-in was quick", "breakfast was better than expected", "the staff went out of their way"],
    keywords: ["hotel", "stay", "resort", "weekend getaway", "rooms"],
    closers: ["Would stay again", "Booking again next trip"],
  },
  AUTOMOBILE: {
    label: "Automobile",
    actions: ["got my car serviced", "came in for a repair", "had bodywork done"],
    praise: ["they explained what needed doing and what didn't", "the estimate matched the bill", "car came back clean", "delivered on time"],
    keywords: ["car service", "car repair", "workshop", "service centre"],
    closers: ["Servicing here from now on", "Honest workshop, hard to find"],
  },
  EDUCATION: {
    label: "Education",
    actions: ["enrolled my child here", "attended a course", "took a demo class"],
    praise: ["the teachers are patient", "small batches so everyone gets attention", "progress updates are regular"],
    keywords: ["coaching centre", "classes", "tuition", "training institute"],
    closers: ["Happy with the decision", "Recommending to other parents"],
  },
  FREELANCER: {
    label: "Freelancer",
    actions: ["worked with them on a project", "hired them for a one-off piece"],
    praise: ["delivered on time", "took feedback well", "communication was clear throughout"],
    keywords: ["freelancer", "consultant", "professional services"],
    closers: ["Working together again", "Easy to recommend"],
  },
  AGENCY: {
    label: "Agency",
    actions: ["worked with this team", "engaged them for a campaign"],
    praise: ["reporting was honest", "responsive when it mattered", "they pushed back when we were wrong"],
    keywords: ["agency", "marketing agency", "digital marketing"],
    closers: ["Would work with them again", "Genuinely useful partner"],
  },
  PROFESSIONAL: {
    label: "Professional services",
    actions: ["consulted them", "used their services this year"],
    praise: ["clear advice, no jargon", "responsive over email", "well organised"],
    keywords: ["consultant", "professional", "advisory"],
    closers: ["Sticking with them", "Recommending them"],
  },
  OTHER: {
    label: "Business",
    actions: ["used their service", "visited recently"],
    praise: ["the staff were helpful", "everything was well organised", "no complaints at all"],
    keywords: ["service", "local business"],
    closers: ["Would come back", "Happy to recommend"],
  },
};

/** Maps the 27 website industries onto the voice above. */
export const INDUSTRY_TO_CATEGORY: Record<string, string> = {
  "real-estate": "REAL_ESTATE", builders: "REAL_ESTATE", architects: "PROFESSIONAL",
  "interior-designers": "PROFESSIONAL", restaurants: "RESTAURANT", cafes: "CAFE",
  hotels: "HOTEL", resorts: "HOTEL", travel: "HOTEL",
  hospitals: "HOSPITAL", clinics: "CLINIC", doctors: "DOCTOR",
  schools: "EDUCATION", colleges: "EDUCATION", education: "EDUCATION",
  gyms: "GYM", "fitness-centers": "GYM", salons: "SALON", "beauty-brands": "SPA",
  jewellery: "RETAIL", retail: "RETAIL", ecommerce: "RETAIL",
  automobile: "AUTOMOBILE", finance: "PROFESSIONAL", manufacturing: "OTHER",
  ngos: "OTHER", startups: "AGENCY",
};

const pick = <T,>(arr: T[], seed: number) => arr[seed % arr.length];

/**
 * Template generator. Runs when no AI key is set, and as the fallback if a
 * model call fails — a customer standing at a counter can't wait for a retry.
 */
export function templateSuggestions(input: SuggestionInput): string[] {
  const voice = CATEGORY_VOICE[input.category] ?? CATEGORY_VOICE.OTHER;
  const place = input.city ? ` in ${input.city}` : "";
  const service = input.services?.[0];
  const keyword = input.keywords?.[0] ?? voice.keywords[0];
  const seed = Math.floor(Math.random() * 97);

  // SHORT — the one most people will actually pick.
  const short = `${cap(pick(voice.actions, seed))} at ${input.businessName}${place}. ${cap(
    pick(voice.praise, seed + 1)
  )}. ${pick(voice.closers, seed + 2)}.`;

  // DETAILED — two clear reasons, which reads as credible rather than planted.
  const detailed = `${cap(pick(voice.actions, seed + 3))} at ${input.businessName}${place} and it was a good experience. ${cap(
    pick(voice.praise, seed + 4)
  )}, and ${lower(pick(voice.praise, seed + 5))}. If you're looking for ${keyword}${place}, this is worth trying. ${pick(
    voice.closers,
    seed + 6
  )}.`;

  // SPECIFIC — names the service and staff member, which is what Google
  // actually surfaces in search snippets.
  const specific = `${service ? `Came to ${input.businessName} for ${lower(service)}` : `${cap(pick(voice.actions, seed + 7))} at ${input.businessName}`}${place}. ${
    input.staffName ? `${input.staffName} looked after us and ` : ""
  }${lower(pick(voice.praise, seed + 8))}. Good option for ${keyword}${place}. ${pick(voice.closers, seed + 9)}.`;

  return [short, detailed, specific];
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const lower = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

/** AI path, with the template set as the guaranteed fallback. */
export async function generateSuggestions(input: SuggestionInput): Promise<{
  suggestions: string[];
  provider: string;
}> {
  const fallback = templateSuggestions(input);

  if (!process.env.ANTHROPIC_API_KEY && !process.env.OPENAI_API_KEY) {
    return { suggestions: fallback, provider: "template" };
  }

  const voice = CATEGORY_VOICE[input.category] ?? CATEGORY_VOICE.OTHER;

  const system = `You draft short Google review suggestions that a real, satisfied customer can edit and post themselves.

Rules:
- Write as an ordinary customer, not marketing copy. Plain Indian English.
- Never invent specifics you were not given — no prices, no staff names, no dates.
- Vary length: one under 20 words, one around 40, one around 30 naming the service.
- Work in local search terms naturally, never as a keyword list.
- No exclamation marks, no emoji, no superlatives like "amazing" or "best ever".
- Return exactly three reviews separated by a line containing only ---`;

  const prompt = [
    `Business: ${input.businessName}`,
    `Type: ${voice.label}`,
    input.city && `City: ${input.city}`,
    input.services?.length && `Services: ${input.services.slice(0, 4).join(", ")}`,
    input.keywords?.length && `Search terms to work in: ${input.keywords.slice(0, 3).join(", ")}`,
    `\nWrite three review suggestions.`,
  ].filter(Boolean).join("\n");

  try {
    const { complete } = await import("@/lib/ai");
    const result = await complete(system, prompt);

    const parts = result.output
      .split(/^---$/m)
      .map((s) => s.trim())
      .filter((s) => s.length > 15);

    // Two usable drafts is enough; top up from templates rather than showing one.
    if (parts.length >= 2) {
      const merged = [...parts, ...fallback].slice(0, 3);
      return { suggestions: merged, provider: result.provider };
    }
  } catch (err) {
    console.error("[reviews] suggestion generation failed:", err);
  }

  return { suggestions: fallback, provider: "template" };
}

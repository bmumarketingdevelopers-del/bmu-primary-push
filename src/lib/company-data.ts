/** About page content: story, values, team, offices, contact channels. */

export const COMPANY = {
  founded: 2019,
  headcount: 24,
  city: "Bengaluru",
  address: "2nd Floor, 14th Main, HSR Layout Sector 6, Bengaluru 560102",
  email: "hello@bmu.marketing",
  phone: "+91 80 4718 2200",
  whatsapp: "+91 98450 71100",
  hours: "Mon–Fri, 9:30am–6:30pm IST",
};

export const STORY = [
  {
    heading: "We started because reporting was broken",
    body: "Two of us were in-house marketers who kept receiving agency decks full of impressions and reach - numbers that never reconciled with what the sales team saw in the CRM. BMU began as a reporting fix for three clients, and the services grew backwards from there: if we were going to be judged on leads, we wanted control of the creative and the landing page too.",
  },
  {
    heading: "Then the software followed the work",
    body: "Every restaurant client asked the same thing about menu QR codes. Every developer asked the same thing about routing enquiries to WhatsApp. Rather than rebuild it per client, we productised it. BMU QR, Smart Review and AI Studio all started as internal tools we were already maintaining.",
  },
  {
    heading: "Where we are now",
    body: "Twenty-four people in HSR Layout, working with brands across nine cities. We still take on a limited number of retainers each quarter, because the model only works if the strategist on your account can name your top five keywords from memory.",
  },
];

export const VALUES = [
  {
    title: "Report the loss too",
    body: "If a campaign underperformed, it's in the report before you have to ask. Agencies that only surface wins are managing your perception, not your pipeline.",
  },
  {
    title: "You own everything",
    body: "Ad accounts, pixels, domains, CRM records and QR data are created under your ownership on day one. Leaving should cost you a password change, not a migration project.",
  },
  {
    title: "Build once, reuse forever",
    body: "If we solve the same problem for a third client, it becomes a product. That's why our software is priced like software and not billed as custom development.",
  },
  {
    title: "Small enough to know your business",
    body: "We cap new retainers each quarter. A strategist carrying eleven accounts is a strategist reading your brief for the first time on the call.",
  },
];

export const MILESTONES = [
  { year: "2019", label: "Founded in Bengaluru with three retainer clients" },
  { year: "2021", label: "First real estate launch campaign; drone and video brought in-house" },
  { year: "2023", label: "BMU QR released after eighteen months as an internal tool" },
  { year: "2024", label: "AI Studio launched; first pan-India D2C accounts" },
  { year: "2026", label: "24 people, 140+ brands, ₹38Cr in managed ad spend" },
];

export const TEAM = [
  { name: "Divya Nair", role: "Co-founder & Head of Strategy", focus: "Real estate, hospitality" },
  { name: "Aditya Kulkarni", role: "Co-founder & Head of Technology", focus: "Web, apps, automation" },
  { name: "Sana Fernandes", role: "Performance Lead", focus: "Meta, Google, attribution" },
  { name: "Rahul Prabhu", role: "Creative Director", focus: "Brand systems, packaging" },
  { name: "Nikita Shenoy", role: "Content Lead", focus: "UGC, creators, social" },
  { name: "Imran Sait", role: "SEO Lead", focus: "Technical, local, Google Business" },
];

export const CONTACT_CHANNELS = [
  {
    title: "Book a consultation",
    body: "Thirty minutes, a look at your current numbers, and a written plan within three working days.",
    action: "Use the form",
    icon: "CalendarCheck",
  },
  {
    title: "WhatsApp",
    body: "Quickest for a straight question about scope, timelines or pricing.",
    action: COMPANY.whatsapp,
    href: `https://wa.me/${COMPANY.whatsapp.replace(/[^0-9]/g, "")}`,
    icon: "MessageCircle",
  },
  {
    title: "Email",
    body: "Send a brief, an RFP or your current reporting and we'll come back with questions.",
    action: COMPANY.email,
    href: `mailto:${COMPANY.email}`,
    icon: "Mail",
  },
  {
    title: "Existing client?",
    body: "Raise it in the dashboard so it reaches your account manager and the delivery team at once.",
    action: "Open dashboard",
    href: "/dashboard",
    icon: "LifeBuoy",
  },
];

export const BUDGET_BANDS = [
  "Under ₹50,000 / month",
  "₹50,000 – ₹1,00,000 / month",
  "₹1,00,000 – ₹2,50,000 / month",
  "Over ₹2,50,000 / month",
  "One-off project, not a retainer",
  "Not sure yet",
];

export const CONTACT_FAQS = [
  {
    q: "What happens after I submit this?",
    a: "A strategist replies within one working day to book a 30-minute call. Before that call we look at your website, your Google Business profile and whatever ad accounts you're willing to share.",
  },
  {
    q: "Do you charge for the plan?",
    a: "No. The written plan after the first call is free, and it's yours whether or not you work with us.",
  },
  {
    q: "Do you work outside Bengaluru?",
    a: "Yes - clients across nine cities. Drone and video shoots need travel budgeted; everything else runs the same remotely.",
  },
  {
    q: "What's the smallest engagement you take?",
    a: "₹35,000 a month for a marketing retainer. Software subscriptions start at ₹499 a month with no retainer required.",
  },
];

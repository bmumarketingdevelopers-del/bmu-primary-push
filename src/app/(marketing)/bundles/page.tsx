import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import styles from "./page.module.css";
import { BundlePicker, type Bundle } from "./bundle-picker";

export const metadata: Metadata = {
  title: "Bundles",
  description:
    "Eight ready-made bundles that pair the right services under one retainer, one team and one roadmap — with 10% off on every bundle.",
};

/* ---- Bundle data (from the brochure). Each bundle has three plans: Starter, Growth, Premium.
   The cards themselves (and the SELECT overlay) are in bundle-picker.tsx. */

const BUNDLES: Bundle[] = [
  {
    name: "Founder Brand",
    desc: "Builds the founder into a recognised voice in their category.",
    services: ["Personal Branding", "Video Shoots", "Video Editing", "Social Media Management"],
    plans: [
      { monthly: "59,000", six: "3,54,000" },
      { monthly: "1,15,500", six: "6,93,000" },
      { monthly: "2,05,000", six: "12,30,000" },
    ],
  },
  {
    name: "Business AI",
    desc: "Automates enquiries and lead capture on top of a performing funnel.",
    services: ["AI Chatbots", "Website", "Digital Marketing (incl. lead generation)"],
    plans: [
      { monthly: "21,000", oneTime: "29,500", six: "1,26,000" },
      { monthly: "42,500", oneTime: "72,500", six: "2,55,000" },
      { monthly: "85,500", oneTime: "1,49,500", six: "5,13,000" },
    ],
  },
  {
    name: "Local Business Growth",
    desc: "Built for cafés, clinics, stores and service businesses with a catchment.",
    services: ["GMB", "SEO", "Social Media Management", "Video Shoots", "Graphic Designing"],
    plans: [
      { monthly: "59,000", six: "3,54,000" },
      { monthly: "1,15,000", six: "6,90,000" },
      { monthly: "2,05,000", six: "12,30,000" },
    ],
  },
  {
    name: "Complete Digital Growth",
    desc: "Every capability under one retainer, run as a single roadmap.",
    services: [
      "Digital Marketing",
      "SEO",
      "Branding",
      "Website",
      "Social Media Management",
      "Video Editing",
      "UGC",
      "AI Chatbots",
    ],
    plans: [
      { monthly: "78,500", oneTime: "64,000", six: "4,71,000" },
      { monthly: "1,53,500", oneTime: "1,36,500", six: "9,21,000" },
      { monthly: "2,86,000", oneTime: "2,77,500", six: "17,16,000" },
    ],
  },
  {
    name: "Digital Presence",
    desc: "Everything a business needs to exist properly online and be found.",
    services: ["Website", "SEO", "Google Business Profile", "Social Media Management"],
    plans: [
      { monthly: "40,500", oneTime: "21,000", six: "2,43,000" },
      { monthly: "76,500", oneTime: "51,000", six: "4,59,000" },
      { monthly: "1,28,000", oneTime: "1,06,500", six: "7,68,000" },
    ],
  },
  {
    name: "Brand Launch",
    desc: "For new brands going to market with a complete identity from day one.",
    services: ["Complete Branding (incl. logo)", "Google Business Profile", "Website"],
    plans: [
      { monthly: "8,500", oneTime: "55,500", six: "51,000" },
      { monthly: "17,000", oneTime: "1,15,000", six: "1,02,000" },
      { monthly: "34,000", oneTime: "2,35,000", six: "2,04,000" },
    ],
  },
  {
    name: "Social Growth",
    desc: "Consistent content volume and design quality across social platforms.",
    services: ["Social Media Management", "Graphic Designing", "Video Editing", "UGC Content"],
    plans: [
      { monthly: "53,000", six: "3,18,000" },
      { monthly: "1,02,500", six: "6,15,000" },
      { monthly: "1,83,500", six: "11,01,000" },
    ],
  },
  {
    name: "UGC Growth",
    desc: "A full creator engine — content, creators, ads and promotions.",
    services: ["UGC Content", "UGC Outsourcing", "UGC Ads", "UGC Promotions"],
    plans: [
      { monthly: "55,500", six: "3,33,000" },
      { monthly: "1,02,500", six: "6,15,000" },
      { monthly: "2,05,000", six: "12,30,000" },
    ],
  },
];

const PERKS = [
  { title: "One retainer", body: "All your services, billed together every month." },
  { title: "One team", body: "A single crew owns strategy through delivery." },
  { title: "Built-in saving", body: "10% off automatically, on every bundle." },
];

export default function BundlesPage() {
  return (
    <>
      {/* Hero: dark band under the header, centred text, buttons, three perks underneath */}
      <section className={styles.hero}>
        <div className={cn("container", styles.heroInner)}>
          <p className={styles.heroEyebrow}>
            <span className={styles.dash} aria-hidden="true" />
            Bundle packages
            <span className={styles.dash} aria-hidden="true" />
          </p>
          <h1 className={cn("display", styles.heroTitle)}>
            Services that work
            <br />
            <span className={styles.heroTitleMuted}>better together.</span>
          </h1>
          <p className={styles.heroLede}>
            Eight ready-made bundles that pair the right services under one retainer,
            <br className={styles.ledeBreak} /> one team and one roadmap. Or build your own from our add-ons.
          </p>
          <div className={styles.heroActions}>
            <a href="#bundles" className={styles.btnPrimary}>
              Explore bundles <ArrowRight aria-hidden="true" />
            </a>
            <Link href="/contact" className={styles.btnOutline}>
              Build a custom bundle
            </Link>
          </div>

          <ul className={styles.perks}>
            {PERKS.map((p) => (
              <li key={p.title} className={styles.perk}>
                <span className={styles.perkTitle}>
                  <span className={styles.dash} aria-hidden="true" />
                  {p.title}
                </span>
                <span className={styles.perkBody}>{p.body}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Bundles: eight cards */}
      <section id="bundles" className={cn("section", styles.bundles)}>
        <div className="container">
          <h2 className={cn("display", styles.sectionTitle)}>Bundles</h2>
          <BundlePicker bundles={BUNDLES} />
        </div>
      </section>
    </>
  );
}

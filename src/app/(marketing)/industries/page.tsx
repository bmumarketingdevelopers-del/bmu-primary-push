import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BedDouble,
  Building2,
  Car,
  Dumbbell,
  GraduationCap,
  ShoppingBag,
  SquarePlus,
  Utensils,
  type LucideIcon,
} from "lucide-react";
import { Reveal } from "@/components/marketing/reveal";
import { cn } from "@/lib/utils";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Industries",
  description: "Marketing playbooks for real estate, restaurants, hotels, healthcare, education, ecommerce, automobile, fitness and more.",
};

// Page-only copy, kept here so the shared industries data stays untouched

/** Hero grid: 8 sector tiles around the green "27 sectors served" tile (index 4 is the centre). */
const HERO_TILES: { label: string; href: string; Icon: LucideIcon }[] = [
  { label: "Real estate", href: "/industries/real-estate", Icon: Building2 },
  { label: "Restaurants", href: "/industries/restaurants", Icon: Utensils },
  { label: "Hotels", href: "/industries/hotels-resorts", Icon: BedDouble },
  { label: "Clinics", href: "/industries/healthcare", Icon: SquarePlus },
  { label: "Education", href: "/industries/education", Icon: GraduationCap },
  { label: "Ecommerce", href: "/industries/ecommerce-d2c", Icon: ShoppingBag },
  { label: "Automobile", href: "/industries/automobile", Icon: Car },
  { label: "Fitness", href: "/industries/fitness-beauty", Icon: Dumbbell },
];

const SECTORS: {
  slug: string;
  tag: string;
  name: string;
  summary: string;
  value: string;
  label: string;
  Icon: LucideIcon;
}[] = [
  {
    slug: "real-estate",
    tag: "Site visits, not form fills",
    name: "Real Estate",
    summary: "Launch marketing, from aerial film to WhatsApp.",
    value: "312%",
    label: "More site visits booked",
    Icon: Building2,
  },
  {
    slug: "restaurants",
    tag: "Fuller tables, better ratings",
    name: "Restaurants & Cafes",
    summary: "Local search, food content and review collection.",
    value: "4.8★",
    label: "Average rating achieved",
    Icon: Utensils,
  },
  {
    slug: "hotels-resorts",
    tag: "Direct bookings over OTA",
    name: "Hotels & Resorts",
    summary: "Direct booking funnels that cut OTA dependence.",
    value: "+34%",
    label: "Direct booking share",
    Icon: BedDouble,
  },
  {
    slug: "healthcare",
    tag: "Appointments, handled carefully",
    name: "Hospitals & Clinics",
    summary: "Patient acquisition within medical ad rules.",
    value: "+180%",
    label: "Appointment enquiries",
    Icon: SquarePlus,
  },
  {
    slug: "education",
    tag: "Admissions, season after season",
    name: "Schools & Colleges",
    summary: "Enquiries and nurture across the admission cycle.",
    value: "+41%",
    label: "Enquiry to application",
    Icon: GraduationCap,
  },
  {
    slug: "ecommerce-d2c",
    tag: "Creative velocity, workable CAC",
    name: "Ecommerce & D2C",
    summary: "Catalogue imagery, testing and full-funnel ads.",
    value: "−41%",
    label: "Cost per acquisition",
    Icon: ShoppingBag,
  },
  {
    slug: "automobile",
    tag: "Test drives and service",
    name: "Automobile",
    summary: "Showroom footfall, test drives and service.",
    value: "+96%",
    label: "Test drives booked",
    Icon: Car,
  },
  {
    slug: "fitness-beauty",
    tag: "Memberships, repeat bookings",
    name: "Fitness & Beauty",
    summary: "Local visibility and booking automation.",
    value: "+38%",
    label: "Trial to membership",
    Icon: Dumbbell,
  },
];

const ALSO_SERVED = [
  "Restaurants", "Cafes", "Hotels", "Resorts", "Hospitals", "Clinics", "Doctors", "Schools", "Colleges",
  "Builders", "Architects", "Interior Designers", "Gyms", "Fitness Centers", "Salons", "Beauty Brands",
  "Jewellery", "Retail", "Ecommerce", "Finance", "Education", "Travel", "Manufacturing", "NGOs", "Startups",
];

export default function IndustriesPage() {
  return (
    <>
      {/* Hero: dark band under the header, text left, sector tile grid right */}
      <section className={styles.hero}>
        <div className={cn("container", styles.heroGrid)}>
          <div>
            <span className="eyebrow">Industries</span>
            <h1 className={cn("display", styles.heroTitle)}>Twenty-seven sectors, twenty-seven playbooks</h1>
            <p className={styles.heroLede}>
              Every industry has a different buying cycle, a different response window and a different definition
              of a good lead. We start from the playbook rather than from scratch.
            </p>
            <Link href="/contact" className={styles.heroButton}>
              Book a free consultation <ArrowRight aria-hidden="true" />
            </Link>
          </div>

          <div>
            <div className={styles.tiles}>
              {HERO_TILES.slice(0, 4).map((t) => (
                <HeroTile key={t.label} {...t} />
              ))}
              <div className={cn(styles.tile, styles.tileCount)}>
                <span className={cn("display", styles.tileCountValue)}>27</span>
                <span className={styles.tileCountLabel}>sectors served</span>
              </div>
              {HERO_TILES.slice(4).map((t) => (
                <HeroTile key={t.label} {...t} />
              ))}
            </div>
            <p className={styles.tilesNote}>+ 19 more, from architects to NGOs</p>
          </div>
        </div>
      </section>

      {/* Sectors we work in most: 2 columns of cards, each with its headline number */}
      <section className="section">
        <div className="container">
          <Reveal className={styles.sectorsHead}>
            <div>
              <span className="eyebrow">Deep expertise</span>
              <h2 className={cn("display", styles.sectionTitle)}>Sectors we work in most</h2>
            </div>
            <p className={styles.sectorsNote}>Each has a dedicated playbook page</p>
          </Reveal>

          <div className={styles.sectorsGrid}>
            {SECTORS.map(({ slug, tag, name, summary, value, label, Icon }, i) => (
              <Reveal key={slug} delay={(i % 4) * 0.06}>
                <Link href={`/industries/${slug}`} className={styles.sector}>
                  <span className={styles.sectorIcon}>
                    <Icon aria-hidden="true" />
                  </span>
                  <span className={styles.sectorText}>
                    <span className={styles.sectorTag}>{tag}</span>
                    <span className={cn("display", styles.sectorName)}>{name}</span>
                    <span className={styles.sectorSummary}>{summary}</span>
                  </span>
                  <span className={styles.sectorMetric}>
                    <span className={cn("display", styles.sectorValue)}>{value}</span>
                    <span className={styles.sectorLabel}>{label}</span>
                  </span>
                  <span className={styles.sectorArrow} aria-hidden="true">
                    <ArrowRight />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Also served: white panel, intro left, sector chips right */}
      <section className={styles.alsoSection}>
        <div className="container">
          <Reveal>
            <div className={styles.also}>
              <div>
                <span className={styles.alsoEyebrow}>Everyone else</span>
                <h2 className={cn("display", styles.alsoTitle)}>Also served</h2>
                <p className={styles.alsoLede}>
                  No dedicated page yet, but we work in all of these. Ask for comparable work.
                </p>
                <Link href="/contact" className={styles.alsoButton}>
                  Ask about your sector <ArrowRight aria-hidden="true" />
                </Link>
              </div>
              <ul className={styles.chips}>
                {ALSO_SERVED.map((name) => (
                  <li key={name} className={styles.chip}>
                    {name}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Closing band (replaces the shared CtaBand on this page only) */}
      <section className="section">
        <div className="container">
          <Reveal>
            <div className={styles.cta}>
              <div className={styles.ctaText}>
                <h2 className={cn("display", styles.ctaTitle)}>
                  Tell us what you&apos;re
                  <br />
                  trying to grow
                </h2>
                <p className={styles.ctaBody}>
                  A 30-minute call, a look at your current numbers and a written plan in three working days.
                </p>
              </div>
              <div className={styles.ctaActions}>
                <Link href="/contact" className={styles.ctaPrimary}>
                  Book a free consultation <ArrowRight aria-hidden="true" />
                </Link>
                <Link href="/case-studies" className={styles.ctaSecondary}>
                  See results
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function HeroTile({ label, href, Icon }: { label: string; href: string; Icon: LucideIcon }) {
  return (
    <Link href={href} className={styles.tile}>
      <span className={styles.tileIcon}>
        <Icon aria-hidden="true" />
      </span>
      <span className={styles.tileLabel}>{label}</span>
    </Link>
  );
}

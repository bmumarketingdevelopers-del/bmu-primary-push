import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Crosshair, Plus, Sun } from "lucide-react";
import { PageHero } from "@/components/marketing/page-hero";
import { Reveal } from "@/components/marketing/reveal";
import { SectionHeading } from "@/components/marketing/section-heading";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { HERO_STATS } from "@/lib/content";
import { TEAM } from "@/lib/company-data";
import { cn, initials } from "@/lib/utils";
import { AboutStats } from "./about-stats";
import { AboutTimeline } from "./about-timeline";
import { AboutValues } from "./about-values";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "About",
  description:
    "BMU.Marketing is an AI-first growth agency in Bengaluru - 24 people running strategy, creative, media and software for brands across nine cities.",
};

// About-page story copy (kept here so the shared STORY in company-data stays untouched).
const ABOUT_STORY = [
  {
    heading: "It started with real estate",
    body: "In 2018 we launched BMU as a real estate agency, and we got very good at it: understanding buyers, running site visits and closing deals. But selling property in a digital market meant we needed marketing, and a lot of it.",
  },
  {
    heading: "Then came the five-agency problem",
    body: "One agency handled our marketing. Another built our website. Someone else ran social media, and a fourth team ran our ads. Each had its own invoice and its own timeline, and when results slipped, each one pointed at the others.",
  },
  {
    heading: "So we built what we wished existed",
    body: "That frustration became BMU Marketing: one platform where every digital service a business needs sits under one roof, with one team accountable for the result.",
  },
  {
    heading: "Research, failures, and getting back up",
    body: "It didn't happen overnight. We researched, tested, failed and started again. Today BMU Marketing is live, with the full digital stack at prices that make sense for growing businesses.",
  },
];

const AGENDA = [
  {
    title: "One partner, not five",
    body: "Strategy, content, ads, SEO, web and automation, run by one team that shares one goal: your growth.",
  },
  {
    title: "Priced for growing businesses",
    body: "Agency-grade work shouldn't be reserved for big brands. A single café or a property developer can get the full stack.",
  },
  {
    title: "Built by business owners",
    body: "We've carried sales targets ourselves, so we judge our work by leads and revenue, not likes and reach.",
  },
];

// About-page values copy (kept here so the shared VALUES in company-data stays untouched).
const ABOUT_VALUES = [
  {
    title: "One team, full accountability",
    body: "Strategy, creative, ads and web all sit with us. When numbers slip, there's no other agency to point at.",
  },
  {
    title: "Fair, clear pricing",
    body: "We know what agency bills feel like from the client's side. Our plans are published, with no setup fees.",
  },
  {
    title: "We report the misses too",
    body: "If a campaign underperforms, it's in the report before you have to ask, along with what we're changing.",
  },
  {
    title: "You own everything",
    body: "Ad accounts, pages, domains and data are set up in your name from day one.",
  },
];

// Let's talk: the 4 service cards around the orbit (positions in page.module.css, .talkCard_*)
const TALK_CARDS = [
  { key: "strategy", title: "Strategy", body: "Turn ideas into direction", Icon: StrategyIcon },
  { key: "performance", title: "Performance", body: "Drive measurable results", Icon: Crosshair },
  { key: "creative", title: "Creative", body: "Make brands stand out", Icon: CreativeIcon },
  { key: "technology", title: "Technology", body: "Build what's next", Icon: Sun },
] as const;

// Placeholder professional portraits (Unsplash, already allowed in next.config) - swap for real team photos.
// Each keeps its ring colour from the design.
const unsplash = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=96&h=96&fit=crop&crop=faces&q=80`;
const TALK_FACES = [
  { src: unsplash("1560250097-0b93528c311a"), ring: "#d9b89a" },
  { src: unsplash("1573496359142-b8d87734a5a2"), ring: "#7a5040" },
  { src: unsplash("1519085360753-af0119f7cbe7"), ring: "#c98b6b" },
  { src: unsplash("1573497019940-1c28c88b4f3e"), ring: "#a9604c" },
];

const JOURNEY = [
  {
    label: "2018",
    title: "BMU is founded",
    body: "A real estate agency in Bengaluru, built on closing deals.",
  },
  {
    label: "The spark",
    title: "Five agencies, one business",
    body: "Juggling vendors shows us what businesses are missing.",
  },
  {
    label: "The build",
    title: "Research and restarts",
    body: "Years of testing, failing and rebuilding the model.",
  },
  {
    label: "2026",
    title: "BMU Marketing goes live",
    body: "Every digital service, one team, reasonable prices.",
  },
];

export default function AboutPage() {
  return (
    <>
      <div className={styles.hero}>
        <PageHero
          eyebrow="About"
          title={"We were the client\nbefore we became the agency."}
          lede="BMU started in 2018 as a real estate agency in Bengaluru. Managing five different agencies to market one business is what led us to build BMU Marketing: every digital service, one team, fair prices."
        >
          <AboutStats stats={HERO_STATS} />
        </PageHero>
      </div>

      {/* Story */}
      <section className="section">
        <div className={cn("container", styles.storyGrid)}>
          <Reveal>
            <span className="eyebrow">Our story</span>
            <h2 className="sec-title">
              The story
              <br />
              behind BMU
            </h2>
            <p className={styles.storyLede}>
              From selling homes to building the marketing partner we couldn&apos;t find.
            </p>
          </Reveal>

          <div className={styles.storyList}>
            {ABOUT_STORY.map((s, i) => (
              <Reveal key={s.heading} delay={i * 0.07}>
                <article className={styles.storyItem}>
                  <h3 className={cn("display", styles.storyHeading)}>{s.heading}</h3>
                  <p className={styles.storyBody}>{s.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Agenda */}
      <section className={cn("section", styles.agenda)}>
        <div className="container">
          <Reveal>
            <span className="eyebrow">Our agenda</span>
            <h2 className={cn("display", styles.agendaTitle)}>
              Every digital service a business needs,
              <br className={styles.agendaBreak} /> under one roof, at a fair price.
            </h2>
            <p className={styles.agendaLede}>
              That&apos;s where we&apos;re taking BMU Marketing. No more juggling agencies, and no
              more paying five margins for one outcome.
            </p>
          </Reveal>

          <div className={styles.agendaGrid}>
            {AGENDA.map((a, i) => (
              <Reveal key={a.title} delay={i * 0.07}>
                <article className={styles.agendaCard}>
                  <span className={styles.agendaBar} aria-hidden="true" />
                  <h3 className={cn("display", styles.agendaCardTitle)}>{a.title}</h3>
                  <p className={styles.agendaCardBody}>{a.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className={cn("section", styles.altSection)}>
        <div className="container">
          <Reveal>
            <SectionHeading
              eyebrow="How we work"
              title="What we won't compromise on"
              lede="These come straight from our years as the client."
            />
          </Reveal>

          <AboutValues values={ABOUT_VALUES} />
        </div>
      </section>

      {/* Timeline */}
      <section className="section">
        <div className="container">
          <Reveal>
            <SectionHeading eyebrow="Our journey" title="From real estate to everything digital" />
          </Reveal>

          <AboutTimeline steps={JOURNEY} />
        </div>
      </section>

      {/* Founder note */}
      <section className={cn("section", styles.founder)}>
        <div className="container">
          <Reveal>
            <span className="eyebrow">A note from the founder</span>
            <figure className={styles.founderFigure}>
              <span className={cn("display", styles.founderMark)} aria-hidden="true">
                &ldquo;
              </span>
              <div>
                <blockquote className={cn("display", styles.founderQuote)}>
                  <p>
                    We didn&apos;t start as marketers. We started as a business that needed
                    marketing and couldn&apos;t find one partner to trust with all of it. BMU
                    Marketing is that partner.
                  </p>
                </blockquote>
                <figcaption className={styles.founderBy}>
                  <span className={styles.founderAvatar} aria-hidden="true">
                    <span className={styles.founderAvatarDot} />
                  </span>
                  <span>
                    <span className={styles.founderName}>Founder</span>
                    <span className={styles.founderRole}>BMU Marketing, Bengaluru</span>
                  </span>
                </figcaption>
              </div>
            </figure>
          </Reveal>
        </div>
      </section>

      {/* Team */}
      <section className={cn("section", styles.altSection)}>
        <div className="container">
          <Reveal>
            <SectionHeading
              eyebrow="Team"
              title={<>The people who&apos;d<br />be on your account</>}
              lede="No account-management layer between you and the people doing the work. You meet your strategist on the first call and they stay on the account."
            />
          </Reveal>

          <div className={styles.teamGrid}>
            {TEAM.map((t, i) => (
              <Reveal key={t.name} delay={(i % 3) * 0.07}>
                <article className={styles.teamCard}>
                  <Avatar className={styles.avatar}>
                    <AvatarFallback>{initials(t.name)}</AvatarFallback>
                  </Avatar>
                  <div className={styles.teamBody}>
                    <h3 className={styles.teamName}>{t.name}</h3>
                    <p className={styles.teamRole}>{t.role}</p>
                    <p className={styles.teamFocus}>{t.focus}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Let's talk (replaces the shared CtaBand on this page only) */}
      <section className="section">
        <div className="container">
          <Reveal>
            <div className={styles.talk}>
              <div className={styles.talkContent}>
                <span className="eyebrow">Let&apos;s talk</span>
                <h2 className={styles.talkTitle}>
                  Come see whether
                  <br /> we&apos;re a fit.
                </h2>
                <p className={styles.talkBody}>
                  Tell us about your goals, challenges and where you want to go. We&apos;ll share
                  how we can help and what the next steps look like.
                </p>
                <div className={styles.talkActions}>
                  <Link href="/contact" className={styles.talkPrimary}>
                    Book a free consultation <ArrowRight aria-hidden="true" />
                  </Link>
                  <Link href="/case-studies" className={styles.talkSecondary}>
                    Read the case studies
                  </Link>
                </div>
              </div>

              <div className={styles.talkVisual}>
                <div className={styles.talkOrbit}>
                  <TalkOrbitDesktop />
                  <TalkOrbitMobile />
                  {TALK_CARDS.map(({ key, title, body, Icon }) => (
                    <div key={key} className={cn(styles.talkCard, styles[`talkCard_${key}`])}>
                      <span className={styles.talkCardIcon}>
                        <Icon aria-hidden="true" />
                      </span>
                      <span>
                        <span className={styles.talkCardTitle}>{title}</span>
                        <span className={styles.talkCardBody}>{body}</span>
                      </span>
                    </div>
                  ))}
                </div>

                <div className={styles.talkTeam}>
                  <div className={styles.talkFaces}>
                    {TALK_FACES.map((f) => (
                      <span key={f.src} className={styles.talkFace} style={{ borderColor: f.ring }}>
                        <Image src={f.src} alt="" width={96} height={96} />
                      </span>
                    ))}
                    <span className={cn(styles.talkFace, styles.talkFacePlus)} aria-hidden="true">
                      <Plus />
                    </span>
                  </div>
                  <p className={styles.talkTeamText}>
                    A team that works with you,
                    <br /> not around you.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

/* ---- Let's talk: solid card icons, as in the design */

function StrategyIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" {...props}>
      <rect x="3" y="11" width="3.6" height="6" rx="1" />
      <rect x="8.2" y="7" width="3.6" height="10" rx="1" />
      <rect x="13.4" y="3" width="3.6" height="14" rx="1" />
    </svg>
  );
}

function CreativeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" {...props}>
      <path
        d="M10 3.5a6.5 6.5 0 1 1-5.6 3.2"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ---- Let's talk: orbit drawings (decorative). Coordinates traced from the design. */

function TalkCenter({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  const outer = r * 0.95;
  const inner = r * 0.45;
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="#fff" />
      <rect
        x={cx - outer / 2}
        y={cy - outer / 2}
        width={outer}
        height={outer}
        rx={outer * 0.26}
        fill="hsl(var(--primary))"
      />
      <rect
        x={cx - inner / 2}
        y={cy - inner / 2}
        width={inner}
        height={inner}
        rx={inner * 0.2}
        fill="#fff"
      />
    </g>
  );
}

/** Laptop: wide drawing to the right of the text. */
function TalkOrbitDesktop() {
  return (
    <svg
      className={cn(styles.talkSvg, styles.talkSvgDesktop)}
      viewBox="0 0 660 325"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        {/* 34-unit grid starting where the design's grid starts, fading out from the centre */}
        <pattern id="talkGridD" x="75" y="27" width="34" height="34" patternUnits="userSpaceOnUse">
          <path d="M34 0H0V34" fill="none" stroke="rgb(255 255 255 / 0.11)" strokeWidth="1" />
        </pattern>
        <radialGradient id="talkFadeD" cx="0.5" cy="0.55" r="0.85">
          <stop offset="0.5" stopColor="#fff" />
          <stop offset="1" stopColor="#000" />
        </radialGradient>
        <mask id="talkMaskD">
          <rect x="75" y="27" width="585" height="298" fill="url(#talkFadeD)" />
        </mask>
      </defs>
      <rect x="75" y="27" width="585" height="298" fill="url(#talkGridD)" mask="url(#talkMaskD)" />
      <g fill="none" stroke="rgb(255 255 255 / 0.13)" strokeWidth="1">
        <circle cx="356" cy="168" r="42" />
        <circle cx="356" cy="168" r="82" />
        <circle cx="356" cy="168" r="120" />
        <circle cx="356" cy="168" r="149" />
      </g>
      <path
        d="M318 86.4 A112 109 0 1 1 340.8 244.3"
        fill="none"
        stroke="rgb(255 255 255 / 0.85)"
        strokeWidth="1.4"
        strokeDasharray="6 6"
      />
      <g fill="#fff">
        <circle cx="399" cy="46" r="4.5" />
        <circle cx="517" cy="144" r="4.5" />
        <circle cx="411" cy="264" r="4.5" />
        <circle cx="272" cy="167" r="4.5" />
      </g>
      <TalkCenter cx={356} cy={168} r={30} />
    </svg>
  );
}

/** Phone/tablet: taller drawing below the text. */
function TalkOrbitMobile() {
  return (
    <svg
      className={cn(styles.talkSvg, styles.talkSvgMobile)}
      viewBox="0 0 688 540"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <pattern id="talkGridM" width="58" height="58" patternUnits="userSpaceOnUse">
          <path d="M58 0H0V58" fill="none" stroke="rgb(255 255 255 / 0.08)" strokeWidth="1.5" />
        </pattern>
        <radialGradient id="talkFadeM">
          <stop offset="0.5" stopColor="#fff" />
          <stop offset="1" stopColor="#000" />
        </radialGradient>
        <mask id="talkMaskM">
          <rect width="688" height="540" fill="url(#talkFadeM)" />
        </mask>
      </defs>
      <rect width="688" height="540" fill="url(#talkGridM)" mask="url(#talkMaskM)" />
      <g fill="none" stroke="rgb(255 255 255 / 0.14)" strokeWidth="1.5">
        <circle cx="342" cy="277" r="75" />
        <circle cx="342" cy="277" r="145" />
        <circle cx="342" cy="277" r="275" />
      </g>
      <path
        d="M200 146 A205 205 0 1 1 304 476"
        fill="none"
        stroke="rgb(255 255 255 / 0.85)"
        strokeWidth="2.5"
        strokeDasharray="11 11"
      />
      <g fill="#fff">
        <circle cx="377" cy="74" r="8" />
        <circle cx="562" cy="278" r="8" />
        <circle cx="357" cy="483" r="8" />
        <circle cx="168" cy="277" r="8" />
      </g>
      <TalkCenter cx={342} cy={277} r={55} />
    </svg>
  );
}

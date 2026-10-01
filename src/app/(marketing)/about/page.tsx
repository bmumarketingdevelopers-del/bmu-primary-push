import type { Metadata } from "next";
import { PageHero } from "@/components/marketing/page-hero";
import { CtaBand } from "@/components/marketing/cta-band";
import { Reveal } from "@/components/marketing/reveal";
import { SectionHeading } from "@/components/marketing/section-heading";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { HERO_STATS } from "@/lib/content";
import { COMPANY, MILESTONES, STORY, TEAM, VALUES } from "@/lib/company-data";
import { cn, initials } from "@/lib/utils";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "About",
  description:
    "BMU.Marketing is an AI-first growth agency in Bengaluru - 24 people running strategy, creative, media and software for brands across nine cities.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="The agency that reports the losses too"
        lede={`Founded in ${COMPANY.founded} in ${COMPANY.city}. ${COMPANY.headcount} people running strategy, creative, media, web and software - so nobody can point at the other agency when the numbers slip.`}
      >
        <dl className={styles.stats}>
          {HERO_STATS.map((s) => (
            <div key={s.label}>
              <dt className={cn("display", styles.statValue)}>{s.value}</dt>
              <dd className={styles.statLabel}>{s.label}</dd>
            </div>
          ))}
        </dl>
      </PageHero>

      {/* Story */}
      <section className="section">
        <div className={cn("container", styles.storyGrid)}>
          <Reveal>
            <span className="eyebrow">Our story</span>
            <h2 className="sec-title">
              How this
              <br />
              came about
            </h2>
          </Reveal>

          <div className={styles.storyList}>
            {STORY.map((s, i) => (
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

      {/* Values */}
      <section className={cn("section", styles.altSection)}>
        <div className="container">
          <Reveal>
            <SectionHeading
              eyebrow="How we work"
              title={<>Four things we<br />refuse to bend on</>}
              lede="These cost us pitches occasionally. They're also why clients stay past the first year."
            />
          </Reveal>

          <div className={styles.valueGrid}>
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={(i % 2) * 0.07}>
                <article className={styles.valueCard}>
                  <h3 className={cn("display", styles.valueTitle)}>{v.title}</h3>
                  <p className={styles.valueBody}>{v.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section">
        <div className="container">
          <Reveal>
            <SectionHeading eyebrow="Timeline" title="Seven years, briefly" />
          </Reveal>

          <ol className={styles.timeline}>
            {MILESTONES.map((m, i) => (
              <Reveal key={m.year} delay={i * 0.06}>
                <li className={styles.milestone}>
                  <span className={styles.milestoneMarker}>
                    <span className={styles.milestoneDot} />
                  </span>
                  <p className={cn("display", styles.milestoneYear)}>{m.year}</p>
                  <p className={styles.milestoneLabel}>{m.label}</p>
                </li>
              </Reveal>
            ))}
          </ol>
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

      <CtaBand
        title="Come see whether we're a fit"
        body="We'll tell you on the first call if you'd be better served elsewhere. It happens about one time in five."
        secondary={{ href: "/case-studies", label: "Read the case studies" }}
      />
    </>
  );
}

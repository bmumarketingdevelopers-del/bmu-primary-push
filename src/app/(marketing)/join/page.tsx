import type { Metadata } from "next";
import { BadgeCheck, CalendarClock, IndianRupee, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/marketing/page-hero";
import { CreatorApplicationForm } from "@/components/marketing/creator-application-form";
import { Reveal } from "@/components/marketing/reveal";
import { SectionHeading } from "@/components/marketing/section-heading";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema } from "@/lib/structured-data";
import { cn } from "@/lib/utils";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Join BMU Creators",
  description:
    "Apply to the BMU Creators roster. Paid brand collaborations across food, travel, fitness, interiors and more — briefs matched to your city and category.",
};

const PROMISES = [
  {
    icon: IndianRupee,
    title: "The fee is agreed before you shoot",
    body: "You see the budget in the brief. It doesn't move after delivery, and it doesn't depend on how the post performs.",
  },
  {
    icon: CalendarClock,
    title: "Paid on the 3rd, every month",
    body: "Payouts run monthly for work approved in the previous month. TDS at 10%, certificate issued quarterly.",
  },
  {
    icon: ShieldCheck,
    title: "Usage rights are capped at 30 days",
    body: "Anything beyond that is a separate paid licence. Brands can't quietly run your face in an ad campaign for a year.",
  },
  {
    icon: BadgeCheck,
    title: "Briefs matched, not blasted",
    body: "You get briefs for your city and categories. We'd rather send you four relevant ones a quarter than forty you'll ignore.",
  },
];

const FAQS = [
  {
    q: "How many followers do I need?",
    a: "There's no hard floor. Engagement and category fit matter more — we've booked 12,000-follower accounts for neighbourhood restaurant work and turned down 200,000-follower accounts with hollow reach.",
  },
  {
    q: "Do I have to be in Bengaluru?",
    a: "No. Most work is Bengaluru, Mangaluru and Mysuru, but travel campaigns run coast-wide and D2C brands work pan-India. Tell us your city and we'll match accordingly.",
  },
  {
    q: "Can I say no to a brief?",
    a: "Always, and it doesn't affect future briefs. Tell us the brands or categories you won't touch when you apply and we'll filter them out before they reach you.",
  },
  {
    q: "Is this exclusive?",
    a: "No. You keep working with whoever you like, including other agencies. The only restriction is a short category exclusivity window inside a specific campaign, which is stated in that brief.",
  },
  {
    q: "What happens after I apply?",
    a: "We review weekly and reply either way. If accepted you get portal access, where briefs, deliverables and payouts all live.",
  },
];

export default function JoinPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ href: "/join", label: "Join BMU Creators" }])} />

      <PageHero
        eyebrow="BMU Creators"
        title="Get paid properly for the work you already make"
        lede="We book creators for brand campaigns across food, travel, fitness, interiors and retail. Clear briefs, agreed fees, and payouts that arrive when we said they would."
        breadcrumbs={[{ href: "/join", label: "Join" }]}
      />

      <section className="section">
        <div className="container">
          <Reveal>
            <SectionHeading
              eyebrow="What you get"
              title={<>Four things we put<br />in writing</>}
              lede="Creator work has a reputation for vague terms and late payment. These are the parts we made non-negotiable."
            />
          </Reveal>

          <div className={styles.promiseGrid}>
            {PROMISES.map((p, i) => {
              const Icon = p.icon;
              return (
                <Reveal key={p.title} delay={(i % 2) * 0.07}>
                  <article className={styles.promiseCard}>
                    <span className={styles.promiseIconWrap}>
                      <Icon className={styles.promiseIcon} strokeWidth={1.8} />
                    </span>
                    <h3 className={cn("display", styles.promiseTitle)}>{p.title}</h3>
                    <p className={styles.promiseBody}>{p.body}</p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className={cn("section", styles.applySection)}>
        <div className={cn("container", styles.applyContainer)}>
          <Reveal>
            <SectionHeading
              eyebrow="Apply"
              title="Tell us what you make"
              lede="Five minutes. Be accurate about reach — inflated numbers get found out at the first campaign report and cost you the roster spot."
            />
          </Reveal>
          <Reveal delay={0.1}>
            <CreatorApplicationForm />
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className={cn("container", styles.faqGrid)}>
          <Reveal>
            <span className="eyebrow">Questions</span>
            <h2 className="sec-title">
              Before you
              <br />
              apply
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <Accordion type="single" collapsible className={styles.faqList}>
              {FAQS.map((f) => (
                <AccordionItem key={f.q} value={f.q}>
                  <AccordionTrigger>{f.q}</AccordionTrigger>
                  <AccordionContent>{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </section>
    </>
  );
}

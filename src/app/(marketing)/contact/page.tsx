import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, LayoutGrid, Mail, MapPin, MessageCircle } from "lucide-react";
import { ContactPageForm, ContactSteps } from "./contact-page-form";
import { Reveal } from "@/components/marketing/reveal";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, faqSchema } from "@/lib/structured-data";
import { cn } from "@/lib/utils";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Book a free 30-minute consultation with BMU.Marketing. A written growth plan within three working days - no deck, no pressure.",
};

// Page-only copy, kept here so the shared company data stays untouched
const CONTACT = {
  email: "buildmyuniversee@gmail.com",
  whatsapp: "+91 81054 91414",
  address: "376, Phase 9, Royal Park Residency Layout, JP Nagar 9th Phase, J. P. Nagar, Bengaluru, Karnataka 560108",
};

const WHATSAPP_HREF = `https://wa.me/${CONTACT.whatsapp.replace(/[^0-9]/g, "")}`;

const STEPS = [
  { title: "Tell us where you are", body: "Your goals, budget and what's not working" },
  { title: "We review the opportunity", body: "A strategist books your 30-minute call" },
  { title: "30-minute growth call", body: "We review your website, Google profile and ad accounts" },
  { title: "Leave with a direction", body: "Practical next steps, no pressure." },
];

const CHANNELS = [
  {
    title: "WhatsApp",
    body: "Quickest way to ask a question, discuss a project or check availability.",
    action: CONTACT.whatsapp,
    href: WHATSAPP_HREF,
    Icon: MessageCircle,
  },
  {
    title: "Email",
    body: "Send a brief, an RFP or your current reporting and we'll come back with questions.",
    action: CONTACT.email,
    href: `mailto:${CONTACT.email}`,
    Icon: Mail,
  },
  {
    title: "Existing client?",
    body: "Head straight to your client dashboard for updates, reports and account support.",
    action: "Open dashboard",
    href: "/dashboard",
    Icon: LayoutGrid,
  },
];

const FAQS = [
  {
    q: "What happens after I submit this?",
    a: "We review your details and get back to you within one working day. If there's a potential fit, we'll schedule a focused 30-minute conversation to understand your goals, challenges and current marketing setup.",
  },
  {
    q: "What does the first call include?",
    a: "A straightforward conversation about your business, what you're trying to achieve and what's currently getting in the way. No lengthy presentation or hard sell.",
  },
  {
    q: "Do you work with businesses outside Bengaluru?",
    a: "Yes. We work with businesses across India and can collaborate remotely with teams wherever they're based.",
  },
  {
    q: "What's the smallest engagement you take?",
    a: "It depends on the challenge, scope and goals. We prefer understanding what you need first and then recommending the right engagement.",
  },
];

export default function ContactPage() {
  return (
    <>
      <JsonLd data={[breadcrumbSchema([{ href: "/contact", label: "Contact" }]), faqSchema(FAQS)]} />

      {/* Hero: dark band under the header, text left, "what happens next" card right */}
      <section className={styles.hero}>
        <div className={cn("container", styles.heroGrid)}>
          <div className={styles.heroText}>
            <h1 className={cn("display", styles.heroTitle)}>Let&apos;s talk what&apos;s next for your growth.</h1>
            <p className={styles.heroLede}>
              Tell us where your business is today, what you&apos;re trying to achieve, and what&apos;s getting in
              the way. We&apos;ll take a focused look and help you identify the next move.
            </p>
            <p className={styles.heroPill}>
              <span className={styles.heroPillDot} aria-hidden="true" />
              We&apos;ll get back to you within one working day
            </p>
          </div>

          <div className={styles.steps}>
            <p className={styles.stepsLabel}>What happens next</p>
            <ContactSteps steps={STEPS} />
          </div>
        </div>
      </section>

      {/* Form left, direct channels + studio right */}
      <section className="section">
        <div className={cn("container", styles.mainGrid)}>
          <Reveal className={styles.formCard}>
            <h2 className={cn("display", styles.formTitle)}>Book a free growth consultation</h2>
            <p className={styles.formSub}>Fields marked * are required.</p>
            <ContactPageForm />
          </Reveal>

          <Reveal delay={0.1} className={styles.side}>
            <div className={styles.direct}>
              <h3 className={styles.directTitle}>Prefer to reach out directly?</h3>
              <ul className={styles.channels}>
                {CHANNELS.map(({ title, body, action, href, Icon }) => {
                  const external = href.startsWith("http") || href.startsWith("mailto");
                  const link = (
                    <>
                      {action} <ArrowRight aria-hidden="true" />
                    </>
                  );
                  return (
                    <li key={title} className={styles.channel}>
                      <span className={styles.channelIcon}>
                        <Icon aria-hidden="true" />
                      </span>
                      <div className={styles.channelBody}>
                        <h4 className={styles.channelTitle}>{title}</h4>
                        <p className={styles.channelText}>{body}</p>
                        {external ? (
                          <a href={href} target="_blank" rel="noreferrer" className={styles.channelAction}>
                            {link}
                          </a>
                        ) : (
                          <Link href={href} className={styles.channelAction}>
                            {link}
                          </Link>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className={styles.studio}>
              <h3 className={cn("display", styles.studioTitle)}>BMU Studio</h3>
              <ul className={styles.studioList}>
                <li className={styles.studioItem}>
                  <MapPin className={styles.studioIcon} aria-hidden="true" />
                  <span>{CONTACT.address}</span>
                </li>
                <li className={styles.studioItem}>
                  <Clock className={styles.studioIcon} aria-hidden="true" />
                  <span>Mon–Fri · 9:30 AM–6:30 PM IST</span>
                </li>
                <li className={styles.studioItem}>
                  <Mail className={styles.studioIcon} aria-hidden="true" />
                  <a href={`mailto:${CONTACT.email}`} className={styles.studioLink}>
                    {CONTACT.email}
                  </a>
                </li>
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ: intro + WhatsApp button left, dropdowns right (first one open) */}
      <section className={cn("section", styles.faqSection)}>
        <div className={cn("container", styles.faqGrid)}>
          <Reveal>
            <span className="eyebrow">Before you start</span>
            <h2 className={cn("display", styles.faqTitle)}>A few things worth knowing first.</h2>
            <p className={styles.faqLede}>
              Still deciding if BMU is right for you?
              <br />
              Here are a few answers to the questions we hear most.
            </p>
            <a href={WHATSAPP_HREF} target="_blank" rel="noreferrer" className={styles.faqButton}>
              Ask us on WhatsApp <ArrowRight aria-hidden="true" />
            </a>
          </Reveal>
          <Reveal delay={0.1}>
            <Accordion type="single" collapsible defaultValue={FAQS[0].q} className={styles.faqList}>
              {FAQS.map((f) => (
                <AccordionItem key={f.q} value={f.q} className={styles.faqItem}>
                  <AccordionTrigger icon="chevron" className={styles.faqTrigger}>
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className={styles.faqAnswer}>{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </section>
    </>
  );
}

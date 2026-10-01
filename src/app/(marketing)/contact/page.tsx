import type { Metadata } from "next";
import Link from "next/link";
import { CalendarCheck, LifeBuoy, Mail, MapPin, MessageCircle, Clock } from "lucide-react";
import { PageHero } from "@/components/marketing/page-hero";
import { ContactForm } from "@/components/marketing/contact-form";
import { Reveal } from "@/components/marketing/reveal";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { COMPANY, CONTACT_CHANNELS, CONTACT_FAQS } from "@/lib/company-data";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, faqSchema } from "@/lib/structured-data";
import { cn } from "@/lib/utils";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Book a free 30-minute consultation with BMU.Marketing. A written growth plan within three working days - no deck, no pressure.",
};

const ICONS = { CalendarCheck, MessageCircle, Mail, LifeBuoy };

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([{ href: "/contact", label: "Contact" }]),
          faqSchema(CONTACT_FAQS),
        ]}
      />
      <PageHero
        eyebrow="Contact"
        title="Tell us what you're trying to grow"
        lede="Thirty minutes on a call, a look at your current numbers, and a written plan within three working days. The plan is yours either way."
      />

      <section className="section">
        <div className={cn("container", styles.mainGrid)}>
          <Reveal className={styles.sidebar}>
            <div className={styles.channels}>
              {CONTACT_CHANNELS.map((c) => {
                const Icon = ICONS[c.icon as keyof typeof ICONS];
                const body = (
                  <div className={styles.channel}>
                    <span className={styles.channelIconWrap}>
                      <Icon className={styles.channelIcon} strokeWidth={1.8} />
                    </span>
                    <div className={styles.channelBody}>
                      <h3 className={styles.channelTitle}>{c.title}</h3>
                      <p className={styles.channelText}>{c.body}</p>
                      <p className={styles.channelAction}>{c.action}</p>
                    </div>
                  </div>
                );

                if (!c.href) return <div key={c.title}>{body}</div>;
                const external = c.href.startsWith("http") || c.href.startsWith("mailto");
                return external ? (
                  <a key={c.title} href={c.href} target="_blank" rel="noreferrer">
                    {body}
                  </a>
                ) : (
                  <Link key={c.title} href={c.href}>
                    {body}
                  </Link>
                );
              })}
            </div>

            <div className={styles.studio}>
              <h3 className={cn("display", styles.studioTitle)}>Studio</h3>
              <ul className={styles.studioList}>
                <li className={styles.studioItem}>
                  <MapPin className={styles.studioIcon} />
                  <span className={styles.studioText}>{COMPANY.address}</span>
                </li>
                <li className={styles.studioItem}>
                  <Clock className={styles.studioIcon} />
                  <span className={styles.studioText}>{COMPANY.hours}</span>
                </li>
                <li className={styles.studioItem}>
                  <Mail className={styles.studioIcon} />
                  <a href={`mailto:${COMPANY.email}`} className={styles.studioLink}>
                    {COMPANY.email}
                  </a>
                </li>
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <ContactForm />
          </Reveal>
        </div>
      </section>

      <section className={cn("section", styles.faqSection)}>
        <div className={cn("container", styles.faqGrid)}>
          <Reveal>
            <span className="eyebrow">Before you write</span>
            <h2 className="sec-title">
              Questions we get
              <br />
              on this page
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <Accordion type="single" collapsible className={styles.faqList}>
              {CONTACT_FAQS.map((f) => (
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

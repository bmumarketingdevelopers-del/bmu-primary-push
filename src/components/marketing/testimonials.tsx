import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SectionHeading } from "./section-heading";
import { Reveal } from "./reveal";
import { SwipeCarousel } from "./swipe-carousel";
import { TESTIMONIALS } from "@/lib/content";
import { cn, initials } from "@/lib/utils";
import styles from "./testimonials.module.css";

type Quote = { quote: string; author: string; role: string };

export function Testimonials({ items }: { items?: Quote[] }) {
  const quotes = items?.length ? items : TESTIMONIALS;

  return (
    <section className={cn("section", styles.testimonials)}>
      <div className="container">
        <Reveal>
          <SectionHeading
            className={styles.heading}
            eyebrow="Testimonials"
            title={<>What clients say<br />after month three</>}
          />
        </Reveal>

        <SwipeCarousel label="Testimonials">
          {quotes.map((t, i) => (
            <Reveal key={t.author} delay={i * 0.07} className={styles.reveal}>
              <figure className={styles.card}>
                <p className={cn("display", styles.mark)}>&ldquo;</p>
                <blockquote className={styles.quote}>{t.quote}</blockquote>
                <figcaption className={styles.author}>
                  <Avatar>
                    <AvatarFallback>{initials(t.author)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <b className={styles.name}>{t.author}</b>
                    <span className={styles.role}>{t.role}</span>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </SwipeCarousel>
      </div>
    </section>
  );
}

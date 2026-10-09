"use client";

import * as React from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import styles from "./page.module.css";

type Plan = { name: string; desc: string; featured: boolean };
/**
 * A plan's price. Monthly retainers: `monthly` fee, 6-month `now` price and crossed-out `was`.
 * One-time projects (`oneTime`): `monthly` holds the project price, shown without "/m" and with a
 * "One-time project" label; `from` puts "From" before it.
 * Per-shoot prices (`perShoot`, business video shoots): `monthly` holds the price of one shoot,
 * shown without "/m" and with a "Per shoot" label.
 * With a shoot option (`withShoot`, social media management): `monthly` / `six` are the prices
 * without a shoot and `withShoot` the prices with one; the card shows both rows and, when open,
 * a "Start without shoot" and a "Start with shoot" button, each locking its own price on Contact.
 */
type Price = {
  monthly: string;
  now?: string;
  was?: string;
  oneTime?: boolean;
  perShoot?: boolean;
  /** per-session prices (podcast shoots): the session length, e.g. "3 hrs"; shown without "/m" */
  perSession?: string;
  /** per-campaign prices (brand collaborations, experiential ads); shown without "/m" */
  perCampaign?: boolean;
  from?: boolean;
  six?: string;
  withShoot?: { monthly: string; six: string; sessions: number };
};
export type PlanService = {
  name: string;
  /** the matching "What do you need first?" option on the Contact form, e.g. "Marketing and Visibility - SEO" */
  need?: string;
  prices: [Price, Price, Price];
  /** what each plan includes, [Starter, Growth, Premium]; services with lists can expand */
  features?: [string[], string[], string[]];
};

/**
 * Contact page link for a plan: pre-fills "What do you need first?" with the service and locks
 * "Monthly budget" to this plan's own price (e.g. "₹23,800 / month · Starter plan").
 */
function contactHref(need: string | undefined, plan: string, price: Price, shoot?: "with" | "without") {
  if (!need) return "/contact";
  const amount = shoot === "with" && price.withShoot ? price.withShoot.monthly : price.monthly;
  const params = new URLSearchParams({ need, plan, price: amount });
  if (price.oneTime) params.set("type", "one-time");
  if (price.perShoot) params.set("type", "per-shoot");
  if (price.perSession) params.set("type", "per-session");
  if (price.perCampaign) params.set("type", "per-campaign");
  if (price.from) params.set("from", "1");
  if (shoot) params.set("shoot", shoot);
  if (shoot === "with" && price.withShoot) params.set("sessions", String(price.withShoot.sessions));
  return `/contact?${params.toString()}`;
}

const sessionsLabel = (n: number) => `${n} ${n === 1 ? "session" : "sessions"}`;

/**
 * One service's three plan cards. When the service has feature lists, "Explore" expands the
 * section right here on the page: all three cards grow to show what each plan includes, and their
 * buttons turn into "Start with …" (with a short glow) that lead to the Contact page. The ✕ next
 * to the service title collapses it again. Without lists, "Explore" goes straight to Contact.
 */
export function PlanExplorer({ service, plans }: { service: PlanService; plans: Plan[] }) {
  const [open, setOpen] = React.useState(false);
  const listId = React.useId();

  /* Phones: the three cards are a swipeable row (like the landing page Services cards), with dots
     under it. On tablet/desktop the row is a normal 3-column grid and this does nothing visible. */
  const trackRef = React.useRef<HTMLDivElement>(null);
  const [active, setActive] = React.useState(0);

  // Which card is nearest the start of the row
  const closestCard = (track: HTMLElement) => {
    const cards = Array.from(track.children) as HTMLElement[];
    const first = cards[0]?.offsetLeft ?? 0;
    let best = 0;
    cards.forEach((c, i) => {
      if (Math.abs(c.offsetLeft - first - track.scrollLeft) < Math.abs(cards[best].offsetLeft - first - track.scrollLeft))
        best = i;
    });
    return best;
  };

  React.useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onScroll = () => setActive(closestCard(track));
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, []);

  const goTo = (i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const cards = Array.from(track.children) as HTMLElement[];
    track.scrollTo({ left: cards[i].offsetLeft - cards[0].offsetLeft, behavior: "smooth" });
    setActive(i);
  };
  const expandable = Boolean(service.features);

  return (
    <div className={cn(styles.service, open && styles.serviceOpen)}>
      <div className={styles.serviceHead}>
        <h3 className={styles.serviceTitle}>{service.name}</h3>
        {open && (
          <button
            type="button"
            className={styles.serviceClose}
            onClick={() => setOpen(false)}
            aria-label={`Close ${service.name} plan details`}
            aria-controls={listId}
          >
            <X aria-hidden="true" />
          </button>
        )}
      </div>

      <div id={listId} ref={trackRef} className={styles.planGrid}>
        {plans.map((plan, i) => {
          const price = service.prices[i];
          const features = service.features?.[i];
          return (
            <div key={plan.name} className={cn(styles.plan, plan.featured && styles.planFeatured)}>
              <div className={styles.planTop}>
                <span className={cn("display", styles.planName)}>{plan.name}</span>
                {plan.featured && <span className={styles.planBadge}>Most chosen</span>}
              </div>
              <p className={styles.planDesc}>{plan.desc}</p>
              {price.withShoot ? (
                // two prices: without a shoot, then (under a thin line) with a shoot
                <div className={styles.planShoot}>
                  <div className={styles.planShootRow}>
                    <p>
                      <span className={cn("display", styles.planShootPrice)}><span className={styles.rupee}>₹</span>{price.monthly}</span>
                      <span className={styles.planShootLabel}>Without Shoot</span>
                    </p>
                    <p className={styles.planShootSix}>₹{price.six} for 6 months</p>
                  </div>
                  <div className={styles.planShootRow}>
                    <p>
                      <span className={cn("display", styles.planShootPrice)}><span className={styles.rupee}>₹</span>{price.withShoot.monthly}</span>
                      <span className={styles.planShootLabel}>
                        With Shoot · {sessionsLabel(price.withShoot.sessions).toUpperCase()}
                      </span>
                    </p>
                    <p className={styles.planShootSix}>₹{price.withShoot.six} for 6 months</p>
                  </div>
                </div>
              ) : (
                <p className={cn("display", styles.planPrice)}>
                  {price.from && <span className={styles.planFrom}>From </span>}<span className={styles.rupee}>₹</span>{price.monthly}
                  {!price.oneTime && !price.perShoot && !price.perSession && !price.perCampaign && "/m"}
                </p>
              )}
              {price.withShoot ? null : price.oneTime ? (
                <p className={styles.planNow}>ONE-TIME PROJECT</p>
              ) : price.perShoot ? (
                <p className={styles.planNow}>PER SHOOT</p>
              ) : price.perSession ? (
                <p className={styles.planNow}>PER SESSION · {price.perSession.toUpperCase()}</p>
              ) : price.perCampaign ? (
                <p className={styles.planNow}>PER CAMPAIGN</p>
              ) : (
                <p className={styles.planNow}>
                  Now @ <strong>₹{price.now}</strong> <s>₹{price.was}</s>/6months
                </p>
              )}

              {/* feature list: always in the page, slides open/closed with the section */}
              {features && (
                <div className={styles.planMore} aria-hidden={!open}>
                  <div className={styles.planMoreInner}>
                    <ul className={styles.planFeatures}>
                      {features.map((f) => (
                        <li key={f}>{f}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {open && price.withShoot ? (
                // shoot option: one button per price, each locking its own price on Contact
                <div className={styles.planBtnPair}>
                  <Link
                    href={contactHref(service.need, plan.name, price, "without")}
                    className={cn(styles.planBtn, plan.featured && styles.planBtnFeatured, styles.planBtnStart)}
                  >
                    <span>Start without shoot</span>
                  </Link>
                  <Link
                    href={contactHref(service.need, plan.name, price, "with")}
                    className={cn(styles.planBtn, plan.featured && styles.planBtnFeatured, styles.planBtnStart)}
                  >
                    <span>Start with shoot</span>
                  </Link>
                </div>
              ) : open ? (
                // the changed button: glows and slides its new label in so the change is noticed;
                // opens the Contact page with this service chosen and this plan's price as the budget
                <Link
                  href={contactHref(service.need, plan.name, price)}
                  className={cn(styles.planBtn, plan.featured && styles.planBtnFeatured, styles.planBtnStart)}
                >
                  <span>Start with {plan.name}</span>
                </Link>
              ) : expandable ? (
                <button
                  type="button"
                  className={cn(styles.planBtn, plan.featured && styles.planBtnFeatured)}
                  onClick={() => setOpen(true)}
                  aria-expanded={false}
                  aria-controls={listId}
                >
                  Explore
                </button>
              ) : (
                <Link href="/contact" className={cn(styles.planBtn, plan.featured && styles.planBtnFeatured)}>
                  Explore
                </Link>
              )}
            </div>
          );
        })}
      </div>

      {/* phones only: one dot per card, the current one green and wide; tap to slide to it */}
      <div className={styles.planDots}>
        {plans.map((plan, i) => (
          <button
            key={plan.name}
            type="button"
            aria-label={`Show ${service.name} ${plan.name} plan`}
            aria-current={active === i ? "true" : undefined}
            className={cn(styles.planDot, active === i && styles.planDotActive)}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </div>
  );
}

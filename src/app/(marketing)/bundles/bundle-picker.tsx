"use client";

import * as React from "react";
import Link from "next/link";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Check, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import styles from "./page.module.css";

export type Plan = {
  monthly: string;
  /** 6-month total shown under the price */
  six?: string;
  /** one-time part, shown as "+ ₹… ONE-TIME" */
  oneTime?: string;
};

export type Bundle = { name: string; desc: string; services: string[]; plans: [Plan, Plan, Plan] };

const PLAN_NAMES = ["Starter", "Growth", "Premium"];
const PLAN_DESCS = ["The essentials to get started.", "Tools to grow your business.", "Everything for maximum growth."];

/* ---- Add-ons (shown under the selected bundle). Quoted groups first, then the fixed-price ones. */
const ADD_ONS = [
  {
    title: "Content & Creative",
    items: [
      "Additional social posts or carousels",
      "Additional reels or short-form edits",
      "Festival and campaign creative sets",
      "Marketing collateral and print design",
      "Additional design revisions beyond package scope",
    ],
  },
  {
    title: "Production",
    items: [
      "Additional shoot hours or shoot days",
      "Additional location",
      "Drone coverage where permitted",
      "Product styling and props",
      "Model or actor coordination",
      "Travel beyond Bengaluru city limits",
    ],
  },
  {
    title: "Creator & UGC",
    items: [
      "Additional UGC videos",
      "Additional creators in a campaign",
      "Creator payments and product seeding",
      "Usage rights extension for paid media",
      "Whitelisting and spark ad setup",
    ],
  },
  {
    title: "Web, SEO & AI",
    items: [
      "Additional website pages",
      "E-commerce or payment integration",
      "Booking and appointment flows",
      "Additional keyword scope",
      "CRM and API integrations",
      "Website maintenance retainer",
    ],
  },
  {
    title: "Management",
    items: [
      "Ad spend management above standard scope",
      "Additional platform in a social retainer",
      "Dedicated account manager",
      "Weekly reporting and review calls",
    ],
  },
];

const PRICED_ADD_ONS = [
  { name: "Additional platform in a social media package", price: "6,600", each: true },
  { name: "Additional shoot session (6 hours)", price: "9,500" },
  { name: "Ranking on AI engines (AEO / GEO)", price: "9,500" },
];

// ₹ in the big prices: sized to the digits (the display font has no ₹ of its own)
const Rupee = () => <span className={styles.rupee}>₹</span>;

/**
 * One bundle card. On the Bundles page SELECT is a dropdown of the three plans; in the overlay the
 * card is read-only with the chosen plan highlighted.
 */
function BundleCard({
  bundle: b,
  onSelect,
  chosen,
}: {
  bundle: Bundle;
  onSelect?: (plan: number) => void;
  /** index of the chosen plan (overlay only) */
  chosen?: number;
}) {
  const withOneTime = b.plans.some((p) => p.oneTime);
  // overlay: the chosen plan is highlighted, the other two fade back
  const planState = (i: number) => chosen !== undefined && (i === chosen ? styles.planChosen : styles.planDimmed);
  return (
    <article className={styles.card}>
      {onSelect && (
        <DropdownMenu.Root modal={false}>
          <DropdownMenu.Trigger asChild>
            <button type="button" className={styles.select} aria-label={`Select a ${b.name} plan`}>
              Select <ChevronDown aria-hidden="true" />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content className={styles.selectMenu} align="end" sideOffset={6}>
              {b.plans.map((p, i) => (
                <DropdownMenu.Item key={PLAN_NAMES[i]} className={styles.selectMenuItem} onSelect={() => onSelect(i)}>
                  <span className={cn("display", styles.selectMenuName)}>{PLAN_NAMES[i]}</span>
                  <span className={styles.selectMenuPrice}>
                    ₹{p.monthly}/M{p.oneTime && ` + ₹${p.oneTime} one-time`}
                  </span>
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      )}
      <div>
        <h3 className={cn("display", styles.cardTitle)}>{b.name}</h3>
        <p className={styles.cardDesc}>{b.desc}</p>
        <ul className={styles.chips}>
          {b.services.map((s) => (
            <li key={s} className={styles.chip}>
              {s}
            </li>
          ))}
        </ul>
      </div>

      <ul className={styles.plans}>
        {b.plans.map((p, i) =>
          withOneTime ? (
            // monthly + one-time: one line of prices, the 6-month line underneath
            <li key={PLAN_NAMES[i]} className={cn(styles.plan, styles.planSplit, planState(i))}>
              <div className={styles.planSplitRow}>
                <span className={cn("display", styles.planName)}>{PLAN_NAMES[i]}</span>
                <span className={styles.planPrices}>
                  <span className={cn("display", styles.price)}>
                    <Rupee />
                    {p.monthly}
                  </span>
                  <span className={styles.unit}>/M</span>
                  <span className={cn("display", styles.price, styles.plus)}>
                    + <Rupee />
                    {p.oneTime}
                  </span>
                  <span className={styles.unit}>ONE-TIME</span>
                </span>
              </div>
              {p.six && (
                <p className={styles.planLine}>
                  ₹{p.six} for 6 months + ₹{p.oneTime} one - time
                </p>
              )}
            </li>
          ) : (
            // monthly only: plan name + line on the left, price box on the right
            <li key={PLAN_NAMES[i]} className={cn(styles.plan, planState(i))}>
              <span>
                <span className={cn("display", styles.planName)}>{PLAN_NAMES[i]}</span>
                <span className={styles.planDesc}>{PLAN_DESCS[i]}</span>
              </span>
              <span className={styles.priceBox}>
                <span>
                  <span className={cn("display", styles.price)}>
                    <Rupee />
                    {p.monthly}
                  </span>
                  <span className={styles.unit}>/M</span>
                </span>
                {p.six && <span className={styles.priceSix}>₹{p.six} for 6 months</span>}
              </span>
            </li>
          ),
        )}
      </ul>

      <p className={styles.saving}>10% bundle saving applied</p>
    </article>
  );
}

/**
 * The eight bundle cards. Picking a plan from SELECT opens a full-screen overlay over the Bundles page
 * with the chosen bundle and plan (read-only) and the add-ons. The page underneath keeps its scroll spot; the close button,
 * Escape and the phone's back button all return to the cards.
 */
export function BundlePicker({ bundles }: { bundles: Bundle[] }) {
  // the chosen bundle and plan (0 Starter, 1 Growth, 2 Premium)
  const [selected, setSelected] = React.useState<{ bundle: Bundle; plan: number } | null>(null);
  // add-on groups the visitor has added to the bundle (titles, in the order they were added)
  const [added, setAdded] = React.useState<string[]>([]);
  const closeRef = React.useRef<HTMLButtonElement>(null);

  const open = (b: Bundle, plan: number) => {
    // one history entry per open, so the back button closes the overlay instead of leaving the page
    window.history.pushState({ bundleOverlay: true }, "");
    setAdded([]);
    setSelected({ bundle: b, plan });
  };
  const toggleAddOn = (title: string) =>
    setAdded((a) => (a.includes(title) ? a.filter((t) => t !== title) : [...a, title]));

  // Contact links carry the bundle, its chosen plan and price (plus the one-time fee, if any)
  // so the Contact form can lock "What do you need first?" and "Monthly budget" to them
  const contactHref = ({ bundle: b, plan }: { bundle: Bundle; plan: number }, addOns: string[]) => {
    const p = b.plans[plan];
    const params = new URLSearchParams({ bundle: b.name, plan: PLAN_NAMES[plan], price: p.monthly });
    if (p.oneTime) params.set("once", p.oneTime);
    addOns.forEach((t) => params.append("addon", t));
    return `/contact?${params}`;
  };
  const close = () => window.history.back();

  React.useEffect(() => {
    if (!selected) return;
    const onPop = () => setSelected(null);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && window.history.back();
    window.addEventListener("popstate", onPop);
    window.addEventListener("keydown", onKey);
    // the page underneath stays still while the overlay is open
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      window.removeEventListener("popstate", onPop);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [selected]);

  return (
    <>
      <div className={styles.grid}>
        {bundles.map((b) => (
          <BundleCard key={b.name} bundle={b} onSelect={(plan) => open(b, plan)} />
        ))}
      </div>

      {selected && (
        <div className={styles.overlay} role="dialog" aria-modal="true" aria-label={`${selected.bundle.name} bundle, ${PLAN_NAMES[selected.plan]} plan`}>
          <div className={styles.overlayBar}>
            <div className={cn("container", styles.overlayBarInner)}>
              <span className={styles.heroEyebrow}>
                <span className={styles.dash} aria-hidden="true" />
                Selected bundle · {PLAN_NAMES[selected.plan]} plan
              </span>
              <button ref={closeRef} type="button" className={styles.overlayClose} onClick={close}>
                <X aria-hidden="true" />
                <span className="sr-only">Close and go back to bundles</span>
              </button>
            </div>
          </div>

          <div className={cn("container", styles.overlayBody)}>
            {/* the chosen bundle, read-only */}
            <div className={styles.selectedCard}>
              <BundleCard bundle={selected.bundle} chosen={selected.plan} />
            </div>

            {/* Add-ons: five quoted groups */}
            <section className={styles.addOns}>
              <h2 className={cn("display", styles.addOnsTitle)}>Add-ons</h2>
              <p className={styles.addOnsLede}>
                Every package can be extended. Add-ons are quoted against the existing scope so the retainer stays
                clean and predictable.
              </p>
              <div className={styles.addOnGrid}>
                {ADD_ONS.map((g) => {
                  const isAdded = added.includes(g.title);
                  return (
                    <article key={g.title} className={cn(styles.addOnCard, isAdded && styles.addOnCardAdded)}>
                      <h3 className={cn("display", styles.addOnTitle)}>{g.title}</h3>
                      <ul className={styles.addOnList}>
                        {g.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                      {/* Custom Quote on the left, Add (or Added, click to remove) on the right */}
                      <div className={styles.addOnActions}>
                        <Link
                          href={contactHref(selected, [g.title])}
                          className={cn("display", styles.quoteBtn)}
                        >
                          Custom Quote
                        </Link>
                        <button
                          type="button"
                          className={cn("display", styles.addBtn, isAdded && styles.addBtnAdded)}
                          aria-pressed={isAdded}
                          onClick={() => toggleAddOn(g.title)}
                        >
                          {isAdded ? (
                            <>
                              <Check aria-hidden="true" /> Added
                            </>
                          ) : (
                            "Add"
                          )}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* Priced add-ons: fixed prices */}
              <h3 className={cn("display", styles.pricedTitle)}>Priced add-ons</h3>
              <ul className={styles.pricedList}>
                {PRICED_ADD_ONS.map((a) => (
                  <li key={a.name} className={styles.pricedRow}>
                    <span>{a.name}</span>
                    <span className={cn("display", styles.pricedPrice)}>
                      <Rupee />
                      {a.price}
                      {a.each && " each"}
                    </span>
                  </li>
                ))}
              </ul>
              <p className={styles.addOnsNote}>
                <span className={cn("display", styles.addOnsNoteLabel)}>Note</span>
                Add-on pricing is confirmed in writing before execution. All prices exclusive of GST.
              </p>

              {/* Your selection: the bundle + every added add-on (each can be removed here) */}
              <div className={styles.selection} aria-live="polite">
                <p className={cn("display", styles.selectionTitle)}>Your selection</p>
                <ul className={styles.selectionList}>
                  <li className={cn(styles.selectionChip, styles.selectionBundle)}>{selected.bundle.name} bundle · {PLAN_NAMES[selected.plan]}</li>
                  {added.map((t) => (
                    <React.Fragment key={t}>
                      <li className={styles.selectionPlus} aria-hidden="true">
                        +
                      </li>
                      <li className={styles.selectionChip}>
                        {t}
                        <button
                          type="button"
                          className={styles.selectionRemove}
                          onClick={() => toggleAddOn(t)}
                          aria-label={`Remove ${t}`}
                        >
                          <X aria-hidden="true" />
                        </button>
                      </li>
                    </React.Fragment>
                  ))}
                </ul>
                {added.length === 0 && (
                  <p className={styles.selectionHint}>No add-ons yet. Tap “Add” on any add-on above to include it.</p>
                )}
              </div>

              <div className={styles.proceedWrap}>
                <Link href={contactHref(selected, added)} className={cn("display", styles.proceedBtn)}>
                  Proceed with custom bundles
                </Link>
              </div>
            </section>
          </div>
        </div>
      )}
    </>
  );
}

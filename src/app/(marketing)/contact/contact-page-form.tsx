"use client";

import * as React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ArrowRight, Check, CheckCircle2, ChevronDown, ChevronRight, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BUDGET_BANDS } from "@/lib/company-data";
import { SERVICE_PAGES } from "@/lib/service-pages-data";
import { cn } from "@/lib/utils";
import { formContext } from "@/lib/form-context";
import styles from "./page.module.css";

/**
 * Contact page form. Same fields and submission as the shared ContactForm, with the landing page's
 * "What do you need first?" dropdown (copied from contact-cta.tsx): each service opens a submenu of its
 * offerings on hover. An offering is submitted as "Service - Offering" so the lead says exactly what was picked.
 */
const NEED_GROUPS = SERVICE_PAGES.map((s) => ({
  value: s.title,
  label: s.title,
  options: (s.detail?.offerings ?? []).map((o) => ({ value: `${s.title} - ${o.title}`, label: o.title })),
}));

const NEED_LABELS = new Map(
  NEED_GROUPS.flatMap((g) => [[g.value, g.label] as const, ...g.options.map((o) => [o.value, o.label] as const)]),
);

// Phones have no room beside the list for a submenu, so services expand in place there instead
const PHONE_QUERY = "(max-width: 639px)";

function subscribePhone(onChange: () => void) {
  const mq = window.matchMedia(PHONE_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function useIsPhone() {
  return React.useSyncExternalStore(
    subscribePhone,
    () => window.matchMedia(PHONE_QUERY).matches,
    () => false,
  );
}

// The page's query string (read once in the browser; empty while rendering on the server)
const noSubscribe = () => () => {};
const useSearch = () =>
  React.useSyncExternalStore(
    noSubscribe,
    () => window.location.search,
    () => "",
  );

export function ContactPageForm() {
  const [state, setState] = React.useState<"idle" | "sending" | "sent" | "error">("idle");

  // Coming from a Pricing plan ("Start with …"), the link carries ?need=…&plan=…&price=…:
  // "What do you need first?" shows that plan's service and "Monthly budget" its exact price,
  // both locked. Only valid values are used; any other visit gets the normal dropdowns.
  const search = useSearch();
  const prefill = React.useMemo(() => {
    const params = new URLSearchParams(search);
    const n = params.get("need");
    const plan = params.get("plan");
    const price = params.get("price");
    const validPlan = plan === "Starter" || plan === "Growth" || plan === "Premium";
    const validPrice = price !== null && /^\d{1,3}(,\d{2,3})*$/.test(price);
    // one-time projects (e.g. Complete Branding): "₹38,000 one-time", "From ₹1,42,500 one-time"
    const oneTime = params.get("type") === "one-time";
    const from = params.get("from") === "1" ? "From " : "";
    // social media plans: "₹23,800 / month without shoot", "₹33,200 / month with shoot (1 session)"
    const shoot = params.get("shoot");
    const sessions = Number(params.get("sessions"));
    const shootText =
      shoot === "without"
        ? " without shoot"
        : shoot === "with" && Number.isInteger(sessions) && sessions > 0 && sessions < 10
          ? ` with shoot (${sessions} ${sessions === 1 ? "session" : "sessions"})`
          : "";
    // per-shoot prices (business video shoots): "₹11,400 per shoot"
    const perShoot = params.get("type") === "per-shoot";
    // per-session prices (podcast shoots): "₹14,200 per session"
    const perSession = params.get("type") === "per-session";
    // per-campaign prices (brand collaborations, experiential ads): "₹38,000 per campaign"
    const perCampaign = params.get("type") === "per-campaign";
    const amount = oneTime
      ? `${from}₹${price} one-time`
      : perShoot
        ? `${from}₹${price} per shoot`
        : perSession
          ? `${from}₹${price} per session`
          : perCampaign
            ? `${from}₹${price} per campaign`
            : `₹${price} / month${shootText}`;
    return {
      need: n && NEED_LABELS.has(n) ? n : null,
      lockedBudget: validPlan && validPrice ? `${amount} · ${plan} plan` : null,
    };
  }, [search]);

  const [needChoice, setNeed] = React.useState<string | null>(null);
  const [budgetChoice, setBudget] = React.useState<string | null>(null);
  const lockedBudget = prefill.lockedBudget;
  // Coming from a plan locks the service too (the plan's own service, can't be changed here)
  const lockedNeed = lockedBudget && prefill.need ? prefill.need : null;
  // Empty until picked (or pre-filled); the field is optional
  const need = lockedNeed ?? needChoice ?? prefill.need ?? "";
  // The plan's own price when locked; otherwise the visitor's pick, starting on the first band
  const budget = lockedBudget ?? budgetChoice ?? BUDGET_BANDS[0];
  const isPhone = useIsPhone();
  // Phones only: the service whose sub-services are expanded in the list
  const [expanded, setExpanded] = React.useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    const f = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: f.get("name"),
          phone: f.get("phone"),
          email: f.get("email"),
          need: f.get("need"),
          company: f.get("company"),
          budget: f.get("budget"),
          message: f.get("message"),
          form: "contact",
          ...formContext(),
        }),
      });
      setState(res.ok ? "sent" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <div className={styles.cfSent}>
        <CheckCircle2 className={styles.cfSentIcon} strokeWidth={1.6} />
        <h3 className={cn("display", styles.cfSentTitle)}>Request received</h3>
        <p className={styles.cfSentBody}>
          A strategist replies within one working day to book the call. If it&apos;s urgent, WhatsApp is faster
          - the number is in the panel beside the form.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit}>
      <div className={styles.cfGrid}>
        <Field id="name" label="Your name" required placeholder="Priya Raghavan" />
        <Field id="company" label="Company" placeholder="Atria Living" />
        <Field id="email" label="Work email" type="email" required placeholder="priya@company.in" />
        <Field id="phone" label="WhatsApp number" type="tel" required placeholder="+91 98450 00000" />

        <div className={styles.cfField}>
          <Label htmlFor="need" className={styles.cfLabel}>
            What do you need first?
          </Label>
          {/* The hidden input keeps `need` in the submitted form data */}
          <input type="hidden" name="need" value={need} />
          {lockedNeed ? (
            // Came from a Pricing plan: that plan's service, shown locked (can't be changed here)
            <>
              <div id="need" className={cn(styles.cfSelect, styles.cfLocked)} aria-disabled="true">
                <span className={styles.cfSelectText}>{NEED_LABELS.get(lockedNeed) ?? lockedNeed}</span>
                <Lock className={styles.cfSelectChevron} aria-hidden="true" />
              </div>
              <span className={styles.cfLockedNote}>Set by the plan you chose</span>
            </>
          ) : (
            <DropdownMenu.Root modal={false}>
              <DropdownMenu.Trigger asChild>
                <button type="button" id="need" className={styles.cfSelect}>
                  {need ? (
                    <span className={styles.cfSelectText}>{NEED_LABELS.get(need) ?? need}</span>
                  ) : (
                    <span className={cn(styles.cfSelectText, styles.cfPlaceholder)}>Select a service</span>
                  )}
                  <ChevronDown className={styles.cfSelectChevron} aria-hidden="true" />
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content className={styles.cfMenu} align="start" sideOffset={6}>
                  {NEED_GROUPS.map((g) =>
                    g.options.length && isPhone ? (
                      // Phones: tap a service to expand its sub-services in place
                      <React.Fragment key={g.value}>
                        <DropdownMenu.Item
                          className={cn(
                            styles.cfMenuItem,
                            (expanded === g.value || need.startsWith(`${g.value} - `)) && styles.cfMenuItemActive,
                          )}
                          onSelect={(e) => {
                            e.preventDefault(); // keep the menu open
                            setExpanded((cur) => (cur === g.value ? null : g.value));
                          }}
                        >
                          {g.label}
                          <ChevronRight
                            className={cn(styles.cfMenuChevron, expanded === g.value && styles.cfMenuChevronOpen)}
                            aria-hidden="true"
                          />
                        </DropdownMenu.Item>
                        {expanded === g.value && (
                          <DropdownMenu.RadioGroup value={need} onValueChange={setNeed}>
                            {g.options.map((o) => (
                              <DropdownMenu.RadioItem
                                key={o.value}
                                value={o.value}
                                className={cn(styles.cfMenuItem, styles.cfMenuNested)}
                              >
                                {o.label}
                                <DropdownMenu.ItemIndicator className={styles.cfMenuCheck}>
                                  <Check />
                                </DropdownMenu.ItemIndicator>
                              </DropdownMenu.RadioItem>
                            ))}
                          </DropdownMenu.RadioGroup>
                        )}
                      </React.Fragment>
                    ) : g.options.length ? (
                      // Hover (or tap) a service to open its sub-services beside the list
                      <DropdownMenu.Sub key={g.value}>
                        <DropdownMenu.SubTrigger
                          className={cn(styles.cfMenuItem, need.startsWith(`${g.value} - `) && styles.cfMenuItemActive)}
                        >
                          {g.label}
                          <ChevronRight className={styles.cfMenuChevron} aria-hidden="true" />
                        </DropdownMenu.SubTrigger>
                        <DropdownMenu.Portal>
                          <DropdownMenu.SubContent
                            className={cn(styles.cfMenu, styles.cfSubMenu)}
                            sideOffset={6}
                            alignOffset={-6}
                          >
                            <DropdownMenu.RadioGroup value={need} onValueChange={setNeed}>
                              {g.options.map((o) => (
                                <DropdownMenu.RadioItem key={o.value} value={o.value} className={styles.cfMenuItem}>
                                  {o.label}
                                  <DropdownMenu.ItemIndicator className={styles.cfMenuCheck}>
                                    <Check />
                                  </DropdownMenu.ItemIndicator>
                                </DropdownMenu.RadioItem>
                              ))}
                            </DropdownMenu.RadioGroup>
                          </DropdownMenu.SubContent>
                        </DropdownMenu.Portal>
                      </DropdownMenu.Sub>
                    ) : (
                      // A service without sub-services is picked directly
                      <DropdownMenu.RadioGroup key={g.value} value={need} onValueChange={setNeed}>
                        <DropdownMenu.RadioItem value={g.value} className={styles.cfMenuItem}>
                          {g.label}
                          <DropdownMenu.ItemIndicator className={styles.cfMenuCheck}>
                            <Check />
                          </DropdownMenu.ItemIndicator>
                        </DropdownMenu.RadioItem>
                      </DropdownMenu.RadioGroup>
                    ),
                  )}
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          )}
        </div>

        <div className={styles.cfField}>
          <Label htmlFor="budget" className={styles.cfLabel}>
            Monthly budget
          </Label>
          {/* Same green dropdown as "What do you need first?"; the hidden input keeps `budget` in the form data */}
          <input type="hidden" name="budget" value={budget} />
          {lockedBudget ? (
            // Came from a Pricing plan: the plan's own price, shown locked (can't be changed here)
            <>
              <div id="budget" className={cn(styles.cfSelect, styles.cfLocked)} aria-disabled="true">
                <span className={styles.cfSelectText}>{lockedBudget}</span>
                <Lock className={styles.cfSelectChevron} aria-hidden="true" />
              </div>
              <span className={styles.cfLockedNote}>Set by the plan you chose</span>
            </>
          ) : (
            <DropdownMenu.Root modal={false}>
              <DropdownMenu.Trigger asChild>
                <button type="button" id="budget" className={styles.cfSelect}>
                  <span className={styles.cfSelectText}>{budget}</span>
                  <ChevronDown className={styles.cfSelectChevron} aria-hidden="true" />
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content className={styles.cfMenu} align="start" sideOffset={6}>
                  <DropdownMenu.RadioGroup value={budget} onValueChange={setBudget}>
                    {BUDGET_BANDS.map((b) => (
                      <DropdownMenu.RadioItem key={b} value={b} className={styles.cfMenuItem}>
                        {b}
                        <DropdownMenu.ItemIndicator className={styles.cfMenuCheck}>
                          <Check />
                        </DropdownMenu.ItemIndicator>
                      </DropdownMenu.RadioItem>
                    ))}
                  </DropdownMenu.RadioGroup>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          )}
        </div>

        <div className={cn(styles.cfField, styles.cfWide)}>
          <Label htmlFor="message" className={styles.cfLabel}>
            What are you trying to achieve?
          </Label>
          <textarea
            id="message"
            name="message"
            rows={4}
            placeholder="Where you are now, what's not working, and what a good six months would look like."
            className={styles.cfTextarea}
          />
        </div>
      </div>

      <Button type="submit" disabled={state === "sending"} className={styles.cfSubmit}>
        {state === "sending" ? "Sending…" : "Book my free consultation"}
        <ArrowRight aria-hidden="true" />
      </Button>

      <p className={styles.cfNote}>
        {state === "error" ? (
          "That didn't send. Try WhatsApp or email instead - both are beside the form."
        ) : (
          <>
            <Check className={styles.cfNoteIcon} aria-hidden="true" /> No sales pitch. Just a focused conversation.
          </>
        )}
      </p>
    </form>
  );
}

function Field({
  id,
  label,
  type = "text",
  required,
  placeholder,
}: {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div className={styles.cfField}>
      <Label htmlFor={id} className={styles.cfLabel}>
        {label} {required && <span className={styles.cfRequired}>*</span>}
      </Label>
      <Input id={id} name={id} type={type} required={required} placeholder={placeholder} className={styles.cfInput} />
    </div>
  );
}

/**
 * "What happens next" steps in the hero (kept in this file to avoid adding another one).
 * Adds .stepsPlay when at least 35% of the list is in view, which starts the CSS sequence in
 * page.module.css; removes it once the list has fully left the screen, so it replays every visit
 * (same approach as the About timeline).
 */
export function ContactSteps({ steps }: { steps: { title: string; body: string }[] }) {
  const ref = React.useRef<HTMLOListElement>(null);
  const [play, setPlay] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) setPlay(false);
        else if (entry.intersectionRatio >= 0.35) setPlay(true);
      },
      { threshold: [0, 0.35] },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <ol ref={ref} className={cn(styles.stepsList, play && styles.stepsPlay)}>
      {steps.map((s, i) => (
        <li key={s.title} className={styles.step}>
          <span className={cn(styles.stepNum, i === 0 && styles.stepNumActive)}>{i + 1}</span>
          <span>
            <span className={styles.stepTitle}>{s.title}</span>
            <span className={styles.stepBody}>{s.body}</span>
          </span>
        </li>
      ))}
    </ol>
  );
}

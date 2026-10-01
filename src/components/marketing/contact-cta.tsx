"use client";

import * as React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Check, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Reveal } from "./reveal";
import { SERVICE_PAGES } from "@/lib/service-pages-data";
import { cn } from "@/lib/utils";
import { formContext } from "@/lib/form-context";
import styles from "./contact-cta.module.css";

/**
 * "What do you need first?" options: each service opens a submenu of its offerings on hover.
 * An offering is submitted as "Service - Offering" so the lead says exactly what was picked.
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

export function ContactCta() {
  const [state, setState] = React.useState<"idle" | "sending" | "sent" | "error">("idle");
  // Empty until the visitor picks something; the field is optional
  const [need, setNeed] = React.useState("");
  const isPhone = useIsPhone();
  // Phones only: the service whose sub-services are expanded in the list
  const [expanded, setExpanded] = React.useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          phone: form.get("phone"),
          need: form.get("need"),
          form: "quick",
          ...formContext(),
        }),
      });
      setState(res.ok ? "sent" : "error");
    } catch {
      setState("error");
    }
  }

  return (
    <section id="contact" className="section">
      <div className="container">
        <Reveal>
          <div className={styles.panel}>
            <div
              aria-hidden
              className={styles.glow}
            />
            <div className={styles.copy}>
              <h2 className={cn("display", styles.title)}>
                Tell us what you&apos;re
                <br />
                trying to grow
              </h2>
              <p className={styles.lede}>
                A 30-minute call, a look at your current numbers, and a written plan within three working days.
                No deck, no pressure.
              </p>
            </div>

            <div className={styles.formCard}>
              <form onSubmit={onSubmit} className={styles.form}>
                <div className={styles.field}>
                  <Label htmlFor="name" className={styles.label}>Your name</Label>
                  <Input
                    id="name" name="name" required placeholder="Priya Raghavan"
                    className={styles.input}
                  />
                </div>
                <div className={styles.field}>
                  <Label htmlFor="phone" className={styles.label}>WhatsApp number</Label>
                  <Input
                    id="phone" name="phone" type="tel" required placeholder="+91 98450 00000"
                    className={styles.input}
                  />
                </div>
                <div className={styles.field}>
                  <Label htmlFor="need" className={styles.label}>What do you need first?</Label>
                  {/*
                   * Custom dropdown (a native <select> list can't take the green gradient).
                   * The hidden input keeps `need` in the submitted form data.
                   */}
                  <input type="hidden" name="need" value={need} />
                  <DropdownMenu.Root modal={false}>
                    <DropdownMenu.Trigger asChild>
                      <button type="button" id="need" className={styles.select}>
                        {need ? (NEED_LABELS.get(need) ?? need) : <span className={styles.placeholder}>Select a service</span>}
                      </button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Portal>
                      <DropdownMenu.Content className={styles.menu} align="start" sideOffset={6}>
                        {NEED_GROUPS.map((g) =>
                          g.options.length && isPhone ? (
                            // Phones: tap a service to expand its sub-services in place
                            <React.Fragment key={g.value}>
                              <DropdownMenu.Item
                                className={cn(
                                  styles.menuItem,
                                  (expanded === g.value || need.startsWith(`${g.value} - `)) && styles.menuItemActive,
                                )}
                                onSelect={(e) => {
                                  e.preventDefault(); // keep the menu open
                                  setExpanded((cur) => (cur === g.value ? null : g.value));
                                }}
                              >
                                {g.label}
                                <ChevronRight
                                  className={cn(styles.menuChevron, expanded === g.value && styles.menuChevronOpen)}
                                  aria-hidden="true"
                                />
                              </DropdownMenu.Item>
                              {expanded === g.value && (
                                <DropdownMenu.RadioGroup value={need} onValueChange={setNeed}>
                                  {g.options.map((o) => (
                                    <DropdownMenu.RadioItem
                                      key={o.value}
                                      value={o.value}
                                      className={cn(styles.menuItem, styles.menuNested)}
                                    >
                                      {o.label}
                                      <DropdownMenu.ItemIndicator className={styles.menuCheck}>
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
                                className={cn(styles.menuItem, need.startsWith(`${g.value} - `) && styles.menuItemActive)}
                              >
                                {g.label}
                                <ChevronRight className={styles.menuChevron} aria-hidden="true" />
                              </DropdownMenu.SubTrigger>
                              <DropdownMenu.Portal>
                                <DropdownMenu.SubContent className={cn(styles.menu, styles.subMenu)} sideOffset={6} alignOffset={-6}>
                                  <DropdownMenu.RadioGroup value={need} onValueChange={setNeed}>
                                    {g.options.map((o) => (
                                      <DropdownMenu.RadioItem key={o.value} value={o.value} className={styles.menuItem}>
                                        {o.label}
                                        <DropdownMenu.ItemIndicator className={styles.menuCheck}>
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
                              <DropdownMenu.RadioItem value={g.value} className={styles.menuItem}>
                                {g.label}
                                <DropdownMenu.ItemIndicator className={styles.menuCheck}>
                                  <Check />
                                </DropdownMenu.ItemIndicator>
                              </DropdownMenu.RadioItem>
                            </DropdownMenu.RadioGroup>
                          ),
                        )}
                      </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                  </DropdownMenu.Root>
                </div>

                <Button type="submit" disabled={state !== "idle"} className={styles.submit}>
                  {state === "sent"
                    ? "Request sent - we'll call you"
                    : state === "sending"
                      ? "Sending…"
                      : "Book my free consultation"}
                </Button>

                <p className={styles.note}>
                  {state === "error" ? "Something went wrong. Try WhatsApp instead." : "We reply within one working day."}
                </p>
              </form>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

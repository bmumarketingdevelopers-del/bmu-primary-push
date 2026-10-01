"use client";

import * as React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Reveal } from "./reveal";
import { CONTACT_NEEDS } from "@/lib/content";
import { cn } from "@/lib/utils";
import { formContext } from "@/lib/form-context";
import styles from "./contact-cta.module.css";

export function ContactCta() {
  const [state, setState] = React.useState<"idle" | "sending" | "sent" | "error">("idle");
  const [need, setNeed] = React.useState<string>(CONTACT_NEEDS[0]);

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
                        {need}
                      </button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Portal>
                      <DropdownMenu.Content className={styles.menu} align="start" sideOffset={6}>
                        <DropdownMenu.RadioGroup value={need} onValueChange={setNeed}>
                          {CONTACT_NEEDS.map((n) => (
                            <DropdownMenu.RadioItem key={n} value={n} className={styles.menuItem}>
                              {n}
                              <DropdownMenu.ItemIndicator className={styles.menuCheck}>
                                <Check />
                              </DropdownMenu.ItemIndicator>
                            </DropdownMenu.RadioItem>
                          ))}
                        </DropdownMenu.RadioGroup>
                      </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                  </DropdownMenu.Root>
                </div>

                <Button type="submit" disabled={state !== "idle"} className={styles.submit}>
                  {state === "sent"
                    ? "Request sent — we'll call you"
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

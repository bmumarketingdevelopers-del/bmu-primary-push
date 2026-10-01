"use client";

import * as React from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CONTACT_NEEDS } from "@/lib/content";
import { BUDGET_BANDS } from "@/lib/company-data";
import { cn } from "@/lib/utils";
import { formContext } from "@/lib/form-context";
import styles from "./contact-form.module.css";

const SELECT_CLASS = styles.select;

export function ContactForm() {
  const [state, setState] = React.useState<"idle" | "sending" | "sent" | "error">("idle");

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
      <div className={styles.sent}>
        <CheckCircle2 className={styles.sentIcon} strokeWidth={1.6} />
        <h3 className={cn("display", styles.sentTitle)}>Request received</h3>
        <p className={styles.sentBody}>
          A strategist replies within one working day to book the call. If it&apos;s urgent, WhatsApp is faster
          — the number is in the panel above.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={styles.form}>
      <div className={styles.grid}>
        <Field id="name" label="Your name" required placeholder="Priya Raghavan" />
        <Field id="company" label="Company" placeholder="Atria Living" />
        <Field id="email" label="Work email" type="email" required placeholder="priya@company.in" />
        <Field id="phone" label="WhatsApp number" type="tel" required placeholder="+91 98450 00000" />

        <div className={styles.field}>
          <Label htmlFor="need">What do you need first?</Label>
          <select id="need" name="need" className={SELECT_CLASS}>
            {CONTACT_NEEDS.map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <Label htmlFor="budget">Monthly budget</Label>
          <select id="budget" name="budget" className={SELECT_CLASS}>
            {BUDGET_BANDS.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </div>

        <div className={cn(styles.field, styles.wide)}>
          <Label htmlFor="message">What are you trying to grow?</Label>
          <textarea
            id="message"
            name="message"
            rows={5}
            placeholder="Where you are now, what's not working, and what a good six months would look like."
            className={styles.textarea}
          />
        </div>
      </div>

      <Button type="submit" size="lg" disabled={state === "sending"} className={styles.submit}>
        {state === "sending" ? "Sending…" : "Book my free consultation"}
      </Button>

      <p className={styles.note}>
        {state === "error"
          ? "That didn't send. Try WhatsApp or email instead — both are listed above."
          : "We reply within one working day. No mailing list, no follow-up sequence."}
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
    <div className={styles.field}>
      <Label htmlFor={id}>
        {label} {required && <span className={styles.required}>*</span>}
      </Label>
      <Input id={id} name={id} type={type} required={required} placeholder={placeholder} />
    </div>
  );
}

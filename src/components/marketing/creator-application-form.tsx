"use client";

import * as React from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { formContext } from "@/lib/form-context";
import styles from "./creator-application-form.module.css";

const PLATFORMS = ["Instagram", "YouTube", "Both"];
const CATEGORIES = [
  "Food", "Restaurants", "Travel", "Fashion", "Beauty", "Fitness",
  "Interiors", "Real estate", "Automobile", "Parenting", "Tech", "Finance",
];

const SELECT_CLASS = styles.select;

export function CreatorApplicationForm() {
  const [picked, setPicked] = React.useState<string[]>([]);
  const [state, setState] = React.useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = React.useState<string | null>(null);

  function toggle(c: string) {
    setPicked((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (picked.length === 0) {
      setError("Pick at least one category so we can match you to briefs.");
      return;
    }

    setState("sending");
    setError(null);
    const f = new FormData(e.currentTarget);
    const rupees = Number(f.get("rateCard") || 0);

    try {
      const res = await fetch("/api/creator-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: f.get("name"),
          email: f.get("email"),
          phone: f.get("phone") || undefined,
          handle: f.get("handle"),
          platform: f.get("platform"),
          city: f.get("city") || undefined,
          categories: picked,
          followers: Number(f.get("followers") || 0),
          // Money is stored in paise everywhere, so convert at the boundary.
          rateCard: rupees ? rupees * 100 : undefined,
          portfolio: f.get("portfolio") || undefined,
          pitch: f.get("pitch") || undefined,
          ...formContext(),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "That didn't send. Try again in a moment.");
        setState("error");
        return;
      }
      setState("sent");
    } catch {
      setError("Network problem. Try again in a moment.");
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <div className={styles.sent}>
        <CheckCircle2 className={styles.sentIcon} strokeWidth={1.6} />
        <h3 className={cn("display", styles.sentTitle)}>Application received</h3>
        <p className={styles.sentBody}>
          We review applications weekly and reply either way. If you&apos;re a fit for a live brief
          you&apos;ll hear from us sooner than that.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={styles.form}>
      <div className={styles.grid}>
        <Field id="name" label="Your name" required placeholder="Nandita Prakash" />
        <Field id="handle" label="Handle" required placeholder="@blrfoodwalk" />
        <Field id="email" label="Email" type="email" required placeholder="you@email.com" />
        <Field id="phone" label="WhatsApp number" type="tel" placeholder="+91 98450 00000" />

        <div className={styles.field}>
          <Label htmlFor="platform">Main platform</Label>
          <select id="platform" name="platform" className={SELECT_CLASS}>
            {PLATFORMS.map((p) => <option key={p}>{p}</option>)}
          </select>
        </div>

        <Field id="city" label="City" placeholder="Bengaluru" />
        <Field id="followers" label="Followers" type="number" required placeholder="184000" />
        <Field id="rateCard" label="Rate per deliverable (₹)" type="number" placeholder="3500" />

        <div className={cn(styles.categories, styles.wide)}>
          <Label>
            Categories <span className={styles.required}>*</span>
          </Label>
          <div className={styles.chips}>
            {CATEGORIES.map((c) => {
              const on = picked.includes(c);
              return (
                <button
                  type="button"
                  key={c}
                  onClick={() => toggle(c)}
                  aria-pressed={on}
                  className={cn(
                    styles.chip,
                    on
                      ? styles.chipOn
                      : styles.chipOff
                  )}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>

        <Field id="portfolio" label="Best recent work (link)" placeholder="https://instagram.com/reel/..." className={styles.wide} />

        <div className={cn(styles.field, styles.wide)}>
          <Label htmlFor="pitch">Anything we should know?</Label>
          <textarea
            id="pitch"
            name="pitch"
            rows={4}
            placeholder="Brands you won't work with, how far you'll travel, turnaround you can commit to."
            className={styles.textarea}
          />
        </div>
      </div>

      {error && (
        <p className={styles.error}>
          <AlertCircle className={styles.errorIcon} />
          {error}
        </p>
      )}

      <Button type="submit" size="lg" disabled={state === "sending"} className={styles.submit}>
        {state === "sending" ? "Sending…" : "Apply to join"}
      </Button>

      <p className={styles.note}>
        We review weekly and reply either way. No mailing list.
      </p>
    </form>
  );
}

function Field({
  id, label, type = "text", required, placeholder, className,
}: {
  id: string; label: string; type?: string; required?: boolean;
  placeholder?: string; className?: string;
}) {
  return (
    <div className={cn(styles.field, className)}>
      <Label htmlFor={id}>
        {label} {required && <span className={styles.required}>*</span>}
      </Label>
      <Input id={id} name={id} type={type} required={required} placeholder={placeholder} />
    </div>
  );
}

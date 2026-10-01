"use client";

import * as React from "react";
import { CheckCircle2, Frown, Meh, Smile, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { submitFeedback, recordGoogleRedirect, type FeedbackState } from "@/app/r/[slug]/actions";
import { ReviewSuggestions } from "./review-suggestions";
import { cn } from "@/lib/utils";
import styles from "./review-booster.module.css";

const initial: FeedbackState = { ok: false, message: null };

type Step = "ask" | "suggest" | "private" | "thanks";

/**
 * Sentiment routing. Happy customers go to Google; everyone else reaches the
 * owner privately. This is the difference between a review QR and a review
 * *system* — you stop paying to publish your own bad days.
 */
export function ReviewBooster({
  slug,
  name,
  gbpUrl,
  brandColor,
}: {
  slug: string;
  name: string;
  gbpUrl: string;
  brandColor: string;
}) {
  const [step, setStep] = React.useState<Step>("ask");
  const [sentiment, setSentiment] = React.useState<"POSITIVE" | "NEUTRAL" | "NEGATIVE">("NEGATIVE");
  const [state, action, pending] = React.useActionState(submitFeedback, initial);

  React.useEffect(() => {
    if (state.ok) setStep("thanks");
  }, [state.ok]);

  /**
   * Sentiment decides what we suggest, never whether Google is reachable.
   * Unhappy customers land on the private form with the Google link still
   * on screen; happy ones get drafted text they can post.
   */
  async function onChoose(choice: "POSITIVE" | "NEUTRAL" | "NEGATIVE") {
    setSentiment(choice);

    if (choice === "POSITIVE") {
      await recordGoogleRedirect(slug);
      setStep("suggest");
      return;
    }

    setStep("private");
  }

  if (step === "suggest") {
    return (
      <ReviewSuggestions slug={slug} businessName={name} gbpUrl={gbpUrl} brandColor={brandColor} />
    );
  }

  if (step === "thanks") {
    return (
      <div className={styles.thanks} style={{ "--brand": brandColor } as React.CSSProperties}>
        <CheckCircle2 className={styles.thanksIcon} strokeWidth={1.5} />
        <h1 className={cn("display", styles.thanksTitle)}>Thank you</h1>
        <p className={styles.thanksNote}>
          This goes straight to the owner, not onto a public page. If you left a number, expect a
          call to put it right.
        </p>
      </div>
    );
  }

  if (step === "private") {
    return (
      <form action={action} className={styles.private}>
        <input type="hidden" name="slug" value={slug} />
        <input type="hidden" name="sentiment" value={sentiment} />

        <h1 className={cn("display", styles.privateTitle)}>
          Sorry that wasn&apos;t right
        </h1>
        <p className={styles.privateLede}>
          Tell {name} what happened. This stays private — it goes to the owner, not to Google.
        </p>

        <div className={styles.fields}>
          <div className={styles.field}>
            <Label htmlFor="comment">What went wrong?</Label>
            <textarea
              id="comment"
              name="comment"
              rows={4}
              required
              autoFocus
              placeholder="The wait was long and nobody explained why."
              className={styles.textarea}
            />
          </div>

          <div className={styles.contactGrid}>
            <div className={styles.field}>
              <Label htmlFor="name">Your name</Label>
              <Input id="name" name="name" placeholder="Optional" />
            </div>
            <div className={styles.field}>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" type="tel" placeholder="Optional" />
            </div>
          </div>
        </div>

        {state.message && (
          <p className={styles.error}>
            {state.message}
          </p>
        )}

        <Button type="submit" size="lg" disabled={pending} className={styles.submit}>
          {pending ? "Sending…" : "Send privately"}
        </Button>

        {/*
          The public option stays visible here too. Sending private feedback
          is offered as well as a Google review, not instead of one — that
          difference is what separates this from review gating.
        */}
        <a
          href={gbpUrl}
          target="_blank"
          rel="noreferrer"
          onClick={() => recordGoogleRedirect(slug)}
          className={styles.googleAlt}
        >
          Post this on Google instead
        </a>

        <button
          type="button"
          onClick={() => setStep("ask")}
          className={styles.back}
        >
          Back
        </button>
      </form>
    );
  }

  /**
   * Every path offers the public review link.
   *
   * The earlier version sent only happy customers to Google and diverted
   * everyone else to a private form. That's review gating — Google prohibits
   * it, and enforcement can strip every review from a listing. Since one
   * penalty would hit every client at once, this asks everyone the same way
   * and collects private feedback alongside rather than instead.
   */
  return (
    <div className={styles.ask} style={{ "--brand": brandColor } as React.CSSProperties}>
      <Star className={styles.askIcon} strokeWidth={1.6} />
      <h1 className={cn("display", styles.askTitle)}>How was your experience?</h1>
      <p className={styles.askLede}>at {name}</p>

      <div className={styles.choices}>
        <button
          onClick={() => onChoose("POSITIVE")}
          className={cn(styles.choice, styles.choicePositive)}
        >
          <Smile className={styles.choiceIcon} strokeWidth={1.8} />
          <span>
            <span className={styles.choiceLabel}>Excellent</span>
            <span className={cn(styles.choiceHint, styles.choiceHintSoft)}>I&apos;d recommend this place</span>
          </span>
        </button>

        <button
          onClick={() => onChoose("NEUTRAL")}
          className={cn(styles.choice, styles.choiceNeutral)}
        >
          <Meh className={cn(styles.choiceIcon, styles.choiceIconMuted)} strokeWidth={1.8} />
          <span>
            <span className={styles.choiceLabel}>Okay</span>
            <span className={cn(styles.choiceHint, styles.choiceHintMuted)}>Something could be better</span>
          </span>
        </button>

        <button
          onClick={() => onChoose("NEGATIVE")}
          className={cn(styles.choice, styles.choiceNegative)}
        >
          <Frown className={cn(styles.choiceIcon, styles.choiceIconMuted)} strokeWidth={1.8} />
          <span>
            <span className={styles.choiceLabel}>Not satisfied</span>
            <span className={cn(styles.choiceHint, styles.choiceHintMuted)}>I want to tell you why</span>
          </span>
        </button>
      </div>

      {/* Available without choosing anything, so the public path is never gated. */}
      <a
        href={gbpUrl}
        target="_blank"
        rel="noreferrer"
        onClick={() => recordGoogleRedirect(slug)}
        className={styles.googleDirect}
      >
        Write a Google review directly
      </a>
    </div>
  );
}

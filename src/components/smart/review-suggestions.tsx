"use client";

import * as React from "react";
import { Check, Copy, ExternalLink, Loader2, RefreshCw, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import styles from "./review-suggestions.module.css";

/**
 * Shown only after a customer has said their experience was good.
 *
 * The blank Google text box is where most review requests die. Offering
 * drafts removes that friction — the customer still chooses one, edits it if
 * they want, and posts it under their own account.
 */
export function ReviewSuggestions({
  slug,
  businessName,
  gbpUrl,
  brandColor,
}: {
  slug: string;
  businessName: string;
  gbpUrl: string;
  brandColor: string;
}) {
  const [suggestions, setSuggestions] = React.useState<string[]>([]);
  const [selected, setSelected] = React.useState<number | null>(null);
  const [text, setText] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [copied, setCopied] = React.useState(false);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/reviews/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      const data = await res.json();
      setSuggestions(data.suggestions ?? []);
      setSelected(0);
      setText(data.suggestions?.[0] ?? "");
    } catch {
      setSuggestions([]);
    }
    setLoading(false);
  }, [slug]);

  React.useEffect(() => {
    load();
  }, [load]);

  function choose(index: number) {
    setSelected(index);
    setText(suggestions[index]);
    setCopied(false);
  }

  /**
   * Two steps on purpose. Google has no way to receive review text through a
   * URL, so the text goes to the clipboard and the customer pastes it. Doing
   * both at once means people land on Google not knowing what to do next.
   */
  async function copyText() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      // Clipboard blocked — they can still select the textarea by hand.
      setCopied(true);
    }
  }

  function openGoogle() {
    if (gbpUrl) window.open(gbpUrl, "_blank", "noopener");
  }

  return (
    <div className={styles.root} style={{ "--brand": brandColor } as React.CSSProperties}>
      <div className={styles.intro}>
        <div className={styles.stars}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={styles.star} />
          ))}
        </div>
        <h1 className={cn("display", styles.title)}>Thank you</h1>
        <p className={styles.lede}>
          Pick whichever sounds most like you, edit it however you want, then post it on Google.
        </p>
      </div>

      {loading ? (
        <div className={styles.loading}>
          <Loader2 className={styles.spinner} />
          <p className={styles.loadingText}>Writing a few options…</p>
        </div>
      ) : (
        <>
          <div className={styles.options}>
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => choose(i)}
                className={cn(
                  styles.option,
                  selected === i ? styles.optionSelected : styles.optionIdle
                )}
              >
                {s}
              </button>
            ))}
          </div>

          <div className={styles.editor}>
            <label htmlFor="review-text" className={styles.editorLabel}>
              Edit before posting
            </label>
            <textarea
              id="review-text"
              value={text}
              onChange={(e) => { setText(e.target.value); setCopied(false); }}
              rows={4}
              className={styles.textarea}
            />
          </div>

          {!copied ? (
            <Button size="lg" className={styles.copyButton} onClick={copyText}>
              <Copy /> Copy this review
            </Button>
          ) : (
            <div className={styles.copied}>
              <p className={styles.copiedNote}>
                <Check className={styles.copiedIcon} /> Copied. Now paste it on Google.
              </p>
              <Button size="lg" className={styles.googleButton} onClick={openGoogle}>
                Open Google and paste <ExternalLink />
              </Button>
            </div>
          )}

          <button
            type="button"
            onClick={load}
            className={styles.refresh}
          >
            <RefreshCw className={styles.refreshIcon} /> Show different options
          </button>

          <p className={styles.disclaimer}>
            Google asks you to type the review yourself, so paste it in and tap five stars. You post
            it from your own account and can change any of it — {businessName} never sees it first.
          </p>
        </>
      )}
    </div>
  );
}

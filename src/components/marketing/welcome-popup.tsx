"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { ChevronRight, X } from "lucide-react";
import { formContext } from "@/lib/form-context";
import { cn } from "@/lib/utils";
import styles from "./welcome-popup.module.css";

// Lives in the marketing layout so its timer survives navigation. Per page load (first visit,
// reload, reopening the tab) it shows at most twice:
//   1. 6 seconds after the visitor reaches the home page
//   2. once more, 30 seconds after that first popup is closed
// Dismissing the second one, or sending the form at any point, ends it for this page load.
const FIRST_DELAY = 6 * 1000;
const REOPEN_AFTER = 30 * 1000;

// Popup leads are stored with the landing-page form and tagged here, so they're easy to filter
const POPUP_NEED = "Website popup";

type Stage = "idle" | "first" | "waiting" | "second" | "done";
type SendState = "idle" | "sending" | "sent" | "error";

export function WelcomePopup() {
  const pathname = usePathname();
  const [stage, setStage] = useState<Stage>("idle");
  const [send, setSend] = useState<SendState>("idle");
  // Never cover the contact form; a popup that falls due there waits until they move on.
  // After a successful send it stays open on the thank-you message until closed.
  const open = (stage === "first" || stage === "second" || send === "sent") && pathname !== "/contact";

  const readyForFirst = stage === "idle" && pathname === "/";
  useEffect(() => {
    if (!readyForFirst) return;
    const t = window.setTimeout(() => setStage("first"), FIRST_DELAY);
    return () => window.clearTimeout(t);
  }, [readyForFirst]);

  useEffect(() => {
    if (stage !== "waiting") return;
    const t = window.setTimeout(() => setStage("second"), REOPEN_AFTER);
    return () => window.clearTimeout(t);
  }, [stage]);

  // ✕, Esc and the backdrop. After a send, closing just hides the thank-you message.
  const dismiss = () => {
    if (send === "sent") {
      setSend("idle");
      return;
    }
    setStage((s) => (s === "first" ? "waiting" : "done"));
  };

  const onOpenChange = (next: boolean) => {
    if (!next) dismiss();
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSend("sending");
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          phone: form.get("phone"),
          email: form.get("email") || "",
          need: POPUP_NEED,
          form: "quick",
          ...formContext(),
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      // Sent: no second popup this page load
      setStage("done");
      setSend("sent");
    } catch {
      setSend("error");
    }
  }

  return (
    // Non-modal so the page behind keeps scrolling. The blurred backdrop is a plain div that closes
    // the popup on a tap; Radix's own outside-press closing is off, because on phones it would fire
    // as soon as a finger starts scrolling
    <Dialog.Root open={open} onOpenChange={onOpenChange} modal={false}>
      <Dialog.Portal>
        <div aria-hidden="true" className={styles.overlay} onClick={dismiss} />
        <Dialog.Content
          className={styles.content}
          onInteractOutside={(e) => e.preventDefault()}
          // Focus the card itself rather than the ✕, so no focus ring appears around it on open
          onOpenAutoFocus={(e) => {
            e.preventDefault();
            (e.currentTarget as HTMLElement).focus();
          }}
        >
          <div aria-hidden="true" className={styles.decor} />

          <Dialog.Close className={styles.close} aria-label="Close">
            <X />
          </Dialog.Close>

          <div className={styles.inner}>
<<<<<<< HEAD
            <span aria-hidden="true" className={styles.mark}>
              <span />
            </span>
            <span className={styles.pill}>Curious What We Do!</span>
=======
            <Image
              src="/images/brand/bmu-logo-light.png"
              alt="BMU Marketing"
              width={556}
              height={233}
              className={styles.logo}
            />
>>>>>>> ec9c9d3 (Updated landing page 2)

            <Dialog.Title className={styles.title}>Let&apos;s build your next growth move.</Dialog.Title>
            <Dialog.Description className={styles.text}>
              Share your goals and discover the strategies that move your business forward.
            </Dialog.Description>
            <span className={styles.pill}>Curious What We Do?</span>

            {send === "sent" ? (
              <p className={styles.thanks} role="status">
                Thanks - we&apos;ll be in touch within one working day.
              </p>
            ) : (
              <form onSubmit={onSubmit} className={styles.form}>
                <div className={styles.field}>
                  <label htmlFor="popup-name" className={styles.label}>Name</label>
                  <input
                    id="popup-name"
                    name="name"
                    required
                    minLength={2}
                    autoComplete="name"
                    placeholder="Enter your Name"
                    className={styles.input}
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="popup-phone" className={styles.label}>Phone</label>
                  <input
                    id="popup-phone"
                    name="phone"
                    type="tel"
                    required
                    minLength={6}
                    autoComplete="tel"
                    placeholder="Enter your Phone"
                    className={styles.input}
                  />
                </div>
                <div className={cn(styles.field, styles.fieldWide)}>
                  <label htmlFor="popup-email" className={styles.label}>Email</label>
                  <input
                    id="popup-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="Enter your Mail-id"
                    className={styles.input}
                  />
                </div>

                <button type="submit" disabled={send === "sending"} className={cn(styles.button, styles.fieldWide)}>
                  {send === "sending" ? "Sending…" : "Submit"}
                  <span aria-hidden="true" className={styles.buttonIcon}>
                    <ChevronRight />
                  </span>
                </button>

                {send === "error" && (
                  <p className={cn(styles.error, styles.fieldWide)} role="alert">
                    That didn&apos;t send. Please try again, or WhatsApp us.
                  </p>
                )}
              </form>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

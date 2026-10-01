"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import styles from "./welcome-popup.module.css";

// Lives in the marketing layout so its timer survives navigation. Per page load (first visit,
// reload, reopening the tab) it shows at most twice:
//   1. 10 seconds after the visitor reaches the home page
//   2. once more, 1 minute after that first popup is closed or "View our case studies" is clicked
// Dismissing the second one, or booking a consultation at any point, ends it for this page load.
const FIRST_DELAY = 10 * 1000;
const REOPEN_AFTER = 60 * 1000;

type Stage = "idle" | "first" | "waiting" | "second" | "done";

export function WelcomePopup() {
  const pathname = usePathname();
  const [stage, setStage] = useState<Stage>("idle");
  // Never cover the contact form; a popup that falls due there waits until they move on
  const open = (stage === "first" || stage === "second") && pathname !== "/contact";

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

  // ✕, Esc, the backdrop and "View our case studies"
  const dismiss = () => setStage((s) => (s === "first" ? "waiting" : "done"));

  const onOpenChange = (next: boolean) => {
    if (!next) dismiss();
  };

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
            <span aria-hidden="true" className={styles.mark}>
              <span />
            </span>
            <span className={styles.pill}>Curious What We Do!</span>

            <Dialog.Title className={styles.title}>Let&apos;s build your next growth move.</Dialog.Title>
            <Dialog.Description className={styles.text}>
              Share your goals with us and discover the strategy, ideas and opportunities that could move
              your business forward.
            </Dialog.Description>

            <div className={styles.actions}>
              <Link href="/case-studies" onClick={dismiss} className={cn(styles.button, styles.ghost)}>
                View our case studies
              </Link>
              <Link href="/contact" onClick={() => setStage("done")} className={cn(styles.button, styles.primary)}>
                Book a free consultation
                <span aria-hidden="true" className={styles.buttonIcon}>
                  <ChevronRight />
                </span>
              </Link>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

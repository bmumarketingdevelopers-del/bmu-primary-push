"use client";

import * as React from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { ArTargetCompiler } from "./target-compiler";
import { saveArTarget, type ArState } from "@/app/business/ar/actions";
import { cn } from "@/lib/utils";
import styles from "./ar-target-dialog.module.css";

const initial: ArState = { ok: false, message: null };

/**
 * Wraps the compiler in a dialog and submits the result.
 *
 * The compiler produces a URL and a score in the browser; those are posted
 * through a normal form so the write goes through the same validation and
 * ownership checks as everything else.
 */
export function ArTargetDialog({
  slug,
  name,
  hasTarget,
}: {
  slug: string;
  name: string;
  hasTarget: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const [state, action, pending] = React.useActionState(saveArTarget, initial);
  const [result, setResult] = React.useState<{ url: string; quality: number } | null>(null);
  const formRef = React.useRef<HTMLFormElement>(null);

  // Submit as soon as compilation finishes — the owner has nothing left to decide.
  React.useEffect(() => {
    if (result) formRef.current?.requestSubmit();
  }, [result]);

  React.useEffect(() => {
    if (state.ok) {
      const t = setTimeout(() => setOpen(false), 2600);
      return () => clearTimeout(t);
    }
  }, [state.ok]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={hasTarget ? "ghost" : "default"} size="sm">
          {hasTarget ? "Replace target" : "Compile target"}
        </Button>
      </DialogTrigger>

      <DialogContent className={styles.dialog}>
        <DialogHeader>
          <DialogTitle>Tracking target for {name}</DialogTitle>
          <DialogDescription>
            Upload the artwork exactly as it goes to print. We check whether it will track before
            you commit to a print run, then compile it here on this device.
          </DialogDescription>
        </DialogHeader>

        <ArTargetCompiler
          experienceSlug={slug}
          onCompiled={(url, quality) => setResult({ url, quality })}
        />

        <form ref={formRef} action={action} className={styles.submitForm}>
          <input type="hidden" name="slug" value={slug} />
          <input type="hidden" name="targetMindUrl" value={result?.url ?? ""} />
          <input type="hidden" name="targetQuality" value={result?.quality ?? 0} />
        </form>

        {pending && <p className={styles.saving}>Saving…</p>}

        {state.message && (
          <p className={cn(styles.message, state.ok ? styles.messageOk : styles.messageError)}>
            {state.ok ? (
              <CheckCircle2 className={styles.messageIcon} />
            ) : (
              <AlertCircle className={styles.messageIcon} />
            )}
            {state.message}
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}

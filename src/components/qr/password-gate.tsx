"use client";

import { useActionState } from "react";
import { AlertCircle, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { unlockQr, type UnlockState } from "@/app/q/[slug]/actions";
import { cn } from "@/lib/utils";
import styles from "./password-gate.module.css";

const initial: UnlockState = { error: null };

export function PasswordGate({ slug, label }: { slug: string; label: string }) {
  const [state, action, pending] = useActionState(unlockQr, initial);

  return (
    <form action={action} className={styles.gate}>
      <span className={styles.lockBadge}>
        <Lock className={styles.lockIcon} strokeWidth={1.8} />
      </span>
      <h1 className={cn("display", styles.title)}>{label}</h1>
      <p className={styles.lede}>
        This code is password protected.
      </p>

      <input type="hidden" name="slug" value={slug} />

      <div className={styles.field}>
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" required autoFocus />
      </div>

      {state.error && (
        <p className={styles.error}>
          <AlertCircle className={styles.errorIcon} />
          {state.error}
        </p>
      )}

      <Button type="submit" size="lg" disabled={pending} className={styles.submit}>
        {pending ? "Checking…" : "Continue"}
      </Button>
    </form>
  );
}

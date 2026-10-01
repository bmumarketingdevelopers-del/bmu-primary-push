"use client";

import * as React from "react";
import { AlertCircle, ArrowUpCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { escalateApproval, type ApprovalState } from "@/app/admin/approvals/actions";
import { cn } from "@/lib/utils";
import styles from "./escalate-dialog.module.css";

const initial: ApprovalState = { ok: false, message: null };

/**
 * The only real lever a super admin has on a stuck approval.
 *
 * The agency can't sign off on the client's behalf, so escalating means
 * handing it to someone senior enough to pick up the phone — which is why
 * this records an owner rather than changing the creative's status.
 */
export function EscalateDialog({
  approval,
  team,
}: {
  approval: { id: string; title: string; client: string; daysWaiting: number };
  team: { id: string; name: string }[];
}) {
  const [open, setOpen] = React.useState(false);
  const [state, action, pending] = React.useActionState(escalateApproval, initial);

  React.useEffect(() => {
    if (state.ok) {
      const t = setTimeout(() => setOpen(false), 1400);
      return () => clearTimeout(t);
    }
  }, [state.ok]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm"><ArrowUpCircle /> Escalate</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Escalate this approval</DialogTitle>
          <DialogDescription>
            {approval.title} · {approval.client} · waiting {approval.daysWaiting} days
          </DialogDescription>
        </DialogHeader>

        <form action={action} className={styles.form}>
          <input type="hidden" name="id" value={approval.id} />

          <div className={styles.field}>
            <Label htmlFor="esc-to">Hand it to</Label>
            <select
              id="esc-to"
              name="to"
              required
              className={styles.select}
            >
              <option value="">Choose someone</option>
              {team.map((t) => <option key={t.id} value={t.name}>{t.name}</option>)}
            </select>
          </div>

          <div className={styles.field}>
            <Label htmlFor="esc-note">What do they need to know?</Label>
            <textarea
              id="esc-note"
              name="note"
              rows={3}
              placeholder="Third revision on the same brief — worth a call rather than another email."
              className={styles.textarea}
            />
          </div>

          {state.message && (
            <p className={cn(styles.result, state.ok ? styles.resultOk : styles.resultError)}>
              {state.ok ? <CheckCircle2 className={styles.resultIcon} /> : <AlertCircle className={styles.resultIcon} />}
              {state.message}
            </p>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={pending}>{pending ? "Escalating…" : "Escalate"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

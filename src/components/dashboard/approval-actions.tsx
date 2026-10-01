"use client";

import * as React from "react";
import { AlertCircle, CheckCircle2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { decideApproval, type ApprovalDecisionState } from "@/app/dashboard/approvals/actions";
import { cn } from "@/lib/utils";
import styles from "./approval-actions.module.css";

const initial: ApprovalDecisionState = { ok: false, message: null };

export function ApprovalActions({
  item,
}: {
  item: { id: string; title: string; status: string };
}) {
  if (item.status !== "PENDING") {
    return (
      <p className={styles.decided}>
        {item.status === "APPROVED" ? "You approved this." : "Changes requested — new version coming."}
      </p>
    );
  }

  return (
    <div className={styles.actions}>
      <DecisionDialog item={item} decision="APPROVED" />
      <DecisionDialog item={item} decision="CHANGES_REQUESTED" />
    </div>
  );
}

function DecisionDialog({
  item, decision,
}: {
  item: { id: string; title: string };
  decision: "APPROVED" | "CHANGES_REQUESTED";
}) {
  const [open, setOpen] = React.useState(false);
  const [state, action, pending] = React.useActionState(decideApproval, initial);
  const approving = decision === "APPROVED";

  React.useEffect(() => {
    if (state.ok) {
      const t = setTimeout(() => setOpen(false), 1800);
      return () => clearTimeout(t);
    }
  }, [state.ok]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant={approving ? "default" : "outline"}>
          {approving ? <CheckCircle2 /> : <MessageSquare />}
          {approving ? "Approve" : "Request changes"}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{approving ? "Approve this" : "Request changes"}</DialogTitle>
          <DialogDescription>
            {item.title} —{" "}
            {approving
              ? "It goes out on the scheduled date once approved."
              : "Be specific. A vague note produces a second version that misses differently."}
          </DialogDescription>
        </DialogHeader>

        <form action={action} className={styles.form}>
          <input type="hidden" name="id" value={item.id} />
          <input type="hidden" name="title" value={item.title} />
          <input type="hidden" name="decision" value={decision} />

          <div className={styles.field}>
            <Label htmlFor={`fb-${item.id}-${decision}`}>
              {approving ? "Anything to add" : "What needs changing"}
              {approving && <span className={styles.optional}>optional</span>}
            </Label>
            <textarea
              id={`fb-${item.id}-${decision}`}
              name="feedback"
              rows={3}
              required={!approving}
              placeholder={
                approving
                  ? "Looks good — maybe push it to Saturday."
                  : "The price in the second slide is last season's. Should be ₹4,999."
              }
              className={styles.textarea}
            />
          </div>

          {state.message && (
            <p className={cn(styles.message, state.ok ? styles.messageOk : styles.messageError)}>
              {state.ok ? <CheckCircle2 className={styles.messageIcon} /> : <AlertCircle className={styles.messageIcon} />}
              {state.message}
            </p>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Sending…" : approving ? "Approve" : "Send back"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

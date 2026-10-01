"use client";

import * as React from "react";
import { AlertCircle, CheckCircle2, MessageCircleQuestion, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { respondToBrief, type BriefState } from "@/app/creators/briefs/actions";
import { cn, inr } from "@/lib/utils";
import styles from "./brief-actions.module.css";

const initial: BriefState = { ok: false, message: null };

type Decision = "ACCEPTED" | "DECLINED" | "QUESTION";

const COPY: Record<Decision, { title: string; description: string; cta: string }> = {
  ACCEPTED: {
    title: "Accept this brief",
    description: "Confirm what you'd charge and when you can deliver. The team confirms before anything is contracted.",
    cta: "Accept brief",
  },
  DECLINED: {
    title: "Decline this brief",
    description: "A reason helps us send you better-matched work, but it's optional.",
    cta: "Decline",
  },
  QUESTION: {
    title: "Ask about this brief",
    description: "Usage rights, timelines, whether the fee covers revisions — anything that changes your answer.",
    cta: "Send question",
  },
};

export function BriefActions({
  brief,
}: {
  brief: { id: string; title: string; fee?: number; dueAt?: string; responded?: string | null };
}) {
  if (brief.responded) {
    return (
      <p className={styles.responded}>
        You {brief.responded.toLowerCase() === "accepted" ? "accepted" : brief.responded.toLowerCase()} this brief.
      </p>
    );
  }

  return (
    <div className={styles.actions}>
      <BriefDialog brief={brief} decision="ACCEPTED" />
      <BriefDialog brief={brief} decision="QUESTION" />
      <BriefDialog brief={brief} decision="DECLINED" />
    </div>
  );
}

function BriefDialog({
  brief, decision,
}: {
  brief: { id: string; title: string; fee?: number; dueAt?: string };
  decision: Decision;
}) {
  const [open, setOpen] = React.useState(false);
  const [state, action, pending] = React.useActionState(respondToBrief, initial);
  const copy = COPY[decision];

  React.useEffect(() => {
    if (state.ok) {
      const t = setTimeout(() => setOpen(false), 2000);
      return () => clearTimeout(t);
    }
  }, [state.ok]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant={decision === "ACCEPTED" ? "default" : decision === "QUESTION" ? "outline" : "ghost"}
        >
          {decision === "ACCEPTED" && <CheckCircle2 />}
          {decision === "QUESTION" && <MessageCircleQuestion />}
          {decision === "DECLINED" && <ThumbsDown />}
          {decision === "ACCEPTED" ? "Accept brief" : decision === "QUESTION" ? "Ask a question" : "Decline"}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{copy.title}</DialogTitle>
          <DialogDescription>{brief.title} — {copy.description}</DialogDescription>
        </DialogHeader>

        <form action={action} className={styles.form}>
          <input type="hidden" name="briefId" value={brief.id} />
          <input type="hidden" name="briefTitle" value={brief.title} />
          <input type="hidden" name="decision" value={decision} />

          {decision === "ACCEPTED" && (
            <>
              <div className={styles.field}>
                <Label htmlFor={`fee-${brief.id}`}>Your fee (₹)</Label>
                <Input
                  id={`fee-${brief.id}`}
                  name="quotedFee"
                  type="number"
                  step="1"
                  defaultValue={brief.fee ? brief.fee / 100 : undefined}
                  placeholder="120000"
                />
                <p className={styles.help}>
                  {brief.fee
                    ? `The brief offers ${inr(brief.fee)}. Quote differently if the deliverables warrant it.`
                    : "Leave empty to use your rate card."}
                </p>
              </div>

              <div className={styles.field}>
                <Label htmlFor={`date-${brief.id}`}>You can deliver by</Label>
                <Input id={`date-${brief.id}`} name="proposedAt" type="date" defaultValue={brief.dueAt} />
              </div>
            </>
          )}

          <div className={styles.field}>
            <Label htmlFor={`msg-${brief.id}`}>
              {decision === "QUESTION" ? "Your question" : "Anything to add"}
              {decision !== "QUESTION" && (
                <span className={styles.optional}>optional</span>
              )}
            </Label>
            <textarea
              id={`msg-${brief.id}`}
              name="message"
              rows={3}
              required={decision === "QUESTION"}
              placeholder={
                decision === "QUESTION"
                  ? "Does the fee cover usage rights beyond 30 days?"
                  : decision === "DECLINED"
                    ? "Clashes with a shoot that week."
                    : "Happy to do this — I'd suggest shooting on the Tuesday."
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
            <Button type="submit" disabled={pending}>{pending ? "Sending…" : copy.cta}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

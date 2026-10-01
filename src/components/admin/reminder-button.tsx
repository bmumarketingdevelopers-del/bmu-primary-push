"use client";

import { useActionState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sendApprovalReminder, type ReminderState } from "@/app/admin/approvals/actions";
import { cn } from "@/lib/utils";
import styles from "./reminder-button.module.css";

const initial: ReminderState = { ok: false, message: null };

export function ReminderButton({
  id,
  email,
  disabled,
}: {
  id: string;
  email?: string;
  disabled?: boolean;
}) {
  const [state, action, pending] = useActionState(sendApprovalReminder, initial);

  if (state.message) {
    return (
      <span className={cn(styles.status, state.ok ? styles.statusOk : styles.statusError)}>
        {state.message}
      </span>
    );
  }

  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      {email && <input type="hidden" name="email" value={email} />}
      <Button type="submit" variant="ghost" size="sm" disabled={disabled || pending}>
        <Send /> {pending ? "Sending…" : "Send reminder"}
      </Button>
    </form>
  );
}

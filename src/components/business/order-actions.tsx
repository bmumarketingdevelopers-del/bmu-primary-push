"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { advanceOrder, cancelOrder, type OrderState } from "@/app/business/orders/actions";
import styles from "./order-actions.module.css";

const initial: OrderState = { ok: false, message: null };

/**
 * One button per ticket, sized for a thumb on a kitchen screen.
 * Errors show inline — nobody reads a toast during service.
 */
export function AdvanceOrderButton({
  id, from, label,
}: { id: string; from: string; label: string }) {
  const [state, action, pending] = React.useActionState(advanceOrder, initial);

  return (
    <form action={action} className={styles.advanceForm}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="from" value={from} />
      <Button type="submit" size="sm" className={styles.advanceButton} disabled={pending}>
        {pending ? "…" : label}
      </Button>
      {state.message && !state.ok && (
        <p className={styles.advanceError}>{state.message}</p>
      )}
    </form>
  );
}

export function CancelOrderButton({ id }: { id: string }) {
  const [state, action, pending] = React.useActionState(cancelOrder, initial);

  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <Button
        type="submit"
        variant="ghost"
        size="sm"
        disabled={pending}
        aria-label="Cancel order"
        className={styles.cancelButton}
      >
        <X />
      </Button>
      {state.message && !state.ok && (
        <span className={styles.cancelError}>{state.message}</span>
      )}
    </form>
  );
}

"use client";

import * as React from "react";
import { AlertCircle, BellRing, CheckCircle2, IndianRupee, Plus, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { CmsFields } from "./cms-fields";
import {
  LINE_ITEM_FIELDS, createInvoice, recordPayment,
  sendInvoice, sendPaymentReminder, type InvoiceState,
} from "@/app/admin/invoices/actions";
import { cn, inr } from "@/lib/utils";
import styles from "./invoice-actions.module.css";

const initial: InvoiceState = { ok: false, message: null };

function Result({ state }: { state: InvoiceState }) {
  if (!state.message) return null;
  return (
    <p className={cn(styles.result, state.ok ? styles.resultOk : styles.resultError)}>
      {state.ok ? <CheckCircle2 className={styles.resultIcon} /> : <AlertCircle className={styles.resultIcon} />}
      {state.message}
    </p>
  );
}

/** Create an invoice from line items. The total is shown as you type. */
export function NewInvoiceDialog({ clients }: { clients: { id: string; name: string }[] }) {
  const [open, setOpen] = React.useState(false);
  const [state, action, pending] = React.useActionState(createInvoice, initial);
  const [taxRate, setTaxRate] = React.useState(18);
  const [preview, setPreview] = React.useState({ subtotal: 0, total: 0 });

  React.useEffect(() => {
    if (state.ok) {
      const t = setTimeout(() => setOpen(false), 1800);
      return () => clearTimeout(t);
    }
  }, [state.ok]);

  /**
   * Reads the repeater inputs directly. The server recalculates from the same
   * rows, so this is a preview only — it can never be the number that's billed.
   */
  function recalc(e: React.FormEvent<HTMLFormElement>) {
    const form = e.currentTarget;
    let subtotal = 0;

    for (let i = 0; ; i++) {
      const qty = form.querySelector<HTMLInputElement>(`[name="items.${i}.quantity"]`);
      const rate = form.querySelector<HTMLInputElement>(`[name="items.${i}.unitPrice"]`);
      if (!qty && !rate) break;
      subtotal += (Number(qty?.value) || 1) * (Number(rate?.value) || 0);
    }

    setPreview({ subtotal, total: Math.round(subtotal * (1 + taxRate / 100)) });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm"><Plus /> New invoice</Button>
      </DialogTrigger>

      <DialogContent className={styles.dialog}>
        <DialogHeader>
          <DialogTitle>New invoice</DialogTitle>
          <DialogDescription>
            The total is calculated from the line items — it isn&apos;t a field you can type into.
          </DialogDescription>
        </DialogHeader>

        <form action={action} onInput={recalc} className={styles.form}>
          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <Label htmlFor="inv-client">Client</Label>
              <select
                id="inv-client"
                name="clientId"
                required
                className={styles.select}
              >
                <option value="">Choose a client</option>
                {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className={styles.field}>
              <Label htmlFor="inv-number">Invoice number</Label>
              <Input id="inv-number" name="number" placeholder="Leave empty to generate" />
            </div>
          </div>

          <CmsFields fields={LINE_ITEM_FIELDS} value={{ items: [{ quantity: 1 }] }} />

          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <Label htmlFor="inv-tax">GST %</Label>
              <Input
                id="inv-tax"
                name="taxRate"
                type="number"
                defaultValue={18}
                onChange={(e) => setTaxRate(Number(e.target.value) || 0)}
              />
            </div>
            <div className={styles.field}>
              <Label htmlFor="inv-due">Due date</Label>
              <Input id="inv-due" name="dueAt" type="date" />
            </div>
          </div>

          <div className={styles.field}>
            <Label htmlFor="inv-notes">Notes on the invoice</Label>
            <textarea
              id="inv-notes"
              name="notes"
              rows={2}
              className={styles.textarea}
            />
          </div>

          <dl className={styles.summary}>
            <div className={styles.summaryRow}>
              <dt className={styles.summaryLabel}>Subtotal</dt>
              <dd>{inr(preview.subtotal * 100)}</dd>
            </div>
            <div className={styles.summaryRow}>
              <dt className={styles.summaryLabel}>GST at {taxRate}%</dt>
              <dd>{inr((preview.total - preview.subtotal) * 100)}</dd>
            </div>
            <div className={cn(styles.summaryRow, styles.summaryTotal)}>
              <dt>Total</dt>
              <dd>{inr(preview.total * 100)}</dd>
            </div>
          </dl>

          <Result state={state} />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={pending}>{pending ? "Creating…" : "Create invoice"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/** Send, chase and record payment, inline on the row. */
export function InvoiceRowActions({
  invoice,
}: {
  invoice: { id: string; number: string; status: string; total: number; amountPaid?: number };
}) {
  const [sendState, sendAction, sending] = React.useActionState(sendInvoice, initial);
  const [remindState, remindAction, reminding] = React.useActionState(sendPaymentReminder, initial);
  const [payOpen, setPayOpen] = React.useState(false);
  const [payState, payAction, paying] = React.useActionState(recordPayment, initial);

  const outstanding = invoice.total - (invoice.amountPaid ?? 0);
  const settled = invoice.status === "PAID";

  return (
    <div className={styles.rowActions}>
      {invoice.status === "DRAFT" && (
        <form action={sendAction}>
          <input type="hidden" name="id" value={invoice.id} />
          <Button type="submit" variant="ghost" size="sm" disabled={sending}>
            <Send /> {sending ? "Sending…" : "Send"}
          </Button>
        </form>
      )}

      {!settled && invoice.status !== "DRAFT" && (
        <form action={remindAction}>
          <input type="hidden" name="id" value={invoice.id} />
          <Button type="submit" variant="ghost" size="sm" disabled={reminding}>
            <BellRing /> {reminding ? "Sending…" : "Chase"}
          </Button>
        </form>
      )}

      {!settled && (
        <Dialog open={payOpen} onOpenChange={setPayOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm"><IndianRupee /> Payment</Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Record a payment</DialogTitle>
              <DialogDescription>
                {invoice.number} · {inr(outstanding)} outstanding. Part payments are fine — the
                invoice only closes once it&apos;s covered in full.
              </DialogDescription>
            </DialogHeader>

            <form action={payAction} className={styles.payForm}>
              <input type="hidden" name="id" value={invoice.id} />

              <div className={styles.field}>
                <Label htmlFor={`amt-${invoice.id}`}>Amount received (₹)</Label>
                <Input
                  id={`amt-${invoice.id}`}
                  name="amount"
                  type="number"
                  step="0.01"
                  required
                  defaultValue={(outstanding / 100).toFixed(2)}
                />
              </div>

              <div className={styles.field}>
                <Label htmlFor={`ref-${invoice.id}`}>Reference</Label>
                <Input id={`ref-${invoice.id}`} name="reference" placeholder="NEFT/UTR or cheque number" />
              </div>

              <Result state={payState} />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setPayOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={paying}>{paying ? "Recording…" : "Record payment"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {(sendState.message || remindState.message) && (
        <span className={styles.rowMessage}>
          {sendState.message || remindState.message}
        </span>
      )}
    </div>
  );
}

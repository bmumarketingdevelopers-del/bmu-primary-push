"use client";

import * as React from "react";
import { AlertCircle, CheckCircle2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { createQrCode, type QrActionState } from "@/app/admin/qr/actions";
import { QR_KINDS } from "@/lib/qr-platform";
import { cn } from "@/lib/utils";
import styles from "./new-qr-dialog.module.css";

const initial: QrActionState = { ok: false, message: null };

/** Sensible destination per kind, so the form isn't a blank URL box. */
const HINTS: Record<string, { placeholder: string; help: string }> = {
  PROFILE: { placeholder: "/b/your-slug", help: "Opens the full smart profile." },
  GOOGLE_REVIEW: { placeholder: "/r/your-slug", help: "Sentiment-routed review flow." },
  WHATSAPP: { placeholder: "https://wa.me/919845000111", help: "Country code, no plus." },
  MENU: { placeholder: "/b/your-slug/menu", help: "Digital menu with table tracking." },
  PAYMENT: { placeholder: "upi://pay?pa=name@upi", help: "UPI link or payment page." },
  BOOKING: { placeholder: "/b/your-slug/book", help: "Appointment flow." },
  VCARD: { placeholder: "https://example.com/card", help: "Saves a contact." },
  LEAD: { placeholder: "https://example.com/offer", help: "Landing page with a form." },
  URL: { placeholder: "https://example.com", help: "Any link." },
};

export function NewQrDialog({ clients }: { clients: { id: string; name: string }[] }) {
  const [open, setOpen] = React.useState(false);
  const [kind, setKind] = React.useState("PROFILE");
  const [state, action, pending] = React.useActionState(createQrCode, initial);

  React.useEffect(() => {
    if (state.ok) {
      const t = setTimeout(() => setOpen(false), 1600);
      return () => clearTimeout(t);
    }
  }, [state.ok]);

  const hint = HINTS[kind] ?? HINTS.URL;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm"><Plus /> New QR code</Button>
      </DialogTrigger>

      <DialogContent className={styles.dialog}>
        <DialogHeader>
          <DialogTitle>Create a QR code</DialogTitle>
          <DialogDescription>
            The printed code encodes a short link, never the destination. You can repoint it any
            time without reprinting anything.
          </DialogDescription>
        </DialogHeader>

        <form action={action} className={styles.form}>
          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <Label htmlFor="qr-client">Client</Label>
              <select
                id="qr-client"
                name="clientId"
                required
                className={styles.select}
              >
                {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className={styles.field}>
              <Label htmlFor="qr-label">Label</Label>
              <Input id="qr-label" name="label" required placeholder="Reception standee" />
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <Label>What should it do?</Label>
            <div className={styles.kindBox}>
              {Object.entries(QR_KINDS).map(([group, kinds]) => (
                <div key={group}>
                  <p className={styles.groupLabel}>
                    {group}
                  </p>
                  <div className={styles.kindGrid}>
                    {kinds.map((k) => (
                      <button
                        key={k.kind}
                        type="button"
                        onClick={() => setKind(k.kind)}
                        className={cn(
                          styles.kindOption,
                          kind === k.kind ? styles.kindOptionOn : styles.kindOptionOff
                        )}
                      >
                        <span className={styles.kindLabel}>{k.label}</span>
                        <span className={styles.kindHelp}>{k.help}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <input type="hidden" name="type" value={kind} />
          </div>

          <div className={styles.field}>
            <Label htmlFor="qr-target">Destination</Label>
            <Input id="qr-target" name="target" required placeholder={hint.placeholder} />
            <p className={styles.help}>{hint.help}</p>
          </div>

          <div className={styles.field}>
            <Label htmlFor="qr-password">Password (optional)</Label>
            <Input id="qr-password" name="password" placeholder="Leave empty for an open code" />
            <p className={styles.help}>
              Useful for price lists and internal documents on a public standee.
            </p>
          </div>

          {state.message && (
            <p className={cn(styles.result, state.ok ? styles.resultOk : styles.resultError)}>
              {state.ok ? <CheckCircle2 className={styles.resultIcon} /> : <AlertCircle className={styles.resultIcon} />}
              {state.message}
            </p>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={pending}>{pending ? "Creating…" : "Create code"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useActionState, useState } from "react";
import { AlertCircle, CheckCircle2, Download, ExternalLink, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { updateQrTarget, type QrActionState } from "@/app/admin/qr/actions";
import { cn } from "@/lib/utils";
import styles from "./qr-editor.module.css";

const initial: QrActionState = { ok: false, message: null };

export function QrEditor({
  id, slug, label, target,
}: {
  id: string;
  slug: string;
  label: string;
  target: string;
}) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(updateQrTarget, initial);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm"><Pencil /> Edit</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{label}</DialogTitle>
          <DialogDescription>
            Change where this code goes. Anything already printed keeps working — only the
            destination moves.
          </DialogDescription>
        </DialogHeader>

        <div className={styles.preview}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/api/qr/${slug}`}
            alt={`QR code for ${label}`}
            className={styles.qrImage}
          />
          <div className={styles.details}>
            <div>
              <p className={styles.detailLabel}>
                Printed URL
              </p>
              <p className={styles.printedUrl}>/q/{slug}</p>
            </div>
            <div className={styles.downloads}>
              <Button asChild variant="outline" size="sm">
                <a href={`/api/qr/${slug}?f=png&d=1`}><Download /> PNG for print</a>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <a href={`/q/${slug}`} target="_blank" rel="noreferrer"><ExternalLink /> Test</a>
              </Button>
            </div>
          </div>
        </div>

        <form action={action} className={styles.form}>
          <input type="hidden" name="id" value={id} />

          <div className={styles.field}>
            <Label htmlFor={`label-${id}`}>Label</Label>
            <Input id={`label-${id}`} name="label" defaultValue={label} required />
          </div>

          <div className={styles.field}>
            <Label htmlFor={`target-${id}`}>Destination URL</Label>
            <Input id={`target-${id}`} name="target" type="url" defaultValue={target} required />
          </div>

          {state.message && (
            <p className={cn(styles.result, state.ok ? styles.resultOk : styles.resultError)}>
              {state.ok
                ? <CheckCircle2 className={styles.resultIcon} />
                : <AlertCircle className={styles.resultIcon} />}
              {state.message}
            </p>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={pending}>{pending ? "Saving…" : "Save destination"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

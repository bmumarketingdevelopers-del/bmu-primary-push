"use client";

import * as React from "react";
import { AlertCircle, CheckCircle2, Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { CmsFields } from "./cms-fields";
import { saveEntity, type EntityState } from "@/app/admin/entity-actions";
import { ENTITIES } from "@/lib/entities/registry";
import { cn } from "@/lib/utils";
import styles from "./entity-dialog.module.css";

const initial: EntityState = { ok: false, message: null };

/**
 * One dialog for every create and edit in the admin panel.
 *
 * `options` supplies pick-lists — clients for a project, for instance — so the
 * form never asks anyone to type a database ID.
 */
export function EntityDialog({
  entity,
  record,
  options,
  trigger,
  label,
  variant,
  open: controlledOpen,
  onOpenChange,
}: {
  entity: keyof typeof ENTITIES;
  record?: Record<string, unknown> & { id?: string };
  options?: Record<string, { value: string; label: string }[]>;
  trigger?: React.ReactNode;
  label?: string;
  /** Trigger button style when no custom trigger is passed. */
  variant?: React.ComponentProps<typeof Button>["variant"];
  /** Controlled mode — used when a row menu opens the dialog. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const def = ENTITIES[entity];
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  const setOpen = React.useCallback(
    (next: boolean) => {
      if (isControlled) onOpenChange?.(next);
      else setUncontrolledOpen(next);
    },
    [isControlled, onOpenChange]
  );
  const [state, action, pending] = React.useActionState(saveEntity, initial);
  const isEdit = Boolean(record?.id);

  React.useEffect(() => {
    if (state.ok) {
      const t = setTimeout(() => setOpen(false), 1400);
      return () => clearTimeout(t);
    }
  }, [state.ok]);

  // Fields with a pick-list are rendered as selects, the rest by CmsFields.
  const optionFields = def.fields.filter((f) => options?.[f.name]);
  const plainFields = def.fields.filter((f) => !options?.[f.name]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!isControlled && (
      <DialogTrigger asChild>
        {trigger ?? (
          <Button size="sm" variant={variant ?? (isEdit ? "ghost" : "default")}>
            {isEdit ? <Pencil /> : <Plus />}
            {label ?? (isEdit ? "Edit" : `New ${def.singular.toLowerCase()}`)}
          </Button>
        )}
      </DialogTrigger>
      )}

      <DialogContent className={styles.dialog}>
        <DialogHeader>
          <DialogTitle>{isEdit ? `Edit ${def.singular.toLowerCase()}` : `New ${def.singular.toLowerCase()}`}</DialogTitle>
          <DialogDescription>{def.description}</DialogDescription>
        </DialogHeader>

        <form action={action} className={styles.form}>
          <input type="hidden" name="__entity" value={entity} />
          {record?.id && <input type="hidden" name="__id" value={String(record.id)} />}

          {optionFields.map((f) => (
            <div key={f.name} className={styles.field}>
              <label htmlFor={`e-${f.name}`} className={styles.label}>{f.label}</label>
              <select
                id={`e-${f.name}`}
                name={f.name}
                defaultValue={String(record?.[f.name] ?? "")}
                className={styles.select}
              >
                {options![f.name].map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              {f.help && <p className={styles.help}>{f.help}</p>}
            </div>
          ))}

          <CmsFields fields={plainFields} value={(record ?? {}) as Record<string, unknown>} />

          {state.message && (
            <p className={cn(styles.result, state.ok ? styles.resultOk : styles.resultError)}>
              {state.ok ? <CheckCircle2 className={styles.resultIcon} /> : <AlertCircle className={styles.resultIcon} />}
              {state.message}
            </p>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving…" : isEdit ? "Save changes" : `Create ${def.singular.toLowerCase()}`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

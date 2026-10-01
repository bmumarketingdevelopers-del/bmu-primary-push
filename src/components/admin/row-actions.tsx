"use client";

import * as React from "react";
import { Eye, EyeOff, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { EntityDialog } from "./entity-dialog";
import { deleteEntity, toggleEntity } from "@/app/admin/entity-actions";
import { ENTITIES } from "@/lib/entities/registry";
import styles from "./row-actions.module.css";

/**
 * Edit, hide and delete for a table row.
 *
 * Delete asks first and names the record — an accidental client deletion
 * takes its projects, leads and invoices with it through the cascade.
 */
export function RowActions({
  entity,
  record,
  options,
  toggleField,
  toggleValue,
  toggleLabels = ["Hide", "Show"],
  canDelete = true,
}: {
  entity: keyof typeof ENTITIES;
  record: Record<string, unknown> & { id?: string };
  options?: Record<string, { value: string; label: string }[]>;
  /** Boolean column to flip, e.g. isActive or isPublished. */
  toggleField?: string;
  toggleValue?: boolean;
  toggleLabels?: [string, string];
  canDelete?: boolean;
}) {
  const def = ENTITIES[entity];
  const [confirming, setConfirming] = React.useState(false);
  const [editing, setEditing] = React.useState(false);

  const name = String(record.name ?? record.title ?? record.handle ?? record.number ?? "this record");

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            aria-label={`Actions for ${name}`}
            className={styles.trigger}
          >
            <MoreHorizontal className={styles.triggerIcon} />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setEditing(true); }}>
            <Pencil /> Edit {def.singular.toLowerCase()}
          </DropdownMenuItem>

          {toggleField && (
            <DropdownMenuItem asChild>
              <form action={toggleEntity} className={styles.toggleForm}>
                <input type="hidden" name="__entity" value={entity} />
                <input type="hidden" name="__id" value={String(record.id ?? "")} />
                <input type="hidden" name="__field" value={toggleField} />
                <input type="hidden" name="__next" value={String(!toggleValue)} />
                <button type="submit" className={styles.toggleButton}>
                  {toggleValue ? <EyeOff /> : <Eye />}
                  {toggleValue ? toggleLabels[0] : toggleLabels[1]}
                </button>
              </form>
            </DropdownMenuItem>
          )}

          {canDelete && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className={styles.deleteItem}
                onSelect={(e) => { e.preventDefault(); setConfirming(true); }}
              >
                <Trash2 /> Delete
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit — the same dialog as create, opened in controlled mode. */}
      <EntityDialog
        entity={entity}
        record={record}
        options={options}
        open={editing}
        onOpenChange={setEditing}
      />

      <Dialog open={confirming} onOpenChange={setConfirming}>
        <DialogContent className={styles.confirmDialog}>
          <DialogHeader>
            <DialogTitle>Delete {name}?</DialogTitle>
            <DialogDescription>
              This can&apos;t be undone. Anything attached to this{" "}
              {def.singular.toLowerCase()} — projects, leads, invoices — is removed with it.
              If you only want it out of the way, hide it instead.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirming(false)}>Keep it</Button>
            <form action={deleteEntity}>
              <input type="hidden" name="__entity" value={entity} />
              <input type="hidden" name="__id" value={String(record.id ?? "")} />
              <Button type="submit" variant="destructive">Delete permanently</Button>
            </form>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

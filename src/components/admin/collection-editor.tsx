"use client";

import { useActionState } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CmsFields } from "./cms-fields";
import { saveCollectionItem, type ItemState } from "@/app/admin/cms/c/actions";
import type { CollectionDef } from "@/lib/cms/collections";
import { cn } from "@/lib/utils";
import styles from "./collection-editor.module.css";

const initial: ItemState = { ok: false, message: null };

export function CollectionEditor({
  collection,
  slug,
  value,
}: {
  collection: CollectionDef;
  slug: string;
  value: Record<string, unknown>;
}) {
  const [state, action, pending] = useActionState(saveCollectionItem, initial);

  return (
    <form action={action} className={styles.form}>
      <input type="hidden" name="__collection" value={collection.key} />
      <input type="hidden" name="__slug" value={slug} />

      <CmsFields fields={collection.fields} value={value} />

      {state.message && (
        <p className={cn(styles.result, state.ok ? styles.resultOk : styles.resultError)}>
          {state.ok ? <CheckCircle2 className={styles.resultIcon} /> : <AlertCircle className={styles.resultIcon} />}
          {state.message}
        </p>
      )}

      <div className={styles.saveBar}>
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : `Save ${collection.singular.toLowerCase()}`}
        </Button>
      </div>
    </form>
  );
}

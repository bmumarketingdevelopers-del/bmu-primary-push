"use client";

import { useActionState } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CmsFields } from "./cms-fields";
import { saveContentBlock, type CmsState } from "@/app/admin/cms/actions";
import type { BlockDef } from "@/lib/cms/schema";
import { cn } from "@/lib/utils";
import styles from "./cms-editor.module.css";

const initial: CmsState = { ok: false, message: null };

export function CmsEditor({ block, value }: { block: BlockDef; value: Record<string, unknown> }) {
  const [state, action, pending] = useActionState(saveContentBlock, initial);

  return (
    <form action={action} className={styles.form}>
      <input type="hidden" name="__key" value={block.key} />

      <CmsFields fields={block.fields} value={value} />

      {state.message && (
        <p className={cn(styles.result, state.ok ? styles.resultOk : styles.resultError)}>
          {state.ok ? <CheckCircle2 className={styles.resultIcon} /> : <AlertCircle className={styles.resultIcon} />}
          {state.message}
        </p>
      )}

      <div className={styles.saveBar}>
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}

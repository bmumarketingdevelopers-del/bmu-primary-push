"use client";

import * as React from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Field } from "@/lib/cms/schema";
import { cn } from "@/lib/utils";
import styles from "./cms-fields.module.css";

/** Renders a list of CMS fields. Shared by the block editor and the collection editor. */
export function CmsFields({ fields, value }: { fields: Field[]; value: Record<string, unknown> }) {
  return (
    <div className={styles.fields}>
      {fields.map((field) => (
        <FieldInput key={field.name} field={field} value={value[field.name]} />
      ))}
    </div>
  );
}

function FieldInput({
  field,
  value,
  namePrefix = "",
}: {
  field: Field;
  value: unknown;
  namePrefix?: string;
}) {
  const name = namePrefix ? `${namePrefix}.${field.name}` : field.name;

  if (field.type === "repeater" && field.fields) {
    return <Repeater field={field} value={value} name={name} />;
  }

  if (field.type === "list") {
    const list = Array.isArray(value) ? (value as string[]) : [];
    return (
      <div className={styles.field}>
        <Label htmlFor={name}>{field.label}</Label>
        <textarea
          id={name}
          name={name}
          rows={Math.max(3, list.length + 1)}
          defaultValue={list.join("\n")}
          placeholder={field.placeholder}
          className={cn(styles.textarea, styles.textareaMono)}
        />
        <p className={styles.help}>
          {field.help ?? "One item per line."}
        </p>
      </div>
    );
  }

  if (field.type === "textarea") {
    return (
      <div className={styles.field}>
        <Label htmlFor={name}>{field.label}</Label>
        <textarea
          id={name}
          name={name}
          rows={4}
          defaultValue={String(value ?? "")}
          placeholder={field.placeholder}
          className={styles.textarea}
        />
        {field.help && <p className={styles.help}>{field.help}</p>}
      </div>
    );
  }

  return (
    <div className={styles.field}>
      <Label htmlFor={name}>{field.label}</Label>
      <Input
        id={name}
        name={name}
        type={field.type === "number" ? "number" : "text"}
        defaultValue={String(value ?? "")}
        placeholder={field.placeholder}
      />
      {field.help && <p className={styles.help}>{field.help}</p>}
    </div>
  );
}

function Repeater({ field, value, name }: { field: Field; value: unknown; name: string }) {
  const initialRows = Array.isArray(value) ? (value as Record<string, unknown>[]) : [];
  const [rows, setRows] = React.useState<Record<string, unknown>[]>(
    initialRows.length ? initialRows : [{}]
  );

  return (
    <div className={styles.repeater}>
      <div className={styles.repeaterHeader}>
        <Label>{field.label}</Label>
        <span className={styles.help}>{rows.length} item{rows.length === 1 ? "" : "s"}</span>
      </div>

      <div className={styles.rows}>
        {rows.map((row, i) => (
          <div key={i} className={styles.row}>
            <div className={styles.rowHeader}>
              <span className={styles.rowLabel}>
                Item {i + 1}
              </span>
              <button
                type="button"
                onClick={() => setRows((r) => r.filter((_, idx) => idx !== i))}
                className={styles.removeButton}
                aria-label={`Remove item ${i + 1}`}
              >
                <Trash2 className={styles.removeIcon} />
              </button>
            </div>

            <div className={styles.rowFields}>
              {field.fields!.map((sub) => (
                <FieldInput
                  key={sub.name}
                  field={sub}
                  value={row[sub.name]}
                  namePrefix={`${name}.${i}`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <Button type="button" variant="outline" size="sm" onClick={() => setRows((r) => [...r, {}])}>
        <Plus /> Add item
      </Button>
    </div>
  );
}

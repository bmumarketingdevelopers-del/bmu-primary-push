import type { Field } from "@/lib/cms/schema";

/**
 * Rebuilds structured data from a flat form post.
 *
 * Lists arrive newline-separated; repeaters arrive as indexed names like
 * `links.0.label`. This is the simplest encoding that survives a plain HTML
 * form without any client-side state, which means the editors still work if
 * JavaScript fails to load.
 */
export function decodeFields(
  fields: Field[],
  formData: FormData,
  prefix = ""
): Record<string, unknown> {
  const out: Record<string, unknown> = {};

  for (const field of fields) {
    const name = prefix ? `${prefix}.${field.name}` : field.name;

    if (field.type === "list") {
      out[field.name] = String(formData.get(name) ?? "")
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);
      continue;
    }

    if (field.type === "repeater" && field.fields) {
      const rows: Record<string, unknown>[] = [];
      for (let i = 0; ; i++) {
        const rowPrefix = `${name}.${i}`;
        if (!field.fields.some((f) => formData.has(`${rowPrefix}.${f.name}`))) break;

        const row = decodeFields(field.fields, formData, rowPrefix);
        const empty = Object.values(row).every(
          (v) => v === "" || v === null || (Array.isArray(v) && v.length === 0)
        );
        if (!empty) rows.push(row);
      }
      out[field.name] = rows;
      continue;
    }

    if (field.type === "number") {
      const raw = formData.get(name);
      out[field.name] = raw === null || raw === "" ? null : Number(raw);
      continue;
    }

    out[field.name] = String(formData.get(name) ?? "");
  }

  return out;
}

"use server";

import { revalidatePath } from "next/cache";
import { requireStaff } from "@/lib/session";
import { saveBlock } from "@/lib/cms";
import { blockByKey, type Field } from "@/lib/cms/schema";

export type CmsState = { ok: boolean; message: string | null };

/**
 * Rebuilds the block's JSON from flat form data.
 *
 * Lists arrive as newline-separated text; repeaters arrive as indexed field
 * names like `items.0.value`, which is the simplest encoding that survives a
 * plain HTML form post without any client-side state.
 */
function collect(fields: Field[], formData: FormData, prefix = ""): Record<string, unknown> {
  const out: Record<string, unknown> = {};

  for (const field of fields) {
    const name = prefix ? `${prefix}.${field.name}` : field.name;

    if (field.type === "list") {
      const raw = String(formData.get(name) ?? "");
      out[field.name] = raw.split("\n").map((l) => l.trim()).filter(Boolean);
      continue;
    }

    if (field.type === "repeater" && field.fields) {
      const rows: Record<string, unknown>[] = [];
      for (let i = 0; ; i++) {
        const rowPrefix = `${name}.${i}`;
        const present = field.fields.some((f) => formData.has(`${rowPrefix}.${f.name}`));
        if (!present) break;

        const row = collect(field.fields, formData, rowPrefix);
        // Skip rows the editor blanked out entirely.
        const empty = Object.values(row).every(
          (v) => v === "" || (Array.isArray(v) && v.length === 0)
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

export async function saveContentBlock(_prev: CmsState, formData: FormData): Promise<CmsState> {
  const user = await requireStaff();

  const key = String(formData.get("__key") ?? "");
  const def = blockByKey(key);
  if (!def) return { ok: false, message: "That content block doesn't exist." };

  try {
    const data = collect(def.fields, formData);
    const result = await saveBlock(key, data, user.id);

    // The public site is statically cached — clear it so edits appear.
    revalidatePath("/", "layout");

    return result.saved
      ? { ok: true, message: "Saved. The live site is updated." }
      : { ok: true, message: "Validated, but not stored — no DATABASE_URL is configured." };
  } catch (err) {
    console.error("[cms] save failed:", err);
    return { ok: false, message: "Couldn't save that. Check the server logs." };
  }
}

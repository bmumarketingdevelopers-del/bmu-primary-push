"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireStaff } from "@/lib/session";
import { collectionByKey } from "@/lib/cms/collections";
import { deleteItem, saveItem, setPublished } from "@/lib/cms/items";
import type { Field } from "@/lib/cms/schema";

export type ItemState = { ok: boolean; message: string | null };

/** Same flat-form decoding the block editor uses: lists by line, repeaters by index. */
function collect(fields: Field[], formData: FormData, prefix = ""): Record<string, unknown> {
  const out: Record<string, unknown> = {};

  for (const field of fields) {
    const name = prefix ? `${prefix}.${field.name}` : field.name;

    if (field.type === "list") {
      out[field.name] = String(formData.get(name) ?? "")
        .split("\n").map((l) => l.trim()).filter(Boolean);
      continue;
    }

    if (field.type === "repeater" && field.fields) {
      const rows: Record<string, unknown>[] = [];
      for (let i = 0; ; i++) {
        const rowPrefix = `${name}.${i}`;
        if (!field.fields.some((f) => formData.has(`${rowPrefix}.${f.name}`))) break;
        const row = collect(field.fields, formData, rowPrefix);
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

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 60);

export async function saveCollectionItem(_prev: ItemState, formData: FormData): Promise<ItemState> {
  const user = await requireStaff();

  const key = String(formData.get("__collection") ?? "");
  const originalSlug = String(formData.get("__slug") ?? "");
  const def = collectionByKey(key);
  if (!def) return { ok: false, message: "Unknown collection." };

  try {
    const data = collect(def.fields, formData);
    const slug = slugify(String(data.slug || data[def.titleField] || originalSlug));

    if (!slug) return { ok: false, message: "This needs a slug or a title." };
    data.slug = slug;

    const result = await saveItem(key, slug, data, user.id);

    // Clear the whole public site — one item can appear on several pages.
    revalidatePath("/", "layout");

    if (!result.saved) {
      return { ok: true, message: "Validated, but not stored — no DATABASE_URL is configured." };
    }

    // A renamed slug leaves the editor pointing at a URL that no longer exists.
    if (slug !== originalSlug && originalSlug !== "new") {
      redirect(`/admin/cms/c/${key}/${slug}`);
    }

    return { ok: true, message: "Saved. The live site is updated." };
  } catch (err) {
    // redirect() throws by design — let it through.
    if (err && typeof err === "object" && "digest" in err) throw err;
    console.error("[cms] item save failed:", err);
    return { ok: false, message: "Couldn't save that. Check the server logs." };
  }
}

export async function togglePublished(formData: FormData) {
  await requireStaff();
  const key = String(formData.get("collection") ?? "");
  const slug = String(formData.get("slug") ?? "");
  const next = String(formData.get("next") ?? "true") === "true";

  await setPublished(key, slug, next);
  revalidatePath("/", "layout");
  revalidatePath(`/admin/cms/c/${key}`);
}

export async function removeItem(formData: FormData) {
  await requireStaff();
  const key = String(formData.get("collection") ?? "");
  const slug = String(formData.get("slug") ?? "");

  await deleteItem(key, slug);
  revalidatePath("/", "layout");
  redirect(`/admin/cms/c/${key}`);
}

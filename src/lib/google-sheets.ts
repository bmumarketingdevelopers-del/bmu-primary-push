import "server-only";
import { z } from "zod";

/** Fields every public form sends from formContext(). Bounded — they come straight from the browser. */
export const formContextSchema = z.object({
  page: z.string().max(500).optional(),
  referrer: z.string().max(2000).optional(),
});

type FormContext = z.infer<typeof formContextSchema>;

/**
 * The "which page" columns for a sheet row. Falls back to the Referer header
 * for a client that didn't send context, e.g. an old tab still open from
 * before a deploy.
 */
export function pageColumns(ctx: FormContext, req: Request) {
  let path = ctx.page;
  const fallback = req.headers.get("referer");
  if (!path && fallback) {
    try {
      path = new URL(fallback).pathname;
    } catch {
      // Malformed header — leave the column blank.
    }
  }

  return {
    Page: path ?? "",
    "Came from": ctx.referrer ?? "",
  };
}

export type SheetRow = Record<string, string | number | null | undefined>;

/**
 * Appends a form submission to a tab in Google Sheets, through the Apps
 * Script web app in scripts/google-sheets-webhook.gs. The script creates the
 * tab and any missing header columns on first use, so a new field here needs
 * no change on the sheet side.
 *
 * Same rule as email: this must never break the submit that triggered it.
 * The database is the record; the sheet is a convenience copy.
 */
export async function appendToSheet(sheet: string, row: SheetRow) {
  const url = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  const stamped = {
    "Submitted at": new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    ...row,
  };

  if (!url) {
    console.info(`[sheets] would append to "${sheet}" — no GOOGLE_SHEETS_WEBHOOK_URL set`);
    return { sent: false, reason: "not-configured" as const };
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret: process.env.GOOGLE_SHEETS_SECRET ?? "", sheet, row: stamped }),
      // Apps Script cold starts are slow, but a hung request shouldn't pin the function open.
      signal: AbortSignal.timeout(15_000),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok || !data?.ok) throw new Error(data?.error ?? `HTTP ${res.status}`);
    return { sent: true as const };
  } catch (err) {
    console.error(`[sheets] append to "${sheet}" failed:`, err);
    return { sent: false, reason: "error" as const };
  }
}

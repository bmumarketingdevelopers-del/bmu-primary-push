/**
 * Website form submissions → Google Sheets.
 *
 * The site posts every form submit here (src/lib/google-sheets.ts). Each form
 * gets its own tab, created on the first submission, and columns are added as
 * new fields appear — adding a field to a form needs no change in this file.
 *
 * Setup, once:
 *  1. Create a Google Sheet, then Extensions → Apps Script. Replace the editor
 *     contents with this file and save.
 *  2. Set SECRET below to a long random string. Put the same value in
 *     GOOGLE_SHEETS_SECRET on the server.
 *  3. Deploy → New deployment → gear icon → Web app.
 *       Execute as:      Me
 *       Who has access:  Anyone
 *     Authorise when asked, then copy the Web app URL (ends in /exec) into
 *     GOOGLE_SHEETS_WEBHOOK_URL on the server.
 *
 * After editing this script later: Deploy → Manage deployments → pencil →
 * Version: New version. Saving alone doesn't change what the URL runs.
 */
const SECRET = "change-me";

function doPost(e) {
  let body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return reply({ ok: false, error: "Body is not JSON" });
  }

  // "Anyone" access means anyone holding the URL can post; the secret is what keeps junk out.
  if (SECRET === "change-me" || body.secret !== SECRET) {
    return reply({ ok: false, error: "Wrong or unset secret" });
  }

  // Two submissions at once would otherwise race on the header row.
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);

  try {
    const book = SpreadsheetApp.getActiveSpreadsheet();
    const name = String(body.sheet || "Submissions").slice(0, 90);
    const sheet = book.getSheetByName(name) || book.insertSheet(name);
    const row = body.row || {};

    let headers =
      sheet.getLastColumn() > 0
        ? sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(String)
        : [];

    const missing = Object.keys(row).filter((key) => headers.indexOf(key) === -1);
    if (missing.length) {
      headers = headers.concat(missing);
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight("bold");
      sheet.setFrozenRows(1);
    }

    sheet.appendRow(headers.map((h) => cell(row[h])));
    return reply({ ok: true });
  } finally {
    lock.releaseLock();
  }
}

/**
 * Text is written with a leading ' so Sheets keeps it exactly as typed:
 * "+91 98450 00000" stays a phone number instead of a broken formula,
 * pincodes keep their leading zeros, and "=IMPORTXML(…)" typed into a form
 * stays harmless text. The ' itself isn't shown in the cell.
 */
function cell(value) {
  if (value === null || value === undefined) return "";
  if (typeof value === "number") return value;
  return "'" + String(value);
}

function reply(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}

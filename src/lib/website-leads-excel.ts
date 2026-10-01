import "server-only";
import ExcelJS from "exceljs";
import {
  LEAD_FORM_LABELS,
  LEAD_STATUS_LABELS,
  LEAD_STATUSES,
  type LeadForm,
  type LeadStatus,
  type WebsiteLead,
} from "@/lib/website-lead-types";

/**
 * Excel workbook for website leads:
 *   Summary            — counts by status for each form, and how to update statuses
 *   Landing page form  — one row per lead from the landing-page form
 *   Contact page form  — one row per lead from the /contact form
 *
 * Lead sheets: a title band (rows 1–2), the header on row 3 (frozen, with filters), then one
 * row per lead. The Status column is a dropdown (New / Follow up / Converted / Rejected) for
 * tracking in Excel; the dashboard remains the source of truth.
 */

const INK = "FF121F2F";
const INK_2 = "FF1F3B56";
const GREEN = "FF8BB72C";
const GREEN_TINT = "FFEEF6E1";
const STRIPE = "FFF7FAF2";
const BORDER = "FFDDE3D5";
const GREY_TEXT = "FF8A929A";
const MUTED = "FF5F6870";
const WHITE = "FFFFFFFF";

const ID_HEADER = "Lead ID";
const STATUS_HEADER = "Status";
const HEADER_ROW = 3;
const DROPDOWN_ROWS = 1000; // dropdown also on empty rows below the data

const STATUS_STYLE: Record<LeadStatus, { fill: string; font: string }> = {
  new: { fill: "FFE8EEF6", font: "FF1F3B56" },
  follow_up: { fill: "FFFFF1D6", font: "FF8A5A00" },
  converted: { fill: "FFE1F2C4", font: "FF3F6212" },
  rejected: { fill: "FFFBE1E1", font: "FFA52F2F" },
};

// Stored in UTC; shown in India time
const IST_OFFSET = 5.5 * 60 * 60 * 1000;
const ist = (iso: string | null) =>
  iso ? new Date(new Date(iso).getTime() + IST_OFFSET) : null;

type Column = {
  header: string;
  width: number;
  value: (l: WebsiteLead, index: number) => ExcelJS.CellValue;
  kind?: "date" | "text" | "wrap" | "status" | "id" | "index";
};

const LEAD_COLUMNS: Record<LeadForm, Column[]> = {
  quick: [
    { header: "#", width: 6, value: (_, i) => i + 1, kind: "index" },
    {
      header: "Received (IST)",
      width: 21,
      value: (l) => ist(l.createdAt),
      kind: "date",
    },
    { header: "Name", width: 24, value: (l) => l.name },
    { header: "Phone", width: 17, value: (l) => l.phone, kind: "text" },
    { header: "Needs", width: 30, value: (l) => l.need },
    {
      header: STATUS_HEADER,
      width: 16,
      value: (l) => LEAD_STATUS_LABELS[l.status],
      kind: "status",
    },
    {
      header: "Status updated (IST)",
      width: 21,
      value: (l) => ist(l.statusUpdatedAt),
      kind: "date",
    },
    { header: "Submitted from", width: 16, value: (l) => l.page },
    { header: "Came from", width: 30, value: (l) => l.referrer },
    { header: ID_HEADER, width: 38, value: (l) => l.id, kind: "id" },
  ],
  contact: [
    { header: "#", width: 6, value: (_, i) => i + 1, kind: "index" },
    {
      header: "Received (IST)",
      width: 21,
      value: (l) => ist(l.createdAt),
      kind: "date",
    },
    { header: "Name", width: 24, value: (l) => l.name },
    { header: "Phone", width: 17, value: (l) => l.phone, kind: "text" },
    { header: "Email", width: 28, value: (l) => l.email },
    { header: "Company", width: 22, value: (l) => l.company },
    {
      header: STATUS_HEADER,
      width: 16,
      value: (l) => LEAD_STATUS_LABELS[l.status],
      kind: "status",
    },
    { header: "Monthly budget", width: 17, value: (l) => l.budget },
    { header: "Needs", width: 26, value: (l) => l.need },
    { header: "Message", width: 50, value: (l) => l.message, kind: "wrap" },
    {
      header: "Status updated (IST)",
      width: 21,
      value: (l) => ist(l.statusUpdatedAt),
      kind: "date",
    },
    { header: "Submitted from", width: 16, value: (l) => l.page },
    { header: "Came from", width: 30, value: (l) => l.referrer },
    { header: ID_HEADER, width: 38, value: (l) => l.id, kind: "id" },
  ],
};

const colLetter = (n: number) => {
  let s = "";
  for (; n > 0; n = Math.floor((n - 1) / 26))
    s = String.fromCharCode(65 + ((n - 1) % 26)) + s;
  return s;
};

const thin = { style: "thin" as const, color: { argb: BORDER } };
const box = { top: thin, left: thin, bottom: thin, right: thin };
const solid = (argb: string): ExcelJS.Fill => ({
  type: "pattern",
  pattern: "solid",
  fgColor: { argb },
});

const exportedAt = () =>
  new Date(Date.now() + IST_OFFSET)
    .toISOString()
    .slice(0, 16)
    .replace("T", " ") + " IST";

const statusList = `"${LEAD_STATUSES.map((s) => LEAD_STATUS_LABELS[s]).join(",")}"`;

function addLeadSheet(
  wb: ExcelJS.Workbook,
  form: LeadForm,
  leads: WebsiteLead[],
) {
  const cols = LEAD_COLUMNS[form];
  const last = colLetter(cols.length);
  const statusIndex = cols.findIndex((c) => c.kind === "status") + 1;
  const statusLetter = colLetter(statusIndex);

  const ws = wb.addWorksheet(LEAD_FORM_LABELS[form], {
    properties: { tabColor: { argb: form === "quick" ? GREEN : INK_2 } },
    // Header row and the #/Received/Name columns stay in view while scrolling
    views: [
      {
        state: "frozen",
        xSplit: 3,
        ySplit: HEADER_ROW,
        topLeftCell: "D4",
        activeCell: `${statusLetter}4`,
      },
    ],
    pageSetup: {
      orientation: "landscape",
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0,
    },
  });
  cols.forEach((c, i) => (ws.getColumn(i + 1).width = c.width));

  // ---- title band (rows 1–2)
  ws.mergeCells(`A1:${last}1`);
  const title = ws.getCell("A1");
  title.value = `${LEAD_FORM_LABELS[form]} — website leads`;
  title.font = { bold: true, size: 14, color: { argb: WHITE } };
  title.fill = solid(INK);
  title.alignment = { vertical: "middle", indent: 1 };
  ws.getRow(1).height = 30;

  ws.mergeCells(`A2:${last}2`);
  const sub = ws.getCell("A2");
  sub.value = `${leads.length} lead${leads.length === 1 ? "" : "s"} · exported ${exportedAt()} · Statuses as set in the admin portal at export time.`;
  sub.font = { size: 10, color: { argb: MUTED } };
  sub.fill = solid(GREEN_TINT);
  sub.alignment = { vertical: "middle", indent: 1 };
  ws.getRow(2).height = 22;

  // ---- header (row 3)
  const header = ws.getRow(HEADER_ROW);
  header.values = cols.map((c) => c.header);
  header.height = 26;
  header.eachCell((cell, col) => {
    const isStatus = col === statusIndex;
    cell.font = { bold: true, color: { argb: isStatus ? INK : WHITE } };
    cell.fill = solid(isStatus ? GREEN : INK_2);
    cell.alignment = {
      vertical: "middle",
      horizontal: isStatus || col === 1 ? "center" : "left",
      indent: isStatus || col === 1 ? 0 : 1,
    };
    cell.border = box;
  });
  ws.getCell(`${statusLetter}${HEADER_ROW}`).note =
    "Pick New, Follow up, Converted or Rejected from the dropdown.";

  // ---- data rows
  leads.forEach((lead, i) => {
    const row = ws.getRow(HEADER_ROW + 1 + i);
    row.values = cols.map((c) => c.value(lead, i) ?? "");
    row.height =
      form === "contact" && lead.message && lead.message.length > 60 ? 42 : 22;
    cols.forEach((c, ci) => {
      const cell = row.getCell(ci + 1);
      cell.border = box;
      cell.alignment = {
        vertical: "middle",
        indent: c.kind === "index" ? 0 : 1,
      };
      if (i % 2 === 1) cell.fill = solid(STRIPE);
      if (c.kind === "index") {
        cell.alignment = { vertical: "middle", horizontal: "center" };
        cell.font = { color: { argb: GREY_TEXT } };
      }
      if (c.kind === "date") cell.numFmt = "dd mmm yyyy, hh:mm AM/PM";
      if (c.kind === "text") cell.numFmt = "@"; // phone numbers stay as typed
      if (c.kind === "wrap")
        cell.alignment = { vertical: "top", wrapText: true, indent: 1 };
      if (c.kind === "status") {
        cell.alignment = { vertical: "middle", horizontal: "center" };
        cell.font = { bold: true };
      }
      if (c.kind === "id") cell.font = { size: 9, color: { argb: GREY_TEXT } };
    });
  });

  // ---- Status dropdown on every data row and the empty rows below
  const firstData = HEADER_ROW + 1;
  const lastDropdown = Math.max(
    HEADER_ROW + leads.length,
    HEADER_ROW + DROPDOWN_ROWS,
  );
  // One validation for the whole range (per-cell validations get split into overlapping ranges,
  // which Excel can flag as damaged content)
  const dropdowns = (
    ws as unknown as {
      dataValidations: {
        add: (range: string, v: ExcelJS.DataValidation) => void;
      };
    }
  ).dataValidations;
  dropdowns.add(`${statusLetter}${firstData}:${statusLetter}${lastDropdown}`, {
    type: "list",
    allowBlank: true,
    formulae: [statusList],
    showInputMessage: true,
    promptTitle: "Review status",
    prompt: "New, Follow up, Converted or Rejected",
    showErrorMessage: true,
    errorStyle: "stop",
    errorTitle: "Status",
    error: "Choose New, Follow up, Converted or Rejected from the list.",
  });

  // Colour follows the value, so it updates as statuses are changed in Excel
  ws.addConditionalFormatting({
    ref: `${statusLetter}${firstData}:${statusLetter}${lastDropdown}`,
    rules: LEAD_STATUSES.map((s, i) => ({
      type: "cellIs" as const,
      operator: "equal" as const,
      formulae: [`"${LEAD_STATUS_LABELS[s]}"`],
      priority: i + 1,
      style: {
        fill: {
          type: "pattern" as const,
          pattern: "solid" as const,
          bgColor: { argb: STATUS_STYLE[s].fill },
        },
        font: { bold: true, color: { argb: STATUS_STYLE[s].font } },
      },
    })),
  });

  // Filter buttons on the header only (not the title band)
  ws.autoFilter = {
    from: { row: HEADER_ROW, column: 1 },
    to: { row: HEADER_ROW, column: cols.length },
  };
}

function addSummarySheet(wb: ExcelJS.Workbook, leads: WebsiteLead[]) {
  const ws = wb.addWorksheet("Summary", {
    properties: { tabColor: { argb: GREEN } },
    views: [{ showGridLines: false }],
  });
  ws.columns = [
    { width: 4 },
    { width: 24 },
    { width: 22 },
    { width: 22 },
    { width: 14 },
  ];

  ws.mergeCells("B2:E2");
  ws.getCell("B2").value = "BMU website leads";
  ws.getCell("B2").font = { bold: true, size: 18, color: { argb: INK } };
  ws.getRow(2).height = 30;
  ws.mergeCells("B3:E3");
  ws.getCell("B3").value = `Exported ${exportedAt()}`;
  ws.getCell("B3").font = { color: { argb: GREY_TEXT } };

  const head = ws.getRow(5);
  [
    "",
    "Status",
    LEAD_FORM_LABELS.quick,
    LEAD_FORM_LABELS.contact,
    "Total",
  ].forEach((v, i) => {
    if (!i) return;
    const cell = head.getCell(i + 1);
    cell.value = v;
    cell.font = { bold: true, color: { argb: WHITE } };
    cell.fill = solid(INK_2);
    cell.alignment = {
      vertical: "middle",
      horizontal: i === 1 ? "left" : "center",
      indent: i === 1 ? 1 : 0,
    };
    cell.border = box;
  });
  head.height = 24;

  const count = (form: LeadForm | null, status: LeadStatus | null) =>
    leads.filter(
      (l) => (!form || l.form === form) && (!status || l.status === status),
    ).length;

  const rows: [
    string,
    number,
    number,
    number,
    { fill: string; font: string } | null,
  ][] = [
    ...LEAD_STATUSES.map(
      (s) =>
        [
          LEAD_STATUS_LABELS[s],
          count("quick", s),
          count("contact", s),
          count(null, s),
          STATUS_STYLE[s],
        ] as [string, number, number, number, { fill: string; font: string }],
    ),
    ["Total", count("quick", null), count("contact", null), leads.length, null],
  ];
  rows.forEach(([label, q, c, t, style], i) => {
    const row = ws.getRow(6 + i);
    row.height = 22;
    [label, q, c, t].forEach((v, j) => {
      const cell = row.getCell(j + 2);
      cell.value = v;
      cell.border = box;
      cell.alignment = {
        vertical: "middle",
        horizontal: j === 0 ? "left" : "center",
        indent: j === 0 ? 1 : 0,
      };
      if (style && j === 0) {
        cell.fill = solid(style.fill);
        cell.font = { bold: true, color: { argb: style.font } };
      }
      if (!style) {
        cell.fill = solid(GREEN_TINT);
        cell.font = { bold: true };
      }
    });
  });

  const converted = count(null, "converted");
  const decided = converted + count(null, "rejected");
  const rateRow = 6 + rows.length + 1;
  ws.getCell(`B${rateRow}`).value = "Conversion rate";
  ws.getCell(`B${rateRow}`).font = { bold: true };
  ws.getCell(`C${rateRow}`).value = decided ? converted / decided : "—";
  ws.getCell(`C${rateRow}`).numFmt = "0%";
  ws.getCell(`C${rateRow}`).alignment = { horizontal: "center" };
  ws.getCell(`D${rateRow}`).value = "converted ÷ (converted + rejected)";
  ws.getCell(`D${rateRow}`).font = { size: 9, color: { argb: GREY_TEXT } };

  const notes = [
    "About this file",
    "Statuses are as they were in the admin portal when this file was exported.",
    "The Status column has a dropdown (New, Follow up, Converted, Rejected) for tracking here, but",
    "changes made in Excel don't update the dashboard — change statuses in the admin portal.",
  ];
  notes.forEach((text, i) => {
    const r = rateRow + 2 + i;
    ws.mergeCells(`B${r}:E${r}`);
    const cell = ws.getCell(`B${r}`);
    cell.value = text;
    cell.font =
      i === 0
        ? { bold: true, size: 12, color: { argb: INK } }
        : { color: { argb: MUTED } };
    cell.alignment = { wrapText: true, vertical: "top" };
    if (i === notes.length - 1) ws.getRow(r).height = 30;
  });
}

export async function buildLeadsWorkbook(
  leads: WebsiteLead[],
): Promise<Buffer> {
  const wb = new ExcelJS.Workbook();
  wb.creator = "BMU admin portal";
  wb.created = new Date();
  addSummarySheet(wb, leads);
  addLeadSheet(
    wb,
    "quick",
    leads.filter((l) => l.form === "quick"),
  );
  addLeadSheet(
    wb,
    "contact",
    leads.filter((l) => l.form === "contact"),
  );
  return Buffer.from(await wb.xlsx.writeBuffer());
}

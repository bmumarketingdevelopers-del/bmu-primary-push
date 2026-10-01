import { splitGst } from "./gst";
import { ADMIN_INVOICES, CAMPAIGNS, CLIENTS, CLIENT_DETAIL_EXTRAS } from "@/lib/admin-data";
import { PAYOUTS, CREATOR_PROFILE } from "@/lib/creator-data";

/** RFC 4180: quote everything containing a comma, quote or newline. */
function cell(value: unknown) {
  const s = value == null ? "" : String(value);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function toCsv(headers: string[], rows: unknown[][]) {
  return [headers, ...rows].map((r) => r.map(cell).join(",")).join("\r\n");
}

const rupees = (paise: number) => (paise / 100).toFixed(2);

/**
 * Look up a client's GSTIN so place of supply and the tax split are computed
 * per invoice rather than assumed. Falls back to the agency's own state when
 * a client has no GSTIN recorded, which is the conservative choice.
 */
function recipientGstin(clientName: string): string | null {
  const client = CLIENTS.find((c) => c.name === clientName);
  const extras = client ? CLIENT_DETAIL_EXTRAS[client.slug] : undefined;
  return (extras as { gstin?: string } | undefined)?.gstin ?? null;
}

/**
 * GSTR-1 B2B section.
 *
 * Place of supply and the CGST/SGST vs IGST split are derived from each
 * client's own GSTIN, not hardcoded. An inter-state invoice filed as
 * CGST/SGST passes validation and shows up months later as a mismatch.
 */
export function gstr1B2b() {
  const headers = [
    "GSTIN/UIN of Recipient", "Receiver Name", "Invoice Number", "Invoice date",
    "Invoice Value", "Place Of Supply", "Reverse Charge", "Invoice Type",
    "Rate", "Taxable Value", "Cess Amount",
  ];

  const rows = ADMIN_INVOICES
    .filter((i) => i.status === "PAID" || i.status === "SENT" || i.status === "OVERDUE")
    .map((i) => {
      const gstin = recipientGstin(i.client);
      const { taxable, placeOfSupply } = splitGst(i.total, { recipientGstin: gstin });
      return [
        // The recipient's GSTIN, not ours — this column identifies the buyer.
        gstin ?? "URP",
        i.client,
        i.number,
        i.issuedAt.split("-").reverse().join("-"),
        rupees(i.total),
        placeOfSupply,
        "N",
        gstin ? "Regular B2B" : "B2CL",
        "18",
        rupees(taxable),
        "0",
      ];
    });

  return toCsv(headers, rows);
}

/** Full tax working, easier to reconcile than the GSTR format. */
export function gstSummary() {
  const headers = [
    "Invoice", "Client", "Issued", "Due", "Status", "Place of Supply",
    "Taxable Value", "CGST 9%", "SGST 9%", "IGST 18%", "Total",
  ];

  const rows = ADMIN_INVOICES.map((i) => {
    const split = splitGst(i.total, { recipientGstin: recipientGstin(i.client) });
    return [
      i.number, i.client, i.issuedAt, i.dueAt, i.status, split.placeOfSupply,
      rupees(split.taxable), rupees(split.cgst), rupees(split.sgst),
      rupees(split.igst), rupees(i.total),
    ];
  });

  const totals = ADMIN_INVOICES.reduce(
    (acc, i) => {
      const s = splitGst(i.total, { recipientGstin: recipientGstin(i.client) });
      return {
        taxable: acc.taxable + s.taxable,
        cgst: acc.cgst + s.cgst,
        sgst: acc.sgst + s.sgst,
        igst: acc.igst + s.igst,
        total: acc.total + i.total,
      };
    },
    { taxable: 0, cgst: 0, sgst: 0, igst: 0, total: 0 }
  );

  rows.push([
    "TOTAL", "", "", "", "", "",
    rupees(totals.taxable), rupees(totals.cgst), rupees(totals.sgst),
    rupees(totals.igst), rupees(totals.total),
  ]);

  return toCsv(headers, rows);
}

/** Section 194J / 194C deductions on creator payouts. */
export function tdsRegister() {
  const headers = [
    "Payout ID", "Period", "Deductee", "PAN", "Section",
    "Gross Amount", "TDS Rate", "TDS Deducted", "Net Paid", "Status", "Paid On",
  ];

  const rows = PAYOUTS.map((p) => [
    p.id, p.period, CREATOR_PROFILE.name, "ABCDE1234F", "194J",
    rupees(p.gross), "10%", rupees(p.tds), rupees(p.net), p.status, p.paidAt ?? "",
  ]);

  return toCsv(headers, rows);
}

export function clientLedger() {
  const headers = [
    "Client ID", "Client", "Industry", "City", "Plan",
    "Monthly Retainer", "Manager", "Health", "Leads This Month", "Onboarded",
  ];

  const rows = CLIENTS.map((c) => [
    c.id, c.name, c.industry, c.city, c.plan,
    rupees(c.retainer), c.manager, c.health, c.leadsThisMonth, c.onboardedAt,
  ]);

  return toCsv(headers, rows);
}

export function adSpendReport() {
  const headers = [
    "Campaign ID", "Campaign", "Client", "Platform", "Status",
    "Budget", "Spend", "Leads", "Cost Per Lead",
  ];

  const rows = CAMPAIGNS.map((c) => [
    c.id, c.name, c.client, c.platform, c.status,
    rupees(c.budget), rupees(c.spend), c.leads,
    c.leads ? rupees(Math.round(c.spend / c.leads)) : "0.00",
  ]);

  return toCsv(headers, rows);
}

export const EXPORTS = {
  "gstr1-b2b": { label: "GSTR-1 (B2B)", build: gstr1B2b },
  "gst-summary": { label: "GST summary", build: gstSummary },
  "tds-register": { label: "TDS register", build: tdsRegister },
  "client-ledger": { label: "Client ledger", build: clientLedger },
  "ad-spend": { label: "Ad spend report", build: adSpendReport },
} as const;

export type ExportKey = keyof typeof EXPORTS;

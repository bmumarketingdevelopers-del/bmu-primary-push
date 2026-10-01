import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { FullInvoice } from "@/lib/invoices";
import { COMPANY } from "@/lib/company-data";

const INK = rgb(18 / 255, 31 / 255, 47 / 255);
const GREEN = rgb(139 / 255, 183 / 255, 44 / 255);
const MUTED = rgb(92 / 255, 104 / 255, 116 / 255);
const LINE = rgb(0.93, 0.93, 0.93);

/** Paise to a plain rupee string. The PDF font has no ₹ glyph, so use "Rs." */
const money = (paise: number) =>
  `Rs. ${(paise / 100).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export async function renderInvoicePdf(invoice: FullInvoice) {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595, 842]); // A4 at 72dpi
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  const M = 48;
  const right = 595 - M;
  let y = 842;

  const text = (
    s: string,
    x: number,
    yy: number,
    opts: { size?: number; bold?: boolean; color?: typeof INK } = {}
  ) => {
    page.drawText(s, {
      x,
      y: yy,
      size: opts.size ?? 10,
      font: opts.bold ? bold : font,
      color: opts.color ?? INK,
    });
  };

  const textRight = (
    s: string,
    xr: number,
    yy: number,
    opts: { size?: number; bold?: boolean; color?: typeof INK } = {}
  ) => {
    const size = opts.size ?? 10;
    const f = opts.bold ? bold : font;
    text(s, xr - f.widthOfTextAtSize(s, size), yy, opts);
  };

  const rule = (yy: number) =>
    page.drawLine({ start: { x: M, y: yy }, end: { x: right, y: yy }, thickness: 1, color: LINE });

  /* --- header band --- */
  page.drawRectangle({ x: 0, y: 842 - 96, width: 595, height: 96, color: INK });
  text("BMU", M, 842 - 56, { size: 20, bold: true, color: rgb(1, 1, 1) });
  text(".", M + bold.widthOfTextAtSize("BMU", 20), 842 - 56, { size: 20, bold: true, color: GREEN });
  text("Marketing", M + bold.widthOfTextAtSize("BMU.", 20), 842 - 56, {
    size: 20, bold: true, color: rgb(1, 1, 1),
  });
  textRight("TAX INVOICE", right, 842 - 50, { size: 12, bold: true, color: rgb(1, 1, 1) });
  textRight(invoice.number, right, 842 - 68, { size: 10, color: rgb(0.7, 0.76, 0.82) });

  y = 842 - 140;

  /* --- from / to --- */
  text("FROM", M, y, { size: 8, bold: true, color: MUTED });
  text("BILLED TO", 320, y, { size: 8, bold: true, color: MUTED });
  y -= 16;

  text("BMU Marketing Pvt Ltd", M, y, { bold: true });
  text(invoice.client, 320, y, { bold: true });
  y -= 14;

  const wrap = (s: string, width: number) => {
    const words = s.split(" ");
    const lines: string[] = [];
    let line = "";
    for (const w of words) {
      const next = line ? `${line} ${w}` : w;
      if (font.widthOfTextAtSize(next, 9) > width) {
        lines.push(line);
        line = w;
      } else line = next;
    }
    if (line) lines.push(line);
    return lines;
  };

  let addrY = y;
  for (const l of wrap(COMPANY.address, 220)) {
    text(l, M, addrY, { size: 9, color: MUTED });
    addrY -= 12;
  }
  text(COMPANY.email, M, addrY, { size: 9, color: MUTED });
  addrY -= 12;
  text("GSTIN 29ABCDE1234F1Z5", M, addrY, { size: 9, color: MUTED });

  text(`Issued  ${invoice.issuedAt}`, 320, y, { size: 9, color: MUTED });
  text(`Due     ${invoice.dueAt}`, 320, y - 12, { size: 9, color: MUTED });
  text(`Status  ${invoice.status}`, 320, y - 24, { size: 9, color: MUTED });

  y = Math.min(addrY, y - 24) - 40;

  /* --- line items --- */
  rule(y);
  y -= 16;
  text("DESCRIPTION", M, y, { size: 8, bold: true, color: MUTED });
  textRight("QTY", 400, y, { size: 8, bold: true, color: MUTED });
  textRight("RATE", 480, y, { size: 8, bold: true, color: MUTED });
  textRight("AMOUNT", right, y, { size: 8, bold: true, color: MUTED });
  y -= 10;
  rule(y);
  y -= 22;

  for (const line of invoice.lines) {
    const amount = line.quantity * line.unitPrice;
    text(line.description, M, y);
    textRight(String(line.quantity), 400, y);
    textRight(money(line.unitPrice), 480, y);
    textRight(money(amount), right, y, { bold: true });
    y -= 14;
    rule(y);
    y -= 20;
  }

  /* --- totals --- */
  const tax = invoice.total - invoice.subtotal;
  y -= 6;
  textRight("Subtotal", 480, y, { color: MUTED });
  textRight(money(invoice.subtotal), right, y);
  y -= 18;
  textRight(`GST @ ${invoice.taxRate}%`, 480, y, { color: MUTED });
  textRight(money(tax), right, y);
  y -= 12;
  page.drawLine({ start: { x: 320, y }, end: { x: right, y }, thickness: 1, color: LINE });
  y -= 22;
  textRight("Total due", 480, y, { size: 12, bold: true });
  textRight(money(invoice.total), right, y, { size: 12, bold: true, color: GREEN });

  /* --- footer --- */
  page.drawRectangle({ x: 0, y: 0, width: 595, height: 72, color: rgb(0.973, 0.969, 0.957) });
  text("Payable by UPI, NEFT or card. Pay online from your client dashboard.", M, 44, {
    size: 9, color: MUTED,
  });
  text(`${COMPANY.email}  ·  ${COMPANY.phone}  ·  ${COMPANY.city}`, M, 28, { size: 9, color: MUTED });

  return pdf.save();
}

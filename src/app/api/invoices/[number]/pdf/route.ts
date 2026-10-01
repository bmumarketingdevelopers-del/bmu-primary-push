import { NextResponse } from "next/server";
import { requireUser } from "@/lib/session";
import { getInvoice } from "@/lib/invoices";
import { renderInvoicePdf } from "@/lib/invoice-pdf";

export async function GET(req: Request, { params }: { params: Promise<{ number: string }> }) {
  await requireUser();

  const { number } = await params;
  const invoice = await getInvoice(number);
  if (!invoice) return NextResponse.json({ error: "Invoice not found" }, { status: 404 });

  const bytes = await renderInvoicePdf(invoice);
  const inline = new URL(req.url).searchParams.get("view") === "1";

  return new NextResponse(new Uint8Array(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `${inline ? "inline" : "attachment"}; filename="${invoice.number}.pdf"`,
      "Cache-Control": "private, no-store",
    },
  });
}

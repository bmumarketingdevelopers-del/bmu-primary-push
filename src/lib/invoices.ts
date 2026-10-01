import { INVOICES } from "@/lib/dashboard-data";
import { ADMIN_INVOICES } from "@/lib/admin-data";

export type InvoiceLine = { description: string; quantity: number; unitPrice: number };

export type FullInvoice = {
  number: string;
  client: string;
  status: string;
  issuedAt: string;
  dueAt: string;
  subtotal: number;
  taxRate: number;
  total: number;
  lines: InvoiceLine[];
};

/** Demo line items, derived so the PDF has something real to render. */
function demoLines(description: string, total: number): InvoiceLine[] {
  const subtotal = Math.round(total / 1.18);
  return [{ description, quantity: 1, unitPrice: subtotal }];
}

export async function getInvoice(number: string): Promise<FullInvoice | null> {
  if (process.env.DATABASE_URL) {
    try {
      const { prisma } = await import("@/lib/prisma");
      const inv = await prisma.invoice.findUnique({
        where: { number },
        include: { items: true, client: true },
      });
      if (inv) {
        return {
          number: inv.number,
          client: inv.client.name,
          status: inv.status,
          issuedAt: inv.issuedAt.toISOString().slice(0, 10),
          dueAt: (inv.dueAt ?? inv.issuedAt).toISOString().slice(0, 10),
          subtotal: inv.subtotal,
          taxRate: inv.taxRate,
          total: inv.total,
          lines: inv.items.map((i) => ({
            description: i.description,
            quantity: i.quantity,
            unitPrice: i.unitPrice,
          })),
        };
      }
      return null;
    } catch (err) {
      console.warn("[invoices] database unreachable, using demo records:", err);
    }
  }

  const admin = ADMIN_INVOICES.find((i) => i.number === number);
  if (admin) {
    return {
      number: admin.number,
      client: admin.client,
      status: admin.status,
      issuedAt: admin.issuedAt,
      dueAt: admin.dueAt,
      subtotal: Math.round(admin.total / 1.18),
      taxRate: 18,
      total: admin.total,
      lines: demoLines("Marketing retainer", admin.total),
    };
  }

  const client = INVOICES.find((i) => i.number === number);
  if (client) {
    return {
      number: client.number,
      client: "Atria Living",
      status: client.status,
      issuedAt: client.issuedAt,
      dueAt: client.dueAt,
      subtotal: Math.round(client.total / 1.18),
      taxRate: 18,
      total: client.total,
      lines: demoLines(client.description, client.total),
    };
  }

  return null;
}

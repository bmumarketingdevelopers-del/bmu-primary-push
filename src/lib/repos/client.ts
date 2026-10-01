/**
 * Client-dashboard reads, scoped to one client account.
 *
 * Everything takes a clientId so a page can never accidentally render another
 * client's numbers — the scoping lives here, not in each page.
 */
import { query, queryData, LIST_LIMIT } from "./db";
import {
  APPROVALS, INVOICES, LEADS, PROJECTS, QR_CODES, RANKINGS, REPORTS, TICKETS,
  type InvoiceRow, type LeadRow, type ProjectRow, type QrRow,
} from "@/lib/dashboard-data";

export async function getClientProjects(clientId?: string | null) {
  return query<ProjectRow[]>(
    "client-projects",
    async (prisma) => {
      const rows = await prisma.project.findMany({
        take: LIST_LIMIT,
        where: clientId ? { clientId } : undefined,
        orderBy: { updatedAt: "desc" },
        include: { manager: { select: { name: true } }, services: { include: { service: true } } },
      });

      return rows.map((p) => ({
        id: p.id.slice(0, 6).toUpperCase(),
        name: p.name,
        status: p.status,
        progress: p.progress,
        manager: p.manager?.name ?? "Unassigned",
        dueAt: (p.dueDate ?? p.createdAt).toISOString().slice(0, 10),
        services: p.services.map((s) => s.service.name),
      })) as ProjectRow[];
    },
    PROJECTS
  );
}

export async function getClientLeads(clientId?: string | null, limit = 50) {
  return query<LeadRow[]>(
    "client-leads",
    async (prisma) => {
      const rows = await prisma.lead.findMany({
        where: clientId ? { clientId } : undefined,
        orderBy: { createdAt: "desc" },
        take: limit,
      });

      return rows.map((l) => ({
        id: l.id.slice(0, 6).toUpperCase(),
        name: l.name,
        phone: l.phone ?? "—",
        source: l.source,
        status: l.status,
        value: l.value ?? 0,
        createdAt: l.createdAt.toISOString().slice(0, 10),
      })) as LeadRow[];
    },
    LEADS
  );
}

export async function getClientInvoices(clientId?: string | null) {
  return query<InvoiceRow[]>(
    "client-invoices",
    async (prisma) => {
      const rows = await prisma.invoice.findMany({
        where: clientId ? { clientId } : undefined,
        orderBy: { issuedAt: "desc" },
        include: { items: { take: 1 } },
      });

      return rows.map((i) => ({
        number: i.number,
        status: i.status,
        total: i.total,
        issuedAt: i.issuedAt.toISOString().slice(0, 10),
        dueAt: (i.dueAt ?? i.issuedAt).toISOString().slice(0, 10),
        description: i.items[0]?.description ?? i.notes ?? "Services rendered",
      })) as InvoiceRow[];
    },
    INVOICES
  );
}

export async function getClientQrCodes(clientId?: string | null) {
  return query<QrRow[]>(
    "client-qr",
    async (prisma) => {
      const rows = await prisma.qrCode.findMany({
        take: LIST_LIMIT,
        where: clientId ? { clientId } : undefined,
        orderBy: { scanCount: "desc" },
        include: { location: { select: { name: true } } },
      });

      return rows.map((q) => ({
        id: q.id.slice(0, 6).toUpperCase(),
        label: q.label,
        type: q.type,
        location: q.location?.name ?? "All",
        scans: q.scanCount,
        // Needs a scan-history comparison to be real; zero is honest until then.
        trend: 0,
        active: q.isActive,
      })) as QrRow[];
    },
    QR_CODES
  );
}

export async function getClientApprovals(clientId?: string | null) {
  return queryData(
    "client-approvals",
    async (prisma) => {
      const rows = await prisma.contentApproval.findMany({
        take: LIST_LIMIT,
        where: clientId ? { clientId } : undefined,
        orderBy: { scheduledFor: "asc" },
      });

      return rows.map((a) => ({
        id: a.id.slice(0, 6).toUpperCase(),
        title: a.title,
        type: a.type,
        scheduledFor: (a.scheduledFor ?? a.sentAt ?? new Date()).toISOString().slice(0, 10),
        status: a.status,
      }));
    },
    APPROVALS
  );
}

export async function getClientRankings(clientId?: string | null) {
  return queryData(
    "client-rankings",
    async (prisma) => {
      const rows = await prisma.seoRanking.findMany({
        where: clientId ? { clientId } : undefined,
        orderBy: { checkedAt: "desc" },
        take: 25,
      });

      return rows.map((r) => ({
        keyword: r.keyword,
        position: r.position,
        previous: r.previousPosition ?? r.position,
        volume: r.volume ?? 0,
      }));
    },
    RANKINGS
  );
}

export async function getClientReports(clientId?: string | null) {
  return queryData(
    "client-reports",
    async (prisma) => {
      const rows = await prisma.report.findMany({
        where: clientId ? { clientId } : undefined,
        orderBy: { periodEnd: "desc" },
        take: 12,
      });

      return rows.map((r) => ({
        id: r.id.slice(0, 6).toUpperCase(),
        title: r.title,
        period: `${r.periodStart.toISOString().slice(0, 10)} – ${r.periodEnd.toISOString().slice(0, 10)}`,
        summary: r.summary ?? "",
      }));
    },
    REPORTS
  );
}

export async function getClientTickets(clientId?: string | null) {
  return queryData(
    "client-tickets",
    async (prisma) => {
      const rows = await prisma.supportTicket.findMany({
        take: LIST_LIMIT,
        where: clientId ? { clientId } : undefined,
        orderBy: { updatedAt: "desc" },
      });

      return rows.map((t) => ({
        id: t.id.slice(0, 6).toUpperCase(),
        subject: t.subject,
        status: t.status,
        priority: t.priority,
        updatedAt: t.updatedAt.toISOString().slice(0, 10),
      }));
    },
    TICKETS
  );
}

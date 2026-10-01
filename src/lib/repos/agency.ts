/**
 * Agency-side reads. Each returns the same shape the pages already render,
 * so converting a page is changing one import and adding `await`.
 */
import { query, queryData, LIST_LIMIT } from "./db";
import {
  ADMIN_INVOICES, ADMIN_LEADS, ADMIN_PROJECTS, AGENCY_KPIS, APPROVAL_QUEUE,
  CAMPAIGNS, CLIENTS, TEAM_MEMBERS,
  type AdminClient, type AdminInvoice, type AdminLead, type AdminProject, type AdminCampaign,
} from "@/lib/admin-data";
import { inr } from "@/lib/utils";

export async function getClients() {
  return query<AdminClient[]>(
    "clients",
    async (prisma) => {
      const rows = await prisma.client.findMany({
        take: LIST_LIMIT,
        orderBy: { createdAt: "desc" },
        include: { _count: { select: { leads: true } } },
      });

      return rows.map((c) => ({
        id: c.id.slice(0, 8).toUpperCase(),
        name: c.name,
        slug: c.slug,
        industry: c.industry,
        city: c.city ?? "—",
        plan: c.monthlyRetainer && c.monthlyRetainer >= 20_00_000 ? "Scale" : c.monthlyRetainer && c.monthlyRetainer >= 8_00_000 ? "Growth" : "Launch",
        retainer: c.monthlyRetainer ?? 0,
        manager: "Unassigned",
        // Health is derived, not stored — a stored flag goes stale silently.
        health: c._count.leads > 100 ? "GOOD" : c._count.leads > 40 ? "WATCH" : "AT_RISK",
        leadsThisMonth: c._count.leads,
        onboardedAt: c.onboardedAt.toISOString().slice(0, 10),
        isActive: c.isActive,
      })) as AdminClient[];
    },
    CLIENTS
  );
}

export async function getClientBySlug(slug: string) {
  const { data } = await getClients();
  return data.find((c) => c.slug === slug) ?? null;
}

export async function getProjects() {
  return query<AdminProject[]>(
    "projects",
    async (prisma) => {
      const rows = await prisma.project.findMany({
        take: LIST_LIMIT,
        orderBy: { updatedAt: "desc" },
        include: { client: { select: { name: true } }, manager: { select: { name: true } } },
      });

      return rows.map((p) => ({
        id: p.id.slice(0, 8).toUpperCase(),
        name: p.name,
        client: p.client.name,
        status: p.status,
        progress: p.progress,
        owner: p.manager?.name ?? "Unassigned",
        dueAt: (p.dueDate ?? p.createdAt).toISOString().slice(0, 10),
        budget: p.budget ?? 0,
      })) as AdminProject[];
    },
    ADMIN_PROJECTS
  );
}

export async function getLeads(limit = 50) {
  return query<AdminLead[]>(
    "leads",
    async (prisma) => {
      const rows = await prisma.lead.findMany({
        orderBy: { createdAt: "desc" },
        take: limit,
        include: { client: { select: { name: true } } },
      });

      return rows.map((l) => ({
        id: l.id.slice(0, 8).toUpperCase(),
        name: l.name,
        client: l.client.name,
        source: l.source,
        status: l.status,
        value: l.value ?? 0,
        owner: l.assignedTo ?? "Unassigned",
        createdAt: l.createdAt.toISOString().slice(0, 10),
      })) as AdminLead[];
    },
    ADMIN_LEADS
  );
}

export async function getCampaigns() {
  return query<AdminCampaign[]>(
    "campaigns",
    async (prisma) => {
      const rows = await prisma.campaign.findMany({
        take: LIST_LIMIT,
        orderBy: { updatedAt: "desc" },
        include: { client: { select: { name: true } }, _count: { select: { leads: true } } },
      });

      return rows.map((c) => ({
        id: c.id.slice(0, 8).toUpperCase(),
        name: c.name,
        client: c.client.name,
        platform: (c.platform.charAt(0).toUpperCase() + c.platform.slice(1)) as AdminCampaign["platform"],
        status: c.status,
        budget: c.budget ?? 0,
        spend: c.spend,
        leads: c._count.leads,
      })) as AdminCampaign[];
    },
    CAMPAIGNS
  );
}

export async function getInvoices() {
  return query<AdminInvoice[]>(
    "invoices",
    async (prisma) => {
      const rows = await prisma.invoice.findMany({
        take: LIST_LIMIT,
        orderBy: { issuedAt: "desc" },
        include: { client: { select: { name: true } } },
      });

      return rows.map((i) => ({
        number: i.number,
        client: i.client.name,
        status: i.status,
        total: i.total,
        issuedAt: i.issuedAt.toISOString().slice(0, 10),
        dueAt: (i.dueAt ?? i.issuedAt).toISOString().slice(0, 10),
      })) as AdminInvoice[];
    },
    ADMIN_INVOICES
  );
}

export async function getApprovals() {
  return queryData(
    "approvals",
    async (prisma) => {
      const rows = await prisma.contentApproval.findMany({
        take: LIST_LIMIT,
        orderBy: { scheduledFor: "asc" },
        include: { client: { select: { name: true } }, reviewedBy: { select: { name: true } } },
      });

      return rows.map((a) => ({
        id: a.id.slice(0, 6).toUpperCase(),
        title: a.title,
        client: a.client.name,
        type: a.type,
        owner: a.reviewedBy?.name ?? "Unassigned",
        scheduledFor: (a.scheduledFor ?? a.sentAt ?? new Date()).toISOString().slice(0, 10),
        status: a.status,
      }));
    },
    APPROVAL_QUEUE
  );
}

export async function getTeamMembers() {
  return queryData(
    "team",
    async (prisma) => {
      const rows = await prisma.user.findMany({
        take: LIST_LIMIT,
        where: { role: { in: ["OWNER", "ADMIN", "MANAGER", "STAFF"] } },
        orderBy: { createdAt: "asc" },
        include: { _count: { select: { managedProjects: true } } },
      });

      return rows.map((u) => ({
        id: u.id.slice(0, 6).toUpperCase(),
        name: u.name,
        email: u.email,
        role: u.role,
        clients: u._count.managedProjects,
        status: u.emailVerified ? "ACTIVE" : "INVITED",
      }));
    },
    TEAM_MEMBERS
  );
}

/**
 * KPI cards. Computed from live rows when there's a database, because a
 * stored summary is the first thing to go stale.
 */
export async function getAgencyKpis() {
  return queryData(
    "kpis",
    async (prisma) => {
      const [clients, retainers, overdue, spend] = await Promise.all([
        prisma.client.count({ where: { isActive: true } }),
        prisma.client.aggregate({ where: { isActive: true }, _sum: { monthlyRetainer: true } }),
        prisma.invoice.aggregate({ where: { status: "OVERDUE" }, _sum: { total: true }, _count: true }),
        prisma.campaign.aggregate({ where: { status: "ACTIVE" }, _sum: { spend: true } }),
      ]);

      return [
        { label: "Monthly recurring revenue", value: inr(retainers._sum.monthlyRetainer ?? 0), delta: 0, sub: `across ${clients} retainers`, icon: "IndianRupee" },
        { label: "Active clients", value: String(clients), delta: 0, sub: "live accounts", icon: "Building2" },
        { label: "Ad spend managed", value: inr(spend._sum.spend ?? 0), delta: 0, sub: "active campaigns", icon: "Megaphone" },
        { label: "Overdue receivables", value: inr(overdue._sum.total ?? 0), delta: 0, sub: `${overdue._count} invoices past due`, icon: "AlertTriangle", inverse: true },
      ];
    },
    AGENCY_KPIS
  );
}

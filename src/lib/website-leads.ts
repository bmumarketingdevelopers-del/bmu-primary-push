import "server-only";
import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { LEAD_STATUSES, type LeadForm, type LeadStatus, type WebsiteLead } from "@/lib/website-lead-types";

export * from "@/lib/website-lead-types";

/**
 * Leads captured by the public website forms, kept apart from the agency CRM so the admin
 * portal can show exactly what each form collected, and track each one's review status.
 *
 * Storage: the WebsiteLead table when DATABASE_URL is set; otherwise a JSON file in .data/
 * (fine for local development — on serverless hosting the file system isn't persistent, so
 * production needs the database).
 */

export type NewWebsiteLead = Omit<WebsiteLead, "id" | "createdAt" | "status" | "statusUpdatedAt">;

export type LeadStorage = "database" | "file";

const FILE = path.join(process.cwd(), ".data", "website-leads.json");

export const leadStorage = (): LeadStorage => (process.env.DATABASE_URL ? "database" : "file");

export const isLeadStatus = (v: unknown): v is LeadStatus => LEAD_STATUSES.includes(v as LeadStatus);

// Older file entries predate review statuses
const normalise = (l: Partial<WebsiteLead> & Pick<WebsiteLead, "id">): WebsiteLead =>
  ({ ...l, status: isLeadStatus(l.status) ? l.status : "new", statusUpdatedAt: l.statusUpdatedAt ?? null }) as WebsiteLead;

async function readFileLeads(): Promise<WebsiteLead[]> {
  try {
    return (JSON.parse(await readFile(FILE, "utf8")) as WebsiteLead[]).map(normalise);
  } catch {
    return [];
  }
}

// File writes are serialised so two changes landing together can't overwrite each other
let queue: Promise<unknown> = Promise.resolve();

function updateFile<T>(change: (leads: WebsiteLead[]) => T): Promise<T> {
  const run = queue.then(async () => {
    const leads = await readFileLeads();
    const result = change(leads);
    await mkdir(path.dirname(FILE), { recursive: true });
    const tmp = `${FILE}.tmp`;
    await writeFile(tmp, JSON.stringify(leads, null, 2));
    await rename(tmp, FILE);
    return result;
  });
  queue = run.catch(() => {});
  return run;
}

export async function saveWebsiteLead(input: NewWebsiteLead): Promise<void> {
  if (leadStorage() === "database") {
    const { prisma } = await import("@/lib/prisma");
    await prisma.websiteLead.create({ data: input });
    return;
  }

  await updateFile((leads) => {
    leads.push({
      ...input,
      id: randomUUID(),
      status: "new",
      statusUpdatedAt: null,
      createdAt: new Date().toISOString(),
    });
  });
}

/** Newest first. */
export async function listWebsiteLeads(): Promise<WebsiteLead[]> {
  if (leadStorage() === "database") {
    const { prisma } = await import("@/lib/prisma");
    const rows = await prisma.websiteLead.findMany({ orderBy: { createdAt: "desc" } });
    return rows.map((r) =>
      normalise({
        ...r,
        form: r.form as LeadForm,
        status: r.status as LeadStatus,
        statusUpdatedAt: r.statusUpdatedAt?.toISOString() ?? null,
        createdAt: r.createdAt.toISOString(),
      }),
    );
  }

  const leads = await readFileLeads();
  return leads.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/**
 * Sets review statuses. Unknown IDs and unchanged statuses are skipped.
 * Returns how many leads actually changed.
 */
export async function setLeadStatuses(updates: { id: string; status: LeadStatus }[]): Promise<number> {
  if (!updates.length) return 0;
  const now = new Date();

  if (leadStorage() === "database") {
    const { prisma } = await import("@/lib/prisma");
    const results = await prisma.$transaction(
      updates.map((u) =>
        prisma.websiteLead.updateMany({
          where: { id: u.id, NOT: { status: u.status } },
          data: { status: u.status, statusUpdatedAt: now },
        }),
      ),
    );
    return results.reduce((n, r) => n + r.count, 0);
  }

  return updateFile((leads) => {
    const byId = new Map(leads.map((l) => [l.id, l]));
    let changed = 0;
    for (const u of updates) {
      const lead = byId.get(u.id);
      if (lead && lead.status !== u.status) {
        lead.status = u.status;
        lead.statusUpdatedAt = now.toISOString();
        changed++;
      }
    }
    return changed;
  });
}

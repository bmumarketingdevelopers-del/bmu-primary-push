import { NextResponse } from "next/server";
import { requireUser } from "@/lib/session";
import { toCsv } from "@/lib/exports";
import { getLeads } from "@/lib/repos/agency";
import { getClientLeads } from "@/lib/repos/client";
import { BUSINESS_LEADS } from "@/lib/business-data";
import { isStaff } from "@/lib/roles";
import { inr } from "@/lib/utils";

export const dynamic = "force-dynamic";

/**
 * Lead export, scoped by role.
 *
 * Scope is derived from the session, never taken from the query string — a
 * client passing ?scope=agency must not be able to download everyone's leads.
 */
export async function GET(req: Request) {
  const user = await requireUser();
  const url = new URL(req.url);

  const from = url.searchParams.get("from") || "";
  const to = url.searchParams.get("to") || "";
  const status = url.searchParams.get("status") || "";
  const source = url.searchParams.get("source") || "";

  type Row = {
    id: string; name: string; phone?: string; client?: string;
    source: string; status: string; value: number; createdAt: string; owner?: string;
  };

  let rows: Row[];
  let scopeLabel: string;

  if (isStaff(user.role)) {
    const { data } = await getLeads(500);
    rows = data;
    scopeLabel = "all-clients";
  } else if (user.role === "BUSINESS") {
    rows = BUSINESS_LEADS.map((l) => ({
      id: l.id, name: l.name, phone: l.phone, source: l.source,
      status: l.status, value: 0, createdAt: l.createdAt,
    }));
    scopeLabel = user.clientId ?? "business";
  } else {
    const { data } = await getClientLeads(user.clientId, 500);
    rows = data;
    scopeLabel = user.clientId ?? "client";
  }

  // Inclusive on both ends — "1st to 31st" should contain the 31st.
  const filtered = rows.filter((r) => {
    if (from && r.createdAt < from) return false;
    if (to && r.createdAt > to) return false;
    if (status && r.status !== status) return false;
    if (source && r.source !== source) return false;
    return true;
  });

  const headers = ["Lead ID", "Name", "Phone", "Client", "Source", "Status", "Deal value", "Owner", "Received"];
  const csv = toCsv(
    headers,
    filtered.map((r) => [
      r.id, r.name, r.phone ?? "", r.client ?? scopeLabel,
      r.source, r.status, r.value ? inr(r.value) : "", r.owner ?? "", r.createdAt,
    ])
  );

  const range = from || to ? `-${from || "start"}_${to || "today"}` : "";

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="leads-${scopeLabel}${range}.csv"`,
      "Cache-Control": "private, no-store",
    },
  });
}

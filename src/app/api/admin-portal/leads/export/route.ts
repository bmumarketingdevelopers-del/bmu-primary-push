import { NextResponse } from "next/server";
import { currentAdmin } from "@/lib/admin-guard";
import { listWebsiteLeads } from "@/lib/website-leads";
import { buildLeadsWorkbook } from "@/lib/website-leads-excel";

export const dynamic = "force-dynamic";

/** Downloads every website lead as an organised .xlsx (Summary + one sheet per form). */
export async function GET() {
  if (!(await currentAdmin())) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const file = await buildLeadsWorkbook(await listWebsiteLeads());
  const date = new Date().toISOString().slice(0, 10);

  return new NextResponse(new Uint8Array(file), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="bmu-website-leads-${date}.xlsx"`,
      "Cache-Control": "no-store",
    },
  });
}

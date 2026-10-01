import { NextResponse } from "next/server";
import { requireStaff } from "@/lib/session";
import { EXPORTS, type ExportKey } from "@/lib/exports";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ type: string }> }) {
  // Financial data — staff only, never a client role.
  await requireStaff();

  const { type } = await params;
  const config = EXPORTS[type as ExportKey];
  if (!config) return NextResponse.json({ error: "Unknown export" }, { status: 404 });

  const csv = config.build();
  const stamp = new Date().toISOString().slice(0, 10);

  return new NextResponse(csv, {
    headers: {
      // BOM so Excel opens rupee values and names as UTF-8.
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="bmu-${type}-${stamp}.csv"`,
      "Cache-Control": "private, no-store",
    },
  });
}

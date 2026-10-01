import { NextResponse } from "next/server";
import { requireUser } from "@/lib/session";
import { listNotifications, markRead } from "@/lib/notifications";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await requireUser();
  const items = await listNotifications(user.id, user.role);
  return NextResponse.json({
    items,
    unread: items.filter((i) => !i.isRead).length,
  });
}

export async function POST(req: Request) {
  const user = await requireUser();
  const body = await req.json().catch(() => ({}));
  await markRead(user.id, Array.isArray(body?.ids) ? body.ids : undefined);
  return NextResponse.json({ ok: true });
}

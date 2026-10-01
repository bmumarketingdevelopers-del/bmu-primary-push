export type AppNotification = {
  id: string;
  title: string;
  body?: string | null;
  href?: string | null;
  isRead: boolean;
  createdAt: string;
};

/** Demo feed, keyed by role, so every surface has something to show. */
const DEMO: Record<string, AppNotification[]> = {
  CLIENT: [
    { id: "n-9", title: "2 creatives are waiting for your approval", href: "/dashboard/approvals", isRead: false, createdAt: iso(-20) },
    { id: "n-8", title: "Invoice BMU-2026-0184 was sent", body: "₹1,00,300 due 15 Aug", href: "/dashboard/invoices", isRead: false, createdAt: iso(-120) },
    { id: "n-7", title: "July report is ready to download", href: "/dashboard/reports", isRead: true, createdAt: iso(-1440) },
  ],
  STAFF: [
    { id: "a-12", title: "New enquiry from Priya Raghavan", body: "Performance marketing · Bengaluru", href: "/admin/leads", isRead: false, createdAt: iso(-8) },
    { id: "a-11", title: "Kesar Motors invoice is now overdue", body: "₹1,00,300, 22 days past due", href: "/admin/invoices", isRead: false, createdAt: iso(-90) },
    { id: "a-10", title: "3 creatives unapproved within 48h of publish", href: "/admin/approvals", isRead: false, createdAt: iso(-240) },
    { id: "a-9", title: "Meraki Studio health dropped to Watch", href: "/admin/clients", isRead: true, createdAt: iso(-1500) },
  ],
  CREATOR: [
    { id: "c-5", title: "New brief from Saffron & Co", body: "Weekend brunch launch · ₹3,500", href: "/creators/briefs", isRead: false, createdAt: iso(-45) },
    { id: "c-4", title: "Blue Harbour approved your reel", href: "/creators/bookings", isRead: false, createdAt: iso(-300) },
    { id: "c-3", title: "July payout of ₹3,960 was released", href: "/creators/payouts", isRead: true, createdAt: iso(-4320) },
  ],
};

function iso(minutesAgo: number) {
  return new Date(Date.now() + minutesAgo * 60_000).toISOString();
}

function demoFor(role: string) {
  if (["OWNER", "ADMIN", "MANAGER", "STAFF"].includes(role)) return DEMO.STAFF;
  if (role === "CREATOR") return DEMO.CREATOR;
  return DEMO.CLIENT;
}

export async function listNotifications(userId: string, role: string): Promise<AppNotification[]> {
  if (process.env.DATABASE_URL) {
    try {
      const { prisma } = await import("@/lib/prisma");
      const rows = await prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 20,
      });
      return rows.map((n) => ({
        id: n.id,
        title: n.title,
        body: n.body,
        href: n.href,
        isRead: n.isRead,
        createdAt: n.createdAt.toISOString(),
      }));
    } catch (err) {
      console.warn("[notifications] database unreachable, using demo feed:", err);
    }
  }
  return demoFor(role);
}

export async function markRead(userId: string, ids?: string[]) {
  if (!process.env.DATABASE_URL) return;
  try {
    const { prisma } = await import("@/lib/prisma");
    await prisma.notification.updateMany({
      where: { userId, ...(ids?.length ? { id: { in: ids } } : { isRead: false }) },
      data: { isRead: true },
    });
  } catch (err) {
    console.error("[notifications] mark read failed:", err);
  }
}

/** Called from anywhere on the server when something happens worth telling someone. */
export async function notify(userId: string, title: string, opts: { body?: string; href?: string } = {}) {
  if (!process.env.DATABASE_URL) {
    console.info(`[notifications] would notify ${userId}: ${title}`);
    return;
  }
  try {
    const { prisma } = await import("@/lib/prisma");
    await prisma.notification.create({
      data: { userId, title, body: opts.body, href: opts.href },
    });
  } catch (err) {
    console.error("[notifications] create failed:", err);
  }
}

export function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return days === 1 ? "yesterday" : `${days}d ago`;
}

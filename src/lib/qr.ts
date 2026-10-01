import { headers } from "next/headers";

export type ResolvedQr = {
  id: string;
  slug: string;
  label: string;
  target: string;
  isActive: boolean;
  password: string | null;
};

/**
 * Demo codes so /q/... works before a database exists.
 * Slugs match ADMIN_QR in admin-data.ts, so the admin table links resolve.
 */
export const DEMO_CODES: ResolvedQr[] = [
  { id: "Q-4411", slug: "atria-brochure", label: "Sales lounge — brochure", target: "https://example.com/brochure.pdf", isActive: true, password: null },
  { id: "Q-4408", slug: "atria-hoarding", label: "Site hoarding — ORR", target: "https://example.com/atria-living", isActive: true, password: null },
  { id: "Q-4405", slug: "saffron-menu", label: "Table tents (all outlets)", target: "https://example.com/menu", isActive: true, password: null },
  { id: "Q-4402", slug: "saffron-review", label: "Review request card", target: "https://g.page/r/example/review", isActive: true, password: null },
  { id: "Q-4399", slug: "verde-feedback", label: "Reception feedback", target: "https://example.com/feedback", isActive: true, password: null },
  { id: "Q-4396", slug: "northview-pricing", label: "Price list (protected)", target: "https://example.com/pricing", isActive: true, password: "tower2026" },
  { id: "Q-4390", slug: "harbour-payment", label: "Booking payment link", target: "https://example.com/pay", isActive: true, password: null },
  { id: "Q-4381", slug: "kesar-diwali", label: "Diwali offer", target: "https://example.com/diwali", isActive: false, password: null },

  // BMU QR tenant codes — these are what the business dashboard links to.
  { id: "SQ-01", slug: "abc-salon", label: "Reception standee", target: "/b/abc-salon", isActive: true, password: null },
  { id: "SQ-02", slug: "abc-review", label: "Billing counter — review card", target: "/r/abc-salon", isActive: true, password: null },
  { id: "SQ-03", slug: "abc-wa", label: "Window sticker — WhatsApp", target: "https://wa.me/919845000111", isActive: true, password: null },
  { id: "SQ-04", slug: "abc-pay", label: "UPI payment", target: "upi://pay?pa=abcsalon@upi", isActive: true, password: null },
  { id: "SQ-05", slug: "abc-diwali", label: "Diwali offer (ended)", target: "/b/abc-salon", isActive: false, password: null },
  { id: "SQ-06", slug: "abc-book", label: "Booking card", target: "/b/abc-salon/book", isActive: true, password: null },

  // Table tents — each carries its own table parameter into the menu.
  { id: "TB-01", slug: "saffron-t1", label: "Table 1", target: "/b/saffron-co/menu?t=saffron-t1", isActive: true, password: null },
  { id: "TB-02", slug: "saffron-t2", label: "Table 2", target: "/b/saffron-co/menu?t=saffron-t2", isActive: true, password: null },
  { id: "TB-07", slug: "saffron-t7", label: "Table 7", target: "/b/saffron-co/menu?t=saffron-t7", isActive: true, password: null },
  { id: "TB-12", slug: "saffron-t12", label: "Terrace 2", target: "/b/saffron-co/menu?t=saffron-t12", isActive: true, password: null },
];

export async function resolveQr(slug: string): Promise<ResolvedQr | null> {
  if (process.env.DATABASE_URL) {
    try {
      const { prisma } = await import("@/lib/prisma");
      const code = await prisma.qrCode.findUnique({ where: { slug } });
      if (code) {
        return {
          id: code.id,
          slug: code.slug,
          label: code.label,
          target: code.target,
          isActive: code.isActive,
          password: code.password,
        };
      }
      return null;
    } catch (err) {
      console.warn("[qr] database unreachable, using demo codes:", err);
    }
  }
  return DEMO_CODES.find((c) => c.slug === slug) ?? null;
}

/** Recording a scan must never block or break the redirect. */
export async function recordScan(code: ResolvedQr) {
  const h = await headers();
  const ua = h.get("user-agent") ?? "";
  const device = /mobile|android|iphone/i.test(ua)
    ? "mobile"
    : /tablet|ipad/i.test(ua)
      ? "tablet"
      : "desktop";

  const scan = {
    device,
    referrer: h.get("referer"),
    city: h.get("x-vercel-ip-city"),
    country: h.get("x-vercel-ip-country"),
  };

  if (!process.env.DATABASE_URL) {
    console.info(`[qr] scan ${code.slug} (${device}) — not persisted, no DATABASE_URL`);
    return;
  }

  try {
    const { prisma } = await import("@/lib/prisma");
    await prisma.$transaction([
      prisma.scanEvent.create({ data: { qrCodeId: code.id, ...scan } }),
      prisma.qrCode.update({
        where: { id: code.id },
        data: { scanCount: { increment: 1 }, lastScanAt: new Date() },
      }),
    ]);
  } catch (err) {
    console.error("[qr] scan not recorded:", err);
  }
}

/** Turns a stored target into something redirect() can use. */
export function absoluteTarget(target: string) {
  if (/^[a-z][a-z0-9+.-]*:/i.test(target)) return target; // http:, upi:, mailto:, tel:
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return target.startsWith("/") ? `${base}${target}` : `${base}/${target}`;
}

/** Public URL a printed code points at. */
export function qrUrl(slug: string) {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return `${base}/q/${slug}`;
}

export const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 48);

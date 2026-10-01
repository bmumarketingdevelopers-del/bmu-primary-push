import { after, NextResponse } from "next/server";
import { z } from "zod";
import { sendEmail } from "@/lib/email";
import { appendToSheet, formContextSchema, pageColumns } from "@/lib/google-sheets";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { COMPANY } from "@/lib/company-data";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  handle: z.string().min(2),
  platform: z.string().min(2),
  city: z.string().optional(),
  categories: z.array(z.string()).min(1, "Pick at least one category"),
  followers: z.number().int().nonnegative(),
  rateCard: z.number().int().nonnegative().optional(),
  portfolio: z.string().optional(),
  pitch: z.string().optional(),
}).merge(formContextSchema);

export async function POST(req: Request) {
  const limit = rateLimit(`creators:${clientIp(req)}`, { limit: 3, windowMs: 60_000 });
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many submissions. Try again shortly." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    );
  }

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { page, referrer, ...app } = parsed.data;

  const row = {
    Name: app.name,
    Email: app.email,
    Phone: app.phone,
    Handle: app.handle,
    Platform: app.platform,
    City: app.city,
    Categories: app.categories.join(", "),
    Followers: app.followers,
    "Rate per deliverable (₹)": app.rateCard != null ? app.rateCard / 100 : undefined,
    Portfolio: app.portfolio,
    Pitch: app.pitch,
    ...pageColumns({ page, referrer }, req),
  };
  after(() => appendToSheet("Creator applications", row));

  if (process.env.DATABASE_URL) {
    try {
      const { prisma } = await import("@/lib/prisma");
      await prisma.creatorApplication.create({
        data: {
          ...app,
          phone: app.phone || null,
          city: app.city || null,
          rateCard: app.rateCard ?? null,
          portfolio: app.portfolio || null,
          pitch: app.pitch || null,
        },
      });
    } catch (err) {
      console.error("[creator-applications] write failed:", err);
    }
  } else {
    console.info("[creator-applications] no DATABASE_URL — logging only:", app);
  }

  await sendEmail({
    to: process.env.EMAIL_INTERNAL ?? COMPANY.email,
    replyTo: app.email,
    subject: `Creator application — ${app.handle}`,
    html: `<p><strong>${app.name}</strong> · ${app.handle} (${app.platform})</p>
           <p>${app.followers.toLocaleString("en-IN")} followers${app.city ? ` · ${app.city}` : ""}</p>
           <p>Categories: ${app.categories.join(", ")}</p>
           ${app.rateCard ? `<p>Rate: ₹${(app.rateCard / 100).toLocaleString("en-IN")} per deliverable</p>` : ""}
           ${app.portfolio ? `<p>Portfolio: ${app.portfolio}</p>` : ""}
           ${app.pitch ? `<p style="white-space:pre-line">${app.pitch}</p>` : ""}`,
  });

  return NextResponse.json({ ok: true });
}

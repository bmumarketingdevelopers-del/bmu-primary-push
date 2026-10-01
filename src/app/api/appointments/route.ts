import { after, NextResponse } from "next/server";
import { z } from "zod";
import { enquiryConfirmation, newEnquiryToAgency, sendEmail } from "@/lib/email";
import { appendToSheet, formContextSchema, pageColumns } from "@/lib/google-sheets";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { saveWebsiteLead } from "@/lib/website-leads";

const schema = z.object({
  name: z.string().min(2),
  phone: z.string().min(6),
  email: z.string().email().optional().or(z.literal("")),
  need: z.string().optional(),
  company: z.string().max(200).optional(),
  budget: z.string().max(100).optional(),
  message: z.string().optional(),
  // Which website form sent it: the landing-page quick form or the /contact page form
  form: z.enum(["quick", "contact"]).optional(),
}).merge(formContextSchema);

/**
 * Consultation requests from the site.
 *
 * Runs without a database and without an email provider — each is attempted,
 * each failure is logged, and the visitor still gets a success response.
 * Losing a notification is bad; showing an error to a warm lead is worse.
 */
export async function POST(req: Request) {
  // Public and unauthenticated, so it needs a ceiling.
  const limit = rateLimit(`appointments:${clientIp(req)}`, { limit: 5, windowMs: 60_000 });
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many requests. Try again shortly, or WhatsApp us." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    );
  }

  const parsed = schema.safeParse(await req.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json({ error: "Name and phone are required." }, { status: 400 });
  }

  const { company, budget, page, referrer, form, ...fields } = parsed.data;
  let persisted = false;

  // Admin portal copy, with every field as the visitor entered it. Older clients that don't send
  // `form` are placed by page.
  try {
    await saveWebsiteLead({
      form: form ?? (page === "/contact" ? "contact" : "quick"),
      name: fields.name,
      phone: fields.phone,
      email: fields.email || null,
      need: fields.need || null,
      company: company || null,
      budget: budget || null,
      message: fields.message || null,
      page: page ?? null,
      referrer: referrer ?? null,
    });
  } catch (err) {
    console.error("[appointments] website lead store failed:", err);
  }

  const row = {
    Name: fields.name,
    Phone: fields.phone,
    Email: fields.email,
    Company: company,
    Budget: budget,
    Need: fields.need,
    Message: fields.message,
    ...pageColumns({ page, referrer }, req),
  };
  after(() => appendToSheet("Enquiries", row));

  // The database and email have a single notes field, so company and budget fold into it there.
  const lead = {
    ...fields,
    message: [company && `Company: ${company}`, budget && `Budget: ${budget}`, fields.message]
      .filter(Boolean)
      .join("\n"),
  };

  if (process.env.DATABASE_URL) {
    try {
      const { prisma } = await import("@/lib/prisma");
      await prisma.appointment.create({
        data: {
          name: lead.name,
          phone: lead.phone,
          email: lead.email || null,
          need: lead.need || null,
          message: lead.message || null,
        },
      });
      persisted = true;
    } catch (err) {
      console.error("[appointments] write failed:", err);
    }
  } else {
    console.info("[appointments] no DATABASE_URL — logging only:", lead);
  }

  const notify = newEnquiryToAgency(lead);
  await sendEmail(notify);

  if (lead.email) {
    const confirm = enquiryConfirmation({ name: lead.name, email: lead.email });
    await sendEmail(confirm);
  }

  return NextResponse.json({ ok: true, persisted });
}

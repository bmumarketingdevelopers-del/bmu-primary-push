import { COMPANY } from "@/lib/company-data";

export const emailConfigured = () => Boolean(process.env.RESEND_API_KEY);

const FROM = process.env.EMAIL_FROM ?? "BMU.Marketing <hello@bmu.marketing>";
const INTERNAL = process.env.EMAIL_INTERNAL ?? COMPANY.email;

type SendArgs = {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
};

/**
 * Sending must never break the request that triggered it. A failed
 * notification is a logging problem, not a reason to fail a form submit.
 */
export async function sendEmail({ to, subject, html, replyTo }: SendArgs) {
  if (!emailConfigured()) {
    console.info(`[email] would send "${subject}" to ${to} — no RESEND_API_KEY set`);
    return { sent: false, reason: "not-configured" as const };
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({ from: FROM, to, subject, html, replyTo });
    return { sent: true as const };
  } catch (err) {
    console.error("[email] send failed:", err);
    return { sent: false, reason: "error" as const };
  }
}

/* ------------------------------------------------------------------ */
/* Templates                                                           */
/* ------------------------------------------------------------------ */

const shell = (heading: string, body: string, cta?: { href: string; label: string }) => `
<div style="background:#F8F7F4;padding:32px 16px;font-family:-apple-system,'Segoe UI',Roboto,sans-serif">
  <div style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #ECECEC;border-radius:20px;overflow:hidden">
    <div style="background:#121F2F;padding:24px 32px">
      <span style="color:#fff;font-size:17px;font-weight:700;letter-spacing:-.3px">
        BMU<span style="color:#8BB72C">.</span>Marketing
      </span>
    </div>
    <div style="padding:32px">
      <h1 style="margin:0 0 16px;font-size:20px;line-height:1.3;color:#121F2F">${heading}</h1>
      <div style="font-size:15px;line-height:1.7;color:#5C6874">${body}</div>
      ${
        cta
          ? `<a href="${cta.href}" style="display:inline-block;margin-top:24px;background:#8BB72C;color:#fff;
             text-decoration:none;padding:13px 24px;border-radius:12px;font-weight:600;font-size:14px">${cta.label}</a>`
          : ""
      }
    </div>
    <div style="border-top:1px solid #ECECEC;padding:20px 32px;font-size:12px;color:#8B959F">
      ${COMPANY.address}<br>${COMPANY.email} · ${COMPANY.phone}
    </div>
  </div>
</div>`;

const appUrl = () => process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export function newEnquiryToAgency(lead: {
  name: string; phone: string; email?: string | null; need?: string | null; message?: string | null;
}) {
  return {
    to: INTERNAL,
    replyTo: lead.email ?? undefined,
    subject: `New enquiry — ${lead.name}${lead.need ? ` (${lead.need})` : ""}`,
    html: shell(
      "New consultation request",
      `<p><strong>${lead.name}</strong><br>
       ${lead.phone}${lead.email ? `<br>${lead.email}` : ""}</p>
       ${lead.need ? `<p><strong>Needs:</strong> ${lead.need}</p>` : ""}
       ${lead.message ? `<p style="white-space:pre-line"><strong>Notes:</strong><br>${lead.message}</p>` : ""}
       <p style="color:#8B959F;font-size:13px">Reply within one working day — that's the promise on the site.</p>`,
      { href: `${appUrl()}/admin/leads`, label: "Open in admin" }
    ),
  };
}

export function enquiryConfirmation(lead: { name: string; email: string }) {
  return {
    to: lead.email,
    subject: "We've got your request — BMU.Marketing",
    html: shell(
      `Thanks, ${lead.name.split(" ")[0]}`,
      `<p>Your request reached us and a strategist will reply within one working day to book a
       30-minute call.</p>
       <p>Before that call we'll look at your website, your Google Business profile and any ad
       accounts you're happy to share, so the conversation starts somewhere useful.</p>
       <p>If it's urgent, WhatsApp is faster: ${COMPANY.whatsapp}</p>`
    ),
  };
}

export function invoiceIssued(invoice: { number: string; client: string; total: string; dueAt: string }) {
  return {
    subject: `Invoice ${invoice.number} — ${invoice.total}`,
    html: shell(
      `Invoice ${invoice.number}`,
      `<p>Hello ${invoice.client},</p>
       <p>Your invoice for <strong>${invoice.total}</strong> is ready, due ${invoice.dueAt}.</p>
       <p>You can pay by card or UPI from the dashboard, or download the PDF for your records.</p>`,
      { href: `${appUrl()}/dashboard/invoices`, label: "View and pay" }
    ),
  };
}

export function paymentReceipt(invoice: { number: string; total: string }) {
  return {
    subject: `Payment received — ${invoice.number}`,
    html: shell(
      "Payment received",
      `<p>We've received <strong>${invoice.total}</strong> against invoice ${invoice.number}. Thank you.</p>
       <p>A GST receipt is attached to the invoice record in your dashboard.</p>`,
      { href: `${appUrl()}/dashboard/invoices`, label: "View invoice" }
    ),
  };
}

export function approvalReminder(item: { title: string; client: string; scheduledFor: string }) {
  return {
    subject: `Approval needed — ${item.title}`,
    html: shell(
      "Something's waiting on you",
      `<p>Hello ${item.client},</p>
       <p><strong>${item.title}</strong> is scheduled to publish on ${item.scheduledFor} and still
       needs your sign-off.</p>
       <p>If we don't hear back it stays unpublished — nothing goes live without approval.</p>`,
      { href: `${appUrl()}/dashboard/approvals`, label: "Review it" }
    ),
  };
}

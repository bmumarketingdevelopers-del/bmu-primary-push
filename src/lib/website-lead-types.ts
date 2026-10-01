/** Shared by the server store, the admin portal UI and the Excel import/export. */

/** "quick" = the short form on the landing page; "contact" = the full form on /contact. */
export type LeadForm = "quick" | "contact";

export const LEAD_FORM_LABELS: Record<LeadForm, string> = {
  quick: "Landing page form",
  contact: "Contact page form",
};

export const LEAD_STATUSES = ["new", "follow_up", "converted", "rejected"] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new: "New",
  follow_up: "Follow up",
  converted: "Converted",
  rejected: "Rejected",
};

export type WebsiteLead = {
  id: string;
  form: LeadForm;
  name: string;
  phone: string;
  email: string | null;
  need: string | null;
  company: string | null;
  budget: string | null;
  message: string | null;
  page: string | null;
  referrer: string | null;
  status: LeadStatus;
  statusUpdatedAt: string | null; // ISO timestamp
  createdAt: string; // ISO timestamp
};

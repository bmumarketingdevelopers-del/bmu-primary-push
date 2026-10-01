/**
 * Who can reach what.
 *
 * Roles carry a default permission set; individual people can be granted or
 * denied specific modules on top. Edge-safe — no Prisma, no bcrypt — so
 * the proxy can import it.
 */
import type { AppRole } from "./roles";

export type Action = "view" | "edit" | "delete" | "approve";

export type ModuleDef = {
  key: string;
  label: string;
  group: "Delivery" | "Growth" | "Money" | "Platform" | "Website";
  description: string;
  /** Actions that make sense for this module. */
  actions: Action[];
  /** Never grantable below these roles, whatever the matrix says. */
  restrictedTo?: AppRole[];
};

export const MODULES: ModuleDef[] = [
  { key: "clients", label: "Clients", group: "Delivery", description: "Client accounts, health, contacts and scope", actions: ["view", "edit", "delete"] },
  { key: "projects", label: "Projects", group: "Delivery", description: "The delivery board and project records", actions: ["view", "edit", "delete"] },
  { key: "approvals", label: "Approval queue", group: "Delivery", description: "Creative awaiting client sign-off", actions: ["view", "edit", "approve"] },
  { key: "media", label: "Media library", group: "Delivery", description: "Uploads to Cloudflare R2", actions: ["view", "edit", "delete"] },

  { key: "leads", label: "Leads", group: "Growth", description: "Every enquiry across all client accounts", actions: ["view", "edit", "delete"] },
  { key: "campaigns", label: "Campaigns", group: "Growth", description: "Ad campaigns, budgets and spend", actions: ["view", "edit", "delete"] },
  { key: "creators", label: "Creators", group: "Growth", description: "Creator roster and applications", actions: ["view", "edit", "delete"] },
  { key: "qr", label: "QR & businesses", group: "Growth", description: "BMU QR tenants and their codes", actions: ["view", "edit", "delete"] },

  { key: "invoices", label: "Invoices", group: "Money", description: "Billing, payments and receivables", actions: ["view", "edit", "delete"], restrictedTo: ["OWNER", "ADMIN"] },
  { key: "exports", label: "Financial exports", group: "Money", description: "GST, TDS and ledger downloads", actions: ["view"], restrictedTo: ["OWNER", "ADMIN"] },
  { key: "store", label: "Store & fulfilment", group: "Money", description: "Hardware orders and the catalogue", actions: ["view", "edit"] },
  { key: "partners", label: "Partners", group: "Money", description: "Agencies, resellers and commissions", actions: ["view", "edit"], restrictedTo: ["OWNER", "ADMIN"] },

  { key: "team", label: "Team & roles", group: "Platform", description: "Adding people and changing permissions", actions: ["view", "edit", "delete"], restrictedTo: ["OWNER", "ADMIN"] },
  { key: "settings", label: "Agency settings", group: "Platform", description: "Business details and integrations", actions: ["view", "edit"], restrictedTo: ["OWNER", "ADMIN"] },
  { key: "reports", label: "Reports", group: "Platform", description: "Monthly client reporting", actions: ["view", "edit"] },

  { key: "cms", label: "Site content", group: "Website", description: "Everything on the public website", actions: ["view", "edit", "delete"] },
  { key: "blog", label: "Blog & articles", group: "Website", description: "The /resources section", actions: ["view", "edit", "delete", "approve"] },
];

export const MODULE_GROUPS = ["Delivery", "Growth", "Money", "Platform", "Website"] as const;

export type PermissionSet = Record<string, Action[]>;

/** Defaults per role. A person starts here, then gets individual overrides. */
export const ROLE_DEFAULTS: Record<AppRole, PermissionSet> = {
  OWNER: Object.fromEntries(MODULES.map((m) => [m.key, m.actions])),

  ADMIN: Object.fromEntries(
    MODULES.map((m) => [m.key, m.key === "team" ? (["view"] as Action[]) : m.actions])
  ),

  MANAGER: {
    clients: ["view", "edit"],
    projects: ["view", "edit"],
    approvals: ["view", "edit", "approve"],
    media: ["view", "edit"],
    leads: ["view", "edit"],
    campaigns: ["view", "edit"],
    creators: ["view", "edit"],
    qr: ["view", "edit"],
    store: ["view"],
    reports: ["view", "edit"],
    cms: ["view"],
    blog: ["view", "edit"],
  },

  STAFF: {
    clients: ["view"],
    projects: ["view", "edit"],
    approvals: ["view"],
    media: ["view", "edit"],
    leads: ["view"],
    qr: ["view"],
    reports: ["view"],
    blog: ["view", "edit"],
  },

  CLIENT: {},
  CREATOR: {},
  BUSINESS: {},
};

/** True if the role may be granted this module at all. */
export function isGrantable(moduleKey: string, role: AppRole) {
  const mod = MODULES.find((m) => m.key === moduleKey);
  if (!mod) return false;
  return !mod.restrictedTo || mod.restrictedTo.includes(role);
}

/**
 * Effective permissions: role defaults, plus grants, minus denials.
 * Denials win — the only safe direction for a conflict.
 */
export function effectivePermissions(
  role: AppRole,
  grants: PermissionSet = {},
  denials: PermissionSet = {}
): PermissionSet {
  const base = { ...(ROLE_DEFAULTS[role] ?? {}) };

  for (const [key, actions] of Object.entries(grants)) {
    if (!isGrantable(key, role)) continue;
    base[key] = [...new Set([...(base[key] ?? []), ...actions])];
  }

  for (const [key, actions] of Object.entries(denials)) {
    if (!base[key]) continue;
    base[key] = base[key].filter((a) => !actions.includes(a));
    if (base[key].length === 0) delete base[key];
  }

  return base;
}

export function can(perms: PermissionSet, moduleKey: string, action: Action = "view") {
  return (perms[moduleKey] ?? []).includes(action);
}

export const ACTION_LABEL: Record<Action, string> = {
  view: "View",
  edit: "Edit",
  delete: "Delete",
  approve: "Approve",
};

export const ROLE_SUMMARY: Record<AppRole, string> = {
  OWNER: "Everything, including billing and permissions",
  ADMIN: "Everything except changing who has access",
  MANAGER: "Their assigned accounts, projects and campaigns — no financials",
  STAFF: "Assigned work only. Cannot see money or client lists",
  CLIENT: "Their own dashboard",
  CREATOR: "Their own briefs, bookings and payouts",
  BUSINESS: "Their own BMU QR tenant",
};

/* ------------------------------ sub-roles ------------------------------ */

export type CustomRoleDef = {
  slug: string;
  name: string;
  description: string;
  baseRole: AppRole;
  permissions: PermissionSet;
  memberCount: number;
  isActive: boolean;
};

/**
 * Sub-roles ship as examples and are editable in admin. A custom role can
 * never exceed its base role — the ceiling is enforced when it's saved, not
 * just hidden in the UI.
 */
export const DEMO_CUSTOM_ROLES: CustomRoleDef[] = [
  {
    slug: "content-editor",
    name: "Content editor",
    description: "Writes and publishes on the public site. No client data at all.",
    baseRole: "STAFF",
    permissions: { cms: ["view", "edit"], blog: ["view", "edit", "approve"], media: ["view", "edit"] },
    memberCount: 2,
    isActive: true,
  },
  {
    slug: "media-buyer",
    name: "Media buyer",
    description: "Runs campaigns and reads leads. Cannot see invoices or client contracts.",
    baseRole: "MANAGER",
    permissions: {
      campaigns: ["view", "edit", "delete"],
      leads: ["view", "edit"],
      clients: ["view"],
      reports: ["view", "edit"],
    },
    memberCount: 3,
    isActive: true,
  },
  {
    slug: "support-desk",
    name: "Support desk",
    description: "Answers client questions. Read-only everywhere, which is the point.",
    baseRole: "STAFF",
    permissions: { clients: ["view"], projects: ["view"], leads: ["view"], qr: ["view"], reports: ["view"] },
    memberCount: 1,
    isActive: true,
  },
  {
    slug: "qr-onboarder",
    name: "QR onboarder",
    description: "Sets up new BMU QR tenants and ships their hardware.",
    baseRole: "MANAGER",
    permissions: { qr: ["view", "edit", "delete"], store: ["view", "edit"], media: ["view", "edit"] },
    memberCount: 2,
    isActive: true,
  },
  {
    slug: "finance-clerk",
    name: "Finance clerk",
    description: "Raises and chases invoices. Deliberately cannot delete anything.",
    baseRole: "ADMIN",
    permissions: { invoices: ["view", "edit"], exports: ["view"], clients: ["view"] },
    memberCount: 1,
    isActive: false,
  },
];

/**
 * Clamps a custom role to what its base role may hold. Without this, a
 * sub-role becomes a privilege-escalation path — build one on STAFF, tick
 * invoices, and you've handed out every client's numbers.
 */
export function clampToBase(baseRole: AppRole, requested: PermissionSet): PermissionSet {
  const ceiling = ROLE_DEFAULTS[baseRole === "STAFF" ? "MANAGER" : baseRole] ?? {};
  const out: PermissionSet = {};

  for (const [key, actions] of Object.entries(requested)) {
    if (!isGrantable(key, baseRole)) continue;
    const allowed = ceiling[key] ?? [];
    const kept = actions.filter((a) => allowed.includes(a));
    if (kept.length) out[key] = kept;
  }

  return out;
}

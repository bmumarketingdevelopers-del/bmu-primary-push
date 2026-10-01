/** Single source of truth for who can reach what. Edge-safe — no Prisma, no bcrypt. */

export const ROLES = ["OWNER", "ADMIN", "MANAGER", "STAFF", "CLIENT", "CREATOR", "BUSINESS"] as const;
export type AppRole = (typeof ROLES)[number];

/** Roles that belong to the agency, not to a client. */
export const STAFF_ROLES: AppRole[] = ["OWNER", "ADMIN", "MANAGER", "STAFF"];

/** Roles that can open the admin portal (/admin-portal). */
export const ADMIN_ROLES: AppRole[] = ["OWNER", "ADMIN"];
export const isAdmin = (role?: string | null) => ADMIN_ROLES.includes(role as AppRole);

export const isStaff = (role?: string | null) => STAFF_ROLES.includes(role as AppRole);

/** Where a user lands after signing in. */
export function homeFor(role?: string | null) {
  if (isStaff(role)) return "/admin";
  if (role === "CREATOR") return "/creators";
  if (role === "BUSINESS") return "/business";
  return "/dashboard";
}

/** Route prefixes that require a session, and which roles may enter. */
export const PROTECTED: { prefix: string; allow: AppRole[] }[] = [
  // Website-lead portal: admins only (not managers or other staff)
  { prefix: "/admin-portal", allow: [...ADMIN_ROLES] },
  { prefix: "/admin", allow: [...STAFF_ROLES] },
  // Staff can open the creator portal to see exactly what a creator sees.
  { prefix: "/creators", allow: ["CREATOR", ...STAFF_ROLES] },
  { prefix: "/business", allow: ["BUSINESS", ...STAFF_ROLES] },
  { prefix: "/dashboard", allow: ["CLIENT", ...STAFF_ROLES] },
];

export function guardFor(pathname: string) {
  return PROTECTED.find((r) => pathname === r.prefix || pathname.startsWith(`${r.prefix}/`));
}

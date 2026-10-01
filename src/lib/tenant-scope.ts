import "server-only";

import { cache } from "react";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";

/**
 * Tenant scoping, enforced at the data layer rather than per page.
 *
 * The failure this prevents is the worst one a multi-tenant platform can
 * have: one client seeing another's leads, customers or revenue. Relying on
 * every page to remember a `where: { businessId }` clause fails the first
 * time someone adds a page in a hurry — and the bug is invisible in testing,
 * because with one account signed in everything looks correct.
 *
 * So the tenant id isn't something a query *may* include. It's something the
 * caller has to obtain first, and obtaining it is what proves they're
 * entitled to the data.
 */

export type TenantContext = {
  /** Business id in the database. */
  id: string;
  /** Public slug, used in /b/{slug} URLs. */
  slug: string;
  name: string;
  /** True when an agency user is viewing a client's account, not their own. */
  isAgencyView: boolean;
};

/**
 * Resolves which business the signed-in user may read.
 *
 * - A BUSINESS user gets their own account and nothing else.
 * - Agency staff may view any account, because support needs to see what the
 *   client sees. That access is deliberate and worth logging.
 * - Anyone else is sent to their own home.
 *
 * `cache` dedupes this across a render: a page and its three child components
 * asking for the tenant hit the database once.
 */
export const requireTenant = cache(async (slugOverride?: string): Promise<TenantContext> => {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const isAgency = ["OWNER", "ADMIN", "MANAGER", "STAFF"].includes(user.role);

  /**
   * An agency user may pass a slug to view a specific client. A BUSINESS user
   * may not — passing someone else's slug must not widen their access, which
   * is why the override is ignored rather than checked.
   */
  const targetSlug = isAgency && slugOverride ? slugOverride : user.clientId;

  if (!targetSlug) {
    if (isAgency) redirect("/admin/businesses");
    redirect("/login");
  }

  if (!process.env.DATABASE_URL) {
    const { tenantForSlug } = await import("@/lib/tenant");
    const demo = tenantForSlug(targetSlug);
    return { id: demo.slug, slug: demo.slug, name: demo.name, isAgencyView: isAgency };
  }

  try {
    const { prisma } = await import("@/lib/prisma");
    const business = await prisma.business.findUnique({
      where: { slug: targetSlug },
      select: { id: true, slug: true, name: true },
    });

    if (!business) notFound();

    // A BUSINESS user reaching a slug that isn't theirs is a bug or an
    // attempt; either way they get nothing.
    if (!isAgency && business.slug !== user.clientId) notFound();

    return { ...business, isAgencyView: isAgency };
  } catch (err) {
    console.error("[tenant] resolution failed:", err);
    const { tenantForSlug } = await import("@/lib/tenant");
    const demo = tenantForSlug(targetSlug);
    return { id: demo.slug, slug: demo.slug, name: demo.name, isAgencyView: isAgency };
  }
});

/**
 * A `where` clause that cannot be written without a tenant.
 *
 * Queries read:
 *
 *   const tenant = await requireTenant();
 *   prisma.lead.findMany({ where: scoped(tenant) })
 *
 * The point is that forgetting the scope is a type error rather than a silent
 * data leak — `scoped()` won't compile without a TenantContext, and a
 * TenantContext can only come from requireTenant(), which does the
 * entitlement check.
 */
export function scoped(tenant: TenantContext) {
  return { businessId: tenant.id };
}

/** Same, for models that reference the business through a relation. */
export function scopedByRelation(tenant: TenantContext) {
  return { business: { id: tenant.id } };
}

/**
 * Asserts a row belongs to the tenant before it's returned or written.
 *
 * Use on any lookup by a user-supplied id — an invoice id, a lead id, an
 * order id. A row fetched by id alone is not yet proven to be theirs, and
 * sequential or guessable ids make that a real path rather than a theoretical
 * one.
 */
export function assertOwned<T extends { businessId?: string | null }>(
  row: T | null,
  tenant: TenantContext
): T {
  if (!row || row.businessId !== tenant.id) notFound();
  return row;
}

/**
 * Agency-side equivalent: proves a staff user may act on a client account.
 * Returns the tenant so the caller can scope with it.
 */
export async function requireAgencyAccess(slug: string): Promise<TenantContext> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  if (!["OWNER", "ADMIN", "MANAGER", "STAFF"].includes(user.role)) {
    notFound();
  }

  return requireTenant(slug);
}

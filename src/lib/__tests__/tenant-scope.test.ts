import { describe, expect, it } from "vitest";
import { scoped, scopedByRelation } from "@/lib/tenant-scope";
import type { TenantContext } from "@/lib/tenant-scope";

const acme: TenantContext = { id: "biz_1", slug: "salons", name: "ABC Salon", isAgencyView: false };
const other: TenantContext = { id: "biz_2", slug: "gyms", name: "Iron & Oak", isAgencyView: false };

/**
 * These tests are about shape, not behaviour: the value of `scoped()` is that
 * a query cannot be written without it, and that it always narrows.
 */

describe("scoping", () => {
  it("produces a where clause tied to the tenant", () => {
    expect(scoped(acme)).toEqual({ businessId: "biz_1" });
  });

  it("never produces the same clause for two tenants", () => {
    expect(scoped(acme)).not.toEqual(scoped(other));
  });

  it("scopes relation-based models too", () => {
    expect(scopedByRelation(acme)).toEqual({ business: { id: "biz_1" } });
  });

  it("uses the id, not the slug", () => {
    // Slugs are user-visible and editable; ids are not. Scoping on a slug
    // would mean a renamed business silently loses access to its own rows.
    expect(JSON.stringify(scoped(acme))).not.toContain("salons");
  });

  it("returns a plain object safe to spread into a larger where clause", () => {
    const where = { ...scoped(acme), status: "NEW" };
    expect(where).toEqual({ businessId: "biz_1", status: "NEW" });
  });
});

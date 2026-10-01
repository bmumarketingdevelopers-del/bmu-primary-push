import { DEMO_BUSINESSES, type SmartProfile } from "./qr-platform";
import { DEMO_INDUSTRY_BUSINESSES } from "./demo-businesses";

/**
 * Resolves which tenant the signed-in user owns.
 *
 * BUSINESS users carry their tenant slug on the session. Staff have none, so
 * they land on a sample tenant — which is deliberate: it lets support see the
 * same screens a customer describes on the phone.
 */
export function tenantForSlug(slug?: string | null): SmartProfile {
  const all = [...DEMO_BUSINESSES, ...DEMO_INDUSTRY_BUSINESSES];
  return all.find((b) => b.slug === slug) ?? all.find((b) => b.slug === "salons") ?? all[0];
}

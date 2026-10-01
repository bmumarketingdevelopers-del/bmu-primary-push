import { BusinessTopbar } from "@/components/business/topbar";
import { PageShell } from "@/components/dashboard/page-shell";
import { ProfileEditor } from "@/components/business/profile-editor";
import { getBusiness } from "@/lib/qr-platform";
import { tenantForSlug } from "@/lib/tenant";
import { getCurrentUser } from "@/lib/session";
import styles from "./page.module.css";

export default async function BusinessProfilePage() {
  const user = await getCurrentUser();
  // BUSINESS users carry their tenant slug on the session.
  const fallback = tenantForSlug(user?.clientId);
  const business = (await getBusiness(fallback.slug)) ?? fallback;

  return (
    <>
      <BusinessTopbar title="My profile" />
      <div className={styles.page}>
        <PageShell
          title="My profile"
          description="Everything here appears on your public page the moment you save. Nothing printed ever needs replacing."
        >
          <ProfileEditor business={business} />
        </PageShell>
      </div>
    </>
  );
}

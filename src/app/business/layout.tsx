import type { Metadata } from "next";
import { BusinessSidebar } from "@/components/business/sidebar";
import { requireUser } from "@/lib/session";
import { getIndustrySetup } from "@/lib/repos/industry";
import { tenantForSlug } from "@/lib/tenant";
import { DemoModeBanner } from "@/components/admin/demo-mode-banner";
import styles from "./layout.module.css";

export const metadata: Metadata = {
  title: { default: "BMU QR", template: "%s · BMU QR" },
  robots: { index: false, follow: false },
};

export default async function BusinessLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser(["BUSINESS", "OWNER", "ADMIN", "MANAGER", "STAFF"]);

  // Resolved here so the sidebar reflects admin edits, not the shipped default.
  const tenant = tenantForSlug(user.clientId);
  const setup = await getIndustrySetup(tenant.slug);
  const modules = setup?.modules ?? null;

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <BusinessSidebar modules={modules} />
      </aside>
      <div className={styles.main}>
        <DemoModeBanner />
        {children}</div>
    </div>
  );
}

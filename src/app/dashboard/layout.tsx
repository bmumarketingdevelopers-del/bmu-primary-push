import type { Metadata } from "next";
import { SidebarNav } from "@/components/dashboard/sidebar";
import { requireUser } from "@/lib/session";
import styles from "./layout.module.css";

export const metadata: Metadata = {
  title: "Client dashboard",
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  /**
   * Explicit roles rather than a bare requireUser().
   *
   * Without the list, any signed-in account reaches this dashboard — a QR
   * tenant or a creator would land on a client's projects and invoices.
   * Staff are allowed so support can see what a client sees.
   */
  await requireUser(["CLIENT", "OWNER", "ADMIN", "MANAGER", "STAFF"]);

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <SidebarNav />
      </aside>
      <div className={styles.main}>{children}</div>
    </div>
  );
}

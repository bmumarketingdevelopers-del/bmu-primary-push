import type { Metadata } from "next";
import { DemoModeBanner } from "@/components/admin/demo-mode-banner";
import { AdminSidebar } from "@/components/admin/sidebar";
import { requireStaff } from "@/lib/session";
import styles from "./layout.module.css";

export const metadata: Metadata = {
  title: { default: "Agency admin", template: "%s · BMU Admin" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireStaff();

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <AdminSidebar />
      </aside>
      <div className={styles.main}>
        <DemoModeBanner />
        {children}
      </div>
    </div>
  );
}

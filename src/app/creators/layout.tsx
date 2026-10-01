import type { Metadata } from "next";
import { CreatorSidebar } from "@/components/creator/sidebar";
import { requireUser } from "@/lib/session";
import styles from "./layout.module.css";

export const metadata: Metadata = {
  title: { default: "Creator portal", template: "%s · BMU Creators" },
  robots: { index: false, follow: false },
};

export default async function CreatorLayout({ children }: { children: React.ReactNode }) {
  await requireUser(["CREATOR", "OWNER", "ADMIN", "MANAGER", "STAFF"]);

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <CreatorSidebar />
      </aside>
      <div className={styles.main}>{children}</div>
    </div>
  );
}

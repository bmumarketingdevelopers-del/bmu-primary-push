"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/marketing/logo";
import { DASHBOARD_NAV } from "./nav-items";
import { CURRENT_CLIENT } from "@/lib/dashboard-data";
import { cn } from "@/lib/utils";
import styles from "./sidebar.module.css";

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className={styles.sidebar}>
      <Logo href="/dashboard" className={styles.logo} />

      <div className={styles.workspace}>
        <p className={styles.workspaceLabel}>Workspace</p>
        <p className={styles.workspaceName}>{CURRENT_CLIENT.name}</p>
        <p className={styles.workspacePlan}>{CURRENT_CLIENT.plan}</p>
      </div>

      <nav className={cn("scroll-thin", styles.nav)}>
        {DASHBOARD_NAV.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(styles.navLink, active ? styles.navLinkActive : styles.navLinkIdle)}
            >
              <Icon className={styles.navIcon} strokeWidth={1.8} />
              {item.label}
              {"badge" in item && item.badge ? (
                <span className={cn(styles.navBadge, active ? styles.navBadgeOnActive : styles.navBadgeIdle)}>
                  {item.badge}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div className={styles.footerLinks}>
        <Link
          href="/admin"
          onClick={onNavigate}
          className={styles.adminLink}
        >
          Switch to agency admin
        </Link>
        <Link
          href="/"
          onClick={onNavigate}
          className={styles.backLink}
        >
          ← Back to website
        </Link>
      </div>
    </div>
  );
}

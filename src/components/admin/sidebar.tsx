"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/marketing/logo";
import { ADMIN_NAV } from "./nav-items";
import { cn } from "@/lib/utils";
import styles from "./sidebar.module.css";

export function AdminSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className={styles.sidebar}>
      <div>
        <Logo href="/admin" className={styles.logo} />
        <span className={styles.roleTag}>
          Agency admin
        </span>
      </div>

      <nav className={cn(styles.nav, "scroll-thin")}>
        {ADMIN_NAV.map((group) => (
          <div key={group.section}>
            <p className={styles.groupLabel}>
              {group.section}
            </p>
            <div className={styles.groupItems}>
              {group.items.map((item) => {
                const active = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    className={cn(styles.link, active ? styles.linkActive : styles.linkIdle)}
                  >
                    <Icon className={styles.linkIcon} strokeWidth={1.8} />
                    {item.label}
                    {"badge" in item && item.badge ? (
                      <span className={cn(styles.count, active ? styles.countOnActive : styles.countOnIdle)}>
                        {item.badge}
                      </span>
                    ) : null}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <Link
        href="/dashboard"
        onClick={onNavigate}
        className={styles.switchLink}
      >
        Switch to client view
      </Link>
    </div>
  );
}

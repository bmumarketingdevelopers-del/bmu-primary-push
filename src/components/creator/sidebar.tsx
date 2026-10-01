"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Clapperboard, FileText, Wallet, UserCircle } from "lucide-react";
import { Logo } from "@/components/marketing/logo";
import { CREATOR_PROFILE } from "@/lib/creator-data";
import { compactNumber, cn } from "@/lib/utils";
import styles from "./sidebar.module.css";

const NAV = [
  { href: "/creators", label: "Overview", icon: LayoutDashboard },
  { href: "/creators/briefs", label: "Briefs", icon: FileText, badge: 2 },
  { href: "/creators/bookings", label: "Bookings", icon: Clapperboard },
  { href: "/creators/payouts", label: "Payouts", icon: Wallet },
  { href: "/creators/profile", label: "Profile", icon: UserCircle },
];

export function CreatorSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className={styles.sidebar}>
      <div>
        <Logo href="/creators" className={styles.logo} />
        <span className={styles.productTag}>
          Creator portal
        </span>
      </div>

      <div className={styles.account}>
        <p className={styles.accountName}>{CREATOR_PROFILE.handle}</p>
        <p className={styles.accountMeta}>
          {compactNumber(CREATOR_PROFILE.followers)} followers · {CREATOR_PROFILE.city}
        </p>
      </div>

      <nav className={cn("scroll-thin", styles.nav)}>
        {NAV.map((item) => {
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
              {item.badge && (
                <span className={cn(styles.navBadge, active ? styles.navBadgeOnActive : styles.navBadgeIdle)}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <Link
        href="/"
        onClick={onNavigate}
        className={styles.backLink}
      >
        ← Back to website
      </Link>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Store, QrCode, Star, Users, Contact,
  Tag, CreditCard, ExternalLink, CalendarCheck, UserCog, UtensilsCrossed, Receipt, Gift, Sparkles, MessageSquare, Building2, Palette, Award, ShieldCheck, Repeat, Boxes,
} from "lucide-react";
import { Logo } from "@/components/marketing/logo";
import { useSession } from "next-auth/react";
import { tenantForSlug } from "@/lib/tenant";
import { setupBySlug, type ModuleKey } from "@/lib/industry-setup";
import { cn } from "@/lib/utils";
import styles from "./sidebar.module.css";

const NAV = [
  { href: "/business", label: "Overview", icon: LayoutDashboard },
  { href: "/business/profile", label: "My profile", icon: Store },
  { href: "/business/appearance", label: "Appearance", icon: Palette },
  { href: "/business/ar", label: "AR", icon: Boxes, module: "ar" as ModuleKey },
  { href: "/business/qr", label: "QR & NFC", icon: QrCode },
  { href: "/business/menu", label: "Menu", icon: UtensilsCrossed, module: "menu" as ModuleKey },
  { href: "/business/orders", label: "Orders", icon: Receipt, badge: 2, module: "orders" as ModuleKey },
  { href: "/business/bookings", label: "Bookings", icon: CalendarCheck, badge: 1, module: "booking" as ModuleKey },
  { href: "/business/staff", label: "Staff & services", icon: UserCog, module: "booking" as ModuleKey },
  { href: "/business/staff-codes", label: "Staff codes", icon: Award },
  { href: "/business/compliance", label: "Licences", icon: ShieldCheck },
  { href: "/business/reviews", label: "Reviews", icon: Star, badge: 2 },
  { href: "/business/review-settings", label: "Review settings", icon: MessageSquare },
  { href: "/business/leads", label: "Leads", icon: Users, badge: 2 },
  { href: "/business/customers", label: "Customers", icon: Contact },
  { href: "/business/returning", label: "Returning", icon: Repeat },
  { href: "/business/offers", label: "Offers", icon: Tag },
  { href: "/business/loyalty", label: "Loyalty", icon: Gift, module: "loyalty" as ModuleKey },
  { href: "/business/ai", label: "AI assistant", icon: Sparkles },
  { href: "/business/locations", label: "Locations", icon: Building2, module: "locations" as ModuleKey },
  { href: "/business/billing", label: "Plan & billing", icon: CreditCard },
];

export function BusinessSidebar({
  onNavigate,
  modules,
}: {
  onNavigate?: () => void;
  /** Passed from the server layout so admin edits take effect immediately. */
  modules?: string[] | null;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const business = tenantForSlug(session?.user?.clientId);
  const setup = setupBySlug(business.slug);

  /**
   * Hide what this industry doesn't use. A salon has no menu and a restaurant
   * has no loyalty tier at Starter — showing every module to everyone is what
   * makes a product feel bloated regardless of how good each part is.
   */
  const allowed = modules ?? setup?.modules ?? null;

  const nav = NAV.filter((item) => {
    const key = "module" in item ? (item.module as ModuleKey) : null;
    return !key || !allowed || allowed.includes(key);
  });

  return (
    <div className={styles.sidebar}>
      <div>
        <Logo tone="onDark" href="/business" className={styles.logo} />
        <span className={styles.productTag}>
          BMU QR
        </span>
      </div>

      <div className={styles.account}>
        <p className={styles.accountName}>{business.name}</p>
        <p className={styles.accountMeta}>Business plan · {business.city}</p>
      </div>

      <nav className={cn("scroll-thin", styles.nav)}>
        {nav.map((item) => {
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

      <a
        href={`/b/${business.slug}`}
        target="_blank"
        rel="noreferrer"
        onClick={onNavigate}
        className={styles.publicLink}
      >
        <ExternalLink className={styles.publicLinkIcon} /> View public page
      </a>
    </div>
  );
}

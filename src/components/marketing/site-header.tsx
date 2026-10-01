"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronRight, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "./logo";
import { MAIN_NAV, type NavItem } from "@/lib/nav";
import { cn } from "@/lib/utils";
import styles from "./site-header.module.css";

export function SiteHeader({
  extraPages = [],
}: {
  /** Pages built in the admin panel that asked for a menu slot. */
  extraPages?: NavItem[];
} = {}) {
  const [stuck, setStuck] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  const onDarkHero = pathname === "/";

  React.useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={cn(styles.header, stuck && styles.stuck)}>
      <div className={cn("container", styles.bar)}>
        <Logo className={stuck ? styles.logoOnLight : styles.logoOnDark} />

        <nav className={styles.nav}>
          {[...MAIN_NAV, ...extraPages].map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <div key={item.href} className={styles.navItem}>
                <Link
                  href={item.href}
                  className={cn(
                    styles.navLink,
                    stuck ? styles.navLinkOnLight : styles.navLinkOnDark,
                    active && styles.active
                  )}
                >
                  {item.label}
                  {item.children && <ChevronDown className={styles.chevron} />}
                </Link>
                <span className={styles.underline} />

                {item.children && (
                  <div className={styles.dropdown}>
                    <div className={styles.dropdownPanel}>
                      {item.children.map((c) => (
                        <div key={c.href} className={styles.dropdownItem}>
                          <Link href={c.href} className={styles.dropdownLink}>
                            <span className={styles.dropdownLabel}>
                              {c.label}
                              {c.submenu && <ChevronRight className={styles.submenuChevron} />}
                            </span>
                            {c.description && (
                              <span className={styles.dropdownDescription}>{c.description}</span>
                            )}
                          </Link>

                          {c.submenu && (
                            <div className={styles.flyout}>
                              <div className={styles.dropdownPanel}>
                                <p className={styles.flyoutTitle}>{c.submenu.label}</p>
                                {c.submenu.items.map((s) => (
                                  <Link key={s.href} href={s.href} className={styles.flyoutLink}>
                                    {s.label}
                                  </Link>
                                ))}
                                <Link href={c.submenu.href} className={cn(styles.dropdownLink, styles.dropdownAll)}>
                                  View all {c.submenu.label.toLowerCase()} →
                                </Link>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                      <Link href={item.href} className={cn(styles.dropdownLink, styles.dropdownAll)}>
                        View all {item.label.toLowerCase()} →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className={styles.actions}>
          <ThemeToggle className={cn(!stuck && styles.themeToggleOnDark)} />
          {/* "Log in" button — hidden for now; /login and /signup work by URL. Uncomment to bring it back.
          <Button
            asChild
            variant={stuck ? "outline" : "ghostLight"}
            size="sm"
            className={styles.clientLogin}
          >
            <Link href="/login">Log in</Link>
          </Button>
          */}
          <Button asChild size="sm" className={styles.bookCall}>
            <Link href="/contact">Book a call</Link>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                aria-label="Open menu"
                className={cn(styles.menuButton, stuck ? styles.menuButtonOnLight : styles.menuButtonOnDark)}
              >
                <Menu className={styles.menuIcon} />
              </button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <Logo className={styles.sheetLogo} />
              <nav className={styles.mobileNav}>
                {MAIN_NAV.map((item) => (
                  <div key={item.href} className={styles.mobileItem}>
                    <SheetClose asChild>
                      <Link href={item.href} className={cn("display", styles.mobileLink)}>{item.label}</Link>
                    </SheetClose>
                    {item.children && (
                      <div className={styles.mobileChildren}>
                        {item.children.map((c) => (
                          <React.Fragment key={c.href}>
                            <SheetClose asChild>
                              <Link href={c.href} className={styles.mobileChildLink}>
                                {c.label}
                              </Link>
                            </SheetClose>
                            {c.submenu && (
                              <div className={styles.mobileSubmenu}>
                                {c.submenu.items.map((s) => (
                                  <SheetClose asChild key={s.href}>
                                    <Link href={s.href} className={styles.mobileSubmenuLink}>
                                      {s.label}
                                    </Link>
                                  </SheetClose>
                                ))}
                              </div>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
              <SheetClose asChild>
                <Button asChild className={styles.mobileCta}>
                  <Link href="/contact">Book a free consultation</Link>
                </Button>
              </SheetClose>
              {/* Menu "Log in" button — hidden for now, along with the header one. Uncomment to bring it back.
              <SheetClose asChild>
                <Button asChild variant="outline" className={styles.mobileLogin}>
                  <Link href="/login">Log in</Link>
                </Button>
              </SheetClose>
              */}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

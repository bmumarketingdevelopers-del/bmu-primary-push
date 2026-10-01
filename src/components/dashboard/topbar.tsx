"use client";

import Link from "next/link";
import * as React from "react";
import { useSession } from "next-auth/react";
import { Menu, Search, Settings, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import { SidebarNav } from "./sidebar";
import { NotificationBell } from "@/components/notification-bell";
import { SignOutItem } from "@/components/sign-out-item";
import { CURRENT_USER } from "@/lib/dashboard-data";
import { cn, initials } from "@/lib/utils";
import styles from "./topbar.module.css";

export function Topbar({ title }: { title: string }) {
  const [open, setOpen] = React.useState(false);
  const { data: session } = useSession();
  const user = session?.user ?? CURRENT_USER;

  return (
    <header className={styles.topbar}>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button
            aria-label="Open menu"
            className={styles.menuButton}
          >
            <Menu className={styles.menuIcon} />
          </button>
        </SheetTrigger>
        <SheetContent side="left" className={styles.sheet}>
          <SheetTitle className="sr-only">Dashboard navigation</SheetTitle>
          <SidebarNav onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>

      <h1 className={cn("display", styles.title)}>{title}</h1>

      <div className={styles.actions}>
        <div className={styles.search}>
          <Search className={styles.searchIcon} />
          <input
            aria-label="Search leads, projects and invoices"
            type="search"
            placeholder="Search leads, projects, invoices"
            className={styles.searchInput}
          />
        </div>

        <NotificationBell />

        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className={styles.account}>
              <Avatar className={styles.avatar}>
                <AvatarFallback className={styles.avatarInitials}>{initials(user.name ?? "BMU")}</AvatarFallback>
              </Avatar>
              <span className={styles.accountName}>{(user.name ?? "Account").split(" ")[0]}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel className={styles.accountLabel}>
              {user.name}
              <span className={styles.accountEmail}>{user.email}</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem><User /> Profile</DropdownMenuItem>
            <DropdownMenuItem><Settings /> Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <SignOutItem />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

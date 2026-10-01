"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import { Menu, Plus, Search, Settings, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import { AdminSidebar } from "./sidebar";
import { NotificationBell } from "@/components/notification-bell";
import { SignOutItem } from "@/components/sign-out-item";
import { ADMIN_USER } from "@/lib/admin-data";
import { cn, initials } from "@/lib/utils";
import styles from "./topbar.module.css";

export function AdminTopbar({ title, action }: { title: string; action?: string }) {
  const [open, setOpen] = React.useState(false);
  const { data: session } = useSession();
  const user = session?.user ?? ADMIN_USER;

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
          <SheetTitle className="sr-only">Admin navigation</SheetTitle>
          <AdminSidebar onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>

      <h1 className={cn("display", styles.title)}>{title}</h1>

      <div className={styles.actions}>
        <div className={styles.search}>
          <Search className={styles.searchIcon} />
          <input
            aria-label="Search clients, projects and invoices"
            type="search"
            placeholder="Search clients, projects, invoices"
            className={styles.searchInput}
          />
        </div>

        {action && (
          <Button size="sm" className={styles.actionButton}>
            <Plus /> {action}
          </Button>
        )}

        <NotificationBell />

        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className={styles.userButton}>
              <Avatar className={styles.avatar}>
                <AvatarFallback className={styles.avatarFallback}>{initials(user.name ?? "BMU")}</AvatarFallback>
              </Avatar>
              <span className={styles.userName}>{(user.name ?? "Account").split(" ")[0]}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel className={styles.userLabel}>
              {user.name}
              <span className={styles.userMeta}>{user.role} · {user.email}</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem><User /> Profile</DropdownMenuItem>
            <DropdownMenuItem><Settings /> Agency settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <SignOutItem />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

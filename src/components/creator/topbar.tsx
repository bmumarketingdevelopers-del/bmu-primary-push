"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import { Menu, Settings, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import { NotificationBell } from "@/components/notification-bell";
import { SignOutItem } from "@/components/sign-out-item";
import { CreatorSidebar } from "./sidebar";
import { CREATOR_PROFILE } from "@/lib/creator-data";
import { cn, initials } from "@/lib/utils";
import styles from "./topbar.module.css";

export function CreatorTopbar({ title }: { title: string }) {
  const [open, setOpen] = React.useState(false);
  const { data: session } = useSession();
  const name = session?.user?.name ?? CREATOR_PROFILE.name;

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
          <SheetTitle className="sr-only">Creator navigation</SheetTitle>
          <CreatorSidebar onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>

      <h1 className={cn("display", styles.title)}>{title}</h1>

      <div className={styles.actions}>
        <NotificationBell />
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className={styles.account}>
              <Avatar className={styles.avatar}>
                <AvatarFallback className={styles.avatarInitials}>{initials(name)}</AvatarFallback>
              </Avatar>
              <span className={styles.accountName}>{name.split(" ")[0]}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel className={styles.accountLabel}>
              {name}
              <span className={styles.accountEmail}>
                {session?.user?.email ?? CREATOR_PROFILE.handle}
              </span>
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

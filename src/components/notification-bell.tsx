"use client";

import * as React from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { relativeTime, type AppNotification } from "@/lib/notifications";
import { cn } from "@/lib/utils";
import styles from "./notification-bell.module.css";

const POLL_MS = 30_000;

/**
 * Polling rather than WebSockets — this app is built to deploy serverless,
 * where a long-lived socket has nowhere to live. Thirty seconds is well inside
 * what "realtime" needs to mean for an approval queue or an overdue invoice.
 */
export function NotificationBell() {
  const [items, setItems] = React.useState<AppNotification[]>([]);
  const [unread, setUnread] = React.useState(0);
  const [open, setOpen] = React.useState(false);

  const load = React.useCallback(async () => {
    try {
      const res = await fetch("/api/notifications", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      setItems(data.items ?? []);
      setUnread(data.unread ?? 0);
    } catch {
      // Offline or mid-deploy — keep whatever we already showed.
    }
  }, []);

  React.useEffect(() => {
    load();
    const id = setInterval(() => {
      // Don't poll a tab nobody is looking at.
      if (document.visibilityState === "visible") load();
    }, POLL_MS);
    return () => clearInterval(id);
  }, [load]);

  async function onOpenChange(next: boolean) {
    setOpen(next);
    if (next && unread > 0) {
      setUnread(0);
      setItems((prev) => prev.map((i) => ({ ...i, isRead: true })));
      await fetch("/api/notifications", { method: "POST", body: "{}" }).catch(() => {});
    }
  }

  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        <button
          aria-label={unread ? `Notifications, ${unread} unread` : "Notifications"}
          className={styles.trigger}
        >
          <Bell className={styles.bellIcon} />
          {unread > 0 && (
            <span className={styles.count}>
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className={styles.menu}>
        <DropdownMenuLabel className={styles.menuLabel}>
          Notifications
          {unread > 0 && <span className={styles.newCount}>{unread} new</span>}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {items.length === 0 && (
          <p className={styles.empty}>
            Nothing new. We&apos;ll tell you when there is.
          </p>
        )}

        {items.map((n) => {
          const content = (
            <span className={styles.entry}>
              <span className={styles.entryHead}>
                {!n.isRead && <span className={styles.unreadDot} />}
                <span className={cn(styles.entryTitle, !n.isRead && styles.entryTitleUnread)}>
                  {n.title}
                </span>
              </span>
              {n.body && <span className={styles.entryMeta}>{n.body}</span>}
              <span className={styles.entryMeta}>{relativeTime(n.createdAt)}</span>
            </span>
          );

          return (
            <DropdownMenuItem key={n.id} asChild className={styles.menuItem}>
              {n.href ? <Link href={n.href}>{content}</Link> : <div>{content}</div>}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

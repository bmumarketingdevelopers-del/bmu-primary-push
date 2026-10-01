"use client";

import { LogOut } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { signOutAction } from "@/app/actions/auth";
import styles from "./sign-out-item.module.css";

export function SignOutItem() {
  return (
    <form action={signOutAction}>
      <DropdownMenuItem asChild>
        <button type="submit" className={styles.button}>
          <LogOut /> Sign out
        </button>
      </DropdownMenuItem>
    </form>
  );
}

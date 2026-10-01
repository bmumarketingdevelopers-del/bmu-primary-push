"use client";

import { CORE_USERS } from "@/lib/demo-users";
import styles from "./login-form.module.css";

// Admin portal first: only the agency owner and manager logins are offered for now.
// Client, creator and business-owner accounts come back once those portals are built.
const SAVED_ROLES = ["OWNER", "MANAGER"];
const SAVED_LABELS: Record<string, string> = { OWNER: "Admin", MANAGER: "Manager" };

/** Saved logins that fill the sign-in form in one tap (development only). */
export function DemoAccounts({ onPick }: { onPick: (email: string, password: string) => void }) {
  const accounts = CORE_USERS.filter((u) => SAVED_ROLES.includes(u.role));

  return (
    <div className={styles.demo}>
      <div>
        <p className={styles.demoTitle}>Saved logins</p>
        <p className={styles.demoNote}>Development only. Tap one to fill the form.</p>
      </div>

      <div className={styles.group}>
        {accounts.map((u) => (
          <AccountRow
            key={u.email}
            onPick={onPick}
            email={u.email}
            password={u.password}
            role={SAVED_LABELS[u.role] ?? u.role}
            label={u.name}
          />
        ))}
      </div>
    </div>
  );
}

function AccountRow({
  onPick, email, password, role, label,
}: {
  onPick: (email: string, password: string) => void;
  email: string;
  password: string;
  role: string;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onPick(email, password)}
      className={styles.account}
    >
      <span className={styles.accountText}>
        <span className={styles.accountEmail}>{email}</span>
        <span className={styles.accountLabel}>{label}</span>
      </span>
      <span className={styles.role}>
        {role}
      </span>
    </button>
  );
}

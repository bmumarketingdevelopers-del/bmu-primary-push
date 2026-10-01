import { Database, Terminal } from "lucide-react";
import styles from "./demo-mode-banner.module.css";

/**
 * Persistent warning when the app is running without a database.
 *
 * Every create form in the panel validates, reports success, and then stores
 * nothing — which reads as "the button is broken" rather than "there's no
 * database". This says so once, at the top of every admin screen, instead of
 * leaving it to a message inside a dialog that closes.
 */
export function DemoModeBanner() {
  if (process.env.DATABASE_URL) return null;

  return (
    <div className={styles.banner}>
      <div className={styles.inner}>
        <span className={styles.iconWrap}>
          <Database className={styles.icon} strokeWidth={2} />
        </span>

        <div className={styles.body}>
          <p className={styles.title}>
            No database connected — nothing you create here is saved
          </p>
          <p className={styles.text}>
            Every form works and validates, but writes are discarded. Pages show built-in demo data,
            so a new client or invoice won&apos;t appear in the list after you save it. Three
            commands fix it:
          </p>

          <code className={styles.commands}>
            <Terminal className={styles.terminalIcon} />
            <span>DATABASE_URL=&quot;postgresql://…&quot; in .env</span>
            <span className={styles.separator}>·</span>
            <span>npx prisma db push</span>
            <span className={styles.separator}>·</span>
            <span>npm run db:seed</span>
          </code>
        </div>
      </div>
    </div>
  );
}

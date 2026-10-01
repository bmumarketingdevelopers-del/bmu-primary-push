"use client";

import styles from "./global-error.module.css";

/**
 * Catches failures in the root layout itself, so it must render its own
 * <html> and <body> and cannot rely on any app styling or providers.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className={styles.body}>
        <div className={styles.panel}>
          <p className={styles.code}>500</p>
          <h1 className={styles.title}>The application failed to load</h1>
          <p className={styles.message}>
            This is a fault at the root of the app rather than on one page. Reloading usually clears it.
          </p>
          {error.digest && (
            <p className={styles.reference}>Reference: {error.digest}</p>
          )}
          <button onClick={reset} className={styles.reload}>
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}

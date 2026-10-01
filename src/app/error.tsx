"use client";

import * as React from "react";
import Link from "next/link";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import styles from "./error.module.css";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("[app] unhandled error:", error);
  }, [error]);

  return (
    <main className={styles.main}>
      <div className={styles.panel}>
        <p className={cn("display", styles.code)}>Oops</p>
        <h1 className={cn("display", styles.title)}>Something broke on our side</h1>
        <p className={styles.message}>
          The error has been logged. Try again — if it keeps happening, tell us what you were doing
          and we&apos;ll fix it.
        </p>
        {error.digest && (
          <p className={styles.reference}>Reference: {error.digest}</p>
        )}
        <div className={styles.actions}>
          <Button onClick={reset}>
            <RefreshCw /> Try again
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Back to homepage</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}

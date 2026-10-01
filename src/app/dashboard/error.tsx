"use client";

import * as React from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import styles from "./error.module.css";

export default function SectionError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("[section] error:", error);
  }, [error]);

  return (
    <div className={styles.wrap}>
      <div className={styles.panel}>
        <h2 className={cn("display", styles.title)}>This section didn&apos;t load</h2>
        <p className={styles.message}>
          Usually a temporary data problem. Retrying is safe — nothing was saved.
        </p>
        {error.digest && (
          <p className={styles.reference}>Ref {error.digest}</p>
        )}
        <Button onClick={reset} className={styles.retry}>
          <RefreshCw /> Retry
        </Button>
      </div>
    </div>
  );
}

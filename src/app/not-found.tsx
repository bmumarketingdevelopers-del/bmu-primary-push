import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <main className={styles.main}>
      <div>
        <p className={cn("display", styles.code)}>404</p>
        <h1 className={cn("display", styles.title)}>This page moved or never existed</h1>
        <p className={styles.message}>
          Check the address, or head back to the homepage and start again.
        </p>
        <Button asChild className={styles.homeButton}>
          <Link href="/">Back to homepage</Link>
        </Button>
      </div>
    </main>
  );
}

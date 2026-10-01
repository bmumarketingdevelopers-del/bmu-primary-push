import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Page } from "@/lib/repos/db";
import styles from "./pagination.module.css";

/**
 * Server-rendered pagination.
 *
 * Links rather than buttons, so a page is shareable and the back button
 * works — someone sending a colleague "page 3 of the overdue invoices"
 * should get page 3.
 */
export function Pagination({
  meta,
  basePath,
  label = "rows",
}: {
  meta: Page;
  basePath: string;
  label?: string;
}) {
  if (meta.total === 0) return null;

  const first = (meta.page - 1) * meta.pageSize + 1;
  const last = Math.min(meta.page * meta.pageSize, meta.total);
  const href = (p: number) => (p <= 1 ? basePath : `${basePath}?page=${p}`);

  // Show a window around the current page rather than every number.
  const window: number[] = [];
  const from = Math.max(1, meta.page - 2);
  const to = Math.min(meta.pages, from + 4);
  for (let i = Math.max(1, to - 4); i <= to; i++) window.push(i);

  return (
    <div className={styles.pagination}>
      <p className={styles.summary}>
        {first}–{last} of {meta.total.toLocaleString("en-IN")} {label}
      </p>

      {meta.pages > 1 && (
        <div className={styles.pages}>
          <Button asChild variant="outline" size="sm" disabled={meta.page === 1}>
            <Link href={href(meta.page - 1)} aria-label="Previous page">
              <ChevronLeft />
            </Link>
          </Button>

          {window[0] > 1 && (
            <>
              <Button asChild variant="ghost" size="sm"><Link href={href(1)}>1</Link></Button>
              {window[0] > 2 && <span className={styles.ellipsis}>…</span>}
            </>
          )}

          {window.map((p) => (
            <Button
              key={p}
              asChild
              variant={p === meta.page ? "default" : "ghost"}
              size="sm"
            >
              <Link href={href(p)} aria-current={p === meta.page ? "page" : undefined}>{p}</Link>
            </Button>
          ))}

          {window[window.length - 1] < meta.pages && (
            <>
              {window[window.length - 1] < meta.pages - 1 && (
                <span className={styles.ellipsis}>…</span>
              )}
              <Button asChild variant="ghost" size="sm">
                <Link href={href(meta.pages)}>{meta.pages}</Link>
              </Button>
            </>
          )}

          <Button asChild variant="outline" size="sm" disabled={meta.page === meta.pages}>
            <Link href={href(meta.page + 1)} aria-label="Next page">
              <ChevronRight />
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}

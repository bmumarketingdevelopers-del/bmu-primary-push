import { cn } from "@/lib/utils";
import styles from "./skeletons.module.css";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn(styles.skeleton, className)} />;
}

/** Matches the KPI-cards-then-charts shape every dashboard page uses. */
export function DashboardSkeleton() {
  return (
    <div className={styles.page}>
      <div className={styles.heading}>
        <Skeleton className={styles.titleBar} />
        <Skeleton className={styles.subtitleBar} />
      </div>

      <div className={styles.kpiGrid}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className={styles.kpi} />
        ))}
      </div>

      <div className={styles.chartGrid}>
        <Skeleton className={cn(styles.chart, styles.chartWide)} />
        <Skeleton className={styles.chart} />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className={styles.page}>
      <div className={styles.heading}>
        <Skeleton className={styles.tableTitleBar} />
        <Skeleton className={styles.tableSubtitleBar} />
      </div>
      <div className={styles.tableFrame}>
        <Skeleton className={styles.tableHeadBar} />
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} className={styles.tableRowBar} />
        ))}
      </div>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className={cn("container", styles.pageShell)}>
      <Skeleton className={styles.eyebrowBar} />
      <Skeleton className={styles.headlineBar} />
      <Skeleton className={styles.ledeBar} />
      <Skeleton className={styles.ledeBarShort} />
      <div className={styles.cardGrid}>
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className={styles.card} />
        ))}
      </div>
    </div>
  );
}

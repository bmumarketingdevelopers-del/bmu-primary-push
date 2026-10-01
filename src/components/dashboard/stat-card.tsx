import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import styles from "./stat-card.module.css";

export function StatCard({
  label, value, delta, sub, icon: Icon, inverse,
}: {
  label: string;
  value: string;
  delta: number;
  sub: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  inverse?: boolean;
}) {
  const up = delta >= 0;
  const good = inverse ? !up : up;

  return (
    <Card className={styles.card}>
      <div className={styles.header}>
        <p className={styles.label}>{label}</p>
        <span className={styles.iconWrap}>
          <Icon className={styles.icon} strokeWidth={1.8} />
        </span>
      </div>
      <p className={cn("display", styles.value)}>{value}</p>
      <div className={styles.footer}>
        <span className={cn(styles.delta, good ? styles.deltaGood : styles.deltaBad)}>
          {up ? <ArrowUpRight className={styles.deltaIcon} /> : <ArrowDownRight className={styles.deltaIcon} />}
          {Math.abs(delta)}%
        </span>
        <span className={styles.sub}>{sub}</span>
      </div>
    </Card>
  );
}

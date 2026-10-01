import { Database, FlaskConical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Source } from "@/lib/repos/db";
import styles from "./data-source-badge.module.css";

/**
 * Says plainly where the numbers came from. Without this, a page reading
 * demo data looks identical to one reading production — which is exactly how
 * someone ends up quoting a fake figure in a client meeting.
 */
export function DataSourceBadge({ source }: { source: Source }) {
  return source === "db" ? (
    <Badge variant="success" className={styles.badge}>
      <Database className={styles.icon} /> Live data
    </Badge>
  ) : (
    <Badge variant="warning" className={styles.badge}>
      <FlaskConical className={styles.icon} /> Demo data
    </Badge>
  );
}

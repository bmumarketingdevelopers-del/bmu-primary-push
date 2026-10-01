import { cn } from "@/lib/utils";
import styles from "./page-shell.module.css";

export function PageShell({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.shell}>
      <div className={styles.header}>
        <div>
          <h2 className={cn("display", styles.title)}>{title}</h2>
          {description && <p className={styles.description}>{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

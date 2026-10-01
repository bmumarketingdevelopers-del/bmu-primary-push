import { Topbar } from "@/components/dashboard/topbar";
import { PageShell } from "@/components/dashboard/page-shell";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApprovalActions } from "@/components/dashboard/approval-actions";
import { getClientApprovals } from "@/lib/repos/client";
import { getCurrentUser } from "@/lib/session";
import { formatDate } from "@/lib/utils";
import styles from "./page.module.css";

export default async function ApprovalsPage() {
  const user = await getCurrentUser();
  const APPROVALS = await getClientApprovals(user?.clientId);

  return (
    <>
      <Topbar title="Content approval" />
      <div className={styles.content}>
        <PageShell
          title="Content approval"
          description="Approve or send back anything scheduled to publish. Nothing goes live without a sign-off here."
        >
          <div className={styles.approvalGrid}>
            {APPROVALS.map((a) => (
              <Card key={a.id}>
                <CardHeader className={styles.approvalHeader}>
                  <div>
                    <CardTitle className={styles.approvalTitle}>{a.title}</CardTitle>
                    <p className={styles.approvalMeta}>
                      {a.type} · scheduled {formatDate(a.scheduledFor)}
                    </p>
                  </div>
                  <StatusBadge status={a.status} />
                </CardHeader>
                <CardContent>
                  <div className={styles.preview}>
                    Creative preview
                  </div>
                  <div className={styles.actions}>
                    <ApprovalActions item={{ id: a.id, title: a.title, status: a.status }} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </PageShell>
      </div>
    </>
  );
}

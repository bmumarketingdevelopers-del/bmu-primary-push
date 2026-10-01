import { AlertTriangle, Clock, MessageSquare, RefreshCw } from "lucide-react";
import { AdminTopbar } from "@/components/admin/topbar";
import { PageShell } from "@/components/dashboard/page-shell";
import { ReminderButton } from "@/components/admin/reminder-button";
import { EscalateDialog } from "@/components/admin/escalate-dialog";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getApprovals, getTeamMembers } from "@/lib/repos/agency";
import { formatDate, cn } from "@/lib/utils";
import styles from "./page.module.css";

type Approval = {
  id: string; title: string; client: string; type: string; owner: string;
  scheduledFor: string; status: string;
  sentAt?: string; revision?: number; comments?: number; escalatedTo?: string | null;
};

const daysSince = (iso?: string) =>
  iso ? Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000)) : 0;

export default async function AdminApprovalsPage() {
  const [queue, team] = await Promise.all([getApprovals(), getTeamMembers()]);
  const rows = queue as Approval[];

  const open = rows.filter((a) => a.status !== "APPROVED");
  const stuck = open.filter((a) => daysSince(a.sentAt) >= 4);
  const churning = open.filter((a) => (a.revision ?? 1) >= 3);
  const avgWait = open.length
    ? Math.round(open.reduce((s, a) => s + daysSince(a.sentAt), 0) / open.length)
    : 0;

  const owners = team.map((t) => ({ id: String(t.id), name: String(t.name) }));

  // Which client is actually the bottleneck, rather than which has most items.
  const byClient = Object.values(
    open.reduce<Record<string, { client: string; count: number; worst: number }>>((acc, a) => {
      const d = daysSince(a.sentAt);
      acc[a.client] ??= { client: a.client, count: 0, worst: 0 };
      acc[a.client].count += 1;
      acc[a.client].worst = Math.max(acc[a.client].worst, d);
      return acc;
    }, {})
  ).sort((a, b) => b.worst - a.worst);

  return (
    <>
      <AdminTopbar title="Approvals" />
      <div className={styles.page}>
        <PageShell
          title="Approval queue"
          description="Oversight, not submission. Creative is sent from the project it belongs to — this screen exists to find what's stuck and do something about it."
        >
          <div className={styles.statGrid}>
            <Card className={styles.statCard}>
              <p className={styles.statLabel}>Awaiting client</p>
              <p className={cn("display", styles.statValue)}>{open.length}</p>
            </Card>
            <Card className={cn(styles.statCard, stuck.length > 0 && styles.warningCard)}>
              <p className={styles.statLabel}>Waiting 4+ days</p>
              <p className={cn("display", styles.statValue)}>{stuck.length}</p>
            </Card>
            <Card className={cn(styles.statCard, churning.length > 0 && styles.dangerCard)}>
              <p className={styles.statLabel}>On revision 3+</p>
              <p className={cn("display", styles.statValue)}>{churning.length}</p>
            </Card>
            <Card className={styles.statCard}>
              <p className={styles.statLabel}>Average wait</p>
              <p className={cn("display", styles.statValue)}>{avgWait}d</p>
            </Card>
          </div>

          {churning.length > 0 && (
            <Card className={styles.dangerCard}>
              <CardHeader>
                <div className={styles.alert}>
                  <span className={styles.alertIcon}>
                    <RefreshCw className={styles.alertGlyph} strokeWidth={1.9} />
                  </span>
                  <div>
                    <CardTitle className={styles.calloutTitle}>
                      {churning.length} item{churning.length > 1 ? "s" : ""} past a third revision
                    </CardTitle>
                    <CardDescription className={styles.alertBody}>
                      Three rounds on the same piece usually means the brief was wrong, not the
                      creative. Another revision costs more than a fifteen-minute call — escalate
                      rather than resubmitting.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Who&apos;s holding things up</CardTitle>
              <CardDescription>
                Ranked by the longest wait, not the largest pile. One item sitting nine days is a
                worse signal than five items sent yesterday.
              </CardDescription>
            </CardHeader>
            <CardContent className={styles.clientList}>
              {byClient.map((c) => (
                <div key={c.client} className={styles.client}>
                  <div className={styles.clientRow}>
                    <span className={styles.clientName}>{c.client}</span>
                    <span className={styles.clientMeta}>
                      {c.count} waiting · oldest {c.worst}d
                    </span>
                  </div>
                  <Progress value={Math.min(100, c.worst * 12)} />
                </div>
              ))}
            </CardContent>
          </Card>

          <div className={styles.queue}>
            {rows.map((a) => {
              const waiting = daysSince(a.sentAt);
              const late = waiting >= 4;
              const revisions = a.revision ?? 1;

              return (
                <Card key={a.id} className={cn(late && a.status !== "APPROVED" && styles.warningCard)}>
                  <CardContent className={styles.itemContent}>
                    <div className={styles.itemHead}>
                      <div className={styles.itemInfo}>
                        <p className={styles.itemTitle}>{a.title}</p>
                        <p className={styles.itemMeta}>
                          {a.client} · {a.type} · owned by {a.owner}
                        </p>
                      </div>
                      <div className={styles.itemBadges}>
                        {revisions >= 3 && <Badge variant="destructive">Revision {revisions}</Badge>}
                        {revisions === 2 && <Badge variant="warning">Revision 2</Badge>}
                        <StatusBadge status={a.status} />
                      </div>
                    </div>

                    <div className={styles.itemFacts}>
                      <span className={cn(styles.fact, late && styles.factLate)}>
                        <Clock className={styles.factIcon} />
                        {a.sentAt ? `Sent ${formatDate(a.sentAt)} · ${waiting}d waiting` : "Not sent yet"}
                      </span>
                      <span>Publishes {formatDate(a.scheduledFor)}</span>
                      {(a.comments ?? 0) > 0 && (
                        <span className={styles.fact}>
                          <MessageSquare className={styles.factIcon} /> {a.comments} comments
                        </span>
                      )}
                      {a.escalatedTo && (
                        <span className={cn(styles.fact, styles.factEscalated)}>
                          <AlertTriangle className={styles.factIcon} /> With {a.escalatedTo}
                        </span>
                      )}
                    </div>

                    {a.status !== "APPROVED" && (
                      <div className={styles.itemActions}>
                        <ReminderButton id={a.id} />
                        <EscalateDialog
                          approval={{ id: a.id, title: a.title, client: a.client, daysWaiting: waiting }}
                          team={owners}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className={styles.noteCard}>
            <CardHeader>
              <CardTitle className={styles.calloutTitle}>Why there&apos;s no &ldquo;submit creative&rdquo; here</CardTitle>
              <CardDescription>
                Work is submitted from the project it belongs to, where the brief and the files
                already are. A separate submit button in the admin panel would let someone send a
                client something with no project behind it — which is how an asset gets published
                that nobody can trace back to a scope.
              </CardDescription>
            </CardHeader>
          </Card>
        </PageShell>
      </div>
    </>
  );
}

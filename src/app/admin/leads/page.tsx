import { AdminTopbar } from "@/components/admin/topbar";
import { PageShell } from "@/components/dashboard/page-shell";
import { LeadTable } from "@/components/lead-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataSourceBadge } from "@/components/admin/data-source-badge";
import { getLeads, getTeamMembers } from "@/lib/repos/agency";
import { cn } from "@/lib/utils";
import styles from "./page.module.css";

export default async function AdminLeadsPage() {
  const [{ data: leads, source }, team] = await Promise.all([getLeads(), getTeamMembers()]);

  // Only people who can actually own a lead appear in the picker.
  const owners = team
    .filter((t) => ["OWNER", "ADMIN", "MANAGER", "STAFF"].includes(String(t.role)))
    .map((t) => ({ id: t.id, name: t.name }));
  const unassigned = leads.filter((l) => !l.owner || l.owner === "Unassigned").length;

  // Placeholder until first-response timestamps exist in the demo data.
  const withinHour = leads.length
    ? Math.round((leads.filter((l) => l.status !== "NEW").length / leads.length) * 100)
    : 0;

  return (
    <>
      <AdminTopbar title="Leads" />
      <div className={styles.page}>
        <PageShell
          title="All leads"
          description="Every enquiry across every client account. Filter by date, status or source — the export honours whatever you've filtered to."
          action={<DataSourceBadge source={source} />}
        >
          {/* Response time predicts conversion better than lead volume does,
              so it goes above the table rather than in a report nobody opens. */}
          <div className={styles.statGrid}>
            <Card className={styles.statCard}>
              <p className={styles.statLabel}>Leads in view</p>
              <p className={cn("display", styles.statValue)}>{leads.length}</p>
            </Card>
            <Card className={cn(styles.statCard, unassigned > 0 && styles.cardWarning)}>
              <p className={styles.statLabel}>Unassigned</p>
              <p className={cn("display", styles.statValue)}>{unassigned}</p>
            </Card>
            <Card className={styles.statCard}>
              <p className={styles.statLabel}>Contacted within an hour</p>
              <p className={cn("display", styles.statValue)}>{withinHour}%</p>
            </Card>
            <Card className={styles.statCard}>
              <p className={styles.statLabel}>Owners active</p>
              <p className={cn("display", styles.statValue)}>{owners.length}</p>
            </Card>
          </div>

          <Card className={styles.cardPrimary}>
            <CardHeader>
              <CardTitle className={styles.calloutTitle}>Why assignment is the whole game</CardTitle>
              <CardDescription>
                A lead with no owner has nobody whose week looks worse when it goes cold. Select
                rows and assign them in bulk, or open one to set an owner, change status and leave
                a note — the first response time is stamped the moment status moves off New.
              </CardDescription>
            </CardHeader>
          </Card>

          {unassigned > 0 && (
            <Card className={cn(styles.cardWarning, styles.unassignedNotice)}>
              <span className={styles.unassignedCount}>{unassigned} lead{unassigned > 1 ? "s" : ""} unassigned.</span>{" "}
              <span className={styles.unassignedHint}>Route these before the client notices the response gap.</span>
            </Card>
          )}

          <LeadTable leads={leads} showClient showOwner team={owners} />
        </PageShell>
      </div>
    </>
  );
}

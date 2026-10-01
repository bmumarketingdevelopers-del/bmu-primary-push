import Link from "next/link";
import { AlertTriangle, PhoneCall, TrendingDown } from "lucide-react";
import { AdminTopbar } from "@/components/admin/topbar";
import { PageShell } from "@/components/dashboard/page-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TENANT_ACCOUNTS } from "@/lib/admin-data";
import { assessTenant, urgency, BAND_LABEL } from "@/lib/tenant-health";
import { cn, inr } from "@/lib/utils";
import styles from "./page.module.css";

const BAND_VARIANT = {
  HEALTHY: "success", WATCH: "warning", AT_RISK: "destructive", DORMANT: "destructive",
} as const;

const URGENCY_COPY = {
  "this-week": "Call this week",
  "this-month": "Call this month",
  "when-you-can": "Worth a call",
  none: "",
} as const;

export default function AccountHealthPage() {
  const assessed = TENANT_ACCOUNTS.map((a) => ({
    account: a,
    health: assessTenant(a),
    urgency: urgency(assessTenant(a), a.daysToRenewal),
  }));

  /**
   * Sorted by revenue at risk, not by score. A dormant free account and a
   * dormant ₹33,300 account are not the same problem.
   */
  const atRisk = assessed
    .filter((r) => r.health.band !== "HEALTHY")
    .sort((a, b) => {
      const urgencyRank = { "this-week": 0, "this-month": 1, "when-you-can": 2, none: 3 };
      const diff = urgencyRank[a.urgency] - urgencyRank[b.urgency];
      return diff !== 0 ? diff : b.account.mrr - a.account.mrr;
    });

  const revenueAtRisk = atRisk.reduce((t, r) => t + r.account.mrr, 0);
  const dormant = assessed.filter((r) => r.health.band === "DORMANT");
  const thisWeek = atRisk.filter((r) => r.urgency === "this-week");

  return (
    <>
      <AdminTopbar title="Account health" />
      <div className={styles.page}>
        <PageShell
          title="Account health"
          description="Churn shows up as silence months before it shows up as a cancellation. This finds the accounts that have gone quiet while there's still time to fix the placement."
        >
          <div className={styles.statGrid}>
            <Card className={styles.statCard}>
              <p className={styles.statLabel}>Accounts</p>
              <p className={cn("display", styles.statValue)}>{assessed.length}</p>
            </Card>
            <Card className={cn(styles.statCard, atRisk.length > 0 && styles.warningCard)}>
              <p className={styles.statLabel}>Need attention</p>
              <p className={cn("display", styles.statValue)}>{atRisk.length}</p>
            </Card>
            <Card className={cn(styles.statCard, dormant.length > 0 && styles.dangerCard)}>
              <p className={styles.statLabel}>Dormant</p>
              <p className={cn("display", styles.statValue)}>{dormant.length}</p>
              <p className={styles.statNote}>45+ days, no scans</p>
            </Card>
            <Card className={cn(styles.statCard, revenueAtRisk ? styles.dangerCard : undefined)}>
              <p className={styles.statLabel}>Monthly revenue at risk</p>
              <p className={cn("display", styles.statValue)}>{inr(revenueAtRisk)}</p>
            </Card>
          </div>

          {thisWeek.length > 0 && (
            <Card className={styles.dangerCard}>
              <CardHeader>
                <div className={styles.alert}>
                  <span className={styles.alertIcon}>
                    <PhoneCall className={styles.alertGlyph} strokeWidth={1.9} />
                  </span>
                  <div>
                    <CardTitle className={styles.calloutTitle}>
                      {thisWeek.length} {thisWeek.length === 1 ? "account renews" : "accounts renew"} within
                      30 days and {thisWeek.length === 1 ? "isn't" : "aren't"} healthy
                    </CardTitle>
                    <CardDescription className={styles.alertBody}>
                      {thisWeek.map((r) => r.account.name).join(", ")}. A quiet account is
                      recoverable when someone calls and moves the standee. It isn&apos;t
                      recoverable after the renewal date passes.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          )}

          <div className={styles.accountList}>
            {atRisk.map(({ account, health, urgency: u }) => (
              <Card key={account.id} className={cn(health.band === "DORMANT" && styles.dangerCard)}>
                <CardContent className={styles.accountBody}>
                  <div className={styles.accountHead}>
                    <div className={styles.accountInfo}>
                      <p className={styles.accountName}>
                        {account.name}
                        <Badge variant={BAND_VARIANT[health.band]}>{BAND_LABEL[health.band]}</Badge>
                        {u !== "none" && <Badge variant="outline">{URGENCY_COPY[u]}</Badge>}
                      </p>
                      <p className={styles.accountMeta}>
                        {account.city} · {account.plan} · {inr(account.mrr)}/mo · renews in{" "}
                        {account.daysToRenewal > 365 ? "—" : `${account.daysToRenewal} days`}
                      </p>
                    </div>

                    <div className={styles.score}>
                      <p className={cn("display", styles.scoreValue)}>{health.score}</p>
                      <p className={styles.scoreLabel}>health</p>
                    </div>
                  </div>

                  <div className={styles.scoreBar}>
                    <Progress value={health.score} />
                  </div>

                  <ul className={styles.signals}>
                    {health.signals
                      .filter((s) => s.triggered)
                      .sort((a, b) => b.weight - a.weight)
                      .map((s) => (
                        <li key={s.key} className={styles.signal}>
                          <AlertTriangle className={styles.signalIcon} />
                          <span>
                            <span className={styles.signalLabel}>{s.label}</span>
                            <span className={styles.signalAction}>{s.action}</span>
                          </span>
                        </li>
                      ))}
                  </ul>

                  <div className={styles.accountActions}>
                    <Button asChild variant="outline" size="sm">
                      <a href={`/b/${account.slug}`} target="_blank" rel="noreferrer">
                        See their profile
                      </a>
                    </Button>
                    <Button asChild variant="ghost" size="sm">
                      <Link href="/admin/businesses">Open account</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className={styles.tableCard}>
            <CardHeader>
              <CardTitle className={styles.tableTitle}>
                <TrendingDown className={styles.tableTitleIcon} /> Every account
              </CardTitle>
              <CardDescription>Sorted by health, worst first.</CardDescription>
            </CardHeader>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Business</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead className={styles.numericHead}>Last scan</TableHead>
                  <TableHead className={styles.numericHead}>Scans (30d)</TableHead>
                  <TableHead className={styles.healthHead}>Health</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...assessed]
                  .sort((a, b) => a.health.score - b.health.score)
                  .map(({ account, health }) => (
                    <TableRow key={account.id}>
                      <TableCell>
                        <span className={styles.businessName}>{account.name}</span>
                        <span className={styles.businessCity}>{account.city}</span>
                      </TableCell>
                      <TableCell className={styles.mutedCell}>{account.plan}</TableCell>
                      <TableCell
                        className={cn(
                          styles.lastScanCell,
                          account.daysSinceLastScan >= 14 ? styles.lastScanStale : styles.lastScanRecent
                        )}
                      >
                        {account.daysSinceLastScan === 0 ? "today" : `${account.daysSinceLastScan}d ago`}
                      </TableCell>
                      <TableCell className={styles.numericCell}>{account.scansLast30.toLocaleString("en-IN")}</TableCell>
                      <TableCell>
                        <Progress value={health.score} />
                        <span className={styles.scoreCaption}>{health.score}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={BAND_VARIANT[health.band]}>{BAND_LABEL[health.band]}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </Card>

          <Card className={styles.noteCard}>
            <CardHeader>
              <CardTitle className={styles.calloutTitle}>Why recency outweighs volume</CardTitle>
              <CardDescription>
                A small shop scanning twice a week is healthy. A restaurant that did four thousand
                scans last quarter and none this month is not — and the volume number would have
                told you it was the best account you had. Days since the last scan carries the
                heaviest weight for that reason.
              </CardDescription>
            </CardHeader>
          </Card>
        </PageShell>
      </div>
    </>
  );
}

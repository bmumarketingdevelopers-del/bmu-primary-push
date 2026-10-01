import { AdminTopbar } from "@/components/admin/topbar";
import { PageShell } from "@/components/dashboard/page-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { ApplicationTrendChart } from "@/components/admin/section-charts";
import {
  APPLICATION_CATEGORIES, APPLICATION_SOURCES, APPLICATION_TREND,
} from "@/lib/admin-data";
import { cn, compactNumber, formatDate, inr } from "@/lib/utils";
import styles from "./page.module.css";

/** Demo queue. Replace with prisma.creatorApplication.findMany() once the DB is live. */
const APPLICATIONS = [
  { id: "CA-31", name: "Rhea D'Souza", handle: "@liftwithrhea", platform: "Instagram", city: "Bengaluru", categories: ["Fitness"], followers: 71000, rateCard: 1_60_000, status: "NEW", createdAt: "2026-08-06" },
  { id: "CA-30", name: "Sameer Ali", handle: "@motorsandmore", platform: "YouTube", city: "Hubballi", categories: ["Automobile", "Tech"], followers: 129000, rateCard: 2_80_000, status: "REVIEWING", createdAt: "2026-08-05" },
  { id: "CA-29", name: "Tanvi Hegde", handle: "@coastalplate", platform: "Instagram", city: "Mangaluru", categories: ["Food", "Travel"], followers: 48000, rateCard: 1_20_000, status: "NEW", createdAt: "2026-08-04" },
  { id: "CA-27", name: "Aarav Menon", handle: "@aaravbuilds", platform: "Both", city: "Bengaluru", categories: ["Interiors"], followers: 22000, rateCard: 80_000, status: "ACCEPTED", createdAt: "2026-08-01" },
  { id: "CA-25", name: "Priyanka N.", handle: "@glowbypriyanka", platform: "Instagram", city: "Chennai", categories: ["Beauty"], followers: 310000, rateCard: 8_50_000, status: "DECLINED", createdAt: "2026-07-29" },
];

const VARIANT = {
  NEW: "info", REVIEWING: "warning", ACCEPTED: "success", DECLINED: "outline",
} as const;

export default function AdminApplicationsPage() {
  const pending = APPLICATIONS.filter((a) => a.status === "NEW").length;

  return (
    <>
      <AdminTopbar title="Creator applications" />
      <div className={styles.page}>
        <PageShell
          title="Creator applications"
          description="Submissions from /join. Reach claims are worth spot-checking — inflated numbers surface at the first campaign report, by which point a brand has already paid."
        >
          {(() => {
            const received = APPLICATION_TREND.reduce((t, m) => t + m.received, 0);
            const approved = APPLICATION_TREND.reduce((t, m) => t + m.approved, 0);
            const rate = Math.round((approved / received) * 100);
            const best = [...APPLICATION_SOURCES].sort((a, b) => b.approvedPct - a.approvedPct)[0];
            const worst = [...APPLICATION_SOURCES].sort((a, b) => a.approvedPct - b.approvedPct)[0];

            return (
              <>
                <div className={styles.statGrid}>
                  <Card className={styles.statCard}>
                    <p className={styles.statLabel}>Applications, 5 months</p>
                    <p className={cn("display", styles.statValue)}>{received}</p>
                  </Card>
                  <Card className={styles.statCard}>
                    <p className={styles.statLabel}>Approved</p>
                    <p className={cn("display", styles.statValue)}>{approved}</p>
                  </Card>
                  <Card className={styles.statCard}>
                    <p className={styles.statLabel}>Acceptance rate</p>
                    <p className={cn("display", styles.statValue)}>{rate}%</p>
                  </Card>
                  <Card className={styles.statCard}>
                    <p className={styles.statLabel}>Awaiting review</p>
                    <p className={cn("display", styles.statValue)}>
                      {APPLICATIONS.filter((a) => ["NEW", "REVIEWING"].includes(a.status)).length}
                    </p>
                  </Card>
                </div>

                <Card className={styles.highlightCard}>
                  <CardHeader>
                    <CardTitle className={styles.calloutTitle}>
                      {best.source} converts at {best.approvedPct}%, {worst.source} at {worst.approvedPct}%
                    </CardTitle>
                    <CardDescription>
                      Volume and quality run in opposite directions here. Paid ads bring the most
                      applications and the fewest usable creators — worth spending that budget on
                      referral incentives instead, which convert nearly seven times better.
                    </CardDescription>
                  </CardHeader>
                </Card>

                <div className={styles.chartGrid}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Received against approved</CardTitle>
                      <CardDescription>
                        Applications climbing while approvals stay flat means the funnel is
                        widening, not improving.
                      </CardDescription>
                    </CardHeader>
                    <CardContent><ApplicationTrendChart /></CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Where they come from</CardTitle>
                      <CardDescription>Ranked by volume, with the acceptance rate beside it.</CardDescription>
                    </CardHeader>
                    <CardContent className={styles.sourceList}>
                      {APPLICATION_SOURCES.map((src) => (
                        <div key={src.source} className={styles.source}>
                          <div className={styles.sourceRow}>
                            <span>{src.source}</span>
                            <span className={styles.sourceMeta}>
                              {src.count} · <strong className={styles.sourceRate}>{src.approvedPct}%</strong> approved
                            </span>
                          </div>
                          <Progress value={src.approvedPct} />
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Categories applying</CardTitle>
                    <CardDescription>
                      Useful when a brand asks whether you can staff a campaign in their sector.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className={styles.categoryList}>
                    {APPLICATION_CATEGORIES.map((c) => (
                      <span key={c.category} className={styles.categoryChip}>
                        {c.category} <strong className={styles.categoryCount}>{c.count}</strong>
                      </span>
                    ))}
                  </CardContent>
                </Card>
              </>
            );
          })()}

          {pending > 0 && (
            <Card className={styles.pendingNotice}>
              <span className={styles.pendingCount}>{pending} new application{pending > 1 ? "s" : ""}.</span>{" "}
              <span className={styles.pendingNote}>We promised a reply within a week on the public page.</span>
            </Card>
          )}

          <Card className={styles.tableCard}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Creator</TableHead>
                  <TableHead>Platform</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Categories</TableHead>
                  <TableHead className={styles.numericHead}>Followers</TableHead>
                  <TableHead className={styles.numericHead}>Rate</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applied</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {APPLICATIONS.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell>
                      <span className={styles.handle}>{a.handle}</span>
                      <span className={styles.creatorName}>{a.name}</span>
                    </TableCell>
                    <TableCell className={styles.mutedCell}>{a.platform}</TableCell>
                    <TableCell className={styles.mutedCell}>{a.city}</TableCell>
                    <TableCell>
                      <div className={styles.categoryBadges}>
                        {a.categories.map((c) => <Badge key={c} variant="secondary">{c}</Badge>)}
                      </div>
                    </TableCell>
                    <TableCell className={styles.followersCell}>{compactNumber(a.followers)}</TableCell>
                    <TableCell className={styles.rateCell}>{inr(a.rateCard)}</TableCell>
                    <TableCell>
                      <Badge variant={VARIANT[a.status as keyof typeof VARIANT]}>
                        {a.status.toLowerCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className={styles.dateCell}>
                      {formatDate(a.createdAt)}
                    </TableCell>
                    <TableCell className={styles.actionCell}>
                      <Button variant="ghost" size="sm" disabled={a.status !== "NEW"}>Review</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </PageShell>
      </div>
    </>
  );
}

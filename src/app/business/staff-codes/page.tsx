import { AlertTriangle, Award, QrCode, TrendingUp } from "lucide-react";
import { BusinessTopbar } from "@/components/business/topbar";
import { PageShell } from "@/components/dashboard/page-shell";
import { EntityDialog } from "@/components/admin/entity-dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { STAFF_SCORES } from "@/lib/business-data";
import { cn } from "@/lib/utils";
import styles from "./page.module.css";

export default function StaffCodesPage() {
  const active = STAFF_SCORES.filter((s) => s.isActive);
  const ranked = [...active].sort((a, b) => b.positive - a.positive);

  const totalReviews = active.reduce((t, s) => t + s.reviews, 0);
  const totalScans = active.reduce((t, s) => t + s.scans, 0);
  const best = ranked[0];
  const topScans = Math.max(...active.map((s) => s.scans));

  /**
   * Conversion matters more than raw review count — someone who scans 341
   * times for 38 reviews is asking badly, not working less.
   */
  const rate = (s: (typeof active)[number]) =>
    s.scans ? Math.round((s.reviews / s.scans) * 100) : 0;

  const struggling = active.filter((s) => rate(s) < 15 && s.scans > 150);
  const complaints = active.filter((s) => s.negative >= 5);

  return (
    <>
      <BusinessTopbar title="Staff codes" />
      <div className={styles.page}>
        <PageShell
          title="Staff codes"
          description="One code per person, printed on their badge. Every scan, review and repeat visit is attributed — which is what lets you run an incentive on it."
          action={<EntityDialog entity="staffCode" label="Add a person" />}
        >
          <div className={styles.statGrid}>
            <Card className={styles.statCard}>
              <p className={styles.statLabel}>Codes in use</p>
              <p className={cn("display", styles.statValue)}>{active.length}</p>
            </Card>
            <Card className={styles.statCard}>
              <p className={styles.statLabel}>Attributed reviews</p>
              <p className={cn("display", styles.statValue)}>{totalReviews}</p>
            </Card>
            <Card className={styles.statCard}>
              <p className={styles.statLabel}>Scans</p>
              <p className={cn("display", styles.statValue)}>{totalScans.toLocaleString("en-IN")}</p>
            </Card>
            <Card className={styles.statCard}>
              <p className={styles.statLabel}>Leading</p>
              <p className={cn("display", styles.leaderValue)}>{best.name.split(" ")[0]}</p>
              <p className={styles.leaderNote}>{best.positive} positive reviews</p>
            </Card>
          </div>

          {complaints.length > 0 && (
            <Card className={styles.complaintsCard}>
              <CardHeader>
                <div className={styles.alertRow}>
                  <span className={styles.alertIcon}>
                    <AlertTriangle className={styles.alertGlyph} strokeWidth={1.9} />
                  </span>
                  <div>
                    <CardTitle className={styles.calloutTitle}>
                      {complaints.map((c) => c.name.split(" ")[0]).join(" and ")} attracting complaints
                    </CardTitle>
                    <CardDescription className={styles.alertDescription}>
                      Worth a conversation before it shows up in your public rating. A leaderboard
                      that only showed positives would hide exactly this.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          )}

          {struggling.length > 0 && (
            <Card className={styles.strugglingCard}>
              <CardHeader>
                <CardTitle className={styles.calloutTitle}>
                  {struggling.map((s) => s.name.split(" ")[0]).join(", ")} — plenty of scans, few reviews
                </CardTitle>
                <CardDescription>
                  High scan counts with low conversion usually means the ask is happening at the
                  wrong moment, not that the service was worse. Ask while the customer is still
                  seated, not at the door.
                </CardDescription>
              </CardHeader>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className={styles.iconTitle}>
                <Award className={styles.titleIcon} /> This month
              </CardTitle>
              <CardDescription>Ranked by positive reviews, with the complaint count beside it.</CardDescription>
            </CardHeader>
            <CardContent className={styles.leaderboard}>
              {ranked.map((s, i) => (
                <div key={s.id} className={styles.rank}>
                  <div className={styles.rankRow}>
                    <span className={styles.rankPerson}>
                      <span
                        className={cn(
                          styles.position,
                          i === 0 ? styles.positionFirst : styles.positionOther
                        )}
                      >
                        {i + 1}
                      </span>
                      <span className={styles.rankName}>{s.name}</span>
                      <span className={styles.muted}>{s.role}</span>
                    </span>
                    <span className={styles.muted}>
                      <strong className={styles.positiveCount}>{s.positive}</strong> positive
                      {s.negative > 0 && (
                        <> · <strong className={styles.complaintCount}>{s.negative}</strong> complaints</>
                      )}
                    </span>
                  </div>
                  <Progress value={Math.round((s.positive / ranked[0].positive) * 100)} />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className={styles.tableCard}>
            <CardHeader>
              <CardTitle className={styles.iconTitle}>
                <TrendingUp className={styles.titleIcon} /> Full breakdown
              </CardTitle>
            </CardHeader>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Person</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead className={styles.scansHead}>Scans</TableHead>
                  <TableHead className={styles.numericHead}>Reviews</TableHead>
                  <TableHead className={styles.numericHead}>Conversion</TableHead>
                  <TableHead className={styles.numericHead}>Repeat</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {STAFF_SCORES.map((s) => (
                  <TableRow key={s.id} className={cn(!s.isActive && styles.inactiveRow)}>
                    <TableCell>
                      <span className={styles.personName}>{s.name}</span>
                      <span className={styles.personRole}>{s.role}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={styles.codeBadge}>{s.code}</Badge>
                    </TableCell>
                    <TableCell>
                      <Progress value={Math.round((s.scans / topScans) * 100)} />
                      <span className={styles.scanCount}>
                        {s.scans.toLocaleString("en-IN")}
                      </span>
                    </TableCell>
                    <TableCell className={styles.numericCell}>{s.reviews}</TableCell>
                    <TableCell className={cn(styles.conversionCell, rate(s) < 15 && styles.lowConversion)}>
                      {rate(s)}%
                    </TableCell>
                    <TableCell className={styles.numericCell}>{s.repeatCustomers}</TableCell>
                    <TableCell className={styles.numericCell}>
                      <Button asChild variant="ghost" size="sm">
                        <a href={`/api/qr/${s.code.toLowerCase()}?f=png&d=1`}>
                          <QrCode /> Badge
                        </a>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          <Card className={styles.noteCard}>
            <CardHeader>
              <CardTitle className={styles.calloutTitle}>Running an incentive on this</CardTitle>
              <CardDescription>
                Pay on <strong>positive reviews minus complaints</strong>, not on scan count.
                Paying per scan rewards whoever asks most often; paying per review rewards
                whoever asks at the right moment. And never pay customers — offering anything in
                exchange for a review breaches Google&apos;s policy and puts every review on the
                listing at risk.
              </CardDescription>
            </CardHeader>
          </Card>
        </PageShell>
      </div>
    </>
  );
}

import { CreatorTopbar } from "@/components/creator/topbar";
import { PageShell } from "@/components/dashboard/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PAYOUTS } from "@/lib/creator-data";
import { cn, formatDate, inr } from "@/lib/utils";
import styles from "./page.module.css";

export default function CreatorPayoutsPage() {
  const pending = PAYOUTS.filter((p) => p.status === "PENDING").reduce((s, p) => s + p.net, 0);
  const paid = PAYOUTS.filter((p) => p.status === "PAID").reduce((s, p) => s + p.net, 0);

  return (
    <>
      <CreatorTopbar title="Payouts" />
      <div className={styles.content}>
        <PageShell
          title="Payouts"
          description="Payouts run on the 3rd of each month for work approved in the previous month. TDS is deducted at 10% and the certificate is issued quarterly."
        >
          <div className={styles.statGrid}>
            <Card className={styles.statCard}>
              <p className={styles.statLabel}>Due to you</p>
              <p className={cn("display", styles.statValue, styles.statValueDue)}>{inr(pending)}</p>
            </Card>
            <Card className={styles.statCard}>
              <p className={styles.statLabel}>Paid to date</p>
              <p className={cn("display", styles.statValue)}>{inr(paid)}</p>
            </Card>
          </div>

          <Card className={styles.tableCard}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Period</TableHead>
                  <TableHead className={styles.numericHead}>Bookings</TableHead>
                  <TableHead className={styles.numericHead}>Gross</TableHead>
                  <TableHead className={styles.numericHead}>TDS (10%)</TableHead>
                  <TableHead className={styles.numericHead}>Net</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Paid on</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {PAYOUTS.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className={styles.periodCell}>{p.period}</TableCell>
                    <TableCell className={styles.bookingsCell}>{p.bookings}</TableCell>
                    <TableCell className={styles.grossCell}>{inr(p.gross)}</TableCell>
                    <TableCell className={styles.tdsCell}>
                      −{inr(p.tds)}
                    </TableCell>
                    <TableCell className={styles.netCell}>{inr(p.net)}</TableCell>
                    <TableCell>
                      <Badge variant={p.status === "PAID" ? "success" : "warning"}>
                        {p.status.toLowerCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className={styles.paidOnCell}>
                      {p.paidAt ? formatDate(p.paidAt) : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          <Card>
            <CardHeader><CardTitle className={styles.notesTitle}>How this works</CardTitle></CardHeader>
            <CardContent className={styles.notes}>
              <p>A booking becomes payable once the brand marks the deliverable approved, not when you post it.</p>
              <p>Anything approved after the 25th rolls into the following month&apos;s payout.</p>
              <p>TDS is deducted at 10% against your PAN. Update it in your profile if it changes.</p>
            </CardContent>
          </Card>
        </PageShell>
      </div>
    </>
  );
}

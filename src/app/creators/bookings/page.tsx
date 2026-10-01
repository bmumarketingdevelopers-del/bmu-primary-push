import { CreatorTopbar } from "@/components/creator/topbar";
import { PageShell } from "@/components/dashboard/page-shell";
import { BookingStatus } from "@/components/creator/booking-status";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BOOKINGS } from "@/lib/creator-data";
import { cn, formatDate, inr } from "@/lib/utils";
import styles from "./page.module.css";

export default function CreatorBookingsPage() {
  const earned = BOOKINGS.filter((b) => ["APPROVED", "PAID"].includes(b.status))
    .reduce((s, b) => s + b.fee, 0);

  return (
    <>
      <CreatorTopbar title="Bookings" />
      <div className={styles.content}>
        <PageShell
          title="Bookings"
          description="Every campaign you've been booked on. A fee is locked when you accept a brief — it doesn't change after delivery."
        >
          <div className={styles.statGrid}>
            <Card className={styles.statCard}>
              <p className={styles.statLabel}>Approved or paid</p>
              <p className={cn("display", styles.statValue)}>{inr(earned)}</p>
            </Card>
            <Card className={styles.statCard}>
              <p className={styles.statLabel}>Total bookings</p>
              <p className={cn("display", styles.statValue)}>{BOOKINGS.length}</p>
            </Card>
            <Card className={styles.statCard}>
              <p className={styles.statLabel}>Brands worked with</p>
              <p className={cn("display", styles.statValue)}>
                {new Set(BOOKINGS.map((b) => b.brand)).size}
              </p>
            </Card>
          </div>

          <Card className={styles.tableCard}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Deliverables</TableHead>
                  <TableHead className={styles.feeHead}>Fee</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Due</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {BOOKINGS.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell>
                      <span className={styles.campaign}>{b.campaign}</span>
                      <span className={styles.bookingId}>{b.id}</span>
                    </TableCell>
                    <TableCell><Badge variant="outline">{b.brand}</Badge></TableCell>
                    <TableCell className={styles.deliverablesCell}>{b.deliverables}</TableCell>
                    <TableCell className={styles.feeCell}>{inr(b.fee)}</TableCell>
                    <TableCell><BookingStatus status={b.status} /></TableCell>
                    <TableCell className={styles.dueCell}>{formatDate(b.dueAt)}</TableCell>
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

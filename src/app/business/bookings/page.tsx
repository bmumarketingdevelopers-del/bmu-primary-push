import { CalendarCheck, MessageCircle, Phone } from "lucide-react";
import { BusinessTopbar } from "@/components/business/topbar";
import { PageShell } from "@/components/dashboard/page-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BOOKINGS } from "@/lib/business-data";
import { prettyTime } from "@/lib/booking";
import { whatsappUrl } from "@/lib/qr-platform";
import { cn } from "@/lib/utils";
import styles from "./page.module.css";

const STATUS = {
  PENDING: "warning", CONFIRMED: "success", COMPLETED: "secondary",
  CANCELLED: "outline", NO_SHOW: "destructive",
} as const;

const dayLabel = (iso: string) =>
  new Date(`${iso}:00`).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });

export default function BusinessBookingsPage() {
  const upcoming = BOOKINGS.filter((b) => ["PENDING", "CONFIRMED"].includes(b.status));
  const grouped = upcoming.reduce<Record<string, typeof BOOKINGS>>((acc, b) => {
    const day = b.startsAt.slice(0, 10);
    (acc[day] ??= []).push(b);
    return acc;
  }, {});
  const noShows = BOOKINGS.filter((b) => b.status === "NO_SHOW").length;

  return (
    <>
      <BusinessTopbar title="Bookings" />
      <div className={styles.page}>
        <PageShell
          title="Bookings"
          description="Taken from your profile, QR codes and WhatsApp. Slots are held the moment someone confirms, so nobody can book over them."
        >
          <div className={styles.statGrid}>
            <Card className={styles.statCard}>
              <p className={styles.statLabel}>Upcoming</p>
              <p className={cn("display", styles.statValue)}>{upcoming.length}</p>
            </Card>
            <Card className={styles.statCard}>
              <p className={styles.statLabel}>Awaiting confirmation</p>
              <p className={cn("display", styles.statValue)}>
                {BOOKINGS.filter((b) => b.status === "PENDING").length}
              </p>
            </Card>
            <Card className={styles.statCard}>
              <p className={styles.statLabel}>Completed this week</p>
              <p className={cn("display", styles.statValue)}>
                {BOOKINGS.filter((b) => b.status === "COMPLETED").length}
              </p>
            </Card>
            <Card className={noShows ? cn(styles.noShowCard, styles.statCard) : styles.statCard}>
              <p className={styles.statLabel}>No-shows</p>
              <p className={cn("display", styles.statValue)}>{noShows}</p>
            </Card>
          </div>

          {noShows > 0 && (
            <Card className={styles.depositCard}>
              <CardHeader>
                <CardTitle className={styles.depositTitle}>Cut no-shows with a deposit</CardTitle>
                <CardDescription>
                  Requiring a small deposit on long services removes most of them. Set it per service
                  under Profile, and the payment link is sent automatically.
                </CardDescription>
              </CardHeader>
            </Card>
          )}

          {Object.entries(grouped).map(([day, items]) => (
            <div key={day} className={styles.dayGroup}>
              <h3 className={cn("display", styles.dayTitle)}>
                <CalendarCheck className={styles.dayIcon} />
                {dayLabel(`${day}T00:00`)}
              </h3>
              <Card className={styles.tableCard}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Time</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>With</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items
                      .sort((a, b) => a.startsAt.localeCompare(b.startsAt))
                      .map((b) => (
                        <TableRow key={b.reference}>
                          <TableCell className={styles.timeCell}>
                            <span className={styles.time}>{prettyTime(b.startsAt.slice(11, 16))}</span>
                            <span className={styles.subline}>{b.duration} min</span>
                          </TableCell>
                          <TableCell>
                            <span className={styles.customer}>{b.customer}</span>
                            <span className={styles.reference}>{b.reference}</span>
                          </TableCell>
                          <TableCell className={styles.mutedCell}>{b.service}</TableCell>
                          <TableCell className={styles.staffCell}>{b.staff}</TableCell>
                          <TableCell>
                            <Badge variant={STATUS[b.status]}>{b.status.replace("_", " ").toLowerCase()}</Badge>
                          </TableCell>
                          <TableCell className={styles.actionsCell}>
                            <Button asChild variant="ghost" size="sm">
                              <a href={whatsappUrl(b.phone, `Hi ${b.customer}, confirming your ${b.service} booking.`)} target="_blank" rel="noreferrer">
                                <MessageCircle /> Remind
                              </a>
                            </Button>
                            <Button asChild variant="ghost" size="sm">
                              <a href={`tel:${b.phone.replace(/\s/g, "")}`}><Phone /> Call</a>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </Card>
            </div>
          ))}

          <Card className={styles.tableCard}>
            <CardHeader><CardTitle>Past bookings</CardTitle></CardHeader>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>When</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {BOOKINGS.filter((b) => !["PENDING", "CONFIRMED"].includes(b.status)).map((b) => (
                  <TableRow key={b.reference}>
                    <TableCell className={styles.referenceCell}>{b.reference}</TableCell>
                    <TableCell className={styles.customerCell}>{b.customer}</TableCell>
                    <TableCell className={styles.mutedCell}>{b.service}</TableCell>
                    <TableCell className={styles.whenCell}>
                      {dayLabel(b.startsAt)} · {prettyTime(b.startsAt.slice(11, 16))}
                    </TableCell>
                    <TableCell>
                      <Badge variant={STATUS[b.status]}>{b.status.replace("_", " ").toLowerCase()}</Badge>
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

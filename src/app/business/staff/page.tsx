import { Plus } from "lucide-react";
import { BusinessTopbar } from "@/components/business/topbar";
import { EntityDialog } from "@/components/admin/entity-dialog";
import { PageShell } from "@/components/dashboard/page-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RowActions } from "@/components/admin/row-actions";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { STAFF_ROSTER } from "@/lib/business-data";
import { DEMO_SERVICES } from "@/lib/booking";
import { initials, inr } from "@/lib/utils";
import styles from "./page.module.css";

export default function BusinessStaffPage() {
  const services = DEMO_SERVICES["abc-salon"];

  return (
    <>
      <BusinessTopbar title="Staff & services" />
      <div className={styles.page}>
        <PageShell
          title="Staff & services"
          description="Working hours decide which slots customers can see. Change a shift and the booking page updates on the next load."
          action={<EntityDialog entity="profileService" label="Add service" />}
        >
          <div className={styles.staffGrid}>
            {STAFF_ROSTER.map((s) => (
              <Card key={s.id}>
                <CardHeader>
                  <div className={styles.person}>
                    <Avatar className={styles.avatar}>
                      <AvatarFallback>{initials(s.name)}</AvatarFallback>
                    </Avatar>
                    <div className={styles.personText}>
                      <CardTitle className={styles.personName}>{s.name}</CardTitle>
                      <p className={styles.personRole}>{s.role}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <dl className={styles.schedule}>
                    <div className={styles.scheduleRow}>
                      <dt className={styles.scheduleLabel}>Days</dt>
                      <dd className={styles.scheduleValue}>{s.days}</dd>
                    </div>
                    <div className={styles.scheduleRow}>
                      <dt className={styles.scheduleLabel}>Hours</dt>
                      <dd className={styles.scheduleValue}>{s.hours}</dd>
                    </div>
                    <div className={styles.scheduleRow}>
                      <dt className={styles.scheduleLabel}>Break</dt>
                      <dd className={styles.scheduleValue}>{s.breakAt}</dd>
                    </div>
                    <div className={styles.scheduleRow}>
                      <dt className={styles.scheduleLabel}>Booked this week</dt>
                      <dd className={styles.scheduleValue}>{s.bookingsThisWeek}</dd>
                    </div>
                  </dl>
                  <div className={styles.staffFooter}>
                    <Badge variant={s.isBookable ? "success" : "outline"}>
                      {s.isBookable ? "Bookable" : "Hidden"}
                    </Badge>
                    <Button variant="ghost" size="sm" className={styles.editButton} disabled title="Not built yet">Edit hours</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Bookable services</CardTitle>
              <CardDescription>
                Duration sets the slot length. The buffer blocks cleanup time after each appointment,
                so back-to-back bookings don&apos;t collide.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className={styles.serviceList}>
                {services.map((s) => (
                  <div key={s.id} className={styles.service}>
                    <div className={styles.serviceText}>
                      <p className={styles.serviceName}>{s.name}</p>
                      <p className={styles.serviceMeta}>
                        {s.duration} min
                        {s.bufferAfter ? ` + ${s.bufferAfter} min buffer` : ""}
                        {s.depositAmount ? ` · ${inr(s.depositAmount)} deposit` : ""}
                      </p>
                    </div>
                    <div className={styles.serviceActions}>
                      {s.price && <span className={styles.servicePrice}>{inr(s.price)}</span>}
                      <RowActions entity="profileService" record={s as unknown as Record<string, unknown>} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </PageShell>
      </div>
    </>
  );
}

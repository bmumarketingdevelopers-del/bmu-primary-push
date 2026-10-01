import Link from "next/link";
import { ChefHat, Clock, Utensils } from "lucide-react";
import { BusinessTopbar } from "@/components/business/topbar";
import { PageShell } from "@/components/dashboard/page-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdvanceOrderButton } from "@/components/business/order-actions";
import { KITCHEN_ORDERS, MENU_STATS } from "@/lib/business-data";
import { inr, cn } from "@/lib/utils";
import styles from "./page.module.css";

const COLUMNS = [
  { status: "PLACED", label: "New", next: "Accept" },
  { status: "PREPARING", label: "Cooking", next: "Mark ready" },
  { status: "READY", label: "Ready", next: "Mark served" },
  { status: "SERVED", label: "Served", next: "Close bill" },
] as const;

export default function BusinessOrdersPage() {
  return (
    <>
      <BusinessTopbar title="Orders" />
      <div className={styles.page}>
        <PageShell
          title="Live orders"
          description="Everything ordered from a table QR or takeaway link. Move a ticket across as the kitchen works — the customer sees the same status."
        >
          <div className={styles.statGrid}>
            <Card className={styles.statCard}>
              <p className={styles.statLabel}>Sales today</p>
              <p className={cn("display", styles.statValue)}>{inr(MENU_STATS.salesToday)}</p>
            </Card>
            <Card className={styles.statCard}>
              <p className={styles.statLabel}>Orders</p>
              <p className={cn("display", styles.statValue)}>{MENU_STATS.ordersToday}</p>
            </Card>
            <Card className={styles.statCard}>
              <p className={styles.statLabel}>Average order</p>
              <p className={cn("display", styles.statValue)}>{inr(MENU_STATS.averageOrder)}</p>
            </Card>
            <Card className={styles.statCard}>
              <p className={styles.statLabel}>Peak hour</p>
              <p className={cn("display", styles.statValue)}>{MENU_STATS.peakHour}</p>
            </Card>
          </div>

          <div className={styles.board}>
            {COLUMNS.map((col) => {
              const items = KITCHEN_ORDERS.filter((o) => o.status === col.status);
              return (
                <div key={col.status} className={styles.column}>
                  <div className={styles.columnHead}>
                    <h3 className={cn("display", styles.columnTitle)}>{col.label}</h3>
                    <Badge variant={col.status === "PLACED" ? "warning" : "outline"}>{items.length}</Badge>
                  </div>

                  {items.map((o) => (
                    <Card
                      key={o.reference}
                      className={cn(
                        styles.ticket,
                        col.status === "PLACED" && styles.ticketNew,
                        o.minutesAgo > 15 && col.status !== "SERVED" && styles.ticketLate
                      )}
                    >
                      <div className={styles.ticketHead}>
                        <div>
                          <p className={cn("display", styles.ticketRef)}>{o.reference}</p>
                          <p className={styles.ticketMeta}>
                            {o.table ?? "Takeaway"} · {o.placedAt}
                          </p>
                        </div>
                        <span
                          className={cn(
                            styles.age,
                            o.minutesAgo > 15 ? styles.ageLate : styles.ageOnTime
                          )}
                        >
                          <Clock className={styles.ageIcon} />
                          {o.minutesAgo}m
                        </span>
                      </div>

                      <ul className={styles.lines}>
                        {o.lines.map((l) => (
                          <li key={l.name}>
                            <span className={styles.quantity}>{l.quantity}×</span> {l.name}
                            {l.note && (
                              <span className={styles.lineNote}>{l.note}</span>
                            )}
                          </li>
                        ))}
                      </ul>

                      <div className={styles.ticketFoot}>
                        <span className={styles.total}>{inr(o.total)}</span>
                        <Badge variant={o.isPaid ? "success" : "outline"}>
                          {o.isPaid ? "Paid" : "At counter"}
                        </Badge>
                      </div>

                      <AdvanceOrderButton id={o.id} from={col.status} label={col.next} />
                    </Card>
                  ))}

                  {items.length === 0 && (
                    <p className={styles.emptyColumn}>
                      Nothing here
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className={styles.kitchenTitle}>
                <ChefHat className={styles.kitchenIcon} /> Kitchen display
              </CardTitle>
              <CardDescription>
                Open this on a tablet in the kitchen and it refreshes on its own. Tickets turn red
                after fifteen minutes, which is where complaints start.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" size="sm">
                <Link href="/business/menu"><Utensils /> Manage the menu</Link>
              </Button>
            </CardContent>
          </Card>
        </PageShell>
      </div>
    </>
  );
}

import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, Building2, MapPin, Phone, Plus, Star } from "lucide-react";
import { BusinessTopbar } from "@/components/business/topbar";
import { EntityDialog } from "@/components/admin/entity-dialog";
import { PageShell } from "@/components/dashboard/page-shell";
import { OutletTrendChart } from "@/components/business/charts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { OUTLETS } from "@/lib/business-data";
import { compactNumber, formatDate, inr, cn } from "@/lib/utils";
import styles from "./page.module.css";

export default function BusinessLocationsPage() {
  const active = OUTLETS.filter((o) => o.isActive);
  const totals = active.reduce(
    (a, o) => ({
      scans: a.scans + o.scans,
      reviews: a.reviews + o.reviews,
      leads: a.leads + o.leads,
      revenue: a.revenue + o.revenue,
    }),
    { scans: 0, reviews: 0, leads: 0, revenue: 0 }
  );

  const avgRating = (active.reduce((s, o) => s + o.rating, 0) / active.length).toFixed(1);
  const best = [...active].sort((a, b) => b.revenue - a.revenue)[0];
  const worst = [...active].sort((a, b) => a.rating - b.rating)[0];
  const topRevenue = best.revenue;

  return (
    <>
      <BusinessTopbar title="Locations" />
      <div className={styles.page}>
        <PageShell
          title="Head office"
          description="Every outlet rolled up, and each one compared against the others. Numbers are for the current month."
          action={<EntityDialog entity="outlet" label="Add outlet" />}
        >
          <div className={styles.statGrid}>
            <Card className={styles.statCard}>
              <p className={styles.statLabel}>Outlets live</p>
              <p className={cn("display", styles.statValue)}>{active.length} / {OUTLETS.length}</p>
            </Card>
            <Card className={styles.statCard}>
              <p className={styles.statLabel}>Total scans</p>
              <p className={cn("display", styles.statValue)}>{compactNumber(totals.scans)}</p>
            </Card>
            <Card className={styles.statCard}>
              <p className={styles.statLabel}>Group revenue</p>
              <p className={cn("display", styles.statValue)}>{inr(totals.revenue)}</p>
            </Card>
            <Card className={styles.statCard}>
              <p className={styles.statLabel}>Average rating</p>
              <p className={cn("display", styles.statValue)}>{avgRating}</p>
            </Card>
          </div>

          <div className={styles.insightGrid}>
            <Card className={styles.bestCard}>
              <CardHeader>
                <CardTitle className={styles.calloutTitle}>{best.name} is carrying the group</CardTitle>
                <CardDescription>
                  {inr(best.revenue)} this month — {Math.round((best.revenue / totals.revenue) * 100)}% of
                  everything. Worth understanding what they do differently before opening another outlet.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className={styles.worstCard}>
              <CardHeader>
                <CardTitle className={styles.calloutTitle}>{worst.name} is rated {worst.rating}</CardTitle>
                <CardDescription>
                  {(Number(avgRating) - worst.rating).toFixed(1)} below the group average. One weak outlet
                  drags the brand name in search results for every other one.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Scans by outlet</CardTitle>
              <CardDescription>Five months. A flat line usually means a standee has been moved or covered.</CardDescription>
            </CardHeader>
            <CardContent><OutletTrendChart /></CardContent>
          </Card>

          <Card className={styles.tableCard}>
            <CardHeader>
              <CardTitle>Outlet comparison</CardTitle>
              <CardDescription>Sorted by revenue. Each outlet has its own Google listing and QR codes.</CardDescription>
            </CardHeader>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Outlet</TableHead>
                  <TableHead>Manager</TableHead>
                  <TableHead className={styles.shareHead}>Revenue share</TableHead>
                  <TableHead className={styles.numericHead}>Scans</TableHead>
                  <TableHead className={styles.numericHead}>Reviews</TableHead>
                  <TableHead className={styles.numericHead}>Rating</TableHead>
                  <TableHead className={styles.numericHead}>Leads</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...OUTLETS].sort((a, b) => b.revenue - a.revenue).map((o) => (
                  <TableRow key={o.id}>
                    <TableCell>
                      <span className={styles.outletName}>
                        {o.name}
                        {o.isHeadOffice && <Badge variant="secondary">HO</Badge>}
                      </span>
                      <span className={styles.outletCode}>{o.code}</span>
                    </TableCell>
                    <TableCell className={styles.managerCell}>{o.manager}</TableCell>
                    <TableCell>
                      <Progress value={Math.round((o.revenue / topRevenue) * 100)} />
                      <span className={styles.shareAmount}>{inr(o.revenue)}</span>
                    </TableCell>
                    <TableCell className={styles.numericCell}>{o.scans.toLocaleString("en-IN")}</TableCell>
                    <TableCell className={styles.numericCell}>{o.reviews}</TableCell>
                    <TableCell className={styles.numericCell}>
                      <span
                        className={cn(
                          styles.rating,
                          o.rating >= Number(avgRating) ? styles.ratingAbove : styles.ratingBelow
                        )}
                      >
                        {o.rating >= Number(avgRating)
                          ? <ArrowUpRight className={styles.ratingIcon} />
                          : <ArrowDownRight className={styles.ratingIcon} />}
                        {o.rating}
                      </span>
                    </TableCell>
                    <TableCell className={styles.numericCell}>{o.leads}</TableCell>
                    <TableCell>
                      <Badge variant={o.isActive ? "success" : "outline"}>
                        {o.isActive ? "Live" : "Closed"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          <div className={styles.outletGrid}>
            {OUTLETS.map((o) => (
              <Card key={o.id} className={cn(!o.isActive && styles.closedCard)}>
                <CardHeader>
                  <div className={styles.outletHead}>
                    <div>
                      <CardTitle className={styles.outletTitle}>
                        <Building2 className={styles.outletIcon} /> {o.name}
                      </CardTitle>
                      <p className={styles.outletMeta}>{o.city} · opened {formatDate(o.openedAt)}</p>
                    </div>
                    <span className={styles.outletRating}>
                      <Star className={styles.starIcon} />
                      {o.rating}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className={styles.outletContent}>
                  <p className={styles.address}>
                    <MapPin className={styles.addressIcon} /> {o.address}
                  </p>
                  <p className={styles.contact}>
                    <Phone className={styles.contactIcon} /> {o.manager} · {o.managerPhone}
                  </p>
                  <dl className={styles.figures}>
                    <div>
                      <dt className={styles.figureLabel}>Scans</dt>
                      <dd className={cn("display", styles.figureValue)}>{compactNumber(o.scans)}</dd>
                    </div>
                    <div>
                      <dt className={styles.figureLabel}>Orders</dt>
                      <dd className={cn("display", styles.figureValue)}>{o.orders}</dd>
                    </div>
                    <div>
                      <dt className={styles.figureLabel}>Leads</dt>
                      <dd className={cn("display", styles.figureValue)}>{o.leads}</dd>
                    </div>
                  </dl>
                  <Button asChild variant="outline" size="sm" className={styles.manageButton}>
                    <Link href="/business/qr">Manage this outlet</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </PageShell>
      </div>
    </>
  );
}

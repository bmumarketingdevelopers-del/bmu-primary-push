import { Package, Truck } from "lucide-react";
import { AdminTopbar } from "@/components/admin/topbar";
import { PageShell } from "@/components/dashboard/page-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PRODUCTS } from "@/lib/store";
import { StoreSalesChart } from "@/components/admin/section-charts";
import { STORE_BY_PRODUCT, STORE_TO_SUBSCRIPTION } from "@/lib/admin-data";
import { Progress } from "@/components/ui/progress";
import { EntityDialog } from "@/components/admin/entity-dialog";
import { RowActions } from "@/components/admin/row-actions";
import { cn, formatDate, inr } from "@/lib/utils";
import styles from "./page.module.css";

/** Demo fulfilment queue. Swap for prisma.productOrder.findMany(). */
const ORDERS = [
  { number: "BMU-S-481203", customer: "Meena Rao", business: "ABC Salon", city: "Bengaluru", items: 2, total: 409800, status: "PENDING", createdAt: "2026-08-07" },
  { number: "BMU-S-481198", customer: "Imran Sheikh", business: "Saffron & Co", city: "Bengaluru", items: 1, total: 549900, status: "PROCESSING", createdAt: "2026-08-06" },
  { number: "BMU-S-481190", customer: "Dr. Verma", business: "Verde Clinics", city: "Mysuru", items: 3, total: 279900, status: "SHIPPED", createdAt: "2026-08-04" },
  { number: "BMU-S-481182", customer: "Kiran Shetty", business: "Blue Harbour", city: "Udupi", items: 1, total: 129900, status: "DELIVERED", createdAt: "2026-08-01" },
];

const STATUS = {
  PENDING: "warning", PROCESSING: "info", SHIPPED: "default",
  DELIVERED: "success", CANCELLED: "outline",
} as const;

export default function AdminStorePage() {
  const revenue = ORDERS.reduce((s, o) => s + o.total, 0);
  const toShip = ORDERS.filter((o) => ["PENDING", "PROCESSING"].includes(o.status)).length;

  return (
    <>
      <AdminTopbar title="Store" />
      <div className={styles.page}>
        <PageShell
          title="Store & fulfilment"
          description="Hardware orders from the public store. Each one creates a free BMU QR account, which is how most tenants enter the funnel."
          action={<EntityDialog entity="storeProduct" label="Add product" />}
        >
          <div className={styles.statGrid}>
            <Card className={styles.statCard}>
              <p className={styles.statLabel}>Product revenue</p>
              <p className={cn("display", styles.statValue)}>{inr(revenue)}</p>
            </Card>
            <Card className={cn(styles.statCard, toShip > 0 && styles.cardWarning)}>
              <p className={styles.statLabel}>Waiting to ship</p>
              <p className={cn("display", styles.statValue)}>{toShip}</p>
            </Card>
            <Card className={styles.statCard}>
              <p className={styles.statLabel}>Products listed</p>
              <p className={cn("display", styles.statValue)}>{PRODUCTS.length}</p>
            </Card>
          </div>

          <div className={styles.chartGrid}>
            <Card>
              <CardHeader>
                <CardTitle>Hardware revenue</CardTitle>
                <CardDescription>Six months. August is part-way through.</CardDescription>
              </CardHeader>
              <CardContent><StoreSalesChart /></CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Best sellers</CardTitle>
                <CardDescription>Units against revenue — the two rank differently.</CardDescription>
              </CardHeader>
              <CardContent className={styles.bestSellers}>
                {STORE_BY_PRODUCT.map((p) => (
                  <div key={p.product} className={styles.seller}>
                    <span className={styles.sellerName}>{p.product}</span>
                    <span className={styles.sellerUnits}>{p.units} units</span>
                    <span className={styles.sellerRevenue}>{inr(p.revenue)}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card className={styles.cardPrimary}>
            <CardHeader>
              <CardTitle>Which hardware turns into a subscription</CardTitle>
              <CardDescription>
                This is the flywheel, measured. Kits convert at nearly three times the rate of a
                single card — the reason to push kits isn&apos;t the margin, it&apos;s this column.
              </CardDescription>
            </CardHeader>
            <CardContent className={styles.conversionList}>
              {STORE_TO_SUBSCRIPTION.map((r) => (
                <div key={r.product} className={styles.conversion}>
                  <div className={styles.conversionLabels}>
                    <span>{r.product}</span>
                    <span className={styles.conversionFigure}>
                      {r.upgraded} of {r.buyers} upgraded · <strong className={styles.conversionRate}>{r.rate}%</strong>
                    </span>
                  </div>
                  <Progress value={r.rate} />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className={styles.tableCard}>
            <CardHeader>
              <CardTitle className={styles.sectionTitle}>
                <Truck className={styles.titleIcon} /> Fulfilment queue
              </CardTitle>
              <CardDescription>Oldest pending first — lead times on the site promise 4 to 10 days.</CardDescription>
            </CardHeader>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead className={styles.numericHead}>Items</TableHead>
                  <TableHead className={styles.numericHead}>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Placed</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {ORDERS.map((o) => (
                  <TableRow key={o.number}>
                    <TableCell className={styles.orderCell}>{o.number}</TableCell>
                    <TableCell>
                      <span className={styles.primaryText}>{o.customer}</span>
                      <span className={styles.secondaryText}>{o.business}</span>
                    </TableCell>
                    <TableCell className={styles.mutedCell}>{o.city}</TableCell>
                    <TableCell className={styles.numericCell}>{o.items}</TableCell>
                    <TableCell className={styles.moneyCell}>{inr(o.total)}</TableCell>
                    <TableCell>
                      <Badge variant={STATUS[o.status as keyof typeof STATUS]}>{o.status.toLowerCase()}</Badge>
                    </TableCell>
                    <TableCell className={styles.mutedNowrapCell}>{formatDate(o.createdAt)}</TableCell>
                    <TableCell className={styles.actionsCell}>
                      <Button variant="ghost" size="sm" disabled={["SHIPPED", "DELIVERED"].includes(o.status)}>
                        Mark shipped
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          <Card className={styles.tableCard}>
            <CardHeader>
              <CardTitle className={styles.sectionTitle}>
                <Package className={styles.titleIcon} /> Catalogue
              </CardTitle>
              <CardDescription>Editing here changes the public store immediately.</CardDescription>
            </CardHeader>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Tech</TableHead>
                  <TableHead className={styles.numericHead}>Price</TableHead>
                  <TableHead>Lead time</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {PRODUCTS.map((p) => (
                  <TableRow key={p.slug}>
                    <TableCell>
                      <span className={styles.primaryText}>{p.name}</span>
                      <span className={styles.productPath}>/store/{p.slug}</span>
                    </TableCell>
                    <TableCell><Badge variant="secondary">{p.category.toLowerCase()}</Badge></TableCell>
                    <TableCell className={styles.mutedCell}>{p.tech}</TableCell>
                    <TableCell className={styles.moneyCell}>{inr(p.price)}</TableCell>
                    <TableCell className={styles.mutedNowrapCell}>{p.leadTime}</TableCell>
                    <TableCell className={styles.actionsCell}>
                      <RowActions
                        entity="storeProduct"
                        record={p as unknown as Record<string, unknown>}
                        toggleField="isActive"
                        toggleValue
                        toggleLabels={["Hide from store", "Show in store"]}
                      />
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

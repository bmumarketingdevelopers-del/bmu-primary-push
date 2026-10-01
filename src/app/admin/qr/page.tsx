import { AdminTopbar } from "@/components/admin/topbar";
import { PageShell } from "@/components/dashboard/page-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QrEditor } from "@/components/admin/qr-editor";
import { NewQrDialog } from "@/components/admin/new-qr-dialog";
import { QrScanChart, QrDeviceChart } from "@/components/admin/section-charts";
import {
  QR_BY_CITY, QR_BY_COUNTRY, QR_BY_DEVICE, QR_PLANS, QR_STORE_SUMMARY,
} from "@/lib/admin-data";
import { QrAccountsTable } from "@/components/admin/qr-accounts-table";
import { cn, inr } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { getClients } from "@/lib/repos/agency";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ADMIN_QR } from "@/lib/admin-data";
import { compactNumber } from "@/lib/utils";
import styles from "./page.module.css";

export default async function AdminQrPage() {
  const { data: clients } = await getClients();

  const total = ADMIN_QR.reduce((s, q) => s + q.scans, 0);

  return (
    <>
      <AdminTopbar title="QR codes" />
      <div className={styles.page}>
        <PageShell
          title="BMU QR — all accounts"
          description="Every code issued across every client. Destinations are editable without reprinting — click Edit to repoint a code and download a print-ready PNG."
          action={<NewQrDialog clients={clients.map((c) => ({ id: c.id, name: c.name }))} />}
        >
          <div className={styles.codeStatGrid}>
            <Card className={styles.statCard}>
              <p className={styles.statLabel}>Scans, all time</p>
              <p className={cn("display", styles.codeStatValue)}>{compactNumber(total)}</p>
            </Card>
            <Card className={styles.statCard}>
              <p className={styles.statLabel}>Codes issued</p>
              <p className={cn("display", styles.codeStatValue)}>{ADMIN_QR.length}</p>
            </Card>
            <Card className={styles.statCard}>
              <p className={styles.statLabel}>Active</p>
              <p className={cn("display", styles.codeStatValue)}>{ADMIN_QR.filter((q) => q.active).length}</p>
            </Card>
          </div>

          {(() => {
            const totalAccounts = QR_PLANS.reduce((t, p) => t + p.accounts, 0);
            const paidAccounts = QR_PLANS.filter((p) => p.price > 0).reduce((t, p) => t + p.accounts, 0);
            const mrr = QR_PLANS.reduce((t, p) => t + p.revenue, 0);
            const topPlan = [...QR_PLANS].sort((a, b) => b.accounts - a.accounts)[0];
            const topRevenuePlan = [...QR_PLANS].sort((a, b) => b.revenue - a.revenue)[0];
            const totalScans = QR_BY_COUNTRY.reduce((t, c) => t + c.scans, 0);

            return (
              <>
                <div className={styles.statGrid}>
                  <Card className={styles.statCard}>
                    <p className={styles.statLabel}>Accounts</p>
                    <p className={cn("display", styles.statValue)}>{totalAccounts}</p>
                    <p className={styles.statNote}>{paidAccounts} paying</p>
                  </Card>
                  <Card className={styles.statCard}>
                    <p className={styles.statLabel}>Subscription revenue</p>
                    <p className={cn("display", styles.statValue)}>{inr(mrr)}</p>
                    <p className={styles.statNote}>annualised</p>
                  </Card>
                  <Card className={styles.statCard}>
                    <p className={styles.statLabel}>Countries</p>
                    <p className={cn("display", styles.statValue)}>{QR_BY_COUNTRY.length}</p>
                    <p className={styles.statNote}>
                      {totalScans.toLocaleString("en-IN")} scans
                    </p>
                  </Card>
                  <Card className={styles.statCard}>
                    <p className={styles.statLabel}>Hardware orders</p>
                    <p className={cn("display", styles.statValue)}>{QR_STORE_SUMMARY.ordersThisMonth}</p>
                    <p className={styles.statNote}>
                      {QR_STORE_SUMMARY.unitsShipped} units shipped
                    </p>
                  </Card>
                </div>

                <Card className={styles.cardPrimary}>
                  <CardHeader>
                    <CardTitle className={styles.calloutTitle}>
                      {topPlan.plan} has the most accounts, {topRevenuePlan.plan} brings the most money
                    </CardTitle>
                    <CardDescription>
                      Free sits at {QR_PLANS[0].accounts} accounts and earns nothing — that&apos;s the
                      cost of the funnel, not a failure. What matters is that {topRevenuePlan.plan} at{" "}
                      {topRevenuePlan.accounts} accounts out-earns every other tier combined below it.
                      Best-selling hardware is the {QR_STORE_SUMMARY.topProduct.toLowerCase()}.
                    </CardDescription>
                  </CardHeader>
                </Card>

                <div className={styles.breakdownGrid}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Plans</CardTitle>
                      <CardDescription>Accounts against revenue. The two rank differently.</CardDescription>
                    </CardHeader>
                    <CardContent className={styles.barList}>
                      {QR_PLANS.map((p) => (
                        <div key={p.plan} className={styles.bar}>
                          <div className={styles.barLabels}>
                            <span className={styles.planName}>
                              {p.plan}
                              {p.price > 0 && (
                                <span className={styles.planPrice}>{inr(p.price)}/yr</span>
                              )}
                            </span>
                            <span className={styles.barFigure}>
                              {p.accounts} accounts · {p.revenue ? inr(p.revenue) : "—"}
                            </span>
                          </div>
                          <Progress value={Math.round((p.accounts / totalAccounts) * 100)} />
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Countries</CardTitle>
                      <CardDescription>
                        Overseas scans are usually diaspora and tourists rather than new markets —
                        worth checking before opening a region.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className={styles.barList}>
                      {QR_BY_COUNTRY.map((c) => (
                        <div key={c.code} className={styles.bar}>
                          <div className={styles.barLabels}>
                            <span>
                              <span className={styles.countryCode}>{c.code}</span>
                              {c.country}
                            </span>
                            <span className={styles.barFigure}>
                              {c.scans.toLocaleString("en-IN")} · {c.accounts} accounts
                            </span>
                          </div>
                          <Progress value={Math.round((c.scans / totalScans) * 100)} />
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </>
            );
          })()}

          <div className={styles.chartGrid}>
            <Card className={styles.scanChartCard}>
              <CardHeader>
                <CardTitle>Scans by code type</CardTitle>
                <CardDescription>
                  Six weeks. Menu codes dominate because they get scanned every meal — profile
                  codes get scanned once per customer, which is the honest comparison.
                </CardDescription>
              </CardHeader>
              <CardContent><QrScanChart /></CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Devices</CardTitle>
                <CardDescription>Worth knowing before you rely on NFC.</CardDescription>
              </CardHeader>
              <CardContent>
                <QrDeviceChart />
                <ul className={styles.deviceList}>
                  {QR_BY_DEVICE.map((d) => (
                    <li key={d.name} className={styles.device}>
                      <span
                        className={styles.deviceSwatch}
                        style={{ "--swatch": d.color } as React.CSSProperties}
                      />
                      <span className={styles.deviceName}>{d.name}</span>
                      <span className={styles.deviceShare}>{d.value}%</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Where scans happen</CardTitle>
              <CardDescription>
                By city. A code scanned far from its printed location usually means someone shared
                a photo of it — worth checking before assuming reach.
              </CardDescription>
            </CardHeader>
            <CardContent className={styles.barList}>
              {QR_BY_CITY.map((c) => (
                <div key={c.city} className={styles.bar}>
                  <div className={styles.cityLabels}>
                    <span>{c.city}</span>
                    <span className={styles.barFigure}>
                      {c.scans.toLocaleString("en-IN")} · {c.share}%
                    </span>
                  </div>
                  <Progress value={c.share} />
                </div>
              ))}
            </CardContent>
          </Card>

          <section className={styles.accounts}>
            <h2 className={cn("display", styles.accountsTitle)}>Accounts</h2>
            <QrAccountsTable />
          </section>

          <Card className={styles.tableCard}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Printed URL</TableHead>
                  <TableHead className={styles.scansHead}>Scans</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {ADMIN_QR.map((q) => (
                  <TableRow key={q.id}>
                    <TableCell>
                      <span className={styles.codeLabel}>{q.label}</span>
                      <span className={styles.codeId}>{q.id}</span>
                    </TableCell>
                    <TableCell><Badge variant="outline">{q.client}</Badge></TableCell>
                    <TableCell><Badge variant="secondary">{q.type.replace("_", " ")}</Badge></TableCell>
                    <TableCell>
                      <a
                        href={`/q/${q.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className={styles.printedUrl}
                      >
                        /q/{q.slug}
                      </a>
                    </TableCell>
                    <TableCell className={styles.scansCell}>{q.scans.toLocaleString("en-IN")}</TableCell>
                    <TableCell><Badge variant={q.active ? "success" : "outline"}>{q.active ? "Active" : "Paused"}</Badge></TableCell>
                    <TableCell className={styles.actionsCell}>
                      <QrEditor id={q.id} slug={q.slug} label={q.label} target={q.target} />
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

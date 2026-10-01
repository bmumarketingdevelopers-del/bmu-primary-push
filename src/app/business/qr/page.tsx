import { Download, ExternalLink, Nfc, Plus, QrCode } from "lucide-react";
import { BusinessTopbar } from "@/components/business/topbar";
import { PageShell } from "@/components/dashboard/page-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BUSINESS_QRS, NFC_CARDS } from "@/lib/business-data";
import { QR_KINDS } from "@/lib/qr-platform";
import { NewQrDialog } from "@/components/admin/new-qr-dialog";
import { tenantForSlug } from "@/lib/tenant";
import { getCurrentUser } from "@/lib/session";
import { cn, compactNumber } from "@/lib/utils";
import styles from "./page.module.css";

export default async function BusinessQrPage() {
  const user = await getCurrentUser();
  const tenant = tenantForSlug(user?.clientId);

  const totalScans = BUSINESS_QRS.reduce((s, q) => s + q.scans, 0);
  const totalTaps = NFC_CARDS.reduce((s, c) => s + c.taps, 0);

  return (
    <>
      <BusinessTopbar title="QR & NFC" />
      <div className={styles.page}>
        <PageShell
          title="QR & NFC"
          description="Every code you've printed. Change where one points and the printed material keeps working — that's the point of dynamic codes."
          action={<NewQrDialog clients={[{ id: tenant.slug, name: tenant.name }]} />}
        >
          <div className={styles.statGrid}>
            <Card className={styles.statCard}>
              <p className={styles.statLabel}>QR scans, all time</p>
              <p className={cn("display", styles.statValue)}>{compactNumber(totalScans)}</p>
            </Card>
            <Card className={styles.statCard}>
              <p className={styles.statLabel}>NFC taps</p>
              <p className={cn("display", styles.statValue)}>{compactNumber(totalTaps)}</p>
            </Card>
            <Card className={styles.statCard}>
              <p className={styles.statLabel}>Active codes</p>
              <p className={cn("display", styles.statValue)}>
                {BUSINESS_QRS.filter((q) => q.isActive).length} / {BUSINESS_QRS.length}
              </p>
            </Card>
          </div>

          <Card className={styles.tableCard}>
            <CardHeader><CardTitle>Your QR codes</CardTitle></CardHeader>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Where it&apos;s printed</TableHead>
                  <TableHead className={styles.numericHead}>Scans</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {BUSINESS_QRS.map((q) => (
                  <TableRow key={q.id}>
                    <TableCell>
                      <span className={styles.codeLabel}>{q.label}</span>
                      <span className={styles.codePath}>/q/{q.code}</span>
                    </TableCell>
                    <TableCell><Badge variant="secondary">{q.kind.replace("_", " ")}</Badge></TableCell>
                    <TableCell className={styles.mutedCell}>{q.placement}</TableCell>
                    <TableCell className={styles.countCell}>{q.scans.toLocaleString("en-IN")}</TableCell>
                    <TableCell>
                      <Badge variant={q.isActive ? "success" : "outline"}>
                        {q.isActive ? "Active" : "Paused"}
                      </Badge>
                    </TableCell>
                    <TableCell className={styles.actionsCell}>
                      <Button asChild variant="ghost" size="sm">
                        <a href={`/api/qr/${q.code}?f=png&d=1`}><Download /> PNG</a>
                      </Button>
                      <Button asChild variant="ghost" size="sm">
                        <a href={q.destination} target="_blank" rel="noreferrer"><ExternalLink /> Test</a>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          <Card className={styles.tableCard}>
            <CardHeader>
              <CardTitle className={styles.iconTitle}>
                <Nfc className={styles.titleIcon} /> NFC cards
              </CardTitle>
              <CardDescription>
                Tap-to-open cards and standees. Each one is tied to a QR code as a fallback for
                phones without NFC.
              </CardDescription>
            </CardHeader>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Serial</TableHead>
                  <TableHead>Assigned to</TableHead>
                  <TableHead className={styles.numericHead}>Taps</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {NFC_CARDS.map((c) => (
                  <TableRow key={c.serial}>
                    <TableCell className={styles.serialCell}>{c.serial}</TableCell>
                    <TableCell className={styles.mutedCell}>{c.holder}</TableCell>
                    <TableCell className={styles.countCell}>{c.taps.toLocaleString("en-IN")}</TableCell>
                    <TableCell>
                      <Badge variant={c.status === "ACTIVE" ? "success" : "outline"}>
                        {c.status.toLowerCase()}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className={styles.iconTitle}>
                <QrCode className={styles.titleIcon} /> What you can create
              </CardTitle>
              <CardDescription>Available on your plan. Some types need Pro.</CardDescription>
            </CardHeader>
            <CardContent className={styles.kindGrid}>
              {Object.entries(QR_KINDS).map(([group, kinds]) => (
                <div key={group}>
                  <p className={styles.kindGroup}>
                    {group}
                  </p>
                  <ul className={styles.kindList}>
                    {kinds.map((k) => (
                      <li key={k.kind} className={styles.kind}>
                        {k.label}
                        <span className={styles.kindHelp}>{k.help}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </CardContent>
          </Card>
        </PageShell>
      </div>
    </>
  );
}

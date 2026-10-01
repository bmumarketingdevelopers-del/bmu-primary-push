import { CheckCircle2, XCircle } from "lucide-react";
import { AdminTopbar } from "@/components/admin/topbar";
import { PageShell } from "@/components/dashboard/page-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { INTEGRATIONS } from "@/lib/admin-data";
import { SERVICE_DETAILS } from "@/lib/services-data";
import { COMPANY } from "@/lib/company-data";
import { cn } from "@/lib/utils";
import styles from "./page.module.css";

export default function AdminSettingsPage() {
  return (
    <>
      <AdminTopbar title="Settings" />
      <div className={styles.page}>
        <PageShell
          title="Agency settings"
          description="Business details, the services catalogue that drives the public site, and connected platforms."
        >
          <Card>
            <CardHeader>
              <CardTitle>Business details</CardTitle>
              <CardDescription>Used on invoices, the contact page and structured data.</CardDescription>
            </CardHeader>
            <CardContent className={styles.detailsForm}>
              <div className={styles.field}>
                <Label htmlFor="legal">Legal name</Label>
                <Input id="legal" defaultValue="BMU Marketing Pvt Ltd" />
              </div>
              <div className={styles.field}>
                <Label htmlFor="gstin">GSTIN</Label>
                <Input id="gstin" defaultValue="29ABCDE1234F1Z5" />
              </div>
              <div className={styles.field}>
                <Label htmlFor="email">Contact email</Label>
                <Input id="email" type="email" defaultValue={COMPANY.email} />
              </div>
              <div className={styles.field}>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" defaultValue={COMPANY.phone} />
              </div>
              <div className={cn(styles.field, styles.fullRow)}>
                <Label htmlFor="address">Registered address</Label>
                <Input id="address" defaultValue={COMPANY.address} />
              </div>
              <div className={styles.fullRow}>
                <Button size="sm" disabled title="Not built yet">Save changes</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Services catalogue</CardTitle>
              <CardDescription>
                These drive the public navigation, the service pages and the sitemap. Editing here changes the website.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className={styles.serviceList}>
                {SERVICE_DETAILS.map((s) => (
                  <div key={s.slug} className={styles.serviceRow}>
                    <div className={styles.serviceInfo}>
                      <p className={styles.serviceTitle}>{s.title}</p>
                      <p className={styles.servicePath}>/services/{s.slug}</p>
                    </div>
                    <div className={styles.serviceActions}>
                      <Badge variant="success">Live</Badge>
                      <Button variant="ghost" size="sm" disabled title="Not built yet">Edit</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Integrations</CardTitle>
              <CardDescription>Platform connections. Anything unconnected is degraded, not broken — the app falls back gracefully.</CardDescription>
            </CardHeader>
            <CardContent className={styles.integrationList}>
              {INTEGRATIONS.map((i, idx) => (
                <div key={i.name}>
                  {idx > 0 && <Separator />}
                  <div className={styles.integrationRow}>
                    <div className={styles.integrationInfo}>
                      {i.connected
                        ? <CheckCircle2 className={cn(styles.statusIcon, styles.statusConnected)} />
                        : <XCircle className={cn(styles.statusIcon, styles.statusDisconnected)} />}
                      <div>
                        <p className={styles.integrationName}>{i.name}</p>
                        <p className={styles.integrationDetail}>{i.detail}</p>
                      </div>
                    </div>
                    <Button variant={i.connected ? "ghost" : "outline"} size="sm" disabled title="Integration setup isn\'t built yet">
                      {i.connected ? "Manage" : "Connect"}
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </PageShell>
      </div>
    </>
  );
}

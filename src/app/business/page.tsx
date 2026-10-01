import Link from "next/link";
import {
  ArrowRight, CalendarCheck, ExternalLink, Eye, IndianRupee, MapPin,
  MessageCircle, Phone, QrCode, Receipt, Repeat, Star, Users,
} from "lucide-react";
import { BusinessTopbar } from "@/components/business/topbar";
import { PageShell } from "@/components/dashboard/page-shell";
import { StatCard } from "@/components/dashboard/stat-card";
import { ScanChart, ActionSplitChart } from "@/components/business/charts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ACTION_SPLIT, BUSINESS_KPIS, BUSINESS_LEADS, FEEDBACK, PROFILE_CHECKLIST,
} from "@/lib/business-data";
import { getCurrentUser } from "@/lib/session";
import { tenantForSlug } from "@/lib/tenant";
import { KPI_LIBRARY } from "@/lib/industry-setup";
import { getIndustrySetup } from "@/lib/repos/industry";
import { formatDate } from "@/lib/utils";
import styles from "./page.module.css";

const ICONS = {
  Eye, Star, MessageCircle, Users, CalendarCheck, Receipt,
  IndianRupee, QrCode, Phone, MapPin, Repeat,
};

/** Plausible figures per metric until the tenant has real history. */
const SAMPLE: Record<string, { value: string; delta: number }> = {
  views: { value: "3,842", delta: 22.4 },
  scans: { value: "4,180", delta: 18.2 },
  reviews: { value: "218", delta: 31.1 },
  whatsapp: { value: "946", delta: 18.7 },
  calls: { value: "512", delta: 9.4 },
  directions: { value: "341", delta: 12.8 },
  leads: { value: "74", delta: -4.2 },
  enquiries: { value: "61", delta: 7.9 },
  bookings: { value: "138", delta: 16.5 },
  siteVisits: { value: "42", delta: 27.0 },
  trials: { value: "36", delta: 21.3 },
  admissions: { value: "88", delta: 14.1 },
  orders: { value: "612", delta: 11.6 },
  sales: { value: "₹2.84L", delta: 9.8 },
  payments: { value: "₹1.12L", delta: 15.2 },
  donations: { value: "₹86,400", delta: 24.6 },
  repeat: { value: "41%", delta: 6.3 },
};

export default async function BusinessOverview() {
  const user = await getCurrentUser();
  const business = tenantForSlug(user?.clientId);
  const setup = await getIndustrySetup(business.slug);
  const done = PROFILE_CHECKLIST.filter((c) => c.done).length;
  const completeness = Math.round((done / PROFILE_CHECKLIST.length) * 100);
  const unhandled = FEEDBACK.filter((f) => f.sentiment !== "POSITIVE" && !f.isResolved);
  const newLeads = BUSINESS_LEADS.filter((l) => l.status === "NEW");

  return (
    <>
      <BusinessTopbar title="Overview" />
      <div className={styles.page}>
        <PageShell
          title={business.name}
          description={
            setup
              ? `${setup.name} · ${setup.primaryGoal}. What your QR codes and NFC cards did this week.`
              : "What your QR codes and NFC cards did this week, and anything that needs you today."
          }
          action={
            <Button asChild variant="outline" size="sm">
              <a href={`/b/${business.slug}`} target="_blank" rel="noreferrer">
                <ExternalLink /> View public page
              </a>
            </Button>
          }
        >
          {/* KPIs come from the industry setup, so a doctor never sees "orders". */}
          <div className={styles.kpiGrid}>
            {(setup?.kpis ?? ["views", "reviews", "whatsapp", "leads"]).map((key) => {
              const meta = KPI_LIBRARY[key];
              const sample = SAMPLE[key] ?? { value: "—", delta: 0 };
              return (
                <StatCard
                  key={key}
                  label={meta.label}
                  value={sample.value}
                  delta={sample.delta}
                  sub={meta.sub}
                  icon={ICONS[meta.icon as keyof typeof ICONS] ?? Eye}
                />
              );
            })}
          </div>

          {/* Things that need action */}
          <div className={styles.alertGrid}>
            {unhandled.length > 0 && (
              <Card className={styles.unhappyCard}>
                <CardHeader>
                  <CardTitle className={styles.alertTitle}>{unhandled.length} unhappy customers</CardTitle>
                  <CardDescription>
                    These never reached Google. Call them back and you often turn the review around.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="ghost" size="sm" className={styles.fullWidthButton}>
                    <Link href="/business/reviews">Read the feedback <ArrowRight /></Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            {newLeads.length > 0 && setup?.modules.includes("leads") && (
              <Card className={styles.newLeadsCard}>
                <CardHeader>
                  <CardTitle className={styles.alertTitle}>{newLeads.length} new leads</CardTitle>
                  <CardDescription>
                    Captured from your QR codes. Response speed is the whole game here.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="ghost" size="sm" className={styles.fullWidthButton}>
                    <Link href="/business/leads">Open leads <ArrowRight /></Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className={styles.alertTitle}>Profile {completeness}% complete</CardTitle>
                <CardDescription>Complete profiles get noticeably more taps per scan.</CardDescription>
              </CardHeader>
              <CardContent className={styles.profileContent}>
                <Progress value={completeness} />
                <ul className={styles.checklist}>
                  {PROFILE_CHECKLIST.filter((c) => !c.done).map((c) => (
                    <li key={c.label} className={styles.checklistItem}>
                      <span className={styles.checklistDot} />
                      {c.label}
                    </li>
                  ))}
                </ul>
                <Button asChild variant="ghost" size="sm" className={styles.fullWidthButton}>
                  <Link href="/business/profile">Finish profile <ArrowRight /></Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className={styles.chartGrid}>
            <Card className={styles.scanCard}>
              <CardHeader>
                <CardTitle>Scans this week</CardTitle>
                <CardDescription>
                  Total against unique devices. Weekends run highest for walk-in businesses.
                </CardDescription>
              </CardHeader>
              <CardContent><ScanChart /></CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>What people tapped</CardTitle>
                <CardDescription>Actions taken after opening your profile.</CardDescription>
              </CardHeader>
              <CardContent>
                <ActionSplitChart />
                <ul className={styles.legend}>
                  {ACTION_SPLIT.map((a) => (
                    <li key={a.name} className={styles.legendItem}>
                      <span
                        className={styles.legendSwatch}
                        style={{ "--swatch": a.color } as React.CSSProperties}
                      />
                      <span className={styles.legendName}>{a.name}</span>
                      <span className={styles.legendValue}>{a.value}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {setup?.modules.includes("leads") && (
          <Card>
            <CardHeader className={styles.leadsHeader}>
              <CardTitle>Latest leads</CardTitle>
              <Button asChild variant="ghost" size="sm">
                <Link href="/business/leads">View all</Link>
              </Button>
            </CardHeader>
            <CardContent className={styles.leadList}>
              {BUSINESS_LEADS.slice(0, 4).map((l) => (
                <div
                  key={l.id}
                  className={styles.leadRow}
                >
                  <div className={styles.leadText}>
                    <p className={styles.leadName}>{l.name}</p>
                    <p className={styles.leadMessage}>{l.message}</p>
                  </div>
                  <div className={styles.leadMeta}>
                    <Badge variant="outline">{l.source}</Badge>
                    <span className={styles.leadDate}>{formatDate(l.createdAt)}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          )}
        </PageShell>
      </div>
    </>
  );
}

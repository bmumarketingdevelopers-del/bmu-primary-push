import { Repeat, TrendingDown, UserCheck, Users } from "lucide-react";
import { BusinessTopbar } from "@/components/business/topbar";
import { PageShell } from "@/components/dashboard/page-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { getRepeatStats } from "@/lib/visitors";
import { tenantForSlug } from "@/lib/tenant";
import { getCurrentUser } from "@/lib/session";
import { cn } from "@/lib/utils";
import styles from "./page.module.css";

export default async function ReturningPage() {
  const user = await getCurrentUser();
  const tenant = tenantForSlug(user?.clientId);
  const stats = await getRepeatStats(tenant.slug);

  const oneTime = stats.totalVisitors - stats.returning;

  return (
    <>
      <BusinessTopbar title="Returning customers" />
      <div className={styles.page}>
        <PageShell
          title="Who comes back"
          description="Nobody scanning a code is anonymous to you any more. This is the share who scanned once and then scanned again."
          action={<Badge variant="outline">Devices, not people — see below</Badge>}
        >
          <div className={styles.statGrid}>
            <Card className={styles.statCard}>
              <p className={styles.statLabel}>Came back</p>
              <p className={cn("display", styles.statValue)}>{stats.repeatRate}%</p>
              <p className={styles.statNote}>
                {stats.returning.toLocaleString("en-IN")} of {stats.totalVisitors.toLocaleString("en-IN")}
              </p>
            </Card>
            <Card className={styles.statCard}>
              <p className={styles.statLabel}>Within 30 days</p>
              <p className={cn("display", styles.statValue)}>{stats.returnedIn30Rate}%</p>
              <p className={styles.statNote}>
                {stats.returnedIn30.toLocaleString("en-IN")} devices
              </p>
            </Card>
            <Card className={styles.statCard}>
              <p className={styles.statLabel}>Regulars</p>
              <p className={cn("display", styles.statValue)}>{stats.loyal}</p>
              <p className={styles.statNote}>four visits or more</p>
            </Card>
            <Card className={stats.lapsed > 0 ? cn(styles.lapsedCard, styles.statCard) : styles.statCard}>
              <p className={styles.statLabel}>Lapsed</p>
              <p className={cn("display", styles.statValue)}>{stats.lapsed}</p>
              <p className={styles.statNote}>not seen in 60 days</p>
            </Card>
          </div>

          <Card className={styles.headlineCard}>
            <CardHeader>
              <CardTitle className={styles.calloutTitle}>
                {stats.repeatRate}% is the number worth watching, not the scan count
              </CardTitle>
              <CardDescription>
                Scans go up when you print more codes. This goes up only when people choose to come
                back — which is the thing you actually control and the thing that decides whether
                the business grows.
              </CardDescription>
            </CardHeader>
          </Card>

          <div className={styles.detailGrid}>
            <Card>
              <CardHeader>
                <CardTitle className={styles.iconTitle}>
                  <Users className={styles.titleIcon} /> The split
                </CardTitle>
                <CardDescription>Everyone who has ever scanned one of your codes.</CardDescription>
              </CardHeader>
              <CardContent className={styles.splitContent}>
                <div className={styles.split}>
                  <div className={styles.splitHead}>
                    <span className={styles.splitLabel}>
                      <UserCheck className={cn(styles.splitIcon, styles.returnedIcon)} /> Came back at least once
                    </span>
                    <span className={styles.splitCount}>{stats.returning.toLocaleString("en-IN")}</span>
                  </div>
                  <Progress value={stats.repeatRate} />
                </div>

                <div className={styles.split}>
                  <div className={styles.splitHead}>
                    <span className={styles.splitLabel}>
                      <Repeat className={cn(styles.splitIcon, styles.onceIcon)} /> Scanned once only
                    </span>
                    <span className={styles.splitCount}>{oneTime.toLocaleString("en-IN")}</span>
                  </div>
                  <Progress value={100 - stats.repeatRate} />
                </div>

                <div className={styles.split}>
                  <div className={styles.splitHead}>
                    <span className={styles.splitLabel}>
                      <TrendingDown className={cn(styles.splitIcon, styles.lapsedIcon)} /> Lapsed past 60 days
                    </span>
                    <span className={styles.splitCount}>{stats.lapsed.toLocaleString("en-IN")}</span>
                  </div>
                  <Progress
                    value={
                      stats.totalVisitors
                        ? Math.round((stats.lapsed / stats.totalVisitors) * 100)
                        : 0
                    }
                  />
                </div>

                <p className={styles.average}>
                  Average of <strong className={styles.emphasis}>{stats.averageVisits}</strong> visits
                  per device.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>What this actually measures</CardTitle>
                <CardDescription>
                  Worth knowing before you quote it to anyone.
                </CardDescription>
              </CardHeader>
              <CardContent className={styles.caveats}>
                <p>
                  It counts <strong className={styles.emphasis}>devices</strong>, not people. A
                  shared family phone reads as one visitor; someone who scans on their own phone and
                  again on their partner&apos;s reads as two.
                </p>
                <p>
                  Clearing browser data resets it, so a device can be counted new twice.
                </p>
                <p>
                  It only sees people who <strong className={styles.emphasis}>scan</strong>. A
                  regular who never scans is invisible here.
                </p>
                <p className={styles.conclusion}>
                  All of which means the real repeat rate is{" "}
                  <strong className={styles.emphasis}>higher</strong> than {stats.repeatRate}%. This
                  is a floor, not an estimate — which is the right direction for a number you put in
                  front of someone.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className={styles.noteCard}>
            <CardHeader>
              <CardTitle className={styles.calloutTitle}>How the identifier works</CardTitle>
              <CardDescription>
                A random value in a cookie, hashed with a server secret and salted per business.
                We never store the raw value, so a leaked row can&apos;t be replayed as someone&apos;s
                cookie — and the same phone produces a different key at every business, so nobody
                can be tracked across two unrelated shops.
              </CardDescription>
            </CardHeader>
          </Card>
        </PageShell>
      </div>
    </>
  );
}

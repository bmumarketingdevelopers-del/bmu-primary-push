import Link from "next/link";
import { ArrowUpRight, Layers } from "lucide-react";
import { AdminTopbar } from "@/components/admin/topbar";
import { PageShell } from "@/components/dashboard/page-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MODULE_LABEL, unmappedIndustries } from "@/lib/industry-setup";
import { getIndustrySetups } from "@/lib/repos/industry";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import styles from "./page.module.css";

const PLAN_VARIANT = { STARTER: "outline", BUSINESS: "secondary", PRO: "default" } as const;

export default async function AdminIndustriesPage() {
  const INDUSTRY_SETUPS = await getIndustrySetups();
  const gaps = unmappedIndustries();
  const byPlan = (p: string) => INDUSTRY_SETUPS.filter((i) => i.plan === p).length;

  return (
    <>
      <AdminTopbar title="Industry setups" />
      <div className={styles.page}>
        <PageShell
          title="Industry setups"
          description="What a business of each type gets when it's onboarded. Every industry has a working demo tenant — open one to see the real profile, booking flow and review journey."
          action={
            <Button asChild size="sm">
              <Link href="/admin/industries/new"><Plus /> New industry</Link>
            </Button>
          }
        >
          <div className={styles.statGrid}>
            <Card className={styles.statCard}>
              <p className={styles.statLabel}>Industries configured</p>
              <p className={cn("display", styles.statValue)}>{INDUSTRY_SETUPS.length}</p>
            </Card>
            <Card className={styles.statCard}>
              <p className={styles.statLabel}>Need Pro</p>
              <p className={cn("display", styles.statValue)}>{byPlan("PRO")}</p>
            </Card>
            <Card className={styles.statCard}>
              <p className={styles.statLabel}>Need Business</p>
              <p className={cn("display", styles.statValue)}>{byPlan("BUSINESS")}</p>
            </Card>
            <Card className={cn(styles.statCard, gaps.length > 0 && styles.cardDanger)}>
              <p className={styles.statLabel}>Missing review voice</p>
              <p className={cn("display", styles.statValue)}>{gaps.length}</p>
            </Card>
          </div>

          <Card className={styles.cardPrimary}>
            <CardHeader>
              <CardTitle className={styles.calloutTitle}>Why these differ</CardTitle>
              <CardDescription>
                A salon needs booking and a restaurant needs a menu. Shipping both to everyone makes
                the product feel bloated to both, so onboarding turns on only what that sector uses —
                and the plan requirement follows from the modules, not the other way round.
              </CardDescription>
            </CardHeader>
          </Card>

          <div className={styles.industryGrid}>
            {INDUSTRY_SETUPS.map((i) => (
              <Link key={i.slug} href={`/admin/industries/${i.slug}`}>
                <Card className={styles.industryCard}>
                  <CardHeader>
                    <div className={styles.industryHead}>
                      <span className={styles.industryIcon}>
                        <Layers className={styles.industryIconGlyph} strokeWidth={1.8} />
                      </span>
                      <div className={styles.industryMeta}>
                        <Badge variant={PLAN_VARIANT[i.plan]}>{i.plan}</Badge>
                        <ArrowUpRight className={styles.industryArrow} />
                      </div>
                    </div>
                    <CardTitle className={styles.industryTitle}>{i.name}</CardTitle>
                    <CardDescription>{i.primaryGoal}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className={styles.actionList}>
                      {i.primaryActions.map((a) => (
                        <Badge key={a} variant="outline" className={styles.actionBadge}>{a}</Badge>
                      ))}
                    </div>
                    <p className={styles.moduleSummary}>
                      {i.modules.length} modules ·{" "}
                      {i.modules.slice(0, 3).map((m) => MODULE_LABEL[m]).join(", ")}…
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </PageShell>
      </div>
    </>
  );
}

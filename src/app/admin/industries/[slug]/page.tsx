import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, ExternalLink, Package, Target, X } from "lucide-react";
import { AdminTopbar } from "@/components/admin/topbar";
import { PageShell } from "@/components/dashboard/page-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { INDUSTRY_SETUPS, KPI_LIBRARY, MODULE_LABEL, type ModuleKey } from "@/lib/industry-setup";
import { getIndustrySetup, getIndustrySetups, isCustomised } from "@/lib/repos/industry";
import { IndustryEditor } from "@/components/admin/industry-editor";
import { CATEGORY_VOICE, templateSuggestions } from "@/lib/review-suggestions";
import { cn } from "@/lib/utils";
import styles from "./page.module.css";

export async function generateStaticParams() {
  const setups = await getIndustrySetups();
  return setups.map((i) => ({ slug: i.slug }));
}

const ALL_MODULES = Object.keys(MODULE_LABEL) as ModuleKey[];

export default async function IndustrySetupPage({
  params,
}: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const isNew = slug === "new";

  const setup = isNew ? null : await getIndustrySetup(slug);
  if (!isNew && !setup) notFound();

  const customised = isNew ? false : await isCustomised(slug);

  if (isNew || !setup) {
    return (
      <>
        <AdminTopbar title="New industry" />
        <div className={styles.page}>
          <PageShell
            title="Add an industry"
            description="A new industry gets its own profile template, module set and dashboard cards. It appears on the public site and in onboarding as soon as you save."
            action={
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/industries"><ArrowLeft /> All industries</Link>
              </Button>

            }
          >
            <IndustryEditor setup={null} slug="new" customised={false} />
          </PageShell>
        </div>
      </>
    );
  }

  const voice = CATEGORY_VOICE[setup.category] ?? CATEGORY_VOICE.OTHER;
  const sampleReviews = templateSuggestions({
    businessName: `Sample ${setup.name}`,
    category: setup.category,
    city: "Bengaluru",
  });

  return (
    <>
      <AdminTopbar title={setup.name} />
      <div className={styles.page}>
        <PageShell
          title={`${setup.name} setup`}
          description={`Goal: ${setup.primaryGoal}. Dashboard leads with "${setup.heroMetric}".`}
          action={
            <div className={styles.actions}>
              <Badge variant={customised ? "default" : "outline"}>
                {customised ? "Edited" : "Shipped default"}
              </Badge>
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/industries"><ArrowLeft /> All industries</Link>
              </Button>

              <Button asChild variant="ghost" size="sm">
                <a href={`/industries/${setup.slug}`} target="_blank" rel="noreferrer">
                  <ExternalLink /> Marketing page
                </a>
              </Button>
              <Button asChild size="sm">
                <a href={`/b/${setup.slug}`} target="_blank" rel="noreferrer">
                  <ExternalLink /> Live demo profile
                </a>
              </Button>
            </div>
          }
        >
          <div className={styles.summaryGrid}>
            <Card>
              <CardHeader>
                <CardTitle className={styles.iconTitle}>
                  <Target className={styles.titleIcon} /> Profile buttons
                </CardTitle>
                <CardDescription>In this order, as the four big tiles.</CardDescription>
              </CardHeader>
              <CardContent className={styles.actionList}>
                {setup.primaryActions.map((a, i) => (
                  <div key={a} className={styles.primaryAction}>
                    <span className={styles.actionIndex}>
                      {i + 1}
                    </span>
                    <span className={styles.actionLabel}>{a}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className={styles.iconTitle}>
                  <Package className={styles.titleIcon} /> Hardware kit
                </CardTitle>
                <CardDescription>What usually ships on the first order.</CardDescription>
              </CardHeader>
              <CardContent className={styles.kitList}>
                {setup.kit.map((k) => (
                  <p key={k} className={styles.kitItem}>
                    <Check className={styles.kitIcon} /> {k}
                  </p>
                ))}
                <Button asChild variant="outline" size="sm" className={styles.storeButton}>
                  <Link href="/store">Open the store</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className={styles.panelTitle}>Plan required</CardTitle>
                <CardDescription>Follows from the modules, not set separately.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className={cn("display", styles.planName)}>{setup.plan}</p>
                <p className={styles.planNote}>
                  {setup.modules.length} of {ALL_MODULES.length} modules enabled at onboarding.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Modules</CardTitle>
              <CardDescription>
                Green is on at onboarding. Anything off can still be enabled later — it just
                isn&apos;t there on day one, so the dashboard stays legible.
              </CardDescription>
            </CardHeader>
            <CardContent className={styles.moduleGrid}>
              {ALL_MODULES.map((m) => {
                const on = setup.modules.includes(m);
                return (
                  <div
                    key={m}
                    className={cn(
                      styles.moduleTile,
                      on ? styles.moduleTileOn : styles.moduleTileOff
                    )}
                  >
                    {on
                      ? <Check className={styles.moduleIconOn} />
                      : <X className={styles.moduleIconOff} />}
                    {MODULE_LABEL[m]}
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dashboard KPIs</CardTitle>
              <CardDescription>
                The four cards this industry sees first. A clinic leads with appointments, a
                restaurant with sales — showing everyone the same four is what made the dashboards
                feel generic.
              </CardDescription>
            </CardHeader>
            <CardContent className={styles.kpiGrid}>
              {setup.kpis.map((k, i) => (
                <div key={k} className={styles.kpi}>
                  <p className={styles.kpiIndex}>
                    Card {i + 1}
                  </p>
                  <p className={styles.kpiLabel}>{KPI_LIBRARY[k].label}</p>
                  <p className={styles.kpiSub}>{KPI_LIBRARY[k].sub}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Edit this setup</CardTitle>
              <CardDescription>
                Changes apply to every tenant in this industry on their next page load. The shipped
                default stays underneath — resetting brings it back.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <IndustryEditor setup={setup} slug={slug} customised={customised} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Review voice</CardTitle>
              <CardDescription>
                Inherits the <strong>{voice.label}</strong> vocabulary. These are the drafts a happy
                customer would be offered after scanning — note they name the service and the area,
                which is what makes them worth more to the listing than &ldquo;great service&rdquo;.
              </CardDescription>
            </CardHeader>
            <CardContent className={styles.voiceBody}>
              <div className={styles.keywords}>
                {voice.keywords.map((k) => (
                  <Badge key={k} variant="secondary">{k}</Badge>
                ))}
              </div>
              {sampleReviews.map((r, i) => (
                <p key={i} className={styles.sampleReview}>
                  {r}
                </p>
              ))}
            </CardContent>
          </Card>
        </PageShell>
      </div>
    </>
  );
}

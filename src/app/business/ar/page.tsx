import { AlertTriangle, Boxes, ExternalLink, QrCode, ScanLine } from "lucide-react";
import { BusinessTopbar } from "@/components/business/topbar";
import { PageShell } from "@/components/dashboard/page-shell";
import { EntityDialog } from "@/components/admin/entity-dialog";
import { ArTargetDialog } from "@/components/ar/ar-target-dialog";
import { toggleArPublished } from "@/app/business/ar/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getArExperiences } from "@/lib/repos/ar";
import { AR_CONTENT, VERDICT_COPY, type ArContentType } from "@/lib/ar";
import { tenantForSlug } from "@/lib/tenant";
import { getCurrentUser } from "@/lib/session";
import { getIndustrySetup } from "@/lib/repos/industry";
import { notFound } from "next/navigation";
import { cn } from "@/lib/utils";
import styles from "./page.module.css";

function verdictOf(score: number | null) {
  if (score === null) return "USABLE" as const;
  return score >= 75 ? ("GOOD" as const) : score >= 45 ? ("USABLE" as const) : ("POOR" as const);
}

export default async function BusinessArPage() {
  const user = await getCurrentUser();
  const tenant = tenantForSlug(user?.clientId);

  /**
   * Hiding the nav link isn't access control — someone can still type the
   * URL. A trade with AR switched off gets a 404 rather than an empty page
   * that looks broken.
   */
  const setup = await getIndustrySetup(tenant.slug);
  if (setup && !setup.modules.includes("ar")) notFound();

  const experiences = await getArExperiences(tenant.slug);

  const live = experiences.filter((e) => e.isPublished);
  const notReady = experiences.filter((e) => !e.targetMindUrl);
  const totalScans = experiences.reduce((t, e) => t + e.scans, 0);

  return (
    <>
      <BusinessTopbar title="AR" />
      <div className={styles.page}>
        <PageShell
          title="Augmented reality"
          description="A customer points their camera at your printed flyer, card or menu and a video plays locked to the print. No app to install — it runs in the browser."
          action={<EntityDialog entity="arExperience" label="New experience" />}
        >
          <div className={styles.statGrid}>
            <Card className={styles.statCard}>
              <p className={styles.statLabel}>Experiences</p>
              <p className={cn("display", styles.statValue)}>{experiences.length}</p>
            </Card>
            <Card className={styles.statCard}>
              <p className={styles.statLabel}>Live</p>
              <p className={cn("display", styles.statValue)}>{live.length}</p>
            </Card>
            <Card className={styles.statCard}>
              <p className={styles.statLabel}>Views</p>
              <p className={cn("display", styles.statValue)}>
                {totalScans.toLocaleString("en-IN")}
              </p>
            </Card>
            <Card className={notReady.length ? cn(styles.warningCard, styles.statCard) : styles.statCard}>
              <p className={styles.statLabel}>Awaiting a target</p>
              <p className={cn("display", styles.statValue)}>{notReady.length}</p>
            </Card>
          </div>

          {notReady.length > 0 && (
            <Card className={styles.warningCard}>
              <CardHeader>
                <div className={styles.alertRow}>
                  <span className={styles.alertIcon}>
                    <AlertTriangle className={styles.alertGlyph} strokeWidth={1.9} />
                  </span>
                  <div>
                    <CardTitle className={styles.calloutTitle}>
                      {notReady.length} {notReady.length === 1 ? "experience needs" : "experiences need"} a
                      compiled target
                    </CardTitle>
                    <CardDescription className={styles.alertDescription}>
                      Uploading the artwork isn&apos;t enough on its own — tracking data has to be
                      generated from it before the camera has anything to recognise. Until that
                      exists, the viewer opens the camera and never finds the image.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          )}

          <div className={styles.experienceGrid}>
            {experiences.map((e) => {
              const verdict = verdictOf(e.targetQuality);
              const content = AR_CONTENT[e.contentType as ArContentType] ?? AR_CONTENT.VIDEO;

              return (
                <Card key={e.slug} className={cn(!e.isPublished && styles.draftCard)}>
                  <CardHeader>
                    <div className={styles.experienceHead}>
                      <div>
                        <CardTitle className={styles.experienceTitle}>
                          <Boxes className={styles.titleIcon} />
                          {e.name}
                        </CardTitle>
                        <CardDescription className={styles.experienceMeta}>
                          {content.label} · {e.scans.toLocaleString("en-IN")} views
                        </CardDescription>
                      </div>
                      <Badge variant={e.isPublished ? "success" : "outline"}>
                        {e.isPublished ? "Live" : "Draft"}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className={styles.experienceContent}>
                    {e.targetQuality !== null && (
                      <div className={styles.quality}>
                        <div className={styles.qualityRow}>
                          <span>How well the artwork tracks</span>
                          <span
                            className={cn(
                              styles.score,
                              verdict === "GOOD" && styles.scoreGood,
                              verdict === "USABLE" && styles.scoreUsable,
                              verdict === "POOR" && styles.scorePoor
                            )}
                          >
                            {e.targetQuality}/100
                          </span>
                        </div>
                        <Progress value={e.targetQuality} />
                        <p className={styles.verdictNote}>
                          {VERDICT_COPY[verdict]}
                        </p>
                      </div>
                    )}

                    {!e.targetMindUrl && (
                      <p className={styles.noTargetNote}>
                        No tracking data yet — the camera has nothing to recognise.
                      </p>
                    )}

                    <div className={styles.actions}>
                      <ArTargetDialog
                        slug={e.slug}
                        name={e.name}
                        hasTarget={Boolean(e.targetMindUrl)}
                      />

                      <Button asChild variant="outline" size="sm" disabled={!e.targetMindUrl}>
                        <a href={`/ar/${e.slug}`} target="_blank" rel="noreferrer">
                          <ScanLine /> Test <ExternalLink />
                        </a>
                      </Button>

                      <Button asChild variant="ghost" size="sm">
                        <a href={`/api/qr/${e.slug}?f=png&d=1`}>
                          <QrCode /> Print code
                        </a>
                      </Button>

                      {/* Publishing needs a target — the action refuses without one. */}
                      <form action={toggleArPublished} className={styles.publishForm}>
                        <input type="hidden" name="slug" value={e.slug} />
                        <input type="hidden" name="next" value={String(!e.isPublished)} />
                        <Button
                          type="submit"
                          variant="ghost"
                          size="sm"
                          disabled={!e.targetMindUrl && !e.isPublished}
                          title={
                            !e.targetMindUrl && !e.isPublished
                              ? "Compile a target before publishing"
                              : undefined
                          }
                        >
                          {e.isPublished ? "Unpublish" : "Publish"}
                        </Button>
                      </form>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className={styles.tipCard}>
            <CardHeader>
              <CardTitle className={styles.calloutTitle}>What makes artwork track well</CardTitle>
              <CardDescription>
                Worth getting right before a print run, because it can&apos;t be fixed afterwards.
                Tracking works by finding distinctive detail — a photograph, texture, or busy
                artwork gives it plenty. Large areas of flat colour give it nothing, and a repeating
                pattern is worse still, because the camera can&apos;t tell one repeat from another
                and the overlay jumps between them.
                <br />
                <br />
                A visiting card with a logo on white will score badly. The same card with a
                photograph on it will score well.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className={styles.noteCard}>
            <CardHeader>
              <CardTitle className={styles.calloutTitle}>Why this runs in the browser</CardTitle>
              <CardDescription>
                The competing products need an app installed before anything happens, which loses
                most people at the first step. This opens from the same QR code as everything else
                and uses the browser camera. The tracking library is around 500KB and loads only on
                this page — your smart profile stays light.
              </CardDescription>
            </CardHeader>
          </Card>
        </PageShell>
      </div>
    </>
  );
}

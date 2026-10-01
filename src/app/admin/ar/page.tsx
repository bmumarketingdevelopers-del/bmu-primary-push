import { AlertTriangle, Boxes, ExternalLink, ScanLine } from "lucide-react";
import { AdminTopbar } from "@/components/admin/topbar";
import { PageShell } from "@/components/dashboard/page-shell";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getArExperiences } from "@/lib/repos/ar";
import { VERDICT_COPY } from "@/lib/ar";
import { cn } from "@/lib/utils";
import styles from "./page.module.css";

function verdictOf(score: number | null) {
  if (score === null) return "USABLE" as const;
  return score >= 75 ? ("GOOD" as const) : score >= 45 ? ("USABLE" as const) : ("POOR" as const);
}

export default async function AdminArPage() {
  const experiences = await getArExperiences();

  const live = experiences.filter((e) => e.isPublished);
  const awaitingTarget = experiences.filter((e) => !e.targetMindUrl);
  const poorTargets = experiences.filter(
    (e) => e.targetQuality !== null && e.targetQuality < 45
  );
  const totalViews = experiences.reduce((t, e) => t + e.scans, 0);

  return (
    <>
      <AdminTopbar title="AR experiences" />
      <div className={styles.page}>
        <PageShell
          title="AR across all accounts"
          description="Every experience your clients have built. This is the screen that catches an experience that was printed but never worked."
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
                {totalViews.toLocaleString("en-IN")}
              </p>
            </Card>
            <Card className={cn(styles.statCard, awaitingTarget.length > 0 && styles.warningCard)}>
              <p className={styles.statLabel}>No target compiled</p>
              <p className={cn("display", styles.statValue)}>{awaitingTarget.length}</p>
            </Card>
          </div>

          {poorTargets.length > 0 && (
            <Card className={styles.dangerCard}>
              <CardHeader>
                <div className={styles.alert}>
                  <span className={styles.alertIcon}>
                    <AlertTriangle className={styles.alertGlyph} strokeWidth={1.9} />
                  </span>
                  <div>
                    <CardTitle className={styles.calloutTitle}>
                      {poorTargets.length} {poorTargets.length === 1 ? "experience is" : "experiences are"} using
                      artwork that won&apos;t track
                    </CardTitle>
                    <CardDescription className={styles.alertBody}>
                      {poorTargets.map((e) => `${e.businessName} — ${e.name}`).join("; ")}. If any of
                      these have already gone to print, the client will blame the product rather
                      than the artwork. Worth a call before they find out from a customer.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          )}

          {awaitingTarget.length > 0 && (
            <Card className={styles.warningCard}>
              <CardHeader>
                <CardTitle className={styles.calloutTitle}>
                  {awaitingTarget.length} {awaitingTarget.length === 1 ? "experience has" : "experiences have"} no
                  compiled target
                </CardTitle>
                <CardDescription>
                  Created but never finished. These open a camera that never recognises anything —
                  the worst possible first impression of the feature.
                </CardDescription>
              </CardHeader>
            </Card>
          )}

          <Card className={styles.tableCard}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Experience</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Content</TableHead>
                  <TableHead className={styles.qualityHead}>Tracking quality</TableHead>
                  <TableHead className={styles.numericHead}>Views</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {experiences.map((e) => {
                  const verdict = verdictOf(e.targetQuality);
                  return (
                    <TableRow key={e.slug}>
                      <TableCell>
                        <span className={styles.experienceName}>
                          <Boxes className={styles.experienceIcon} />
                          {e.name}
                        </span>
                        <span className={styles.experiencePath}>
                          /ar/{e.slug}
                        </span>
                      </TableCell>
                      <TableCell className={styles.clientCell}>
                        {e.businessName}
                      </TableCell>
                      <TableCell className={styles.mutedCell}>{e.contentType.toLowerCase()}</TableCell>
                      <TableCell>
                        {e.targetMindUrl ? (
                          <>
                            <Progress value={e.targetQuality ?? 0} />
                            <span
                              className={cn(
                                styles.quality,
                                verdict === "POOR" ? styles.qualityPoor : styles.qualityOk
                              )}
                            >
                              {e.targetQuality}/100 · {VERDICT_COPY[verdict]}
                            </span>
                          </>
                        ) : (
                          <Badge variant="warning">Not compiled</Badge>
                        )}
                      </TableCell>
                      <TableCell className={styles.numericCell}>{e.scans.toLocaleString("en-IN")}</TableCell>
                      <TableCell>
                        <Badge variant={e.isPublished ? "success" : "outline"}>
                          {e.isPublished ? "Live" : "Draft"}
                        </Badge>
                      </TableCell>
                      <TableCell className={styles.actionCell}>
                        <Button asChild variant="ghost" size="sm" disabled={!e.targetMindUrl}>
                          <a href={`/ar/${e.slug}`} target="_blank" rel="noreferrer">
                            <ScanLine /> Test <ExternalLink />
                          </a>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}

                {experiences.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className={styles.emptyCell}>
                      No AR experiences yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>

          <Card className={styles.noteCard}>
            <CardHeader>
              <CardTitle className={styles.calloutTitle}>Which clients get AR</CardTitle>
              <CardDescription>
                Enabled for trades that print marketing worth animating — real estate, restaurants,
                hotels, jewellery, automobile, interiors, colleges, travel and D2C. Not enabled for
                clinics, gyms or professional services, where there is no print run to put it on.
                Change it per industry in Industry setups.
              </CardDescription>
            </CardHeader>
          </Card>
        </PageShell>
      </div>
    </>
  );
}

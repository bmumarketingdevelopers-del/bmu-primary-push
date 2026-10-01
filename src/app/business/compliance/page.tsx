import { AlertTriangle, BadgeCheck, ExternalLink, ShieldCheck } from "lucide-react";
import { BusinessTopbar } from "@/components/business/topbar";
import { PageShell } from "@/components/dashboard/page-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { complianceFor, complianceGaps, complianceScore } from "@/lib/compliance";
import { getBusiness } from "@/lib/qr-platform";
import { tenantForSlug } from "@/lib/tenant";
import { getCurrentUser } from "@/lib/session";
import { cn } from "@/lib/utils";
import styles from "./page.module.css";

export default async function CompliancePage() {
  const user = await getCurrentUser();
  const fallback = tenantForSlug(user?.clientId);
  const business = (await getBusiness(fallback.slug)) ?? fallback;

  const states = complianceFor(business.category, business.licences ?? {});
  const gaps = complianceGaps(states);
  const score = complianceScore(states);
  const malformed = states.filter((s) => s.present && !s.looksValid);

  return (
    <>
      <BusinessTopbar title="Licences" />
      <div className={styles.page}>
        <PageShell
          title="Licences and compliance"
          description="Numbers your trade is obliged to display where customers can see them. On a digital menu or profile, that means here."
          action={
            <Badge variant={gaps.length === 0 ? "success" : "warning"}>
              {score}% displayed
            </Badge>
          }
        >
          {gaps.length > 0 ? (
            <Card className={styles.warningCard}>
              <CardHeader>
                <div className={styles.statusRow}>
                  <span className={cn(styles.statusIcon, styles.statusIconWarning)}>
                    <AlertTriangle className={styles.statusGlyph} strokeWidth={1.9} />
                  </span>
                  <div>
                    <CardTitle className={styles.calloutTitle}>
                      {gaps.length} required {gaps.length === 1 ? "number" : "numbers"} not displayed
                    </CardTitle>
                    <CardDescription className={styles.statusDescription}>
                      {gaps.map((g) => g.def.short).join(", ")} — your profile is the customer-facing
                      surface now, so it&apos;s where these belong. Add them below and they appear
                      immediately.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ) : (
            <Card className={styles.successCard}>
              <CardHeader>
                <div className={styles.statusRow}>
                  <span className={cn(styles.statusIcon, styles.statusIconSuccess)}>
                    <ShieldCheck className={styles.statusGlyph} strokeWidth={1.9} />
                  </span>
                  <div>
                    <CardTitle className={styles.calloutTitle}>Everything required is displayed</CardTitle>
                    <CardDescription className={styles.statusDescription}>
                      A customer can see and verify your registrations from the profile.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Displayed on your profile</CardTitle>
              <CardDescription>
                Marked required where your trade is obliged to show it. Everything else is optional
                and shows only if you fill it in.
              </CardDescription>
            </CardHeader>
            <CardContent className={styles.formContent}>
              <div className={styles.scoreBlock}>
                <div className={styles.scoreRow}>
                  <span>Required numbers on display</span>
                  <span className={styles.scoreValue}>{score}%</span>
                </div>
                <Progress value={score} />
              </div>

              <form className={styles.licenceForm}>
                {states.map((s) => (
                  <div key={s.key} className={styles.field}>
                    <div className={styles.fieldHead}>
                      <Label htmlFor={s.key}>{s.def.label}</Label>
                      {s.required && <Badge variant="warning">Required for your trade</Badge>}
                      {s.present && s.looksValid && (
                        <BadgeCheck className={styles.validIcon} />
                      )}
                    </div>

                    <Input
                      id={s.key}
                      name={s.key}
                      defaultValue={s.value ?? ""}
                      placeholder={s.def.placeholder}
                      className={cn(!s.looksValid && styles.inputWarning)}
                    />

                    <p className={styles.requirement}>{s.def.requirement}</p>

                    {!s.looksValid && (
                      <p className={styles.formatWarning}>
                        That doesn&apos;t match the usual format. It will still be displayed — check
                        it against your certificate.
                      </p>
                    )}

                    {s.def.verifyUrl && (
                      <a
                        href={s.def.verifyUrl}
                        target="_blank"
                        rel="noreferrer"
                        className={styles.registerLink}
                      >
                        Official register <ExternalLink className={styles.registerIcon} />
                      </a>
                    )}
                  </div>
                ))}

                <Button type="submit" disabled title="Save is wired in the profile editor">
                  Save licences
                </Button>
              </form>
            </CardContent>
          </Card>

          {malformed.length > 0 && (
            <Card className={styles.noteCard}>
              <CardHeader>
                <CardTitle className={styles.calloutTitle}>Why a wrong-looking number still shows</CardTitle>
                <CardDescription>
                  Format checks here are advisory. Refusing to display a number because it failed
                  our pattern would be worse than displaying one that looks unusual — the legal
                  obligation is to show it, and our regex isn&apos;t the authority on what&apos;s valid.
                </CardDescription>
              </CardHeader>
            </Card>
          )}
        </PageShell>
      </div>
    </>
  );
}

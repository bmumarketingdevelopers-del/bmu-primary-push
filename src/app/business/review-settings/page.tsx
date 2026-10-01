import { AlertTriangle, Star } from "lucide-react";
import { BusinessTopbar } from "@/components/business/topbar";
import { PageShell } from "@/components/dashboard/page-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CATEGORY_VOICE, templateSuggestions } from "@/lib/review-suggestions";
import { getCurrentUser } from "@/lib/session";
import { tenantForSlug } from "@/lib/tenant";
import { aiConfigured } from "@/lib/ai";
import styles from "./page.module.css";

export default async function ReviewSettingsPage() {
  const user = await getCurrentUser();
  const business = tenantForSlug(user?.clientId);
  const voice = CATEGORY_VOICE[business.category] ?? CATEGORY_VOICE.OTHER;

  const preview = templateSuggestions({
    businessName: business.name,
    category: business.category,
    city: business.city,
    services: business.services.map((s) => s.name),
  });

  return (
    <>
      <BusinessTopbar title="Review settings" />
      <div className={styles.page}>
        <PageShell
          title="Review suggestions"
          description="When a customer says their experience was good, we offer three drafts they can edit and post. The blank Google text box is where most review requests die."
          action={
            <Badge variant={aiConfigured() ? "success" : "outline"}>
              {aiConfigured() ? "AI writing" : "Template writing"}
            </Badge>
          }
        >
          <Card className={styles.guidelineCard}>
            <CardHeader>
              <div className={styles.alertRow}>
                <span className={styles.alertIcon}>
                  <AlertTriangle className={styles.alertGlyph} strokeWidth={1.9} />
                </span>
                <div>
                  <CardTitle className={styles.calloutTitle}>Where the line is</CardTitle>
                  <CardDescription className={styles.alertDescription}>
                    Google prohibits fake and incentivised reviews, and enforcement removes every
                    review a listing ever collected — not just the bad ones. So: suggestions are
                    shown only to customers who said their experience was good, they edit and post
                    from their own account, and nothing is ever offered in exchange. Never put
                    &ldquo;get 10% off for a review&rdquo; on a standee.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <div className={styles.settingsGrid}>
            <Card>
              <CardHeader>
                <CardTitle className={styles.cardTitle}>Search terms to work in</CardTitle>
                <CardDescription>
                  This is what makes a suggested review worth more than &ldquo;great service&rdquo;.
                  A review mentioning your service and area helps the listing rank for it.
                </CardDescription>
              </CardHeader>
              <CardContent className={styles.settingsContent}>
                <div className={styles.field}>
                  <Label htmlFor="keywords">Keywords</Label>
                  <textarea
                    id="keywords"
                    rows={5}
                    defaultValue={voice.keywords.join("\n")}
                    className={styles.keywords}
                  />
                  <p className={styles.fieldHint}>
                    One per line. Pre-filled for {voice.label.toLowerCase()} businesses.
                  </p>
                </div>
                <div className={styles.field}>
                  <Label htmlFor="area">Area or landmark</Label>
                  <Input id="area" defaultValue={business.city} placeholder="Indiranagar" />
                </div>
                <Button size="sm" disabled title="Not wired to a save action yet">Save settings</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className={styles.previewTitle}>
                  <Star className={styles.titleIcon} /> What customers see
                </CardTitle>
                <CardDescription>
                  Three lengths, because people pick the one that sounds like them. New options are
                  generated each time — no two customers get identical text.
                </CardDescription>
              </CardHeader>
              <CardContent className={styles.previewList}>
                {preview.map((p, i) => (
                  <p key={i} className={styles.suggestion}>
                    {p}
                  </p>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className={styles.calloutTitle}>Industry voice</CardTitle>
              <CardDescription>
                Seventeen category templates cover all 27 industries on the site. Each has its own
                vocabulary — a salon review reads nothing like a car workshop review.
              </CardDescription>
            </CardHeader>
            <CardContent className={styles.voiceList}>
              {Object.values(CATEGORY_VOICE).map((v) => (
                <Badge key={v.label} variant={v.label === voice.label ? "solid" : "outline"}>
                  {v.label}
                </Badge>
              ))}
            </CardContent>
          </Card>
        </PageShell>
      </div>
    </>
  );
}

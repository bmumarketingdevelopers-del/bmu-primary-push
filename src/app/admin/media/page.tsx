import { AdminTopbar } from "@/components/admin/topbar";
import { PageShell } from "@/components/dashboard/page-shell";
import { MediaUploader } from "@/components/admin/media-uploader";
import { MediaBrowser } from "@/components/admin/media-browser";
import { MEDIA_ASSETS } from "@/lib/admin-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { storageConfigured, ALLOWED_TYPES } from "@/lib/storage";
import styles from "./page.module.css";

export default function AdminMediaPage() {
  const ready = storageConfigured();

  return (
    <>
      <AdminTopbar title="Media" />
      <div className={styles.page}>
        <PageShell
          title="Media library"
          description="Creative, footage and documents, organised by client and project. Files upload straight from the browser to Cloudflare R2 — they never pass through the app server."
          action={
            <Badge variant={ready ? "success" : "warning"}>
              {ready ? "R2 connected" : "Storage not configured"}
            </Badge>
          }
        >
          {!ready && (
            <Card className={styles.cardWarning}>
              <CardHeader>
                <CardTitle className={styles.calloutTitle}>Add your R2 credentials</CardTitle>
                <CardDescription>
                  Uploads are validated and refused cleanly until these exist in .env — nothing breaks,
                  it just tells you what&apos;s missing.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <pre className={styles.envSnippet}>
{`R2_ACCOUNT_ID="..."
R2_ACCESS_KEY_ID="..."
R2_SECRET_ACCESS_KEY="..."
R2_BUCKET="bmu-media"
R2_PUBLIC_URL="https://media.bmu.marketing"`}
                </pre>
              </CardContent>
            </Card>
          )}

          <MediaUploader />

          <Card>
            <CardHeader>
              <CardTitle className={styles.calloutTitle}>What&apos;s accepted</CardTitle>
              <CardDescription>
                Type and size are checked server-side before a signed URL is issued. A presigned URL is
                permission to write to your bucket, so it&apos;s never handed out on the client&apos;s word alone.
              </CardDescription>
            </CardHeader>
            <CardContent className={styles.typeList}>
              {ALLOWED_TYPES.map((t) => (
                <Badge key={t} variant="outline">{t}</Badge>
              ))}
              <Badge variant="secondary">Max 25 MB</Badge>
            </CardContent>
          </Card>
          <MediaBrowser assets={MEDIA_ASSETS} />

        </PageShell>
      </div>
    </>
  );
}

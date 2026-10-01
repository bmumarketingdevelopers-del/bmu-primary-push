import { ExternalLink } from "lucide-react";
import { BusinessTopbar } from "@/components/business/topbar";
import { PageShell } from "@/components/dashboard/page-shell";
import { AppearanceEditor } from "@/components/business/appearance-editor";
import { Button } from "@/components/ui/button";
import { getBusiness } from "@/lib/qr-platform";
import { getProfileTheme } from "@/lib/repos/theme";
import { tenantForSlug } from "@/lib/tenant";
import { getCurrentUser } from "@/lib/session";
import styles from "./page.module.css";

export default async function AppearancePage() {
  const user = await getCurrentUser();
  const fallback = tenantForSlug(user?.clientId);
  const business = (await getBusiness(fallback.slug)) ?? fallback;
  const theme = await getProfileTheme(business.slug, business.category);

  return (
    <>
      <BusinessTopbar title="Appearance" />
      <div className={styles.page}>
        <PageShell
          title="Appearance"
          description="How your page looks the moment someone scans. Change anything and the preview updates instantly — nothing goes live until you save."
          action={
            <Button asChild variant="outline" size="sm">
              <a href={`/b/${business.slug}`} target="_blank" rel="noreferrer">
                <ExternalLink /> View live page
              </a>
            </Button>
          }
        >
          <AppearanceEditor business={business} theme={theme} />
        </PageShell>
      </div>
    </>
  );
}

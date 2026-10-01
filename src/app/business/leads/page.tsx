import { BusinessTopbar } from "@/components/business/topbar";
import { PageShell } from "@/components/dashboard/page-shell";
import { LeadTable } from "@/components/lead-table";
import { BUSINESS_LEADS } from "@/lib/business-data";
import styles from "./page.module.css";

export default function BusinessLeadsPage() {
  return (
    <>
      <BusinessTopbar title="Leads" />
      <div className={styles.page}>
        <PageShell
          title="Leads"
          description="Captured from your QR codes, offers and WhatsApp button. Reply inside an hour and conversion roughly doubles."
        >
          <LeadTable leads={BUSINESS_LEADS} showMessage />
        </PageShell>
      </div>
    </>
  );
}

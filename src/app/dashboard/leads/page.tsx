import { Topbar } from "@/components/dashboard/topbar";
import { PageShell } from "@/components/dashboard/page-shell";
import { LeadTable } from "@/components/lead-table";
import { getClientLeads } from "@/lib/repos/client";
import { getCurrentUser } from "@/lib/session";
import styles from "./page.module.css";

export default async function LeadsPage() {
  const user = await getCurrentUser();
  const { data: leads } = await getClientLeads(user?.clientId);

  return (
    <>
      <Topbar title="Leads" />
      <div className={styles.content}>
        <PageShell
          title="Lead tracking"
          description="Every enquiry across Meta, Google, organic, WhatsApp and QR scans, deduplicated by phone number. Filter by date and export what you see."
        >
          <LeadTable leads={leads} />
        </PageShell>
      </div>
    </>
  );
}

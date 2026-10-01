import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { isAdmin } from "@/lib/roles";
import { leadStorage, listWebsiteLeads } from "@/lib/website-leads";
import { LeadsDashboard } from "@/components/admin-portal/leads-dashboard";

export const metadata: Metadata = {
  title: "Admin portal",
  robots: { index: false, follow: false },
};

// Always read fresh — a lead submitted a second ago should be here on refresh
export const dynamic = "force-dynamic";

export default async function AdminPortalPage() {
  // The proxy already guards this route; checked again here in case the matcher ever changes
  const session = await auth();
  if (!session?.user) redirect("/login?next=/admin-portal");
  if (!isAdmin(session.user.role)) redirect("/login");

  let leads: Awaited<ReturnType<typeof listWebsiteLeads>> = [];
  let loadError = false;
  try {
    leads = await listWebsiteLeads();
  } catch (err) {
    console.error("[admin-portal] couldn't load website leads:", err);
    loadError = true;
  }

  return (
    <LeadsDashboard
      leads={leads}
      storage={leadStorage()}
      loadError={loadError}
      userName={session.user.name ?? session.user.email ?? "Admin"}
    />
  );
}

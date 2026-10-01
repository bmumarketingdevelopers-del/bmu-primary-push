import { ShieldCheck } from "lucide-react";
import { AdminTopbar } from "@/components/admin/topbar";
import { PageShell } from "@/components/dashboard/page-shell";
import { PermissionMatrix } from "@/components/admin/permission-matrix";
import { SubRoles } from "@/components/admin/sub-roles";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getCurrentUser } from "@/lib/session";
import { MODULES, ROLE_SUMMARY } from "@/lib/permissions";
import { ROLES } from "@/lib/roles";
import styles from "./page.module.css";

export default async function AdminRolesPage() {
  const user = await getCurrentUser();
  const canEdit = user?.role === "OWNER";

  return (
    <>
      <AdminTopbar title="Access control" />
      <div className={styles.page}>
        <PageShell
          title="Who can see what"
          description="Seventeen modules across five groups. Set the default for each role here, then grant individuals extra access when you add them."
          action={<Badge variant={canEdit ? "success" : "outline"}>{canEdit ? "You can edit" : "View only"}</Badge>}
        >
          <Card>
            <CardHeader>
              <CardTitle className={styles.rolesTitle}>
                <ShieldCheck className={styles.rolesIcon} /> The six roles
              </CardTitle>
              <CardDescription>
                Roles map to the Role enum in the database, so permissions stay consistent between
                the app and the data.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <dl className={styles.roleList}>
                {ROLES.map((r) => (
                  <div key={r} className={styles.roleRow}>
                    <dt className={styles.roleName}>
                      <Badge variant={r === "OWNER" ? "solid" : "outline"}>{r}</Badge>
                    </dt>
                    <dd className={styles.roleSummary}>{ROLE_SUMMARY[r]}</dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>

          <SubRoles canEdit={canEdit} />

          <PermissionMatrix canEdit={canEdit} />

          <Card>
            <CardHeader>
              <CardTitle className={styles.rulesTitle}>Two rules that aren&apos;t configurable</CardTitle>
              <CardDescription>
                <strong>Denials beat grants.</strong> If someone is explicitly denied a module, no
                role default or later grant re-opens it — the only safe direction for a conflict.
                <br /><br />
                <strong>Money is owner and admin only.</strong> Invoices, financial exports and
                partner commissions can&apos;t be granted to a manager or staff member even by
                ticking the box, because those hold every client&apos;s numbers.
              </CardDescription>
            </CardHeader>
            <CardContent className={styles.restrictedList}>
              {MODULES.filter((m) => m.restrictedTo).map((m) => (
                <Badge key={m.key} variant="warning">{m.label}</Badge>
              ))}
            </CardContent>
          </Card>
        </PageShell>
      </div>
    </>
  );
}

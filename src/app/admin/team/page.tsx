import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { AddEmployee } from "@/components/admin/add-employee";
import { AdminTopbar } from "@/components/admin/topbar";
import { PageShell } from "@/components/dashboard/page-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CLIENTS } from "@/lib/admin-data";
import { getTeamMembers } from "@/lib/repos/agency";
import { cn, initials } from "@/lib/utils";
import styles from "./page.module.css";

const ROLE_NOTES: Record<string, string> = {
  OWNER: "Full access including billing and team management",
  ADMIN: "Everything except billing and role changes",
  MANAGER: "Assigned client accounts, projects and campaigns",
  STAFF: "Assigned projects only, no financial data",
  CLIENT: "Their own dashboard only",
  CREATOR: "Their own bookings and briefs",
};

export default async function AdminTeamPage() {
  const TEAM_MEMBERS = await getTeamMembers();

  return (
    <>
      <AdminTopbar title="Team & roles" />
      <div className={styles.page}>
        <PageShell
          title="Team & roles"
          description="Everyone with access, what they can reach and which accounts they look after."
          action={
            <div className={styles.actions}>
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/roles"><ShieldCheck /> Access control</Link>
              </Button>
              <AddEmployee clients={CLIENTS.map((c) => ({ id: c.id, name: c.name }))} />
            </div>
          }
        >
          <Card className={styles.tableCard}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className={styles.accountsHead}>Accounts</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {TEAM_MEMBERS.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell>
                      <div className={styles.member}>
                        <Avatar className={styles.avatar}>
                          <AvatarFallback className={styles.avatarInitials}>{initials(m.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <span className={styles.memberName}>{m.name}</span>
                          <span className={styles.memberEmail}>{m.email}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell><Badge variant={m.role === "OWNER" ? "solid" : "secondary"}>{m.role}</Badge></TableCell>
                    <TableCell className={styles.accountsCell}>{m.clients}</TableCell>
                    <TableCell>
                      <Badge variant={m.status === "ACTIVE" ? "success" : "warning"}>{m.status.toLowerCase()}</Badge>
                    </TableCell>
                    <TableCell className={styles.actionsCell}>
                      <Button variant="ghost" size="sm" asChild><Link href="/admin/roles">Manage</Link></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          <Card className={styles.rolesCard}>
            <div className={styles.rolesHead}>
              <h3 className={cn("display", styles.rolesTitle)}>What each role can reach</h3>
              <Button asChild variant="ghost" size="sm">
                <Link href="/admin/roles">Change these</Link>
              </Button>
            </div>
            <dl className={styles.roleList}>
              {Object.entries(ROLE_NOTES).map(([role, note]) => (
                <div key={role} className={styles.roleRow}>
                  <dt className={styles.roleName}><Badge variant="outline">{role}</Badge></dt>
                  <dd className={styles.roleNote}>{note}</dd>
                </div>
              ))}
            </dl>
          </Card>
        </PageShell>
      </div>
    </>
  );
}

"use client";

import * as React from "react";
import { AlertCircle, CheckCircle2, Plus, ShieldPlus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { createSubRole, type TeamState } from "@/app/admin/roles/actions";
import {
  ACTION_LABEL, DEMO_CUSTOM_ROLES, MODULES, MODULE_GROUPS, ROLE_DEFAULTS,
  isGrantable, type Action,
} from "@/lib/permissions";
import type { AppRole } from "@/lib/roles";
import { cn } from "@/lib/utils";
import styles from "./sub-roles.module.css";

const initial: TeamState = { ok: false, message: null };
const BASES: AppRole[] = ["STAFF", "MANAGER", "ADMIN"];

export function SubRoles({ canEdit }: { canEdit: boolean }) {
  const [open, setOpen] = React.useState(false);
  const [base, setBase] = React.useState<AppRole>("STAFF");
  const [state, action, pending] = React.useActionState(createSubRole, initial);

  // The ceiling: a STAFF sub-role can hold at most what a MANAGER holds.
  const ceiling = ROLE_DEFAULTS[base === "STAFF" ? "MANAGER" : base] ?? {};

  return (
    <Card>
      <CardHeader className={styles.header}>
        <div>
          <CardTitle className={styles.title}>
            <ShieldPlus className={styles.titleIcon} /> Sub-roles
          </CardTitle>
          <CardDescription>
            Narrower roles built on top of the six built-in ones — a content editor who never sees
            client data, a media buyer who never sees invoices.
          </CardDescription>
        </div>

        {canEdit && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm"><Plus /> New sub-role</Button>
            </DialogTrigger>

            <DialogContent className={styles.dialog}>
              <DialogHeader>
                <DialogTitle>Create a sub-role</DialogTitle>
                <DialogDescription>
                  Pick a base role, then tick exactly what this sub-role can reach. Anything above
                  the base role is dropped on save rather than silently granted.
                </DialogDescription>
              </DialogHeader>

              <form action={action} className={styles.form}>
                <div className={styles.fieldRow}>
                  <div className={styles.field}>
                    <Label htmlFor="sr-name">Name</Label>
                    <Input id="sr-name" name="name" required placeholder="Content editor" />
                  </div>
                  <div className={styles.field}>
                    <Label htmlFor="sr-base">Based on</Label>
                    <select
                      id="sr-base"
                      name="baseRole"
                      value={base}
                      onChange={(e) => setBase(e.target.value as AppRole)}
                      className={styles.select}
                    >
                      {BASES.map((b) => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                  <div className={cn(styles.field, styles.fieldWide)}>
                    <Label htmlFor="sr-desc">What is this for?</Label>
                    <Input id="sr-desc" name="description" placeholder="Writes the blog, never sees client data" />
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <Label>Access</Label>
                  <p className={styles.hint}>
                    Greyed-out modules sit above {base} and can&apos;t be granted to a sub-role built on it.
                  </p>

                  <div className={styles.accessBox}>
                    {MODULE_GROUPS.map((group) => (
                      <div key={group}>
                        <p className={styles.groupLabel}>
                          {group}
                        </p>
                        <div className={styles.moduleList}>
                          {MODULES.filter((m) => m.group === group).map((m) => {
                            const allowed = ceiling[m.key] ?? [];
                            const usable = isGrantable(m.key, base) && allowed.length > 0;
                            return (
                              <div
                                key={m.key}
                                className={cn(styles.moduleRow, !usable && styles.moduleRowLocked)}
                              >
                                <span className={styles.moduleName}>{m.label}</span>
                                <div className={styles.actions}>
                                  {m.actions.map((a: Action) => (
                                    <label
                                      key={a}
                                      className={cn(
                                        styles.action,
                                        usable && allowed.includes(a) ? styles.actionEnabled : styles.actionDisabled
                                      )}
                                    >
                                      <input
                                        type="checkbox"
                                        name={`${m.key}.${a}`}
                                        disabled={!usable || !allowed.includes(a)}
                                        className={styles.checkbox}
                                      />
                                      {ACTION_LABEL[a]}
                                    </label>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {state.message && (
                  <p className={cn(styles.result, state.ok ? styles.resultOk : styles.resultError)}>
                    {state.ok ? <CheckCircle2 className={styles.resultIcon} /> : <AlertCircle className={styles.resultIcon} />}
                    {state.message}
                  </p>
                )}

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={pending}>{pending ? "Creating…" : "Create sub-role"}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>

      <CardContent className={styles.roleGrid}>
        {DEMO_CUSTOM_ROLES.map((r) => (
          <div
            key={r.slug}
            className={cn(styles.roleCard, r.isActive ? styles.roleCardActive : styles.roleCardPaused)}
          >
            <div className={styles.roleHeader}>
              <div>
                <p className={styles.roleName}>{r.name}</p>
                <p className={styles.roleDescription}>{r.description}</p>
              </div>
              <Badge variant={r.isActive ? "success" : "outline"}>{r.isActive ? "Active" : "Paused"}</Badge>
            </div>

            <div className={styles.permissionList}>
              {Object.entries(r.permissions).map(([key, actions]) => (
                <Badge key={key} variant="outline" className={styles.permissionBadge}>
                  {MODULES.find((m) => m.key === key)?.label ?? key} · {actions.join("/")}
                </Badge>
              ))}
            </div>

            <div className={styles.roleFooter}>
              <span className={styles.memberCount}>
                <Users className={styles.memberIcon} /> {r.memberCount} member{r.memberCount === 1 ? "" : "s"}
              </span>
              <span>Based on {r.baseRole}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

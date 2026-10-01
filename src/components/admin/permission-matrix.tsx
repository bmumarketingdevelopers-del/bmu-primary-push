"use client";

import * as React from "react";
import { AlertCircle, CheckCircle2, Lock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { saveRoleMatrix, type TeamState } from "@/app/admin/roles/actions";
import {
  ACTION_LABEL, MODULES, MODULE_GROUPS, ROLE_DEFAULTS, ROLE_SUMMARY,
  isGrantable, type Action,
} from "@/lib/permissions";
import type { AppRole } from "@/lib/roles";
import { cn } from "@/lib/utils";
import styles from "./permission-matrix.module.css";

const EDITABLE: AppRole[] = ["ADMIN", "MANAGER", "STAFF"];
const initial: TeamState = { ok: false, message: null };

export function PermissionMatrix({ canEdit }: { canEdit: boolean }) {
  const [role, setRole] = React.useState<AppRole>("MANAGER");
  const [state, action, pending] = React.useActionState(saveRoleMatrix, initial);

  const defaults = ROLE_DEFAULTS[role] ?? {};

  return (
    <form action={action} className={styles.form}>
      <input type="hidden" name="role" value={role} />

      <Card>
        <CardHeader>
          <CardTitle className={styles.title}>
            <ShieldCheck className={styles.titleIcon} /> Role permissions
          </CardTitle>
          <CardDescription>
            What each role can reach by default. Individual people can be given extra modules on
            top when you add them — this sets the starting point.
          </CardDescription>
        </CardHeader>

        <CardContent className={styles.content}>
          <Tabs value={role} onValueChange={(v) => setRole(v as AppRole)}>
            <TabsList>
              {EDITABLE.map((r) => (
                <TabsTrigger key={r} value={r}>{r}</TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <p className={styles.summary}>
            <strong className={styles.summaryRole}>{role}</strong> — {ROLE_SUMMARY[role]}
          </p>

          {!canEdit && (
            <p className={cn(styles.notice, styles.noticeLocked)}>
              <Lock className={styles.noticeIcon} />
              Only an owner can change permissions. You can see the matrix but not edit it —
              otherwise full access would be one click away for anyone who already has most of it.
            </p>
          )}

          {MODULE_GROUPS.map((group) => {
            const mods = MODULES.filter((m) => m.group === group);
            return (
              <section key={group}>
                <h3 className={styles.groupTitle}>
                  {group}
                </h3>
                <div className={styles.moduleList}>
                  {mods.map((mod) => {
                    const grantable = isGrantable(mod.key, role);
                    const current = defaults[mod.key] ?? [];

                    return (
                      <div
                        key={mod.key}
                        className={cn(styles.moduleRow, !grantable && styles.moduleRowLocked)}
                      >
                        <div className={styles.moduleInfo}>
                          <p className={styles.moduleName}>
                            {mod.label}
                            {mod.restrictedTo && (
                              <Badge variant="outline" className={styles.restrictedBadge}>
                                {mod.restrictedTo.join(" / ")} only
                              </Badge>
                            )}
                          </p>
                          <p className={styles.moduleDescription}>{mod.description}</p>
                        </div>

                        <div className={styles.actions}>
                          {mod.actions.map((a: Action) => (
                            <label
                              key={a}
                              className={cn(
                                styles.action,
                                grantable && canEdit ? styles.actionEnabled : styles.actionDisabled
                              )}
                            >
                              <input
                                type="checkbox"
                                name={`${mod.key}.${a}`}
                                defaultChecked={current.includes(a)}
                                disabled={!grantable || !canEdit}
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
              </section>
            );
          })}

          {state.message && (
            <p className={cn(styles.notice, state.ok ? styles.noticeOk : styles.noticeError)}>
              {state.ok ? <CheckCircle2 className={styles.noticeIcon} /> : <AlertCircle className={styles.noticeIcon} />}
              {state.message}
            </p>
          )}

          {canEdit && (
            <Button type="submit" disabled={pending}>
              {pending ? "Saving…" : `Save ${role} permissions`}
            </Button>
          )}
        </CardContent>
      </Card>
    </form>
  );
}

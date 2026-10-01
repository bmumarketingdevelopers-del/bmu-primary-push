"use client";

import * as React from "react";
import { AlertCircle, CheckCircle2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { inviteEmployee, type TeamState } from "@/app/admin/roles/actions";
import { MODULES, MODULE_GROUPS, ROLE_DEFAULTS, ROLE_SUMMARY, isGrantable } from "@/lib/permissions";
import type { AppRole } from "@/lib/roles";
import { cn } from "@/lib/utils";
import styles from "./add-employee.module.css";

const initial: TeamState = { ok: false, message: null };
const ROLES: AppRole[] = ["ADMIN", "MANAGER", "STAFF"];

const DUTIES = [
  { value: "LEAD", label: "Account lead — owns the relationship" },
  { value: "SUPPORT", label: "Support — helps deliver, not the main contact" },
  { value: "REVIEWER", label: "Reviewer — signs off work before it ships" },
];

export function AddEmployee({ clients }: { clients: { id: string; name: string }[] }) {
  const [open, setOpen] = React.useState(false);
  const [role, setRole] = React.useState<AppRole>("MANAGER");
  const [picked, setPicked] = React.useState<string[]>([]);
  const [state, action, pending] = React.useActionState(inviteEmployee, initial);

  const defaults = ROLE_DEFAULTS[role] ?? {};

  React.useEffect(() => {
    if (state.ok) setPicked([]);
  }, [state.ok]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm"><UserPlus /> Add employee</Button>
      </DialogTrigger>

      <DialogContent className={styles.dialog}>
        <DialogHeader>
          <DialogTitle>Add an employee</DialogTitle>
          <DialogDescription>
            Pick a role, then tick anything extra they need. Assign the accounts they&apos;re
            responsible for so leads and approvals route to the right person.
          </DialogDescription>
        </DialogHeader>

        <form action={action} className={styles.form}>
          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" required placeholder="Priyanka B." />
            </div>
            <div className={styles.field}>
              <Label htmlFor="email">Work email</Label>
              <Input id="email" name="email" type="email" required placeholder="priyanka@bmu.marketing" />
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <Label>Role</Label>
            <div className={styles.roleList}>
              {ROLES.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={cn(
                    styles.roleOption,
                    role === r ? styles.roleOptionSelected : styles.roleOptionIdle
                  )}
                >
                  <span className={cn(styles.radio, role === r ? styles.radioOn : styles.radioOff)}>
                    {role === r && <span className={styles.radioDot} />}
                  </span>
                  <span>
                    <span className={styles.roleName}>{r}</span>
                    <span className={styles.roleSummary}>{ROLE_SUMMARY[r]}</span>
                  </span>
                </button>
              ))}
            </div>
            <input type="hidden" name="role" value={role} />
          </div>

          {/* Extra modules on top of the role default */}
          <div className={styles.fieldGroup}>
            <Label>Extra access</Label>
            <p className={styles.hint}>
              Ticked items are already included in {role}. Tick more to grant beyond the default —
              anything greyed out isn&apos;t available to this role at all.
            </p>

            <div className={styles.moduleBox}>
              {MODULE_GROUPS.map((group) => (
                <div key={group}>
                  <p className={styles.groupLabel}>
                    {group}
                  </p>
                  <div className={styles.moduleGrid}>
                    {MODULES.filter((m) => m.group === group).map((m) => {
                      const included = Boolean(defaults[m.key]);
                      const grantable = isGrantable(m.key, role);
                      return (
                        <label
                          key={m.key}
                          className={cn(
                            styles.moduleOption,
                            grantable ? styles.moduleOptionEnabled : styles.moduleOptionDisabled
                          )}
                        >
                          <input
                            type="checkbox"
                            name={`mod.${m.key}`}
                            defaultChecked={included}
                            disabled={!grantable}
                            className={styles.checkbox}
                          />
                          {m.label}
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Responsibility */}
          <div className={styles.fieldGroup}>
            <Label htmlFor="duty">Responsibility</Label>
            <select
              id="duty"
              name="duty"
              className={styles.select}
            >
              {DUTIES.map((d) => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </select>
          </div>

          <div className={styles.fieldGroup}>
            <Label>Accounts they look after</Label>
            <div className={styles.clientList}>
              {clients.map((c) => {
                const on = picked.includes(c.id);
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() =>
                      setPicked((p) => (on ? p.filter((x) => x !== c.id) : [...p, c.id]))
                    }
                    className={cn(styles.clientChip, on ? styles.clientChipOn : styles.clientChipOff)}
                  >
                    {c.name}
                  </button>
                );
              })}
            </div>
            <input type="hidden" name="clients" value={picked.join(",")} />
            <p className={styles.hint}>
              {picked.length === 0
                ? "None selected — they'll see shared work only."
                : `${picked.length} account${picked.length > 1 ? "s" : ""} assigned.`}
            </p>
          </div>

          <div className={styles.field}>
            <Label htmlFor="note">Note</Label>
            <Input id="note" name="note" placeholder="Covers Divya's accounts on Fridays" />
          </div>

          {state.message && (
            <p className={cn(styles.result, state.ok ? styles.resultOk : styles.resultError)}>
              {state.ok ? <CheckCircle2 className={styles.resultIcon} /> : <AlertCircle className={styles.resultIcon} />}
              {state.message}
            </p>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Adding…" : "Add employee"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

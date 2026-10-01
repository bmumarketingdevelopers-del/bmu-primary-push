"use client";

import * as React from "react";
import {
  AlertCircle, CheckCircle2, MessageCircle, Phone, Mail, StickyNote, UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { assignLead, updateLeadStatus, addLeadNote, type LeadState } from "@/app/admin/leads/actions";
import { whatsappUrl } from "@/lib/qr-platform";
import { formatDate, inr, cn } from "@/lib/utils";
import styles from "./lead-drawer.module.css";

const initial: LeadState = { ok: false, message: null };

const STATUSES = ["NEW", "CONTACTED", "QUALIFIED", "SITE_VISIT", "PROPOSAL", "WON", "LOST"] as const;

export type LeadRecord = {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  client?: string;
  message?: string;
  source: string;
  status: string;
  value?: number;
  owner?: string;
  createdAt: string;
};

export type TeamOption = { id: string; name: string };

/**
 * Everything you'd do to a lead, in one place.
 *
 * Assignment, status and notes were previously three imagined screens; a
 * lead is worked in seconds between phone calls, so they belong together.
 */
export function LeadDrawer({
  lead,
  team,
}: {
  lead: LeadRecord;
  team: TeamOption[];
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">Open</Button>
      </DialogTrigger>

      <DialogContent className={styles.dialog}>
        <DialogHeader>
          <DialogTitle>{lead.name}</DialogTitle>
          <DialogDescription>
            {lead.client ? `${lead.client} · ` : ""}
            {lead.source.replace("_", " ").toLowerCase()} · received {formatDate(lead.createdAt)}
          </DialogDescription>
        </DialogHeader>

        <div className={styles.body}>
          {/* Quick facts */}
          <div className={styles.facts}>
            <StatusBadge status={lead.status} />
            {lead.value ? <Badge variant="outline">{inr(lead.value)}</Badge> : null}
            <Badge variant={lead.owner && lead.owner !== "Unassigned" ? "secondary" : "warning"}>
              {lead.owner && lead.owner !== "Unassigned" ? lead.owner : "Unassigned"}
            </Badge>
          </div>

          {lead.message && (
            <p className={styles.leadMessage}>
              {lead.message}
            </p>
          )}

          {/* Contact — one tap, because this is used mid-call */}
          <div className={styles.contactActions}>
            {lead.phone && (
              <>
                <Button asChild variant="outline" size="sm">
                  <a href={`tel:${lead.phone.replace(/\s/g, "")}`}><Phone /> Call</a>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <a
                    href={whatsappUrl(lead.phone, `Hi ${lead.name.split(" ")[0]}, thanks for getting in touch.`)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <MessageCircle /> WhatsApp
                  </a>
                </Button>
              </>
            )}
            {lead.email && (
              <Button asChild variant="outline" size="sm">
                <a href={`mailto:${lead.email}`}><Mail /> Email</a>
              </Button>
            )}
          </div>

          <AssignForm lead={lead} team={team} />
          <StatusForm lead={lead} />
          <NoteForm lead={lead} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Result({ state }: { state: LeadState }) {
  if (!state.message) return null;
  return (
    <p className={cn(styles.result, state.ok ? styles.resultOk : styles.resultError)}>
      {state.ok ? <CheckCircle2 className={styles.resultIcon} /> : <AlertCircle className={styles.resultIcon} />}
      {state.message}
    </p>
  );
}

function AssignForm({ lead, team }: { lead: LeadRecord; team: TeamOption[] }) {
  const [state, action, pending] = React.useActionState(assignLead, initial);
  const [assignee, setAssignee] = React.useState("");

  const selected = team.find((t) => t.id === assignee);

  return (
    <form action={action} className={styles.panel}>
      <Label className={styles.panelLabel}>
        <UserCheck className={styles.panelIcon} /> Who owns this?
      </Label>

      <input type="hidden" name="leadId" value={lead.id} />
      <input type="hidden" name="assigneeName" value={selected?.name ?? ""} />

      <div className={styles.assignRow}>
        <select
          name="assignee"
          value={assignee}
          onChange={(e) => setAssignee(e.target.value)}
          className={styles.assignSelect}
        >
          <option value="">Nobody — leave unassigned</option>
          {team.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
        <Button type="submit" size="sm" disabled={pending}>
          {pending ? "Saving…" : "Assign"}
        </Button>
      </div>

      <Result state={state} />
    </form>
  );
}

function StatusForm({ lead }: { lead: LeadRecord }) {
  const [state, action, pending] = React.useActionState(updateLeadStatus, initial);
  const [status, setStatus] = React.useState(lead.status);

  return (
    <form action={action} className={styles.panel}>
      <Label>Where has it got to?</Label>
      <input type="hidden" name="leadId" value={lead.id} />

      <div className={styles.chips}>
        {STATUSES.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStatus(s)}
            className={cn(
              styles.chip,
              styles.statusChip,
              status === s ? styles.chipOn : styles.chipOff
            )}
          >
            {s.replace("_", " ").toLowerCase()}
          </button>
        ))}
      </div>
      <input type="hidden" name="status" value={status} />

      {status === "LOST" && (
        <div className={styles.field}>
          <Label htmlFor={`lost-${lead.id}`}>Why was it lost?</Label>
          <Input id={`lost-${lead.id}`} name="lostReason" placeholder="Went with a cheaper quote" />
          <p className={styles.help}>
            Required. A loss without a reason teaches you nothing next quarter.
          </p>
        </div>
      )}

      <Button type="submit" size="sm" disabled={pending || status === lead.status}>
        {pending ? "Saving…" : "Update status"}
      </Button>

      <Result state={state} />
    </form>
  );
}

function NoteForm({ lead }: { lead: LeadRecord }) {
  const [state, action, pending] = React.useActionState(addLeadNote, initial);
  const [kind, setKind] = React.useState("NOTE");

  return (
    <form action={action} className={styles.panel}>
      <Label className={styles.panelLabel}>
        <StickyNote className={styles.panelIcon} /> Log what happened
      </Label>

      <input type="hidden" name="leadId" value={lead.id} />
      <input type="hidden" name="kind" value={kind} />

      <div className={styles.chips}>
        {[
          { k: "NOTE", label: "Note" },
          { k: "CALL", label: "Called" },
          { k: "WHATSAPP", label: "WhatsApped" },
          { k: "EMAIL", label: "Emailed" },
        ].map((o) => (
          <button
            key={o.k}
            type="button"
            onClick={() => setKind(o.k)}
            className={cn(styles.chip, kind === o.k ? styles.chipOn : styles.chipOff)}
          >
            {o.label}
          </button>
        ))}
      </div>

      <textarea
        name="body"
        rows={3}
        required
        placeholder="Asked for a site visit on Saturday. Budget around 1.2Cr."
        className={styles.textarea}
      />

      <Button type="submit" size="sm" disabled={pending}>
        {pending ? "Saving…" : "Add to history"}
      </Button>

      <Result state={state} />
    </form>
  );
}

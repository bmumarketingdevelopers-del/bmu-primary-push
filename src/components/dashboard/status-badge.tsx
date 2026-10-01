import { Badge } from "@/components/ui/badge";

type Variant = React.ComponentProps<typeof Badge>["variant"];

const MAP: Record<string, { label: string; variant: Variant }> = {
  // leads
  NEW: { label: "New", variant: "info" },
  CONTACTED: { label: "Contacted", variant: "secondary" },
  QUALIFIED: { label: "Qualified", variant: "default" },
  SITE_VISIT: { label: "Site visit", variant: "warning" },
  PROPOSAL: { label: "Proposal", variant: "warning" },
  WON: { label: "Won", variant: "success" },
  LOST: { label: "Lost", variant: "destructive" },
  // projects
  DISCOVERY: { label: "Discovery", variant: "secondary" },
  IN_PROGRESS: { label: "In progress", variant: "info" },
  REVIEW: { label: "In review", variant: "warning" },
  LIVE: { label: "Live", variant: "success" },
  PAUSED: { label: "Paused", variant: "outline" },
  COMPLETED: { label: "Completed", variant: "success" },
  // invoices
  PAID: { label: "Paid", variant: "success" },
  SENT: { label: "Sent", variant: "info" },
  OVERDUE: { label: "Overdue", variant: "destructive" },
  DRAFT: { label: "Draft", variant: "outline" },
  PARTIALLY_PAID: { label: "Part paid", variant: "warning" },
  VOID: { label: "Void", variant: "outline" },
  // approvals & tickets
  PENDING: { label: "Awaiting you", variant: "warning" },
  APPROVED: { label: "Approved", variant: "success" },
  CHANGES_REQUESTED: { label: "Changes asked", variant: "destructive" },
  OPEN: { label: "Open", variant: "info" },
  RESOLVED: { label: "Resolved", variant: "success" },
  WAITING_ON_CLIENT: { label: "Needs you", variant: "warning" },
};

export function StatusBadge({ status }: { status: string }) {
  const entry = MAP[status] ?? { label: status, variant: "outline" as Variant };
  return <Badge variant={entry.variant}>{entry.label}</Badge>;
}

import { Badge } from "@/components/ui/badge";

const MAP = {
  INVITED: { label: "Invited", variant: "warning" },
  BOOKED: { label: "Booked", variant: "info" },
  IN_PRODUCTION: { label: "In production", variant: "default" },
  SUBMITTED: { label: "With brand", variant: "secondary" },
  APPROVED: { label: "Approved", variant: "success" },
  PAID: { label: "Paid", variant: "success" },
} as const;

export function BookingStatus({ status }: { status: keyof typeof MAP }) {
  const e = MAP[status];
  return <Badge variant={e.variant}>{e.label}</Badge>;
}

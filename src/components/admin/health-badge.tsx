import { Badge } from "@/components/ui/badge";

const MAP = {
  GOOD: { label: "Healthy", variant: "success" },
  WATCH: { label: "Watch", variant: "warning" },
  AT_RISK: { label: "At risk", variant: "destructive" },
} as const;

export function HealthBadge({ health }: { health: keyof typeof MAP }) {
  const e = MAP[health];
  return <Badge variant={e.variant}>{e.label}</Badge>;
}

import {
  LayoutDashboard, FolderKanban, Users, QrCode, CheckSquare,
  Receipt, FileBarChart, LifeBuoy,
} from "lucide-react";

export const DASHBOARD_NAV = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/projects", label: "Projects", icon: FolderKanban },
  { href: "/dashboard/leads", label: "Leads", icon: Users },
  { href: "/dashboard/qr", label: "QR analytics", icon: QrCode },
  { href: "/dashboard/approvals", label: "Content approval", icon: CheckSquare, badge: 2 },
  { href: "/dashboard/invoices", label: "Invoices", icon: Receipt },
  { href: "/dashboard/reports", label: "Reports", icon: FileBarChart },
  { href: "/dashboard/support", label: "Support", icon: LifeBuoy },
] as const;

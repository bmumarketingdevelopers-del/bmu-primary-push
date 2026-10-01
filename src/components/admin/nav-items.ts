import {
  LayoutDashboard, Building2, FolderKanban, Users, Sparkles,
  QrCode, CheckSquare, Receipt, Newspaper, UserCog, Settings,
  Image as ImageIcon, UserPlus, FileSpreadsheet, LayoutTemplate, Store, ShoppingBag, Handshake, ShieldCheck, Layers, FileEdit, FilePlus, HeartPulse, Boxes,
} from "lucide-react";

export const ADMIN_NAV = [
  {
    section: "Overview",
    items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    section: "Delivery",
    items: [
      { href: "/admin/clients", label: "Clients", icon: Building2 },
      { href: "/admin/projects", label: "Projects", icon: FolderKanban },
      { href: "/admin/approvals", label: "Approval queue", icon: CheckSquare, badge: 3 },
    ],
  },
  {
    section: "Growth",
    items: [
      { href: "/admin/leads", label: "Leads", icon: Users },
      { href: "/admin/creators", label: "Creators", icon: Sparkles },
      { href: "/admin/applications", label: "Applications", icon: UserPlus, badge: 2 },
      { href: "/admin/qr", label: "QR codes", icon: QrCode },
    ],
  },
  {
    section: "Website",
    items: [
      { href: "/admin/website", label: "Edit website", icon: LayoutTemplate },
      { href: "/admin/website/pages", label: "Pages", icon: FilePlus },
      { href: "/admin/cms", label: "All content", icon: FileEdit },
      { href: "/admin/businesses", label: "QR businesses", icon: Store },
      { href: "/admin/health", label: "Account health", icon: HeartPulse },
      { href: "/admin/ar", label: "AR experiences", icon: Boxes },
      { href: "/admin/industries", label: "Industry setups", icon: Layers },
      { href: "/admin/store", label: "Store & orders", icon: ShoppingBag },
      { href: "/admin/partners", label: "Partners", icon: Handshake },
    ],
  },
  {
    section: "Business",
    items: [
      { href: "/admin/invoices", label: "Invoices", icon: Receipt },
      { href: "/admin/exports", label: "Exports", icon: FileSpreadsheet },
      { href: "/admin/media", label: "Media", icon: ImageIcon },
      { href: "/admin/blog", label: "Blog & CMS", icon: Newspaper },
      { href: "/admin/team", label: "Team & roles", icon: UserCog },
      { href: "/admin/roles", label: "Access control", icon: ShieldCheck },
      { href: "/admin/settings", label: "Settings", icon: Settings },
    ],
  },
] as const;

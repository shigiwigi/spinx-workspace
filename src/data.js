import {
  LayoutDashboard,
  CalendarClock,
  Megaphone,
  Wallet,
  Boxes,
  KanbanSquare,
  Users,
  FileStack,
  ShoppingCart,
  BarChart3,
  Sparkles,
} from "lucide-react";

export const NAV = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "meetings", label: "Meetings", icon: CalendarClock },
  { id: "notices", label: "Notices", icon: Megaphone },
  { id: "finance", label: "Finance", icon: Wallet },
  { id: "inventory", label: "Inventory", icon: Boxes },
  { id: "projects", label: "Projects", icon: KanbanSquare },
  { id: "team", label: "Team", icon: Users },
  { id: "docs", label: "Documentation", icon: FileStack },
  { id: "procurement", label: "Procurement", icon: ShoppingCart },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "ai", label: "AI Assistant", icon: Sparkles },
];

import { LayoutDashboard, Kanban, Boxes, Calendar, Users, Bell, Wallet } from "lucide-react"; // <-- add Wallet

export const NAV = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "projects", label: "Projects", icon: Kanban },
  { id: "inventory", label: "Inventory", icon: Boxes },
  { id: "calendar", label: "Calendar", icon: Calendar },
  { id: "finance", label: "Finance", icon: Wallet }, // <-- ADD THIS LINE
  { id: "meetings", label: "Meetings", icon: Calendar },
  { id: "team", label: "Team", icon: Users },
  { id: "notices", label: "Notices", icon: Bell }
];
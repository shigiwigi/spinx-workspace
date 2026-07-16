import {
  LayoutDashboard,
  CalendarClock,
  Megaphone,
  Wallet,
  Boxes,
  KanbanSquare,
  Users,
  CalendarDays,
} from "lucide-react";

export const NAV = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "meetings", label: "Meetings", icon: CalendarClock },
  { id: "notices", label: "Notices", icon: Megaphone },
  { id: "calendar", label: "Calendar", icon: CalendarDays },
  { id: "finance", label: "Finance", icon: Wallet },
  { id: "inventory", label: "Inventory", icon: Boxes },
  { id: "projects", label: "Projects", icon: KanbanSquare },
  { id: "team", label: "Team", icon: Users },
];

export const TEAMS = ["Mechanical", "Firmware", "Software", "Workshop Ops", "Finance/Procurement"];

import { 
  LayoutDashboard, 
  Kanban, 
  Boxes, 
  Calendar, 
  Users, 
  Bell 
} from "lucide-react";

// Sidebar Navigation
export const NAV = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "projects", label: "Projects", icon: Kanban },
  { id: "inventory", label: "Inventory", icon: Boxes },
  { id: "calendar", label: "Calendar", icon: Calendar },
  { id: "meetings", label: "Meetings", icon: Calendar },
  { id: "team", label: "Team", icon: Users },
  { id: "notices", label: "Notices", icon: Bell }
];

// Active Workspace Teams
export const TEAMS = [
  "Core Hardware",
  "Firmware & Flight Control",
  "Software & Ground Station",
  "Payload & Integration",
  "Operations & Logistics"
];
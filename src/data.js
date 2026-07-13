import {
  LayoutDashboard, Users, Megaphone, Wallet, Boxes, Kanban as KanbanIcon,
  UserCircle, FileText, ShoppingCart, BarChart3, FileCog, FileBox, FileCode2, BookOpen
} from "lucide-react";
import { C } from "./theme";

// Structural navigation mapping (Permanent layout configuration)
export const NAV = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "meetings", label: "Meetings", icon: Users },
  { id: "notices", label: "Notices", icon: Megaphone },
  { id: "finance", label: "Finance", icon: Wallet },
  { id: "inventory", label: "Inventory", icon: Boxes },
  { id: "projects", label: "Projects", icon: KanbanIcon },
  { id: "team", label: "Team", icon: UserCircle },
  { id: "docs", label: "Documentation", icon: FileText },
  { id: "procurement", label: "Procurement", icon: ShoppingCart },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
];

// Document asset icon mapping index rules
export const docIcon = { 
  circuit: FileCog, 
  cad: FileBox, 
  code: FileCode2, 
  manual: BookOpen 
};

// Static target chart arrays configuration parameters 
export const budgetSeries = [
  { m: "Feb", spend: 0 }, { m: "Mar", spend: 0 }, { m: "Apr", spend: 0 },
  { m: "May", spend: 0 }, { m: "Jun", spend: 0 }, { m: "Jul", spend: 0 },
];

// UI interface presentation rendering parameters
export const PIE_COLORS = [C.gold, "#D6A527", "#AC8A22", "#826A1D", "#584A18"];
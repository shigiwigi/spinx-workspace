import {
  LayoutDashboard, Users, Megaphone, Wallet, Boxes, Kanban as KanbanIcon,
  UserCircle, FileText, ShoppingCart, BarChart3, FileCog, FileBox, FileCode2, BookOpen
} from "lucide-react";
import { C } from "./theme";

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

export const activityFeed = [
  { who: "Arjun Menon", what: "moved ESC Firmware v2 to In Progress", when: "8 min ago" },
  { who: "Devika Nair", what: "approved a quotation from Robu.in", when: "34 min ago" },
  { who: "Shihan", what: "pinned a notice in Engineering", when: "1 hr ago" },
  { who: "Kiran Das", what: "logged 6 units of 2212 920KV motors", when: "2 hr ago" },
  { who: "Meera Pillai", what: "uploaded flight-controller-wiring-v3.pdf", when: "3 hr ago" },
];

export const budgetSeries = [
  { m: "Feb", spend: 42000 }, { m: "Mar", spend: 51000 }, { m: "Apr", spend: 39000 },
  { m: "May", spend: 61000 }, { m: "Jun", spend: 48000 }, { m: "Jul", spend: 57000 },
];

export const initialMeetings = [
  { id: 1, title: "Frame design review — SX-4", date: "Jul 14", time: "10:30 AM", attendees: ["Arjun Menon", "Devika Nair"], status: "Scheduled", notes: "", actions: ["Finalize carbon frame thickness"] },
  { id: 2, title: "Workshop batch #12 planning", date: "Jul 15", time: "3:00 PM", attendees: ["Shihan", "Kiran Das", "Meera Pillai"], status: "Scheduled", notes: "", actions: [] },
  { id: 3, title: "Vendor call — Robu.in components", date: "Jul 11", time: "11:00 AM", attendees: ["Devika Nair"], status: "Completed", notes: "Negotiated 8% bulk discount on 2212 motors for orders above 50 units.", actions: ["Send updated PO by Jul 13", "Confirm delivery window"] },
];

export const initialNotices = [
  { id: 1, title: "Workshop batch #12 registrations open", body: "Marketing page is live. Slots cap at 24 seats, drone-build + FPV track.", team: "Ops", pinned: true, reads: 11, total: 14 },
  { id: 2, title: "New torque driver set arrived", body: "Stored in Cabinet B, Shelf 2. Log usage in Inventory before taking components out.", team: "Engineering", pinned: false, reads: 6, total: 14 },
  { id: 3, title: "Office closed Jul 20 — Muharram", body: "Standard holiday. Workshop equipment room stays locked.", team: "General", pinned: true, reads: 13, total: 14 },
  { id: 4, title: "SX-4 frame supplier changed", body: "Switching to a local CNC vendor in Kochi for faster turnaround on carbon plates.", team: "Engineering", pinned: false, reads: 4, total: 14 },
];

export const expenseCategories = [
  { cat: "Components", amt: 28400 }, { cat: "Tools", amt: 9200 }, { cat: "Workshop", amt: 14100 },
  { cat: "Shipping", amt: 5300 }, { cat: "Misc", amt: 2600 },
];

export const initialExpenses = [
  { id: 1, desc: "2212 920KV motors x12", cat: "Components", amt: 8640, date: "Jul 10" },
  { id: 2, desc: "FPV goggles — demo unit", cat: "Tools", amt: 12500, date: "Jul 08" },
  { id: 3, desc: "Workshop venue — batch 11", cat: "Workshop", amt: 6000, date: "Jul 05" },
  { id: 4, desc: "Courier — Kochi to Kollam", cat: "Shipping", amt: 740, date: "Jul 03" },
];

export const initialInventory = [
  { id: 1, name: "2212 920KV BLDC Motor", qty: 34, low: 20, supplier: "Robu.in", date: "Jun 28" },
  { id: 2, name: "30A BLHeli ESC", qty: 9, low: 15, supplier: "Robu.in", date: "Jun 28" },
  { id: 3, name: "F450 Carbon Frame Kit", qty: 4, low: 5, supplier: "DroneKart", date: "Jun 20" },
  { id: 4, name: "ESP32-C3 Super Mini", qty: 61, low: 20, supplier: "AliExpress", date: "Jul 01" },
  { id: 5, name: "3S 2200mAh LiPo", qty: 12, low: 10, supplier: "Robu.in", date: "Jul 04" },
  { id: 6, name: "M3x10 Nylon Standoffs (pk 50)", qty: 3, low: 8, supplier: "Local — Kollam", date: "Jun 15" },
];

export const initialTasks = {
  todo: [
    { id: "t1", title: "Design SX-4 arm mount v2", tag: "Design", due: "Jul 18", people: ["Arjun Menon"] },
    { id: "t2", title: "Source 6S batteries for payload build", tag: "Procurement", due: "Jul 20", people: ["Devika Nair"] },
  ],
  progress: [
    { id: "t3", title: "ESC firmware — throttle curve tuning", tag: "Firmware", due: "Jul 16", people: ["Kiran Das"] },
    { id: "t4", title: "GCS UDP reconnect handling", tag: "Software", due: "Jul 17", people: ["Shihan"] },
  ],
  done: [
    { id: "t5", title: "SoftAP WPA2 password bug fix", tag: "Firmware", due: "Jul 12", people: ["Shihan"] },
    { id: "t6", title: "Batch 11 workshop wrap report", tag: "Ops", due: "Jul 09", people: ["Meera Pillai"] },
  ],
};

export const teamMembers = [
  { name: "Shihan", role: "Founder / Lead Engineer", attendance: 98, log: "SoftAP WiFi debugging, GCS UDP layer" },
  { name: "Arjun Menon", role: "Mechanical Design", attendance: 91, log: "SX-4 arm mount v2 CAD" },
  { name: "Devika Nair", role: "Procurement & Finance", attendance: 95, log: "Vendor negotiation — Robu.in" },
  { name: "Kiran Das", role: "Firmware Engineer", attendance: 88, log: "ESC throttle curve tuning" },
  { name: "Meera Pillai", role: "Workshop Ops", attendance: 93, log: "Batch 12 seat allocation" },
];

export const docGroups = [
  { project: "SX-4 Quadcopter", docs: [
    { name: "Flight controller wiring v3", type: "circuit", v: "v3", updated: "Jul 12" },
    { name: "SX-4 frame — full assembly", type: "cad", v: "v6", updated: "Jul 09" },
    { name: "spinx-drone-fw (ESP32-C3)", type: "code", v: "main", updated: "Jul 13" },
  ]},
  { project: "Ground Control Station", docs: [
    { name: "GCS Flask app — architecture notes", type: "manual", v: "v1", updated: "Jul 06" },
    { name: "UDP command reference", type: "code", v: "v2", updated: "Jul 07" },
  ]},
];

export const docIcon = { circuit: FileCog, cad: FileBox, code: FileCode2, manual: BookOpen };

export const initialProcurement = [
  { id: 1, item: "6S 5200mAh LiPo x8", vendor: "Robu.in", quote: 15200, status: "Pending" },
  { id: 2, item: "CNC carbon plates — SX-4", vendor: "Kochi CNC Works", quote: 9800, status: "Pending" },
  { id: 3, item: "Torque driver set", vendor: "Local — Kollam", quote: 2400, status: "Approved" },
  { id: 4, item: "FPV camera modules x6", vendor: "AliExpress", quote: 6100, status: "Rejected" },
];

export const progressData = [
  { name: "SX-4 Quadcopter", pct: 68 }, { name: "GCS Platform", pct: 82 },
  { name: "Payload Rig", pct: 34 }, { name: "Workshop Kit v2", pct: 51 },
];

export const usageData = [
  { name: "Motors & ESCs", value: 38 }, { name: "Frames", value: 22 },
  { name: "Batteries", value: 18 }, { name: "Electronics", value: 15 }, { name: "Hardware", value: 7 },
];

export const PIE_COLORS = [C.gold, "#D6A527", "#AC8A22", "#826A1D", "#584A18"];
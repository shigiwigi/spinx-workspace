import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  LayoutDashboard, Users, Megaphone, Wallet, Boxes, Kanban as KanbanIcon,
  UserCircle, FileText, ShoppingCart, BarChart3, Search, Bell, ChevronLeft,
  ChevronRight, Pin, PinOff, Plus, Check, X, Clock, TrendingUp, TrendingDown,
  AlertTriangle, QrCode, Paperclip, FileCode2, FileBox, FileCog, BookOpen,
  CircleDot, CheckCircle2, MoreHorizontal, Sparkles, Lock, ChevronDown,
  Calendar, MapPin, Filter, ArrowUpRight, Package
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip
} from "recharts";

/* ---------------------------------- FONTS ---------------------------------- */
function useFonts() {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Orbitron:wght@700;800&family=Rajdhani:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);
}

/* ---------------------------------- TOKENS ---------------------------------- */
const C = {
  bg: "#0A0A0B", surface: "#131316", surface2: "#1A1A1E", surface3: "#212126",
  border: "#28282D", borderLit: "#3A3A40",
  gold: "#FEC02D", goldDim: "#8C6A1E", goldSoft: "#FEC02D22",
  text: "#F2F1EC", textDim: "#98979E", textFaint: "#5C5B62",
  danger: "#E5484D", success: "#3DD68C", info: "#5EA1F2",
};

const clipCorner = (size = 14) => ({
  clipPath: `polygon(0 0, calc(100% - ${size}px) 0, 100% ${size}px, 100% 100%, 0 100%)`,
});

/* ---------------------------------- PRIMITIVES ---------------------------------- */
const Card = ({ children, className = "", style = {}, corner = true, pad = "p-5" }) => (
  <div
    className={`relative border ${pad} ${className}`}
    style={{ background: C.surface, borderColor: C.border, ...(corner ? clipCorner(16) : {}), ...style }}
  >
    {children}
  </div>
);

const Eyebrow = ({ children }) => (
  <div className="uppercase tracking-[0.18em] text-[11px] font-medium mb-1" style={{ color: C.textFaint, fontFamily: "Rajdhani" }}>
    {children}
  </div>
);

const SectionHeader = ({ title, subtitle, action }) => (
  <div className="flex items-end justify-between mb-6">
    <div>
      <div className="flex items-center gap-3">
        <div style={{ width: 3, height: 22, background: C.gold }} />
        <h1 className="text-2xl" style={{ fontFamily: "Rajdhani", fontWeight: 700, color: C.text, letterSpacing: "0.01em" }}>
          {title}
        </h1>
      </div>
      {subtitle && <p className="text-sm mt-1 ml-[15px]" style={{ color: C.textDim, fontFamily: "Inter" }}>{subtitle}</p>}
    </div>
    {action}
  </div>
);

const Badge = ({ children, tone = "default" }) => {
  const tones = {
    default: { bg: C.surface3, color: C.textDim, border: C.border },
    gold: { bg: C.goldSoft, color: C.gold, border: C.goldDim },
    success: { bg: "#3DD68C1A", color: C.success, border: "#3DD68C33" },
    danger: { bg: "#E5484D1A", color: C.danger, border: "#E5484D33" },
    info: { bg: "#5EA1F21A", color: C.info, border: "#5EA1F233" },
  };
  const t = tones[tone];
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 text-[11px] font-medium border"
      style={{ background: t.bg, color: t.color, borderColor: t.border, fontFamily: "JetBrains Mono" }}
    >
      {children}
    </span>
  );
};

const IconBtn = ({ icon: Icon, onClick, active, title }) => (
  <button
    onClick={onClick}
    title={title}
    className="w-8 h-8 flex items-center justify-center border transition-colors"
    style={{ background: active ? C.goldSoft : "transparent", borderColor: active ? C.goldDim : C.border, color: active ? C.gold : C.textDim }}
  >
    <Icon size={15} />
  </button>
);

const PrimaryBtn = ({ children, onClick, icon: Icon, small }) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center gap-2 ${small ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm"} font-semibold transition-all hover:brightness-110 active:scale-[0.98]`}
    style={{ background: C.gold, color: "#161608", fontFamily: "Rajdhani", clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)" }}
  >
    {Icon && <Icon size={14} />}
    {children}
  </button>
);

const GhostBtn = ({ children, onClick, icon: Icon }) => (
  <button
    onClick={onClick}
    className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium border transition-colors hover:border-[#3A3A40]"
    style={{ borderColor: C.border, color: C.textDim, fontFamily: "Rajdhani" }}
  >
    {Icon && <Icon size={13} />}
    {children}
  </button>
);

const ProgressBar = ({ value, tone = "gold", h = 6 }) => {
  const color = tone === "gold" ? C.gold : tone === "danger" ? C.danger : C.success;
  return (
    <div style={{ height: h, background: C.surface3 }}>
      <div style={{ width: `${Math.min(value, 100)}%`, height: "100%", background: color, transition: "width 0.6s cubic-bezier(.4,0,.2,1)" }} />
    </div>
  );
};

const Avatar = ({ name, size = 28 }) => {
  const initials = name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
  return (
    <div
      className="flex items-center justify-center font-semibold shrink-0"
      style={{ width: size, height: size, background: C.surface3, border: `1px solid ${C.border}`, color: C.gold, fontSize: size * 0.36, fontFamily: "Rajdhani" }}
      title={name}
    >
      {initials}
    </div>
  );
};

const XMark = ({ size = 20, color = C.gold, strokeWidth = 3 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M4 4L20 20M20 4L4 20" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
  </svg>
);

/* ---------------------------------- MOCK DATA ---------------------------------- */
const NAV = [
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

const activityFeed = [
  { who: "Arjun Menon", what: "moved ESC Firmware v2 to In Progress", when: "8 min ago" },
  { who: "Devika Nair", what: "approved a quotation from Robu.in", when: "34 min ago" },
  { who: "Shihan", what: "pinned a notice in Engineering", when: "1 hr ago" },
  { who: "Kiran Das", what: "logged 6 units of 2212 920KV motors", when: "2 hr ago" },
  { who: "Meera Pillai", what: "uploaded flight-controller-wiring-v3.pdf", when: "3 hr ago" },
];

const budgetSeries = [
  { m: "Feb", spend: 42000 }, { m: "Mar", spend: 51000 }, { m: "Apr", spend: 39000 },
  { m: "May", spend: 61000 }, { m: "Jun", spend: 48000 }, { m: "Jul", spend: 57000 },
];

const initialMeetings = [
  { id: 1, title: "Frame design review — SX-4", date: "Jul 14", time: "10:30 AM", attendees: ["Arjun Menon", "Devika Nair"], status: "Scheduled", notes: "", actions: ["Finalize carbon frame thickness"] },
  { id: 2, title: "Workshop batch #12 planning", date: "Jul 15", time: "3:00 PM", attendees: ["Shihan", "Kiran Das", "Meera Pillai"], status: "Scheduled", notes: "", actions: [] },
  { id: 3, title: "Vendor call — Robu.in components", date: "Jul 11", time: "11:00 AM", attendees: ["Devika Nair"], status: "Completed", notes: "Negotiated 8% bulk discount on 2212 motors for orders above 50 units.", actions: ["Send updated PO by Jul 13", "Confirm delivery window"] },
];

const initialNotices = [
  { id: 1, title: "Workshop batch #12 registrations open", body: "Marketing page is live. Slots cap at 24 seats, drone-build + FPV track.", team: "Ops", pinned: true, reads: 11, total: 14 },
  { id: 2, title: "New torque driver set arrived", body: "Stored in Cabinet B, Shelf 2. Log usage in Inventory before taking components out.", team: "Engineering", pinned: false, reads: 6, total: 14 },
  { id: 3, title: "Office closed Jul 20 — Muharram", body: "Standard holiday. Workshop equipment room stays locked.", team: "General", pinned: true, reads: 13, total: 14 },
  { id: 4, title: "SX-4 frame supplier changed", body: "Switching to a local CNC vendor in Kochi for faster turnaround on carbon plates.", team: "Engineering", pinned: false, reads: 4, total: 14 },
];

const expenseCategories = [
  { cat: "Components", amt: 28400 }, { cat: "Tools", amt: 9200 }, { cat: "Workshop", amt: 14100 },
  { cat: "Shipping", amt: 5300 }, { cat: "Misc", amt: 2600 },
];

const initialExpenses = [
  { id: 1, desc: "2212 920KV motors x12", cat: "Components", amt: 8640, date: "Jul 10" },
  { id: 2, desc: "FPV goggles — demo unit", cat: "Tools", amt: 12500, date: "Jul 08" },
  { id: 3, desc: "Workshop venue — batch 11", cat: "Workshop", amt: 6000, date: "Jul 05" },
  { id: 4, desc: "Courier — Kochi to Kollam", cat: "Shipping", amt: 740, date: "Jul 03" },
];

const initialInventory = [
  { id: 1, name: "2212 920KV BLDC Motor", qty: 34, low: 20, supplier: "Robu.in", date: "Jun 28" },
  { id: 2, name: "30A BLHeli ESC", qty: 9, low: 15, supplier: "Robu.in", date: "Jun 28" },
  { id: 3, name: "F450 Carbon Frame Kit", qty: 4, low: 5, supplier: "DroneKart", date: "Jun 20" },
  { id: 4, name: "ESP32-C3 Super Mini", qty: 61, low: 20, supplier: "AliExpress", date: "Jul 01" },
  { id: 5, name: "3S 2200mAh LiPo", qty: 12, low: 10, supplier: "Robu.in", date: "Jul 04" },
  { id: 6, name: "M3x10 Nylon Standoffs (pk 50)", qty: 3, low: 8, supplier: "Local — Kollam", date: "Jun 15" },
];

const initialTasks = {
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

const teamMembers = [
  { name: "Shihan", role: "Founder / Lead Engineer", attendance: 98, log: "SoftAP WiFi debugging, GCS UDP layer" },
  { name: "Arjun Menon", role: "Mechanical Design", attendance: 91, log: "SX-4 arm mount v2 CAD" },
  { name: "Devika Nair", role: "Procurement & Finance", attendance: 95, log: "Vendor negotiation — Robu.in" },
  { name: "Kiran Das", role: "Firmware Engineer", attendance: 88, log: "ESC throttle curve tuning" },
  { name: "Meera Pillai", role: "Workshop Ops", attendance: 93, log: "Batch 12 seat allocation" },
];

const docGroups = [
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

const docIcon = { circuit: FileCog, cad: FileBox, code: FileCode2, manual: BookOpen };

const initialProcurement = [
  { id: 1, item: "6S 5200mAh LiPo x8", vendor: "Robu.in", quote: 15200, status: "Pending" },
  { id: 2, item: "CNC carbon plates — SX-4", vendor: "Kochi CNC Works", quote: 9800, status: "Pending" },
  { id: 3, item: "Torque driver set", vendor: "Local — Kollam", quote: 2400, status: "Approved" },
  { id: 4, item: "FPV camera modules x6", vendor: "AliExpress", quote: 6100, status: "Rejected" },
];

const progressData = [
  { name: "SX-4 Quadcopter", pct: 68 }, { name: "GCS Platform", pct: 82 },
  { name: "Payload Rig", pct: 34 }, { name: "Workshop Kit v2", pct: 51 },
];

const usageData = [
  { name: "Motors & ESCs", value: 38 }, { name: "Frames", value: 22 },
  { name: "Batteries", value: 18 }, { name: "Electronics", value: 15 }, { name: "Hardware", value: 7 },
];
const PIE_COLORS = [C.gold, "#D6A527", "#AC8A22", "#826A1D", "#584A18"];

/* ---------------------------------- CHART TOOLTIP ---------------------------------- */
const TT = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="px-3 py-2 border text-xs" style={{ background: C.surface2, borderColor: C.borderLit, fontFamily: "JetBrains Mono", color: C.text }}>
      <div style={{ color: C.textFaint }}>{label}</div>
      {payload.map((p, i) => <div key={i} style={{ color: C.gold }}>{p.value?.toLocaleString?.() ?? p.value}</div>)}
    </div>
  );
};

/* ================================================================== SECTIONS ================================================================== */

function Dashboard() {
  const activeProjects = 4, pendingTasks = initialTasks.todo.length + initialTasks.progress.length;
  const lowStock = initialInventory.filter(i => i.qty <= i.low);
  const budgetUsedPct = 71;

  const stats = [
    { label: "Active Projects", value: activeProjects, delta: "+1 this month", up: true, icon: KanbanIcon },
    { label: "Pending Tasks", value: pendingTasks, delta: "2 due this week", up: null, icon: Clock },
    { label: "Budget Used", value: `${budgetUsedPct}%`, delta: "of ₹80,000 cap", up: false, icon: Wallet },
    { label: "Low Stock Items", value: lowStock.length, delta: "needs reorder", up: false, icon: AlertTriangle },
  ];

  return (
    <div>
      <SectionHeader title="Dashboard" subtitle="Monday, July 13 — here's where things stand at SpinX." />

      <div className="grid grid-cols-4 gap-4 mb-5">
        {stats.map((s, i) => (
          <Card key={i} pad="p-4">
            <div className="flex items-start justify-between">
              <Eyebrow>{s.label}</Eyebrow>
              <s.icon size={15} style={{ color: C.textFaint }} />
            </div>
            <div className="text-3xl mt-1" style={{ fontFamily: "JetBrains Mono", color: C.text, fontWeight: 500 }}>{s.value}</div>
            <div className="flex items-center gap-1 mt-2 text-[11px]" style={{ color: s.up === false ? C.danger : s.up ? C.success : C.textDim, fontFamily: "Rajdhani" }}>
              {s.up === true && <TrendingUp size={12} />}
              {s.up === false && <TrendingDown size={12} />}
              {s.delta}
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4 mb-5">
        <Card className="col-span-2">
          <div className="flex items-center justify-between mb-3">
            <Eyebrow>Budget overview — last 6 months</Eyebrow>
            <Badge tone="gold">₹57,000 this month</Badge>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={budgetSeries} margin={{ left: -20, top: 5 }}>
              <defs>
                <linearGradient id="goldFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={C.gold} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={C.gold} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={C.border} vertical={false} />
              <XAxis dataKey="m" stroke={C.textFaint} tick={{ fontSize: 11, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
              <YAxis stroke={C.textFaint} tick={{ fontSize: 11, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} width={45} />
              <Tooltip content={<TT />} />
              <Area type="monotone" dataKey="spend" stroke={C.gold} strokeWidth={2} fill="url(#goldFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <Eyebrow>Upcoming meetings</Eyebrow>
          <div className="mt-2 space-y-3">
            {initialMeetings.filter(m => m.status === "Scheduled").map(m => (
              <div key={m.id} className="flex items-start gap-2 pb-3 border-b" style={{ borderColor: C.border }}>
                <div className="text-center shrink-0 px-2 py-1" style={{ background: C.surface3, fontFamily: "JetBrains Mono" }}>
                  <div className="text-[10px]" style={{ color: C.textFaint }}>{m.date.split(" ")[0]}</div>
                  <div className="text-sm font-medium" style={{ color: C.gold }}>{m.date.split(" ")[1]}</div>
                </div>
                <div>
                  <div className="text-sm" style={{ color: C.text, fontFamily: "Inter" }}>{m.title}</div>
                  <div className="text-[11px] mt-0.5" style={{ color: C.textFaint, fontFamily: "JetBrains Mono" }}>{m.time}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="col-span-2">
          <Eyebrow>Recent activity</Eyebrow>
          <div className="mt-2 space-y-0">
            {activityFeed.map((a, i) => (
              <div key={i} className="flex items-center gap-3 py-2.5" style={{ borderTop: i > 0 ? `1px solid ${C.border}` : "none" }}>
                <Avatar name={a.who} size={26} />
                <div className="text-sm" style={{ color: C.textDim, fontFamily: "Inter" }}>
                  <span style={{ color: C.text, fontWeight: 500 }}>{a.who}</span> {a.what}
                </div>
                <div className="ml-auto text-[11px] shrink-0" style={{ color: C.textFaint, fontFamily: "JetBrains Mono" }}>{a.when}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={14} style={{ color: C.danger }} />
            <Eyebrow>Inventory alerts</Eyebrow>
          </div>
          <div className="space-y-2">
            {lowStock.map(item => (
              <div key={item.id} className="flex items-center justify-between px-2.5 py-2 text-xs" style={{ background: "#E5484D0F", border: `1px solid #E5484D33`, fontFamily: "Rajdhani" }}>
                <span style={{ color: C.text }}>{item.name}</span>
                <span style={{ color: C.danger, fontFamily: "JetBrains Mono" }}>{item.qty} left</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function Meetings() {
  const [meetings, setMeetings] = useState(initialMeetings);
  const [expanded, setExpanded] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", date: "", time: "", attendees: "" });
  const [actionDraft, setActionDraft] = useState("");

  const addMeeting = () => {
    if (!form.title.trim()) return;
    setMeetings([{ id: Date.now(), title: form.title, date: form.date || "TBD", time: form.time || "—", attendees: form.attendees.split(",").map(s => s.trim()).filter(Boolean), status: "Scheduled", notes: "", actions: [] }, ...meetings]);
    setForm({ title: "", date: "", time: "", attendees: "" });
    setShowForm(false);
  };

  const updateNotes = (id, notes) => setMeetings(meetings.map(m => m.id === id ? { ...m, notes } : m));
  const addAction = (id) => {
    if (!actionDraft.trim()) return;
    setMeetings(meetings.map(m => m.id === id ? { ...m, actions: [...m.actions, actionDraft] } : m));
    setActionDraft("");
  };

  return (
    <div>
      <SectionHeader title="Meetings" subtitle="Schedule, run, and archive every SpinX meeting in one place."
        action={<PrimaryBtn icon={Plus} onClick={() => setShowForm(!showForm)}>Schedule meeting</PrimaryBtn>} />

      {showForm && (
        <Card className="mb-4">
          <div className="grid grid-cols-4 gap-3">
            <input placeholder="Meeting title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
              className="col-span-2 bg-transparent border px-3 py-2 text-sm outline-none" style={{ borderColor: C.border, color: C.text, fontFamily: "Inter" }} />
            <input placeholder="Jul 20" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}
              className="bg-transparent border px-3 py-2 text-sm outline-none" style={{ borderColor: C.border, color: C.text, fontFamily: "JetBrains Mono" }} />
            <input placeholder="2:00 PM" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })}
              className="bg-transparent border px-3 py-2 text-sm outline-none" style={{ borderColor: C.border, color: C.text, fontFamily: "JetBrains Mono" }} />
            <input placeholder="Attendees, comma separated" value={form.attendees} onChange={e => setForm({ ...form, attendees: e.target.value })}
              className="col-span-3 bg-transparent border px-3 py-2 text-sm outline-none" style={{ borderColor: C.border, color: C.text, fontFamily: "Inter" }} />
            <PrimaryBtn onClick={addMeeting} icon={Check}>Save</PrimaryBtn>
          </div>
        </Card>
      )}

      <div className="space-y-3">
        {meetings.map(m => (
          <Card key={m.id} pad="p-0">
            <div className="p-4 flex items-center gap-4 cursor-pointer" onClick={() => setExpanded(expanded === m.id ? null : m.id)}>
              <div className="text-center shrink-0 w-14 px-2 py-1.5" style={{ background: C.surface3, fontFamily: "JetBrains Mono" }}>
                <div className="text-[10px]" style={{ color: C.textFaint }}>{m.date.split(" ")[0]}</div>
                <div className="text-sm font-medium" style={{ color: C.gold }}>{m.date.split(" ")[1] || ""}</div>
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium" style={{ color: C.text, fontFamily: "Rajdhani", fontSize: 15 }}>{m.title}</div>
                <div className="flex items-center gap-2 mt-1">
                  <Clock size={11} style={{ color: C.textFaint }} />
                  <span className="text-[11px]" style={{ color: C.textFaint, fontFamily: "JetBrains Mono" }}>{m.time}</span>
                  <div className="flex -space-x-1.5 ml-2">
                    {m.attendees.map((a, i) => <Avatar key={i} name={a} size={20} />)}
                  </div>
                </div>
              </div>
              <Badge tone={m.status === "Completed" ? "success" : "gold"}>{m.status}</Badge>
              <ChevronDown size={16} style={{ color: C.textFaint, transform: expanded === m.id ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
            </div>

            {expanded === m.id && (
              <div className="px-4 pb-4 pt-2 grid grid-cols-2 gap-4" style={{ borderTop: `1px solid ${C.border}` }}>
                <div>
                  <Eyebrow>Live notes</Eyebrow>
                  <textarea value={m.notes} onChange={e => updateNotes(m.id, e.target.value)} placeholder="Type notes during the call..."
                    className="w-full mt-1 bg-transparent border px-3 py-2 text-sm outline-none resize-none" rows={4}
                    style={{ borderColor: C.border, color: C.text, fontFamily: "Inter" }} />
                </div>
                <div>
                  <Eyebrow>Action items</Eyebrow>
                  <div className="space-y-1.5 mt-1">
                    {m.actions.map((a, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm" style={{ color: C.textDim, fontFamily: "Inter" }}>
                        <CircleDot size={12} style={{ color: C.gold }} /> {a}
                      </div>
                    ))}
                    <div className="flex gap-2 mt-2">
                      <input value={actionDraft} onChange={e => setActionDraft(e.target.value)} placeholder="Add action item"
                        onKeyDown={e => e.key === "Enter" && addAction(m.id)}
                        className="flex-1 bg-transparent border px-2.5 py-1.5 text-xs outline-none" style={{ borderColor: C.border, color: C.text, fontFamily: "Inter" }} />
                      <GhostBtn icon={Plus} onClick={() => addAction(m.id)}>Add</GhostBtn>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

function Notices() {
  const [notices, setNotices] = useState(initialNotices);
  const [filter, setFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", body: "", team: "General" });
  const teams = ["All", "Engineering", "Ops", "General"];

  const togglePin = (id) => setNotices(notices.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n));
  const addNotice = () => {
    if (!form.title.trim()) return;
    setNotices([{ id: Date.now(), title: form.title, body: form.body, team: form.team, pinned: false, reads: 0, total: 14 }, ...notices]);
    setForm({ title: "", body: "", team: "General" });
    setShowForm(false);
  };

  const filtered = notices.filter(n => filter === "All" || n.team === filter).sort((a, b) => b.pinned - a.pinned);

  return (
    <div>
      <SectionHeader title="Notices" subtitle="Company-wide and team-specific announcements."
        action={<PrimaryBtn icon={Plus} onClick={() => setShowForm(!showForm)}>New notice</PrimaryBtn>} />

      <div className="flex items-center gap-2 mb-4">
        {teams.map(t => (
          <button key={t} onClick={() => setFilter(t)} className="px-3 py-1.5 text-xs font-medium border transition-colors"
            style={{ background: filter === t ? C.goldSoft : "transparent", borderColor: filter === t ? C.goldDim : C.border, color: filter === t ? C.gold : C.textDim, fontFamily: "Rajdhani" }}>
            {t}
          </button>
        ))}
      </div>

      {showForm && (
        <Card className="mb-4 space-y-3">
          <input placeholder="Notice title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
            className="w-full bg-transparent border px-3 py-2 text-sm outline-none" style={{ borderColor: C.border, color: C.text, fontFamily: "Inter" }} />
          <textarea placeholder="Details..." value={form.body} onChange={e => setForm({ ...form, body: e.target.value })} rows={2}
            className="w-full bg-transparent border px-3 py-2 text-sm outline-none resize-none" style={{ borderColor: C.border, color: C.text, fontFamily: "Inter" }} />
          <div className="flex items-center gap-3">
            <select value={form.team} onChange={e => setForm({ ...form, team: e.target.value })}
              className="bg-transparent border px-3 py-2 text-xs outline-none" style={{ borderColor: C.border, color: C.text, fontFamily: "Rajdhani" }}>
              {teams.slice(1).map(t => <option key={t} value={t} style={{ background: C.surface }}>{t}</option>)}
            </select>
            <PrimaryBtn onClick={addNotice} icon={Check} small>Post notice</PrimaryBtn>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-2 gap-4">
        {filtered.map(n => (
          <Card key={n.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Badge tone={n.team === "Engineering" ? "info" : n.team === "Ops" ? "gold" : "default"}>{n.team}</Badge>
                  {n.pinned && <Badge tone="gold">Pinned</Badge>}
                </div>
                <div className="text-sm mt-2" style={{ color: C.text, fontFamily: "Rajdhani", fontWeight: 600, fontSize: 15 }}>{n.title}</div>
                <div className="text-xs mt-1" style={{ color: C.textDim, fontFamily: "Inter" }}>{n.body}</div>
              </div>
              <button onClick={() => togglePin(n.id)} className="shrink-0">
                {n.pinned ? <Pin size={15} style={{ color: C.gold }} /> : <PinOff size={15} style={{ color: C.textFaint }} />}
              </button>
            </div>
            <div className="flex items-center gap-1.5 mt-3 pt-3" style={{ borderTop: `1px solid ${C.border}` }}>
              <Check size={12} style={{ color: C.textFaint }} />
              <span className="text-[11px]" style={{ color: C.textFaint, fontFamily: "JetBrains Mono" }}>{n.reads}/{n.total} read</span>
              <div className="flex-1 max-w-[100px] ml-2"><ProgressBar value={(n.reads / n.total) * 100} h={3} /></div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Finance() {
  const [expenses, setExpenses] = useState(initialExpenses);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ desc: "", cat: "Components", amt: "" });

  const addExpense = () => {
    if (!form.desc.trim() || !form.amt) return;
    setExpenses([{ id: Date.now(), desc: form.desc, cat: form.cat, amt: Number(form.amt), date: "Jul 13" }, ...expenses]);
    setForm({ desc: "", cat: "Components", amt: "" });
    setShowForm(false);
  };

  const totalSpent = expenses.reduce((s, e) => s + e.amt, 0);
  const budget = 80000;

  return (
    <div>
      <SectionHeader title="Finance" subtitle="Expenses, invoices, and budget tracking."
        action={<PrimaryBtn icon={Plus} onClick={() => setShowForm(!showForm)}>Add expense</PrimaryBtn>} />

      <div className="grid grid-cols-3 gap-4 mb-5">
        <Card pad="p-4">
          <Eyebrow>Total spent — July</Eyebrow>
          <div className="text-2xl mt-1" style={{ fontFamily: "JetBrains Mono", color: C.text }}>₹{totalSpent.toLocaleString()}</div>
          <div className="mt-3"><ProgressBar value={(totalSpent / budget) * 100} /></div>
          <div className="text-[11px] mt-1.5" style={{ color: C.textFaint, fontFamily: "JetBrains Mono" }}>of ₹{budget.toLocaleString()} monthly cap</div>
        </Card>
        <Card pad="p-4">
          <Eyebrow>Budget remaining</Eyebrow>
          <div className="text-2xl mt-1" style={{ fontFamily: "JetBrains Mono", color: C.success }}>₹{(budget - totalSpent).toLocaleString()}</div>
          <div className="text-[11px] mt-1.5" style={{ color: C.textFaint, fontFamily: "Rajdhani" }}>19 days left this cycle</div>
        </Card>
        <Card pad="p-4">
          <Eyebrow>Pending invoices</Eyebrow>
          <div className="text-2xl mt-1" style={{ fontFamily: "JetBrains Mono", color: C.text }}>2</div>
          <div className="text-[11px] mt-1.5" style={{ color: C.textFaint, fontFamily: "Rajdhani" }}>₹25,000 awaiting approval</div>
        </Card>
      </div>

      <Card className="mb-5">
        <Eyebrow>Spend by category</Eyebrow>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={expenseCategories} margin={{ left: -20, top: 10 }}>
            <CartesianGrid stroke={C.border} vertical={false} />
            <XAxis dataKey="cat" stroke={C.textFaint} tick={{ fontSize: 11, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
            <YAxis stroke={C.textFaint} tick={{ fontSize: 11, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} width={45} />
            <Tooltip content={<TT />} cursor={{ fill: C.surface3 }} />
            <Bar dataKey="amt" fill={C.gold} maxBarSize={44} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {showForm && (
        <Card className="mb-4">
          <div className="grid grid-cols-4 gap-3">
            <input placeholder="Description" value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })}
              className="col-span-2 bg-transparent border px-3 py-2 text-sm outline-none" style={{ borderColor: C.border, color: C.text, fontFamily: "Inter" }} />
            <select value={form.cat} onChange={e => setForm({ ...form, cat: e.target.value })}
              className="bg-transparent border px-3 py-2 text-xs outline-none" style={{ borderColor: C.border, color: C.text, fontFamily: "Rajdhani" }}>
              {expenseCategories.map(c => <option key={c.cat} value={c.cat} style={{ background: C.surface }}>{c.cat}</option>)}
            </select>
            <input placeholder="Amount ₹" value={form.amt} onChange={e => setForm({ ...form, amt: e.target.value })}
              className="bg-transparent border px-3 py-2 text-sm outline-none" style={{ borderColor: C.border, color: C.text, fontFamily: "JetBrains Mono" }} />
          </div>
          <div className="mt-3"><PrimaryBtn onClick={addExpense} icon={Check} small>Save expense</PrimaryBtn></div>
        </Card>
      )}

      <Card pad="p-0">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.border}` }}>
              {["Description", "Category", "Date", "Amount"].map(h => (
                <th key={h} className="text-left px-4 py-3 text-[11px] uppercase tracking-wider font-medium" style={{ color: C.textFaint, fontFamily: "Rajdhani" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {expenses.map(e => (
              <tr key={e.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                <td className="px-4 py-3" style={{ color: C.text, fontFamily: "Inter" }}>{e.desc}</td>
                <td className="px-4 py-3"><Badge>{e.cat}</Badge></td>
                <td className="px-4 py-3" style={{ color: C.textFaint, fontFamily: "JetBrains Mono", fontSize: 12 }}>{e.date}</td>
                <td className="px-4 py-3" style={{ color: C.text, fontFamily: "JetBrains Mono" }}>₹{e.amt.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function Inventory() {
  const [items, setItems] = useState(initialInventory);
  const [showForm, setShowForm] = useState(false);
  const [qrItem, setQrItem] = useState(null);
  const [q, setQ] = useState("");
  const [form, setForm] = useState({ name: "", qty: "", low: "", supplier: "" });

  const addItem = () => {
    if (!form.name.trim()) return;
    setItems([{ id: Date.now(), name: form.name, qty: Number(form.qty) || 0, low: Number(form.low) || 5, supplier: form.supplier || "—", date: "Jul 13" }, ...items]);
    setForm({ name: "", qty: "", low: "", supplier: "" });
    setShowForm(false);
  };

  const filtered = items.filter(i => i.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div>
      <SectionHeader title="Inventory" subtitle="Components database, stock levels, and suppliers."
        action={<PrimaryBtn icon={Plus} onClick={() => setShowForm(!showForm)}>Add item</PrimaryBtn>} />

      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center gap-2 px-3 py-2 border flex-1 max-w-sm" style={{ borderColor: C.border }}>
          <Search size={14} style={{ color: C.textFaint }} />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search components..."
            className="bg-transparent outline-none text-sm flex-1" style={{ color: C.text, fontFamily: "Inter" }} />
        </div>
      </div>

      {showForm && (
        <Card className="mb-4">
          <div className="grid grid-cols-5 gap-3">
            <input placeholder="Component name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              className="col-span-2 bg-transparent border px-3 py-2 text-sm outline-none" style={{ borderColor: C.border, color: C.text, fontFamily: "Inter" }} />
            <input placeholder="Qty" value={form.qty} onChange={e => setForm({ ...form, qty: e.target.value })}
              className="bg-transparent border px-3 py-2 text-sm outline-none" style={{ borderColor: C.border, color: C.text, fontFamily: "JetBrains Mono" }} />
            <input placeholder="Low-stock at" value={form.low} onChange={e => setForm({ ...form, low: e.target.value })}
              className="bg-transparent border px-3 py-2 text-sm outline-none" style={{ borderColor: C.border, color: C.text, fontFamily: "JetBrains Mono" }} />
            <input placeholder="Supplier" value={form.supplier} onChange={e => setForm({ ...form, supplier: e.target.value })}
              className="bg-transparent border px-3 py-2 text-sm outline-none" style={{ borderColor: C.border, color: C.text, fontFamily: "Inter" }} />
          </div>
          <div className="mt-3"><PrimaryBtn onClick={addItem} icon={Check} small>Save item</PrimaryBtn></div>
        </Card>
      )}

      <Card pad="p-0">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.border}` }}>
              {["Component", "Quantity", "Supplier", "Purchased", "Status", ""].map(h => (
                <th key={h} className="text-left px-4 py-3 text-[11px] uppercase tracking-wider font-medium" style={{ color: C.textFaint, fontFamily: "Rajdhani" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(i => {
              const low = i.qty <= i.low;
              return (
                <tr key={i.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                  <td className="px-4 py-3" style={{ color: C.text, fontFamily: "Inter" }}>{i.name}</td>
                  <td className="px-4 py-3" style={{ color: low ? C.danger : C.text, fontFamily: "JetBrains Mono" }}>{i.qty}</td>
                  <td className="px-4 py-3" style={{ color: C.textDim, fontFamily: "Inter", fontSize: 13 }}>{i.supplier}</td>
                  <td className="px-4 py-3" style={{ color: C.textFaint, fontFamily: "JetBrains Mono", fontSize: 12 }}>{i.date}</td>
                  <td className="px-4 py-3">{low ? <Badge tone="danger">Low stock</Badge> : <Badge tone="success">In stock</Badge>}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => setQrItem(qrItem === i.id ? null : i.id)}><QrCode size={16} style={{ color: C.textFaint }} /></button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      {qrItem && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: "#000000AA" }} onClick={() => setQrItem(null)}>
          <Card pad="p-6" className="text-center" style={{ width: 220 }}>
            <div className="mx-auto mb-3" style={{ width: 140, height: 140, background: "repeating-conic-gradient(#F2F1EC 0% 25%, #0A0A0B 0% 50%) 0 0/20px 20px" }} />
            <div className="text-xs" style={{ color: C.text, fontFamily: "JetBrains Mono" }}>{items.find(i => i.id === qrItem)?.name}</div>
            <div className="text-[10px] mt-1" style={{ color: C.textFaint }}>SPINX-INV-{qrItem}</div>
          </Card>
        </div>
      )}
    </div>
  );
}

function Projects() {
  const [tasks, setTasks] = useState(initialTasks);
  const [dragId, setDragId] = useState(null);
  const [dragFrom, setDragFrom] = useState(null);
  const [drafts, setDrafts] = useState({ todo: "", progress: "", done: "" });
  const cols = [{ key: "todo", label: "To Do" }, { key: "progress", label: "In Progress" }, { key: "done", label: "Done" }];

  const onDrop = (colKey) => {
    if (dragId == null || dragFrom == null) return;
    if (dragFrom === colKey) return;
    const item = tasks[dragFrom].find(t => t.id === dragId);
    setTasks({
      ...tasks,
      [dragFrom]: tasks[dragFrom].filter(t => t.id !== dragId),
      [colKey]: [...tasks[colKey], item],
    });
    setDragId(null); setDragFrom(null);
  };

  const addTask = (colKey) => {
    const title = drafts[colKey];
    if (!title.trim()) return;
    setTasks({ ...tasks, [colKey]: [...tasks[colKey], { id: "t" + Date.now(), title, tag: "General", due: "—", people: ["Shihan"] }] });
    setDrafts({ ...drafts, [colKey]: "" });
  };

  return (
    <div>
      <SectionHeader title="Projects" subtitle="Drag cards between columns to update status." />
      <div className="grid grid-cols-3 gap-4">
        {cols.map(col => (
          <div key={col.key} onDragOver={e => e.preventDefault()} onDrop={() => onDrop(col.key)}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div style={{ width: 6, height: 6, background: col.key === "done" ? C.success : col.key === "progress" ? C.gold : C.textFaint }} />
                <span className="text-xs uppercase tracking-wider font-medium" style={{ color: C.textDim, fontFamily: "Rajdhani" }}>{col.label}</span>
                <span className="text-[11px]" style={{ color: C.textFaint, fontFamily: "JetBrains Mono" }}>{tasks[col.key].length}</span>
              </div>
            </div>
            <div className="space-y-2.5 min-h-[80px]">
              {tasks[col.key].map(t => (
                <div key={t.id} draggable onDragStart={() => { setDragId(t.id); setDragFrom(col.key); }}
                  className="p-3 border cursor-grab active:cursor-grabbing"
                  style={{ background: C.surface, borderColor: C.border, opacity: dragId === t.id ? 0.4 : 1, ...clipCorner(10) }}>
                  <div className="flex items-center justify-between mb-2">
                    <Badge tone={col.key === "done" ? "success" : "default"}>{t.tag}</Badge>
                    {col.key === "done" && <CheckCircle2 size={13} style={{ color: C.success }} />}
                  </div>
                  <div className="text-sm mb-2.5" style={{ color: C.text, fontFamily: "Inter" }}>{t.title}</div>
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-1.5">{t.people.map((p, i) => <Avatar key={i} name={p} size={20} />)}</div>
                    <span className="text-[11px]" style={{ color: C.textFaint, fontFamily: "JetBrains Mono" }}>{t.due}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 mt-2.5">
              <input value={drafts[col.key]} onChange={e => setDrafts({ ...drafts, [col.key]: e.target.value })}
                onKeyDown={e => e.key === "Enter" && addTask(col.key)} placeholder="Add task..."
                className="flex-1 bg-transparent border px-2.5 py-1.5 text-xs outline-none" style={{ borderColor: C.border, color: C.text, fontFamily: "Inter" }} />
              <button onClick={() => addTask(col.key)}><Plus size={15} style={{ color: C.textFaint }} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Team() {
  return (
    <div>
      <SectionHeader title="Team" subtitle="Members, roles, and current work logs." />
      <div className="grid grid-cols-3 gap-4">
        {teamMembers.map((m, i) => (
          <Card key={i}>
            <div className="flex items-center gap-3">
              <Avatar name={m.name} size={40} />
              <div>
                <div className="text-sm font-semibold" style={{ color: C.text, fontFamily: "Rajdhani", fontSize: 15 }}>{m.name}</div>
                <div className="text-[11px]" style={{ color: C.textFaint, fontFamily: "Inter" }}>{m.role}</div>
              </div>
            </div>
            <div className="mt-3 pt-3" style={{ borderTop: `1px solid ${C.border}` }}>
              <div className="flex items-center justify-between text-[11px] mb-1" style={{ fontFamily: "JetBrains Mono" }}>
                <span style={{ color: C.textFaint }}>Attendance</span>
                <span style={{ color: C.gold }}>{m.attendance}%</span>
              </div>
              <ProgressBar value={m.attendance} h={4} />
            </div>
            <div className="text-xs mt-3" style={{ color: C.textDim, fontFamily: "Inter" }}>
              <span style={{ color: C.textFaint }}>Working on: </span>{m.log}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Documentation() {
  const [open, setOpen] = useState(docGroups.map(g => g.project));
  const toggle = (p) => setOpen(open.includes(p) ? open.filter(x => x !== p) : [...open, p]);

  return (
    <div>
      <SectionHeader title="Documentation" subtitle="Design docs, circuit diagrams, CAD files, and source links." />
      <div className="space-y-3">
        {docGroups.map(g => (
          <Card key={g.project} pad="p-0">
            <div className="flex items-center justify-between px-4 py-3 cursor-pointer" onClick={() => toggle(g.project)}>
              <span className="text-sm font-semibold" style={{ color: C.text, fontFamily: "Rajdhani", fontSize: 15 }}>{g.project}</span>
              <ChevronDown size={15} style={{ color: C.textFaint, transform: open.includes(g.project) ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
            </div>
            {open.includes(g.project) && (
              <div style={{ borderTop: `1px solid ${C.border}` }}>
                {g.docs.map((d, i) => {
                  const Icon = docIcon[d.type];
                  return (
                    <div key={i} className="flex items-center gap-3 px-4 py-3" style={{ borderTop: i > 0 ? `1px solid ${C.border}` : "none" }}>
                      <Icon size={16} style={{ color: C.gold }} />
                      <span className="text-sm flex-1" style={{ color: C.text, fontFamily: "Inter" }}>{d.name}</span>
                      <Badge>{d.v}</Badge>
                      <span className="text-[11px]" style={{ color: C.textFaint, fontFamily: "JetBrains Mono" }}>{d.updated}</span>
                      <ArrowUpRight size={14} style={{ color: C.textFaint }} />
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

function Procurement() {
  const [rows, setRows] = useState(initialProcurement);
  const setStatus = (id, status) => setRows(rows.map(r => r.id === id ? { ...r, status } : r));

  return (
    <div>
      <SectionHeader title="Procurement" subtitle="Components to buy, vendor quotes, and purchase approvals." />
      <Card pad="p-0">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.border}` }}>
              {["Item", "Vendor", "Quotation", "Status", ""].map(h => (
                <th key={h} className="text-left px-4 py-3 text-[11px] uppercase tracking-wider font-medium" style={{ color: C.textFaint, fontFamily: "Rajdhani" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                <td className="px-4 py-3" style={{ color: C.text, fontFamily: "Inter" }}>{r.item}</td>
                <td className="px-4 py-3" style={{ color: C.textDim, fontFamily: "Inter", fontSize: 13 }}>{r.vendor}</td>
                <td className="px-4 py-3" style={{ color: C.text, fontFamily: "JetBrains Mono" }}>₹{r.quote.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <Badge tone={r.status === "Approved" ? "success" : r.status === "Rejected" ? "danger" : "gold"}>{r.status}</Badge>
                </td>
                <td className="px-4 py-3">
                  {r.status === "Pending" && (
                    <div className="flex gap-2">
                      <button onClick={() => setStatus(r.id, "Approved")} title="Approve"><Check size={15} style={{ color: C.success }} /></button>
                      <button onClick={() => setStatus(r.id, "Rejected")} title="Reject"><X size={15} style={{ color: C.danger }} /></button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function Analytics() {
  return (
    <div>
      <SectionHeader title="Analytics" subtitle="Monthly spending, project progress, and usage patterns." />
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <Eyebrow>Monthly spending</Eyebrow>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={budgetSeries} margin={{ left: -20, top: 10 }}>
              <CartesianGrid stroke={C.border} vertical={false} />
              <XAxis dataKey="m" stroke={C.textFaint} tick={{ fontSize: 11, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
              <YAxis stroke={C.textFaint} tick={{ fontSize: 11, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} width={45} />
              <Tooltip content={<TT />} />
              <Line type="monotone" dataKey="spend" stroke={C.gold} strokeWidth={2} dot={{ r: 3, fill: C.gold }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <Eyebrow>Project progress</Eyebrow>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={progressData} layout="vertical" margin={{ left: 10, top: 10 }}>
              <CartesianGrid stroke={C.border} horizontal={false} />
              <XAxis type="number" domain={[0, 100]} stroke={C.textFaint} tick={{ fontSize: 11, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" stroke={C.textFaint} tick={{ fontSize: 11, fontFamily: "Inter" }} axisLine={false} tickLine={false} width={110} />
              <Tooltip content={<TT />} cursor={{ fill: C.surface3 }} />
              <Bar dataKey="pct" fill={C.gold} maxBarSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <Eyebrow>Inventory usage by category</Eyebrow>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={usageData} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={2}>
                {usageData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke={C.bg} strokeWidth={2} />)}
              </Pie>
              <Tooltip content={<TT />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
            {usageData.map((d, i) => (
              <div key={i} className="flex items-center gap-1.5 text-[11px]" style={{ color: C.textDim, fontFamily: "Rajdhani" }}>
                <div style={{ width: 8, height: 8, background: PIE_COLORS[i % PIE_COLORS.length] }} /> {d.name}
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <Eyebrow>Meeting statistics</Eyebrow>
          <div className="grid grid-cols-2 gap-4 mt-3">
            {[
              { label: "This month", value: "9" }, { label: "Avg. duration", value: "38m" },
              { label: "Action items closed", value: "82%" }, { label: "No-show rate", value: "3%" },
            ].map((s, i) => (
              <div key={i}>
                <div className="text-2xl" style={{ fontFamily: "JetBrains Mono", color: C.text }}>{s.value}</div>
                <div className="text-[11px] mt-1" style={{ color: C.textFaint, fontFamily: "Rajdhani" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function AIFeatures() {
  const features = [
    "Summarize meeting notes automatically",
    "Search across all documents using natural language",
    "Suggest components based on previous projects",
    "Predict when inventory will run out",
    "Generate weekly progress reports",
  ];
  return (
    <div className="relative overflow-hidden">
      <SectionHeader title="AI Assistant" subtitle="Coming to SpinX Workspace." />
      <Card className="relative">
        <div className="absolute -right-6 -bottom-10 opacity-[0.04]"><XMark size={220} strokeWidth={5} /></div>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={16} style={{ color: C.gold }} />
          <Badge tone="gold">In development</Badge>
        </div>
        <div className="space-y-2.5">
          {features.map((f, i) => (
            <div key={i} className="flex items-center gap-2.5 text-sm" style={{ color: C.textDim, fontFamily: "Inter" }}>
              <Lock size={12} style={{ color: C.textFaint }} /> {f}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ================================================================== SHELL ================================================================== */

export default function SpinXWorkspace() {
  useFonts();
  const [active, setActive] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);

  const renderSection = () => {
    switch (active) {
      case "dashboard": return <Dashboard />;
      case "meetings": return <Meetings />;
      case "notices": return <Notices />;
      case "finance": return <Finance />;
      case "inventory": return <Inventory />;
      case "projects": return <Projects />;
      case "team": return <Team />;
      case "docs": return <Documentation />;
      case "procurement": return <Procurement />;
      case "analytics": return <Analytics />;
      case "ai": return <AIFeatures />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex w-full" style={{ height: "100vh", background: C.bg, fontFamily: "Inter" }}>
      <style>{`
        * { box-sizing: border-box; }
        ::selection { background: ${C.gold}44; }
        input::placeholder, textarea::placeholder { color: ${C.textFaint}; }
        select option { background: ${C.surface}; }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: ${C.bg}; }
        ::-webkit-scrollbar-thumb { background: ${C.surface3}; }
        .spx-fade { animation: spxFade 0.25s ease both; }
        @keyframes spxFade { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
        @media (prefers-reduced-motion: reduce) { .spx-fade { animation: none; } }
      `}</style>

      {/* SIDEBAR */}
      <div className="flex flex-col shrink-0 transition-all duration-300" style={{ width: collapsed ? 68 : 232, background: C.surface, borderRight: `1px solid ${C.border}` }}>
        <div className="flex items-center gap-2.5 px-4 h-16 shrink-0" style={{ borderBottom: `1px solid ${C.border}` }}>
          <XMark size={20} strokeWidth={4} />
          {!collapsed && (
            <div>
              <div style={{ fontFamily: "Orbitron", fontWeight: 800, fontSize: 15, color: C.text, letterSpacing: "0.03em" }}>SPINX</div>
              <div style={{ fontFamily: "JetBrains Mono", fontSize: 9, color: C.textFaint, letterSpacing: "0.12em", marginTop: -2 }}>WORKSPACE</div>
            </div>
          )}
        </div>

        <div className="flex-1 py-3 px-2.5 space-y-0.5 overflow-y-auto">
          {NAV.map(n => {
            const isActive = active === n.id;
            return (
              <button
                key={n.id}
                onClick={() => setActive(n.id)}
                className="w-full flex items-center gap-3 px-2.5 py-2.5 relative transition-colors group"
                style={{ background: isActive ? C.goldSoft : "transparent", color: isActive ? C.gold : C.textDim }}
              >
                {isActive && <div className="absolute left-0 top-0 bottom-0" style={{ width: 2, background: C.gold }} />}
                <n.icon size={16} className="shrink-0" />
                {!collapsed && <span className="text-sm" style={{ fontFamily: "Rajdhani", fontWeight: 600, fontSize: 14 }}>{n.label}</span>}
              </button>
            );
          })}
        </div>

        <div className="p-2.5 shrink-0" style={{ borderTop: `1px solid ${C.border}` }}>
          <button onClick={() => setActive("ai")} className="w-full flex items-center gap-3 px-2.5 py-2.5 transition-colors"
            style={{ background: active === "ai" ? C.goldSoft : "transparent", color: active === "ai" ? C.gold : C.textDim }}>
            <Sparkles size={16} className="shrink-0" />
            {!collapsed && <span className="text-sm" style={{ fontFamily: "Rajdhani", fontWeight: 600 }}>AI Assistant</span>}
          </button>
          <button onClick={() => setCollapsed(!collapsed)} className="w-full flex items-center justify-center gap-2 px-2.5 py-2 mt-1 text-xs"
            style={{ color: C.textFaint, fontFamily: "Rajdhani" }}>
            {collapsed ? <ChevronRight size={14} /> : <><ChevronLeft size={14} /> Collapse</>}
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center gap-4 px-6 h-16 shrink-0" style={{ borderBottom: `1px solid ${C.border}`, background: C.bg }}>
          <div className="flex items-center gap-2 px-3 py-2 border max-w-sm w-full" style={{ borderColor: C.border, background: C.surface }}>
            <Search size={14} style={{ color: C.textFaint }} />
            <input placeholder="Search projects, docs, people..." className="bg-transparent outline-none text-sm flex-1" style={{ color: C.text, fontFamily: "Inter" }} />
          </div>
          <div className="ml-auto flex items-center gap-4">
            <button className="relative">
              <Bell size={17} style={{ color: C.textDim }} />
              <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full" style={{ background: C.gold }} />
            </button>
            <div className="w-px h-6" style={{ background: C.border }} />
            <div className="flex items-center gap-2.5">
              <Avatar name="Shihan" size={32} />
              <div>
                <div className="text-sm font-semibold leading-none" style={{ color: C.text, fontFamily: "Rajdhani" }}>Shihan</div>
                <div className="text-[11px] mt-0.5" style={{ color: C.textFaint, fontFamily: "Inter" }}>Founder</div>
              </div>
            </div>
          </div>
        </div>

        <div key={active} className="flex-1 overflow-y-auto p-6 spx-fade">
          {renderSection()}
        </div>
      </div>
    </div>
  );
}
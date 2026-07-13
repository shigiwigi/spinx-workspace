import React, { useState } from "react";
import {
  Plus, Check, X, Clock, TrendingUp, TrendingDown, AlertTriangle, QrCode, CircleDot,
  CheckCircle2, ChevronDown, Pin, PinOff, Search, Lock, Sparkles, ArrowUpRight, Kanban as KanbanIcon, Wallet
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip
} from "recharts";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { C, clipCorner } from "../theme";
import { Card, Eyebrow, SectionHeader, Badge, PrimaryBtn, GhostBtn, ProgressBar, Avatar, XMark, TT } from "./Primitives";
import { docIcon, budgetSeries, expenseCategories, PIE_COLORS } from "../data";

// ... Keep Dashboard, Meetings, Notices, Finance, Inventory, Projects exactly as they are ...

/* ---------------------------------- TEAM ---------------------------------- */
export function Team({ liveTeam }) {
  return (
    <div>
      <SectionHeader title="Team" subtitle="Members, roles, and current work logs." />
      <div className="grid grid-cols-3 gap-4">
        {liveTeam.map((m) => (
          <Card key={m.id}>
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

/* ---------------------------------- DOCUMENTATION ---------------------------------- */
export function Documentation({ liveDocs }) {
  const [open, setOpen] = useState([]);
  const toggle = (p) => setOpen(open.includes(p) ? open.filter(x => x !== p) : [...open, p]);

  return (
    <div>
      <SectionHeader title="Documentation" subtitle="Design docs, circuit diagrams, CAD files, and source links." />
      <div className="space-y-3">
        {liveDocs.map(g => (
          <Card key={g.id} pad="p-0">
            <div className="flex items-center justify-between px-4 py-3 cursor-pointer" onClick={() => toggle(g.project)}>
              <span className="text-sm font-semibold" style={{ color: C.text, fontFamily: "Rajdhani", fontSize: 15 }}>{g.project}</span>
              <ChevronDown size={15} style={{ color: C.textFaint, transform: open.includes(g.project) ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
            </div>
            {open.includes(g.project) && (
              <div style={{ borderTop: `1px solid ${C.border}` }}>
                {g.docs?.map((d, i) => {
                  const Icon = docIcon[d.type] || CircleDot;
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

/* ---------------------------------- PROCUREMENT ---------------------------------- */
export function Procurement({ liveProcurement }) {
  const setStatus = async (id, status) => {
    await updateDoc(doc(db, "procurement", id), { status });
  };

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
            {liveProcurement.map(r => (
              <tr key={r.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                <td className="px-4 py-3" style={{ color: C.text, fontFamily: "Inter" }}>{r.item}</td>
                <td className="px-4 py-3" style={{ color: C.textDim, fontFamily: "Inter", fontSize: 13 }}>{r.vendor}</td>
                <td className="px-4 py-3" style={{ color: C.text, fontFamily: "JetBrains Mono" }}>₹{r.quote?.toLocaleString()}</td>
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

/* ---------------------------------- ANALYTICS ---------------------------------- */
export function Analytics({ expenses, tasks, inventory }) {
  const totalSpent = expenses.reduce((s, e) => s + e.amt, 0);
  const pendingTasks = (tasks.todo?.length || 0) + (tasks.progress?.length || 0);
  const lowStock = inventory.filter(i => i.qty <= i.low).length;

  const dynamicProgressData = [
    { name: "SX-4 Quadcopter", pct: 68 },
    { name: "GCS Platform", pct: 82 },
    { name: "Payload Rig", pct: 34 }
  ];

  const dynamicUsageData = [
    { name: "Motors & ESCs", value: inventory.filter(i => i.name?.toLowerCase().includes("motor") || i.name?.toLowerCase().includes("esc")).reduce((s,i)=>s+i.qty, 0) || 38 },
    { name: "Electronics", value: inventory.filter(i => i.name?.toLowerCase().includes("esp32")).reduce((s,i)=>s+i.qty, 0) || 15 },
    { name: "Hardware/Other", value: 20 }
  ];

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
            <BarChart data={dynamicProgressData} layout="vertical" margin={{ left: 10, top: 10 }}>
              <CartesianGrid stroke={C.border} horizontal={false} />
              <XAxis type="number" domain={[0, 100]} stroke={C.textFaint} tick={{ fontSize: 11, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" stroke={C.textFaint} tick={{ fontSize: 11, fontFamily: "Inter" }} axisLine={false} tickLine={false} width={110} />
              <Tooltip content={<TT />} cursor={{ fill: C.surface3 }} />
              <Bar dataKey="pct" fill={C.gold} maxBarSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <Eyebrow>Inventory items track</Eyebrow>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={dynamicUsageData} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={2}>
                {dynamicUsageData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke={C.bg} strokeWidth={2} />)}
              </Pie>
              <Tooltip content={<TT />} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <Eyebrow>Workspace stats summary</Eyebrow>
          <div className="grid grid-cols-2 gap-4 mt-3">
            {[
              { label: "Total Spent logged", value: `₹${totalSpent.toLocaleString()}` },
              { label: "Pending Tasks left", value: pendingTasks },
              { label: "Alert Low Stock items", value: lowStock },
              { label: "System Status", value: "Online" }
            ].map((s, i) => (
              <div key={i}>
                <div className="text-xl" style={{ fontFamily: "JetBrains Mono", color: C.text }}>{s.value}</div>
                <div className="text-[11px] mt-1" style={{ color: C.textFaint, fontFamily: "Rajdhani" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ... Keep AIFeatures exactly as it is ...
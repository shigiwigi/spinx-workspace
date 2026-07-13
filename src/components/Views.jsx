import React, { useState } from "react";
import {
  Plus, Check, X, Clock, TrendingUp, TrendingDown, AlertTriangle, QrCode, CircleDot,
  CheckCircle2, ChevronDown, Pin, PinOff, Search, Lock, Sparkles, ArrowUpRight, Kanban as KanbanIcon, Wallet, 
  UserCircle, FileText, ShoppingCart
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip
} from "recharts";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { C, clipCorner } from "../theme";
import { Card, Eyebrow, SectionHeader, Badge, PrimaryBtn, GhostBtn, ProgressBar, Avatar, XMark, TT } from "./Primitives";
import { docIcon, budgetSeries, expenseCategories, PIE_COLORS } from "../data";

/* ---------------------------------- DASHBOARD ---------------------------------- */
export function Dashboard({ meetings = [], inventory = [], notices = [], tasks = { todo: [], progress: [], done: [] }, expenses = [] }) {
  const activeProjects = 0;
  const pendingTasks = (tasks.todo?.length || 0) + (tasks.progress?.length || 0);
  const lowStock = inventory.filter(i => i.qty <= i.low);
  const totalSpent = expenses.reduce((s, e) => s + e.amt, 0);
  const budgetUsedPct = Math.round((totalSpent / 80000) * 100) || 0;

  const stats = [
    { label: "Active Projects", value: activeProjects, delta: "No active tracks", up: null, icon: KanbanIcon },
    { label: "Pending Tasks", value: pendingTasks, delta: `${pendingTasks} tasks remaining`, up: null, icon: Clock },
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
            <div className="flex items-center gap-1 mt-2 text-[11px]" style={{ color: C.textDim, fontFamily: "Rajdhani" }}>
              {s.delta}
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4 mb-5">
        <Card className="col-span-2">
          <div className="flex items-center justify-between mb-3">
            <Eyebrow>Budget overview — last 6 months</Eyebrow>
            <Badge tone="gold">₹{totalSpent.toLocaleString()} this month</Badge>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={budgetSeries} margin={{ left: -20, top: 5 }}>
              <CartesianGrid stroke={C.border} vertical={false} />
              <XAxis dataKey="m" stroke={C.textFaint} tick={{ fontSize: 11, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
              <YAxis stroke={C.textFaint} tick={{ fontSize: 11, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} width={45} />
              <Tooltip content={<TT />} />
              <Area type="monotone" dataKey="spend" stroke={C.gold} strokeWidth={2} fill="none" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <Eyebrow>Upcoming meetings</Eyebrow>
          <div className="mt-2 space-y-3">
            {meetings.filter(m => m.status === "Scheduled").length === 0 ? (
              <p className="text-xs py-4 text-center" style={{ color: C.textFaint, fontFamily: "Inter" }}>No upcoming meetings scheduled.</p>
            ) : (
              meetings.filter(m => m.status === "Scheduled").map(m => (
                <div key={m.id} className="flex items-start gap-2 pb-3 border-b" style={{ borderColor: C.border }}>
                  <div className="text-center shrink-0 px-2 py-1" style={{ background: C.surface3, fontFamily: "JetBrains Mono" }}>
                    <div className="text-[10px]" style={{ color: C.textFaint }}>{m.date?.split(" ")[0]}</div>
                    <div className="text-sm font-medium" style={{ color: C.gold }}>{m.date?.split(" ")[1]}</div>
                  </div>
                  <div>
                    <div className="text-sm" style={{ color: C.text, fontFamily: "Inter" }}>{m.title}</div>
                    <div className="text-[11px] mt-0.5" style={{ color: C.textFaint, fontFamily: "JetBrains Mono" }}>{m.time}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="col-span-2">
          <Eyebrow>Recent activity</Eyebrow>
          <p className="text-xs py-8 text-center" style={{ color: C.textFaint, fontFamily: "Inter" }}>Workspace workspace is fresh. No recent activity events logged.</p>
        </Card>

        <Card>
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={14} style={{ color: C.danger }} />
            <Eyebrow>Inventory alerts</Eyebrow>
          </div>
          <div className="space-y-2">
            {lowStock.length === 0 ? (
              <p className="text-xs py-4 text-center" style={{ color: C.textFaint, fontFamily: "Inter" }}>All items are well stocked.</p>
            ) : (
              lowStock.map(item => (
                <div key={item.id} className="flex items-center justify-between px-2.5 py-2 text-xs" style={{ background: "#E5484D0F", border: `1px solid #E5484D33`, fontFamily: "Rajdhani" }}>
                  <span style={{ color: C.text }}>{item.name}</span>
                  <span style={{ color: C.danger, fontFamily: "JetBrains Mono" }}>{item.qty} left</span>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ---------------------------------- MEETINGS ---------------------------------- */
export function Meetings({ liveMeetings = [] }) {
  const [expanded, setExpanded] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", date: "", time: "", attendees: "" });
  const [actionDraft, setActionDraft] = useState("");

  const addMeeting = async () => {
    if (!form.title.trim()) return;
    await addDoc(collection(db, "meetings"), {
      title: form.title,
      date: form.date || "TBD",
      time: form.time || "—",
      attendees: form.attendees.split(",").map(s => s.trim()).filter(Boolean),
      status: "Scheduled",
      notes: "",
      actions: [],
      createdAt: new Date()
    });
    setForm({ title: "", date: "", time: "", attendees: "" });
    setShowForm(false);
  };

  const updateNotes = async (id, notes) => {
    await updateDoc(doc(db, "meetings", id), { notes });
  };

  const addAction = async (id, currentActions) => {
    if (!actionDraft.trim()) return;
    await updateDoc(doc(db, "meetings", id), {
      actions: [...currentActions, actionDraft]
    });
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

      {liveMeetings.length === 0 ? (
        <Card className="text-center py-12 text-sm" style={{ color: C.textDim, fontFamily: "Inter" }}>
          No records found. Click "Schedule meeting" to populate this interface.
        </Card>
      ) : (
        <div className="space-y-3">
          {liveMeetings.map(m => (
            <Card key={m.id} pad="p-0">
              <div className="p-4 flex items-center gap-4 cursor-pointer" onClick={() => setExpanded(expanded === m.id ? null : m.id)}>
                <div className="text-center shrink-0 w-14 px-2 py-1.5" style={{ background: C.surface3, fontFamily: "JetBrains Mono" }}>
                  <div className="text-[10px]" style={{ color: C.textFaint }}>{m.date?.split(" ")[0]}</div>
                  <div className="text-sm font-medium" style={{ color: C.gold }}>{m.date?.split(" ")[1] || ""}</div>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium" style={{ color: C.text, fontFamily: "Rajdhani", fontSize: 15 }}>{m.title}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock size={11} style={{ color: C.textFaint }} />
                    <span className="text-[11px]" style={{ color: C.textFaint, fontFamily: "JetBrains Mono" }}>{m.time}</span>
                    <div className="flex -space-x-1.5 ml-2">
                      {m.attendees?.map((a, i) => <Avatar key={i} name={a} size={20} />)}
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
                      {m.actions?.map((a, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm" style={{ color: C.textDim, fontFamily: "Inter" }}>
                          <CircleDot size={12} style={{ color: C.gold }} /> {a}
                        </div>
                      ))}
                      <div className="flex gap-2 mt-2">
                        <input value={actionDraft} onChange={e => setActionDraft(e.target.value)} placeholder="Add action item"
                          onKeyDown={e => e.key === "Enter" && addAction(m.id, m.actions || [])}
                          className="flex-1 bg-transparent border px-2.5 py-1.5 text-xs outline-none" style={{ borderColor: C.border, color: C.text, fontFamily: "Inter" }} />
                        <GhostBtn icon={Plus} onClick={() => addAction(m.id, m.actions || [])}>Add</GhostBtn>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------------------------- NOTICES ---------------------------------- */
export function Notices({ liveNotices = [] }) {
  const [filter, setFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", body: "", team: "General" });
  const teams = ["All", "Engineering", "Ops", "General"];

  const togglePin = async (id, currentPinned) => {
    await updateDoc(doc(db, "notices", id), { pinned: !currentPinned });
  };

  const addNotice = async () => {
    if (!form.title.trim()) return;
    await addDoc(collection(db, "notices"), {
      title: form.title,
      body: form.body,
      team: form.team,
      pinned: false,
      reads: 0,
      total: 14,
      createdAt: new Date()
    });
    setForm({ title: "", body: "", team: "General" });
    setShowForm(false);
  };

  const filtered = liveNotices.filter(n => filter === "All" || n.team === filter).sort((a, b) => b.pinned - a.pinned);

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

      {filtered.length === 0 ? (
        <Card className="text-center py-12 text-sm" style={{ color: C.textDim, fontFamily: "Inter" }}>
          No notices found in this channel.
        </Card>
      ) : (
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
                <button onClick={() => togglePin(n.id, n.pinned)} className="shrink-0">
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
      )}
    </div>
  );
}

/* ---------------------------------- FINANCE ---------------------------------- */
export function Finance({ liveExpenses = [] }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ desc: "", cat: "Components", amt: "" });

  const addExpense = async () => {
    if (!form.desc.trim() || !form.amt) return;
    await addDoc(collection(db, "expenses"), {
      desc: form.desc,
      cat: form.cat,
      amt: Number(form.amt),
      date: "Jul 13",
      createdAt: new Date()
    });
    setForm({ desc: "", cat: "Components", amt: "" });
    setShowForm(false);
  };

  const totalSpent = liveExpenses.reduce((s, e) => s + e.amt, 0);
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
          <div className="text-2xl mt-1" style={{ fontFamily: "JetBrains Mono", color: C.text }}>0</div>
          <div className="text-[11px] mt-1.5" style={{ color: C.textFaint, fontFamily: "Rajdhani" }}>₹0 awaiting approval</div>
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

      {liveExpenses.length === 0 ? (
        <Card className="text-center py-12 text-sm" style={{ color: C.textDim, fontFamily: "Inter" }}>
          No financial expenses logged for the current active cycle.
        </Card>
      ) : (
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
              {liveExpenses.map(e => (
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
      )}
    </div>
  );
}

/* ---------------------------------- INVENTORY ---------------------------------- */
export function Inventory({ liveInventory = [] }) {
  const [showForm, setShowForm] = useState(false);
  const [qrItem, setQrItem] = useState(null);
  const [q, setQ] = useState("");
  const [form, setForm] = useState({ name: "", qty: "", low: "", supplier: "" });

  const addItem = async () => {
    if (!form.name.trim()) return;
    await addDoc(collection(db, "inventory"), {
      name: form.name,
      qty: Number(form.qty) || 0,
      low: Number(form.low) || 5,
      supplier: form.supplier || "—",
      date: "Jul 13",
      createdAt: new Date()
    });
    setForm({ name: "", qty: "", low: "", supplier: "" });
    setShowForm(false);
  };

  const filtered = liveInventory.filter(i => i.name?.toLowerCase().includes(q.toLowerCase()));

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

      {filtered.length === 0 ? (
        <Card className="text-center py-12 text-sm" style={{ color: C.textDim, fontFamily: "Inter" }}>
          No components found in the system databank.
        </Card>
      ) : (
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
      )}

      {qrItem && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: "#000000AA" }} onClick={() => setQrItem(null)}>
          <Card pad="p-6" className="text-center" style={{ width: 220 }}>
            <div className="mx-auto mb-3" style={{ width: 140, height: 140, background: "repeating-conic-gradient(#F2F1EC 0% 25%, #0A0A0B 0% 50%) 0 0/20px 20px" }} />
            <div className="text-xs" style={{ color: C.text, fontFamily: "JetBrains Mono" }}>{liveInventory.find(i => i.id === qrItem)?.name}</div>
            <div className="text-[10px] mt-1" style={{ color: C.textFaint }}>SPINX-INV-{qrItem}</div>
          </Card>
        </div>
      )}
    </div>
  );
}

/* ---------------------------------- PROJECTS (KANBAN) ---------------------------------- */
export function Projects({ liveTasks = { todo: [], progress: [], done: [] } }) {
  const [dragId, setDragId] = useState(null);
  const [dragFrom, setDragFrom] = useState(null);
  const [drafts, setDrafts] = useState({ todo: "", progress: "", done: "" });
  const cols = [{ key: "todo", label: "To Do" }, { key: "progress", label: "In Progress" }, { key: "done", label: "Done" }];

  const onDrop = async (colKey) => {
    if (dragId == null || dragFrom == null) return;
    if (dragFrom === colKey) return;
    await updateDoc(doc(db, "tasks", dragId), { status: colKey });
    setDragId(null); setDragFrom(null);
  };

  const addTask = async (colKey) => {
    const title = drafts[colKey];
    if (!title.trim()) return;
    await addDoc(collection(db, "tasks"), {
      title,
      tag: "General",
      due: "—",
      people: ["Shihan"],
      status: colKey,
      createdAt: new Date()
    });
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
                <span className="text-[11px]" style={{ color: C.textFaint, fontFamily: "JetBrains Mono" }}>{liveTasks[col.key]?.length || 0}</span>
              </div>
            </div>
            <div className="space-y-2.5 min-h-[80px]">
              {liveTasks[col.key]?.map(t => (
                <div key={t.id} draggable onDragStart={() => { setDragId(t.id); setDragFrom(col.key); }}
                  className="p-3 border cursor-grab active:cursor-grabbing"
                  style={{ background: C.surface, borderColor: C.border, opacity: dragId === t.id ? 0.4 : 1, ...clipCorner(10) }}>
                  <div className="flex items-center justify-between mb-2">
                    <Badge tone={col.key === "done" ? "success" : "default"}>{t.tag}</Badge>
                    {col.key === "done" && <CheckCircle2 size={13} style={{ color: C.success }} />}
                  </div>
                  <div className="text-sm mb-2.5" style={{ color: C.text, fontFamily: "Inter" }}>{t.title}</div>
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-1.5">{t.people?.map((p, i) => <Avatar key={i} name={p} size={20} />)}</div>
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

/* ---------------------------------- TEAM ---------------------------------- */
export function Team({ liveTeam = [] }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", role: "", attendance: "", log: "" });

  const addMember = async () => {
    if (!form.name.trim() || !form.role.trim()) return;
    await addDoc(collection(db, "team"), {
      name: form.name,
      role: form.role,
      attendance: Number(form.attendance) || 100,
      log: form.log || "Awaiting task assignment.",
      createdAt: new Date()
    });
    setForm({ name: "", role: "", attendance: "", log: "" });
    setShowForm(false);
  };

  return (
    <div>
      <SectionHeader title="Team" subtitle="Members, roles, and current work logs." 
        action={<PrimaryBtn icon={Plus} onClick={() => setShowForm(!showForm)}>Add Member</PrimaryBtn>} />

      {showForm && (
        <Card className="mb-4 space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <input placeholder="Member Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              className="bg-transparent border px-3 py-2 text-sm outline-none" style={{ borderColor: C.border, color: C.text, fontFamily: "Inter" }} />
            <input placeholder="Role (e.g. Firmware Engineer)" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
              className="bg-transparent border px-3 py-2 text-sm outline-none" style={{ borderColor: C.border, color: C.text, fontFamily: "Inter" }} />
            <input placeholder="Attendance %" value={form.attendance} onChange={e => setForm({ ...form, attendance: e.target.value })}
              className="bg-transparent border px-3 py-2 text-sm outline-none" style={{ borderColor: C.border, color: C.text, fontFamily: "JetBrains Mono" }} />
          </div>
          <input placeholder="Current work log statement..." value={form.log} onChange={e => setForm({ ...form, log: e.target.value })}
            className="w-full bg-transparent border px-3 py-2 text-sm outline-none" style={{ borderColor: C.border, color: C.text, fontFamily: "Inter" }} />
          <PrimaryBtn onClick={addMember} icon={Check} small>Save Member</PrimaryBtn>
        </Card>
      )}

      {liveTeam.length === 0 ? (
        <Card className="text-center py-16 text-sm" style={{ color: C.textDim, fontFamily: "Inter" }}>
          <UserCircle size={32} className="mx-auto mb-2 opacity-40" style={{ color: C.gold }} />
          No team records found. Click "Add Member" to begin populating your roster.
        </Card>
      ) : (
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
      )}
    </div>
  );
}

/* ---------------------------------- DOCUMENTATION ---------------------------------- */
export function Documentation({ liveDocs = [] }) {
  const [open, setOpen] = useState([]);
  const toggle = (p) => setOpen(open.includes(p) ? open.filter(x => x !== p) : [...open, p]);

  return (
    <div>
      <SectionHeader title="Documentation" subtitle="Design docs, circuit diagrams, CAD files, and source links." />
      {liveDocs.length === 0 ? (
        <Card className="text-center py-16 text-sm" style={{ color: C.textDim, fontFamily: "Inter" }}>
          <FileText size={32} className="mx-auto mb-2 opacity-40" style={{ color: C.gold }} />
          No workspace documentation logs found.
        </Card>
      ) : (
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
      )}
    </div>
  );
}

/* ---------------------------------- PROCUREMENT ---------------------------------- */
export function Procurement({ liveProcurement = [] }) {
  const setStatus = async (id, status) => {
    await updateDoc(doc(db, "procurement", id), { status });
  };

  return (
    <div>
      <SectionHeader title="Procurement" subtitle="Components to buy, vendor quotes, and purchase approvals." />
      {liveProcurement.length === 0 ? (
        <Card className="text-center py-16 text-sm" style={{ color: C.textDim, fontFamily: "Inter" }}>
          <ShoppingCart size={32} className="mx-auto mb-2 opacity-40" style={{ color: C.gold }} />
          No procurement quotations listed.
        </Card>
      ) : (
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
      )}
    </div>
  );
}

/* ---------------------------------- ANALYTICS ---------------------------------- */
export function Analytics({ expenses = [], tasks = { todo: [], progress: [], done: [] }, inventory = [] }) {
  const totalSpent = expenses.reduce((s, e) => s + e.amt, 0);
  const pendingTasks = (tasks.todo?.length || 0) + (tasks.progress?.length || 0);
  const lowStock = inventory.filter(i => i.qty <= i.low).length;

  const dynamicProgressData = [
    { name: "SX-4 Quadcopter", pct: 0 },
    { name: "GCS Platform", pct: 0 },
    { name: "Payload Rig", pct: 0 }
  ];

  const dynamicUsageData = inventory.length === 0 ? [
    { name: "Empty Engine", value: 100 }
  ] : [
    { name: "Motors & ESCs", value: inventory.filter(i => i.name?.toLowerCase().includes("motor") || i.name?.toLowerCase().includes("esc")).reduce((s,i)=>s+i.qty, 0) || 0 },
    { name: "Electronics", value: inventory.filter(i => i.name?.toLowerCase().includes("esp32")).reduce((s,i)=>s+i.qty, 0) || 0 }
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

/* ---------------------------------- AI FEATURES ---------------------------------- */
export function AIFeatures() {
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
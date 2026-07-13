import React from "react";
import { Kanban as KanbanIcon, Clock, Wallet, AlertTriangle, Radio } from "lucide-react";
import { C, FONT } from "../../theme";
import { Card, Eyebrow, SectionHeader, Badge, ProgressBar, SprayStreak } from "../Primitives";

export function Dashboard({ meetings = [], inventory = [], notices = [], tasks = { todo: [], progress: [], done: [] }, expenses = [] }) {
  const activeProjects = (tasks.progress?.length || 0);
  const pendingTasks = (tasks.todo?.length || 0) + (tasks.progress?.length || 0);
  const lowStock = inventory.filter(i => i.qty <= i.low);
  const totalSpent = expenses.reduce((s, e) => s + e.amt, 0);
  const budget = 80000;
  const budgetUsedPct = Math.round((totalSpent / budget) * 100) || 0;

  const stats = [
    { label: "Active Builds", value: activeProjects, delta: activeProjects ? `${activeProjects} in progress` : "No active tracks", icon: KanbanIcon },
    { label: "Pending Tasks", value: pendingTasks, delta: `${pendingTasks} task${pendingTasks === 1 ? "" : "s"} remaining`, icon: Clock },
    { label: "Budget Used", value: `${budgetUsedPct}%`, delta: `of ₹${budget.toLocaleString()} cap`, icon: Wallet, danger: budgetUsedPct > 85 },
    { label: "Low Stock Items", value: lowStock.length, delta: lowStock.length ? "needs reorder" : "fully stocked", icon: AlertTriangle, danger: lowStock.length > 0 },
  ];

  return (
    <div>
      <SectionHeader title="Dashboard" subtitle="Here's where things stand at SpinX." />

      <div className="grid grid-cols-4 gap-4 mb-5">
        {stats.map((s, i) => (
          <Card key={i} pad="p-4" tag>
            <div className="flex items-start justify-between">
              <Eyebrow>{s.label}</Eyebrow>
              <s.icon size={15} style={{ color: s.danger ? C.danger : C.gold }} />
            </div>
            <div className="text-3xl mt-2" style={{ fontFamily: FONT.mono, color: C.text, fontWeight: 500 }}>{s.value}</div>
            <div className="flex items-center gap-1 mt-2 text-[11px]" style={{ color: s.danger ? C.danger : C.textFaint, fontFamily: FONT.body }}>
              {s.delta}
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4 mb-5">
        <Card className="col-span-2 relative overflow-hidden">
          <SprayStreak size={180} opacity={0.035} style={{ bottom: -40, right: -30 }} />
          <div className="relative flex items-center justify-between mb-3">
            <Eyebrow>Budget overview</Eyebrow>
            <Badge tone="gold">₹{totalSpent.toLocaleString()} this month</Badge>
          </div>
          {totalSpent === 0 ? (
            <div className="h-[160px] flex flex-col items-center justify-center border border-dashed gap-2" style={{ borderColor: C.border }}>
              <Wallet size={22} style={{ color: C.textFaint }} />
              <span className="text-xs" style={{ color: C.textFaint, fontFamily: FONT.body }}>No financial history recorded yet.</span>
            </div>
          ) : (
            <div className="relative py-6">
              <div className="flex items-end justify-between mb-2">
                <span className="text-2xl" style={{ fontFamily: FONT.mono, color: C.text }}>₹{totalSpent.toLocaleString()}</span>
                <span className="text-xs" style={{ color: C.textFaint, fontFamily: FONT.mono }}>/ ₹{budget.toLocaleString()}</span>
              </div>
              <ProgressBar value={budgetUsedPct} h={8} />
            </div>
          )}
        </Card>

        <Card>
          <Eyebrow>Upcoming meetings</Eyebrow>
          <div className="mt-3 space-y-3">
            {meetings.filter(m => m.status === "Scheduled").length === 0 ? (
              <p className="text-xs py-4 text-center" style={{ color: C.textFaint, fontFamily: FONT.body }}>No upcoming meetings scheduled.</p>
            ) : (
              meetings.filter(m => m.status === "Scheduled").map(m => (
                <div key={m.id} className="flex items-start gap-2.5 pb-3 border-b" style={{ borderColor: C.border }}>
                  <div className="text-center shrink-0 px-2 py-1" style={{ background: C.surface3, border: `1px solid ${C.border}`, fontFamily: FONT.mono }}>
                    <div className="text-[10px]" style={{ color: C.textFaint }}>{m.date?.split(" ")[0]}</div>
                    <div className="text-sm font-medium" style={{ color: C.gold }}>{m.date?.split(" ")[1]}</div>
                  </div>
                  <div>
                    <div className="text-sm" style={{ color: C.text, fontFamily: FONT.body }}>{m.title}</div>
                    <div className="text-[11px] mt-0.5" style={{ color: C.textFaint, fontFamily: FONT.mono }}>{m.time}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="col-span-2">
          <div className="flex items-center gap-2 mb-1">
            <Radio size={13} style={{ color: C.gold }} />
            <Eyebrow>Recent activity</Eyebrow>
          </div>
          <p className="text-xs py-8 text-center" style={{ color: C.textFaint, fontFamily: FONT.body }}>Activity stream is fresh. Awaiting team logs.</p>
        </Card>

        <Card>
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={14} style={{ color: C.danger }} />
            <Eyebrow>Inventory alerts</Eyebrow>
          </div>
          <div className="space-y-2">
            {lowStock.length === 0 ? (
              <p className="text-xs py-4 text-center" style={{ color: C.textFaint, fontFamily: FONT.body }}>All items are well stocked.</p>
            ) : (
              lowStock.map(item => (
                <div key={item.id} className="flex items-center justify-between px-2.5 py-2 text-xs" style={{ background: C.dangerSoft, border: `1px solid rgba(229,72,77,0.25)`, fontFamily: FONT.head }}>
                  <span style={{ color: C.text }}>{item.name}</span>
                  <span style={{ color: C.danger, fontFamily: FONT.mono }}>{item.qty} left</span>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

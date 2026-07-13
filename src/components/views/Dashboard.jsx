import React from "react";
import { Kanban as KanbanIcon, Clock, Wallet, AlertTriangle } from "lucide-react";
import { C } from "../../theme";
import { Card, Eyebrow, SectionHeader, Badge } from "../Primitives";

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
      <SectionHeader title="Dashboard" subtitle="Here's where things stand at SpinX." />

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
            <Eyebrow>Budget overview</Eyebrow>
            <Badge tone="gold">₹{totalSpent.toLocaleString()} this month</Badge>
          </div>
          <div className="h-[180px] flex items-center justify-center border border-dashed text-xs" style={{ borderColor: C.border, color: C.textFaint, fontFamily: "Inter" }}>
            No financial history recorded yet.
          </div>
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
          <p className="text-xs py-8 text-center" style={{ color: C.textFaint, fontFamily: "Inter" }}>Activity stream is fresh. Awaiting team logs.</p>
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
import React from "react";
import { Wallet, Clock, AlertTriangle, Radio } from "lucide-react";
import { C, FONT } from "../../theme";
import { Card, SectionHeader, Eyebrow, SprayStreak } from "../Primitives";

export function Analytics({ expenses = [], tasks = { todo: [], progress: [], done: [] }, inventory = [] }) {
  const totalSpent = expenses.reduce((s, e) => s + e.amt, 0);
  const pendingTasks = (tasks.todo?.length || 0) + (tasks.progress?.length || 0);
  const lowStock = inventory.filter(i => i.qty <= i.low).length;

  const stats = [
    { label: "Total budget spent", value: `₹${totalSpent.toLocaleString()}`, icon: Wallet },
    { label: "Pending workflow tasks", value: pendingTasks, icon: Clock },
    { label: "Low stock alerts", value: lowStock, icon: AlertTriangle },
    { label: "System link status", value: "Online", icon: Radio },
  ];

  return (
    <div>
      <SectionHeader title="Analytics" subtitle="Spending and project metrics." />
      <div className="grid grid-cols-2 gap-4">
        <Card className="col-span-2 relative overflow-hidden" tag>
          <SprayStreak size={200} opacity={0.035} style={{ top: -50, right: -40 }} />
          <Eyebrow>Workspace metrics summary</Eyebrow>
          <div className="relative grid grid-cols-4 gap-4 mt-4">
            {stats.map((s, i) => (
              <div key={i} className="border-t pt-3" style={{ borderColor: C.border }}>
                <s.icon size={14} style={{ color: C.gold }} className="mb-2" />
                <div className="text-xl" style={{ fontFamily: FONT.mono, color: C.text }}>{s.value}</div>
                <div className="text-[11px] mt-1" style={{ color: C.textFaint, fontFamily: FONT.head }}>{s.label}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

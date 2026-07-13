import React from "react";
import { C } from "../../theme";
import { Card, SectionHeader, Eyebrow } from "../Primitives";

export function Analytics({ expenses = [], tasks = { todo: [], progress: [], done: [] }, inventory = [] }) {
  const totalSpent = expenses.reduce((s, e) => s + e.amt, 0);
  const pendingTasks = (tasks.todo?.length || 0) + (tasks.progress?.length || 0);
  const lowStock = inventory.filter(i => i.qty <= i.low).length;

  return (
    <div>
      <SectionHeader title="Analytics" subtitle="Spending and project metrics trackers." />
      <div className="grid grid-cols-2 gap-4">
        <Card className="col-span-2">
          <Eyebrow>Workspace metrics tracking summary</Eyebrow>
          <div className="grid grid-cols-2 gap-4 mt-3">
            {[
              { label: "Total Budget Spent logged", value: `₹${totalSpent.toLocaleString()}` },
              { label: "Pending Workflow Tasks left", value: pendingTasks },
              { label: "Alert Low Stock components", value: lowStock },
              { label: "System Link Status", value: "Online" }
            ].map((s, i) => (
              <div key={i} className="border-b pb-2" style={{ borderColor: C.border }}>
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
import React, { useState } from "react";
import { Plus, CheckCircle2, ThumbsUp, AlertCircle } from "lucide-react";
import { doc, updateDoc, collection, addDoc, increment } from "firebase/firestore";
import { db } from "../../firebase";
import { C, clipCorner } from "../../theme";
import { SectionHeader, Badge, Avatar, Card } from "../Primitives";

export function Projects({ liveTasks = { todo: [], progress: [], done: [], completed: [] }, userRole, userId }) {
  const [dragId, setDragId] = useState(null);
  const [dragFrom, setDragFrom] = useState(null);
  const [drafts, setDrafts] = useState({ todo: "", progress: "" });
  const [selectedValue, setSelectedValue] = useState(750);

  // Available points matrices matching our Work Structure guideline document
  const pointOptions = [
    { label: "Weekly Report / Feedback (750 pts)", val: 750 },
    { label: "Idea Submission (750 pts)", val: 750 },
    { label: "Work & Role Duties (1500 pts)", val: 1500 },
    { label: "Event Attendance (500 pts)", val: 500 },
    { label: "Leading Workshops (500 pts)", val: 500 },
    { label: "Overall Performance / Extras (500 pts)", val: 500 }
  ];

  const cols = [
    { key: "todo", label: "To Do" }, 
    { key: "progress", label: "In Progress" }, 
    { key: "done", label: "Done (Reviewing)" },
    { key: "completed", label: "Completed" }
  ];

  const onDrop = async (colKey) => {
    if (dragId == null || dragFrom == null || dragFrom === colKey) return;
    
    // Safety restriction: Regular members cannot drag items into completed manually
    if (colKey === "completed") return; 

    // Safety restriction: Presenters/Media/Ops cannot manage engineering Kanban flows
    if (["Presenter", "Media", "Operations"].includes(userRole)) return;

    await updateDoc(doc(db, "tasks", dragId), { status: colKey });
    setDragId(null); setDragFrom(null);
  };

  const addTask = async (colKey) => {
    const title = drafts[colKey];
    if (!title?.trim()) return;
    
    await addDoc(collection(db, "tasks"), {
      title,
      tag: "Feature",
      due: "TBD",
      assignedTo: userId,
      pointsValue: Number(selectedValue),
      status: colKey,
      createdAt: new Date()
    });
    setDrafts({ ...drafts, [colKey]: "" });
  };

  const approveTask = async (taskId, workerId, pts) => {
    if (userRole !== "Owner") return;
    
    // 1. Mark task as fully finalized
    await updateDoc(doc(db, "tasks", taskId), { status: "completed" });

    // 2. Safely credit points directly into the worker's user document
    await updateDoc(doc(db, "users", workerId), {
      points: increment(pts)
    });
  };

  return (
    <div>
      <SectionHeader title="Projects & Operations" subtitle="Track features and task metrics." />
      
      {/* Task Creation Tool Area (Restricted to Builders) */}
      {["Head Developer", "Developer", "Owner"].includes(userRole) && (
        <Card className="mb-4 p-4">
          <div className="flex gap-4 items-center">
            <select 
              value={selectedValue} 
              onChange={e => setSelectedValue(e.target.value)}
              className="bg-transparent border px-3 py-1.5 text-xs outline-none text-white" 
              style={{ borderColor: C.border, background: C.surface }}
            >
              {pointOptions.map((o, idx) => <option key={idx} value={o.val}>{o.label}</option>)}
            </select>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-4 gap-4">
        {cols.map(col => (
          <div key={col.key} onDragOver={e => e.preventDefault()} onDrop={() => onDrop(col.key)}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div style={{ width: 6, height: 6, background: col.key === "completed" ? C.success : col.key === "done" ? C.gold : C.textFaint }} />
                <span className="text-xs uppercase tracking-wider font-medium" style={{ color: C.textDim, fontFamily: "Rajdhani" }}>{col.label}</span>
                <span className="text-[11px]" style={{ color: C.textFaint, fontFamily: "JetBrains Mono" }}>{liveTasks[col.key]?.length || 0}</span>
              </div>
            </div>

            <div className="space-y-2.5 min-h-[120px] border border-dashed p-2" style={{ borderColor: C.border }}>
              {liveTasks[col.key]?.map(t => (
                <div key={t.id} draggable={!["completed", "done"].includes(col.key) && !["Presenter", "Media", "Operations"].includes(userRole)} 
                  onDragStart={() => { setDragId(t.id); setDragFrom(col.key); }}
                  className="p-3 border bg-neutral-900"
                  style={{ borderColor: C.border, ...clipCorner(10) }}>
                  
                  <div className="flex items-center justify-between mb-2">
                    <Badge tone={col.key === "completed" ? "success" : "default"}>{t.pointsValue} PTS</Badge>
                    {col.key === "completed" && <CheckCircle2 size={13} style={{ color: C.success }} />}
                  </div>

                  <div className="text-sm mb-2.5 text-white" style={{ fontFamily: "Inter" }}>{t.title}</div>
                  
                  {/* Owner Action Panel Layout */}
                  {col.key === "done" && userRole === "Owner" && (
                    <button 
                      onClick={() => approveTask(t.id, t.assignedTo, t.pointsValue)}
                      className="mt-2 w-full flex items-center justify-center gap-2 text-xs py-1 px-2 border rounded border-emerald-500/30 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors"
                    >
                      <ThumbsUp size={12} /> Approve & Credit Points
                    </button>
                  )}

                  {col.key === "done" && userRole !== "Owner" && (
                    <div className="flex items-center gap-1.5 text-[10px] text-amber-400 bg-amber-500/5 px-2 py-1 border border-amber-500/10">
                      <AlertCircle size={10} /> Awaiting Owner Approval
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Inbound Creation Inputs */}
            {["todo", "progress"].includes(col.key) && ["Head Developer", "Developer", "Owner"].includes(userRole) && (
              <div className="flex items-center gap-2 mt-2.5">
                <input value={drafts[col.key] || ""} onChange={e => setDrafts({ ...drafts, [col.key]: e.target.value })}
                  onKeyDown={e => e.key === "Enter" && addTask(col.key)} placeholder="Add task..."
                  className="flex-1 bg-transparent border px-2.5 py-1.5 text-xs outline-none text-white" style={{ borderColor: C.border }} />
                <button onClick={() => addTask(col.key)} className="text-white text-xs">+</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
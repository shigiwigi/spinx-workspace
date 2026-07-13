import React, { useState } from "react";
import { Plus, CheckCircle2 } from "lucide-react";
import { doc, updateDoc, collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { C, clipCorner } from "../../theme";
import { SectionHeader, Badge, Avatar } from "../Primitives";

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
      <SectionHeader title="Projects" subtitle="Drag cards between columns to update tracking." />
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
            <div className="space-y-2.5 min-h-[80px] border border-dashed p-2" style={{ borderColor: C.border }}>
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
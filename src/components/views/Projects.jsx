import React, { useState } from "react";
import { CheckCircle2, ThumbsUp, AlertCircle, FileText } from "lucide-react";
import { doc, updateDoc, collection, addDoc, increment } from "firebase/firestore";
import { db } from "../../firebase";
import { C, clipCorner } from "../../theme";
import { SectionHeader, Badge, Card } from "../Primitives";

export function Projects({ liveTasks = { todo: [], progress: [], done: [], completed: [] }, userRole, userId, allMembers = [] }) {
  const [dragId, setDragId] = useState(null);
  const [dragFrom, setDragFrom] = useState(null);
  const [draft, setDraft] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("GENERAL TASKS");
  const [selectedAssignee, setSelectedAssignee] = useState(userId);
  const [reviewPoints, setReviewPoints] = useState({});
  const [reviewFeedback, setReviewFeedback] = useState({});

  const categories = ["REVIEW", "GENERAL TASKS", "Bonus Structure"];
  const cols = [
    { key: "todo", label: "To Do" }, 
    { key: "progress", label: "In Progress" }, 
    { key: "done", label: "Done (Reviewing)" },
    { key: "completed", label: "Completed" }
  ];

  const onDrop = async (colKey) => {
    if (dragId == null || dragFrom == null || dragFrom === colKey) return;
    if (colKey === "completed") return; 
    if (["Presenter", "Media", "Operations"].includes(userRole)) return;

    await updateDoc(doc(db, "tasks", dragId), { status: colKey });
    setDragId(null); setDragFrom(null);
  };

  const createTask = async () => {
    if (!draft.trim()) return;
    
    const targetAssignee = allMembers.find(m => m.id === selectedAssignee) || { name: "Unassigned" };

    await addDoc(collection(db, "tasks"), {
      title: draft,
      category: selectedCategory,
      assignedToId: selectedAssignee,
      assignedToName: targetAssignee.name,
      status: "todo",
      pointsValue: 0, 
      feedback: "",
      createdAt: new Date()
    });
    setDraft("");
  };

  const finalizeTaskByOwner = async (taskId, workerId) => {
    if (userRole !== "Owner") return;
    
    const allocatedPoints = Number(reviewPoints[taskId]) || 0;
    const feedbackText = reviewFeedback[taskId] || "Task accepted successfully.";

    // 1. Mark task complete with dynamic points and justification text
    await updateDoc(doc(db, "tasks", taskId), { 
      status: "completed",
      pointsValue: allocatedPoints,
      feedback: feedbackText
    });

    // 2. Increment score index only if target worker profile is not the Owner
    const workerDoc = allMembers.find(m => m.id === workerId);
    if (workerDoc && workerDoc.role !== "Owner") {
      await updateDoc(doc(db, "users", workerId), {
        points: increment(allocatedPoints)
      });
    }
  };

  return (
    <div>
      <SectionHeader title="Projects & Operations" subtitle="Track tasks, assign categories, and manage owner payouts." />
      
      {/* Universal Assignment Engine (Restricted to Builders) */}
      {["Head Developer", "Developer", "Owner"].includes(userRole) && (
        <Card className="mb-6 p-4 border border-neutral-800 bg-neutral-900">
          <div className="text-white font-mono text-xs uppercase tracking-wider mb-3">Initialize Operation Task</div>
          <div className="grid grid-cols-4 gap-3">
            <input 
              value={draft} 
              onChange={e => setDraft(e.target.value)} 
              placeholder="Task name or description..."
              className="col-span-2 bg-neutral-950 border border-neutral-800 px-3 py-2 text-xs outline-none text-white font-sans"
            />
            <select 
              value={selectedCategory} 
              onChange={e => setSelectedCategory(e.target.value)}
              className="bg-neutral-950 border border-neutral-800 px-2 py-2 text-white text-xs outline-none font-mono"
            >
              {categories.map((c, i) => <option key={i} value={c}>{c}</option>)}
            </select>
            <select 
              value={selectedAssignee} 
              onChange={e => setSelectedAssignee(e.target.value)}
              className="bg-neutral-950 border border-neutral-800 px-2 py-2 text-white text-xs outline-none"
            >
              {allMembers.map((m) => <option key={m.id} value={m.id}>{m.name} ({m.role})</option>)}
            </select>
          </div>
          <button onClick={createTask} className="mt-3 px-4 py-2 bg-amber-500 text-black font-bold uppercase tracking-wider text-[10px] rounded hover:bg-amber-600 transition-colors">
            Deploy Task Board
          </button>
        </Card>
      )}

      {/* KANBAN BOARD MATRIX LAYOUT */}
      <div className="grid grid-cols-4 gap-4">
        {cols.map(col => (
          <div key={col.key} onDragOver={e => e.preventDefault()} onDrop={() => onDrop(col.key)}>
            <div className="flex items-center justify-between mb-3 border-b border-neutral-800 pb-2 font-mono">
              <span className="text-xs uppercase font-medium tracking-widest text-neutral-400">{col.label}</span>
              <span className="text-xs px-2 py-0.5 bg-neutral-900 text-neutral-500 rounded font-mono">{liveTasks[col.key]?.length || 0}</span>
            </div>

            <div className="space-y-3 min-h-[200px] bg-neutral-950/40 p-2 border border-dashed border-neutral-900">
              {liveTasks[col.key]?.map(t => (
                <div key={t.id} draggable={!["completed", "done"].includes(col.key) && !["Presenter", "Media", "Operations"].includes(userRole)} 
                  onDragStart={() => { setDragId(t.id); setDragFrom(col.key); }}
                  className="p-3 border border-neutral-800 bg-neutral-900 relative"
                  style={{ ...clipCorner(8) }}>
                  
                  <div className="flex items-center justify-between mb-2">
                    <Badge>{t.category || "GENERAL"}</Badge>
                    <div className="text-[10px] text-neutral-400 font-sans">Assignee: <span className="text-white font-medium">{t.assignedToName}</span></div>
                  </div>

                  <div className="text-xs text-neutral-200 my-2 leading-relaxed" style={{ fontFamily: "Inter" }}>{t.title}</div>
                  
                  {/* COMPLETED CARD STATE (DISPLAY JUSTIFICATION & SCORE OUTCOME) */}
                  {col.key === "completed" && (
                    <div className="mt-2 pt-2 border-t border-neutral-800 text-[11px] space-y-1 font-mono">
                      <div className="text-amber-400 font-semibold">+ {t.pointsValue || 0} SCORE POINTS</div>
                      <div className="text-neutral-500 leading-tight font-sans italic">“ {t.feedback} ”</div>
                    </div>
                  )}

                  {/* OWNER REVIEW DASHBOARD MATRIX */}
                  {col.key === "done" && userRole === "Owner" && (
                    <div className="mt-3 pt-3 border-t border-neutral-800 space-y-2">
                      <input 
                        type="number" 
                        placeholder="Points (e.g., 750, 1500)" 
                        value={reviewPoints[t.id] || ""} 
                        onChange={e => setReviewPoints({ ...reviewPoints, [t.id]: e.target.value })}
                        className="w-full bg-neutral-950 border border-neutral-800 px-2 py-1.5 text-xs text-white font-mono outline-none"
                      />
                      <textarea 
                        placeholder="Owner evaluation justification statement..." 
                        rows={2}
                        value={reviewFeedback[t.id] || ""} 
                        onChange={e => setReviewFeedback({ ...reviewFeedback, [t.id]: e.target.value })}
                        className="w-full bg-neutral-950 border border-neutral-800 px-2 py-1.5 text-xs text-white outline-none resize-none"
                      />
                      <button 
                        onClick={() => finalizeTaskByOwner(t.id, t.assignedToId)}
                        className="w-full flex items-center justify-center gap-2 text-[10px] uppercase tracking-wider font-bold py-1.5 border border-emerald-500 text-emerald-400 bg-emerald-950/20 hover:bg-emerald-500 hover:text-black transition-all"
                      >
                        Sign-off Completion
                      </button>
                    </div>
                  )}

                  {col.key === "done" && userRole !== "Owner" && (
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-amber-400 bg-amber-500/5 px-2 py-1 border border-amber-500/10 mt-2">
                      <AlertCircle size={10} /> Pending Owner Evaluation
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
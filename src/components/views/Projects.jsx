import React, { useState } from "react";
import { AlertCircle, Rocket } from "lucide-react";
import { doc, updateDoc, collection, addDoc, increment } from "firebase/firestore";
import { db } from "../../firebase";
import { C, FONT, clipCorner } from "../../theme";
import { TEAMS } from "../../data";
import { SectionHeader, Badge, Card, Avatar, PrimaryBtn } from "../Primitives";

export function Projects({ liveTasks = { todo: [], progress: [], done: [], completed: [] }, userRole, userId, allMembers = [] }) {
  const [dragId, setDragId] = useState(null);
  const [dragFrom, setDragFrom] = useState(null);
  const [dragOverCol, setDragOverCol] = useState(null);
  const [draft, setDraft] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("GENERAL TASKS");
  const [selectedTeam, setSelectedTeam] = useState(TEAMS[0]);
  const [selectedAssignee, setSelectedAssignee] = useState(userId);
  const [reviewPoints, setReviewPoints] = useState({});
  const [reviewFeedback, setReviewFeedback] = useState({});
  const [teamFilter, setTeamFilter] = useState("All");

  const categories = ["REVIEW", "GENERAL TASKS", "Bonus Structure"];
  const categoryTone = { REVIEW: "info", "GENERAL TASKS": "default", "Bonus Structure": "gold" };
  const teamTone = { Mechanical: "default", Firmware: "info", Software: "gold", "Workshop Ops": "success", "Finance/Procurement": "danger" };
  const cols = [
    { key: "todo", label: "To Do" },
    { key: "progress", label: "In Progress" },
    { key: "done", label: "Done (Reviewing)" },
    { key: "completed", label: "Completed" },
  ];
  const canManageBoard = ["Head Developer", "Developer", "Owner"].includes(userRole);
  const canDrag = !["Presenter", "Media", "Operations"].includes(userRole);

  const onDrop = async (colKey) => {
    setDragOverCol(null);
    if (dragId == null || dragFrom == null || dragFrom === colKey) return;
    if (colKey === "completed") return; // completion only happens via owner sign-off
    if (!canDrag) return;

    await updateDoc(doc(db, "tasks", dragId), { status: colKey });
    setDragId(null);
    setDragFrom(null);
  };

  const createTask = async () => {
    if (!draft.trim() || !selectedAssignee) return;

    const targetAssignee = allMembers.find(m => m.id === selectedAssignee) || { name: "Unassigned" };

    await addDoc(collection(db, "tasks"), {
      title: draft.trim(),
      category: selectedCategory,
      team: selectedTeam,
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
    const feedbackText = reviewFeedback[taskId]?.trim() || "Task accepted successfully.";

    await updateDoc(doc(db, "tasks", taskId), {
      status: "completed",
      pointsValue: allocatedPoints,
      feedback: feedbackText
    });

    const workerDoc = allMembers.find(m => m.id === workerId);
    if (workerDoc && workerDoc.role !== "Owner") {
      await updateDoc(doc(db, "users", workerId), {
        points: increment(allocatedPoints)
      });
    }

    setReviewPoints(prev => { const n = { ...prev }; delete n[taskId]; return n; });
    setReviewFeedback(prev => { const n = { ...prev }; delete n[taskId]; return n; });
  };

  const inputStyle = { borderColor: C.border, background: C.bg, color: C.text, fontFamily: FONT.body };

  return (
    <div>
      <SectionHeader title="Projects & Operations" subtitle="Track tasks, assign categories, and manage owner payouts." />

      {/* TASK CREATION — restricted to builders */}
      {canManageBoard && (
        <Card className="mb-6" tag>
          <div className="flex items-center gap-2 mb-3">
            <Rocket size={13} style={{ color: C.gold }} />
            <span className="text-[11px] uppercase tracking-wider font-semibold" style={{ color: C.textFaint, fontFamily: FONT.head }}>
              Initialize operation task
            </span>
          </div>
          <div className="grid grid-cols-5 gap-3">
            <input
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={e => e.key === "Enter" && createTask()}
              placeholder="Task name or description..."
              className="col-span-2 border px-3 py-2 text-xs outline-none"
              style={inputStyle}
            />
            <select
              value={selectedTeam}
              onChange={e => setSelectedTeam(e.target.value)}
              className="border px-2 py-2 text-xs outline-none"
              style={{ ...inputStyle, fontFamily: FONT.head }}
            >
              {TEAMS.map((t, i) => <option key={i} value={t} style={{ background: C.surface }}>{t}</option>)}
            </select>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="border px-2 py-2 text-xs outline-none"
              style={{ ...inputStyle, fontFamily: FONT.head }}
            >
              {categories.map((c, i) => <option key={i} value={c} style={{ background: C.surface }}>{c}</option>)}
            </select>
            <select
              value={selectedAssignee}
              onChange={e => setSelectedAssignee(e.target.value)}
              className="border px-2 py-2 text-xs outline-none"
              style={inputStyle}
            >
              {allMembers.length === 0 && <option value="">No members loaded</option>}
              {allMembers.map((m) => <option key={m.id} value={m.id} style={{ background: C.surface }}>{m.name} ({m.role})</option>)}
            </select>
          </div>
          <div className="mt-3">
            <PrimaryBtn onClick={createTask} small disabled={!draft.trim() || !selectedAssignee}>Deploy task to board</PrimaryBtn>
          </div>
        </Card>
      )}

      {/* TEAM FILTER */}
      <div className="flex items-center gap-2 mb-4">
        {["All", ...TEAMS].map(t => (
          <button key={t} onClick={() => setTeamFilter(t)} className="px-3 py-1.5 text-[11px] font-semibold border transition-colors"
            style={{ background: teamFilter === t ? C.goldSoft : "transparent", borderColor: teamFilter === t ? C.goldLine : C.border, color: teamFilter === t ? C.gold : C.textDim, fontFamily: FONT.head }}>
            {t}
          </button>
        ))}
      </div>

      {/* KANBAN BOARD */}
      <div className="grid grid-cols-4 gap-4">
        {cols.map(col => {
          const items = (liveTasks[col.key] || []).filter(t => teamFilter === "All" || t.team === teamFilter);
          const isDropTarget = dragOverCol === col.key && dragFrom !== col.key && col.key !== "completed";
          return (
            <div
              key={col.key}
              onDragOver={e => { e.preventDefault(); if (col.key !== "completed") setDragOverCol(col.key); }}
              onDragLeave={() => setDragOverCol(prev => (prev === col.key ? null : prev))}
              onDrop={() => onDrop(col.key)}
            >
              <div className="flex items-center justify-between mb-3 pb-2 border-b" style={{ borderColor: C.border }}>
                <span className="text-xs uppercase font-semibold tracking-widest" style={{ color: C.textDim, fontFamily: FONT.head }}>{col.label}</span>
                <span
                  className="text-[11px] px-2 py-0.5"
                  style={{ background: C.surface3, color: items.length ? C.gold : C.textFaint, fontFamily: FONT.mono, border: `1px solid ${C.border}` }}
                >
                  {items.length}
                </span>
              </div>

              <div
                className="space-y-3 min-h-[220px] p-2 border border-dashed transition-colors"
                style={{
                  background: isDropTarget ? C.goldSoft : "rgba(255,255,255,0.01)",
                  borderColor: isDropTarget ? C.goldLine : C.border,
                }}
              >
                {items.length === 0 && (
                  <div className="text-[11px] text-center py-8" style={{ color: C.textFaint, fontFamily: FONT.body }}>
                    No tasks here yet.
                  </div>
                )}

                {items.map(t => (
                  <div
                    key={t.id}
                    draggable={!["completed", "done"].includes(col.key) && canDrag}
                    onDragStart={() => { setDragId(t.id); setDragFrom(col.key); }}
                    onDragEnd={() => setDragOverCol(null)}
                    className="relative p-3"
                    style={{
                      background: C.surface,
                      border: `1px solid ${C.border}`,
                      cursor: !["completed", "done"].includes(col.key) && canDrag ? "grab" : "default",
                      ...clipCorner(8, ["tr"]),
                    }}
                  >
                    <div className="flex items-center justify-between mb-2 gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <Badge tone={categoryTone[t.category] || "default"}>{t.category || "GENERAL"}</Badge>
                        {t.team && <Badge tone={teamTone[t.team] || "default"}>{t.team}</Badge>}
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <Avatar name={t.assignedToName || "?"} size={18} />
                        <span className="text-[10px] truncate max-w-[70px]" style={{ color: C.textFaint, fontFamily: FONT.body }}>{t.assignedToName}</span>
                      </div>
                    </div>

                    <div className="text-xs leading-relaxed" style={{ color: C.text, fontFamily: FONT.body }}>{t.title}</div>

                    {col.key === "completed" && (
                      <div className="mt-2 pt-2 border-t space-y-1" style={{ borderColor: C.border }}>
                        <div className="text-[11px] font-semibold" style={{ color: C.gold, fontFamily: FONT.mono }}>+{t.pointsValue || 0} score points</div>
                        <div className="text-[11px] italic leading-tight" style={{ color: C.textFaint, fontFamily: FONT.body }}>"{t.feedback}"</div>
                      </div>
                    )}

                    {col.key === "done" && userRole === "Owner" && (
                      <div className="mt-3 pt-3 border-t space-y-2" style={{ borderColor: C.border }}>
                        <input
                          type="number"
                          placeholder="Points (e.g., 750, 1500)"
                          value={reviewPoints[t.id] || ""}
                          onChange={e => setReviewPoints({ ...reviewPoints, [t.id]: e.target.value })}
                          className="w-full border px-2 py-1.5 text-xs outline-none"
                          style={{ ...inputStyle, fontFamily: FONT.mono }}
                        />
                        <textarea
                          placeholder="Evaluation justification..."
                          rows={2}
                          value={reviewFeedback[t.id] || ""}
                          onChange={e => setReviewFeedback({ ...reviewFeedback, [t.id]: e.target.value })}
                          className="w-full border px-2 py-1.5 text-xs outline-none resize-none"
                          style={inputStyle}
                        />
                        <button
                          onClick={() => finalizeTaskByOwner(t.id, t.assignedToId)}
                          disabled={!reviewPoints[t.id]}
                          className="w-full flex items-center justify-center gap-2 text-[10px] uppercase tracking-wider font-bold py-1.5 border transition-all"
                          style={{
                            borderColor: reviewPoints[t.id] ? C.success : C.border,
                            color: reviewPoints[t.id] ? C.success : C.textFaint,
                            background: reviewPoints[t.id] ? C.successSoft : "transparent",
                            cursor: reviewPoints[t.id] ? "pointer" : "not-allowed",
                            fontFamily: FONT.head,
                          }}
                        >
                          Sign off completion
                        </button>
                      </div>
                    )}

                    {col.key === "done" && userRole !== "Owner" && (
                      <div className="flex items-center gap-1.5 text-[10px] mt-2 px-2 py-1" style={{ color: C.gold, background: C.goldSoft, border: `1px solid ${C.goldLine}`, fontFamily: FONT.mono }}>
                        <AlertCircle size={10} /> Pending owner evaluation
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

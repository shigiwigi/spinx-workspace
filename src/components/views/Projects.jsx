import React, { useState } from "react";
import { AlertCircle, Rocket } from "lucide-react";
import { doc, updateDoc, collection, addDoc, increment } from "firebase/firestore";
import { db } from "../../firebase";
import { C, FONT, clipCorner } from "../../theme";
import { SectionHeader, Badge, Card, PrimaryBtn } from "../Primitives";

export function Projects({ liveTasks = { todo: [], progress: [], done: [], completed: [] }, liveTeams = [], userRole, userId, profile, allMembers = [] }) {
  const [dragId, setDragId] = useState(null);
  const [dragFrom, setDragFrom] = useState(null);
  const [dragOverCol, setDragOverCol] = useState(null);
  
  const [draft, setDraft] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTaskType, setSelectedTaskType] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");
  
  const [reviewPoints, setReviewPoints] = useState({});
  const [reviewFeedback, setReviewFeedback] = useState({});
  const [teamFilter, setTeamFilter] = useState("All");

  const cols = [
    { key: "todo", label: "To Do" },
    { key: "progress", label: "In Progress" },
    { key: "done", label: "Done (Reviewing)" },
    { key: "completed", label: "Completed" },
  ];
  
  const canManageBoard = ["Head Developer", "Developer", "Owner"].includes(userRole);
  const canDrag = !["Presenter", "Media", "Operations"].includes(userRole);
  const isCoreAdmin = ["Owner", "Head Developer"].includes(userRole);

  const myTeamIds = liveTeams.filter(t => t.leadId === userId || (t.memberIds || []).includes(userId)).map(t => t.id);
  const canViewTask = (task) => {
    if (isCoreAdmin) return true;
    if (task.assignedById === userId) return true;
    return myTeamIds.includes(task.teamId);
  };

  const onDrop = async (colKey) => {
    setDragOverCol(null);
    if (dragId == null || dragFrom == null || dragFrom === colKey) return;
    if (colKey === "completed") return;
    if (!canDrag) return;

    await updateDoc(doc(db, "tasks", dragId), { status: colKey });
    setDragId(null);
    setDragFrom(null);
  };

  const createTask = async () => {
    if (!draft.trim() || !selectedTeam) return;

    const targetTeam = liveTeams.find(t => t.id === selectedTeam) || { name: "Unassigned" };

    await addDoc(collection(db, "tasks"), {
      title: draft.trim(),
      category: selectedCategory.trim() || "General",
      taskType: selectedTaskType.trim() || "Task",
      teamId: selectedTeam,
      teamName: targetTeam.name,
      assignedById: userId,
      assignedByName: profile.name || "Admin",
      status: "todo",
      pointsValue: 0,
      feedback: "",
      createdAt: new Date()
    });
    
    setDraft("");
    setSelectedCategory("");
    setSelectedTaskType("");
  };

  const finalizeTaskByOwner = async (taskId, teamId) => {
    if (userRole !== "Owner") return;

    const allocatedPoints = Number(reviewPoints[taskId]) || 0;
    const feedbackText = reviewFeedback[taskId]?.trim() || "Task accepted successfully.";

    await updateDoc(doc(db, "tasks", taskId), {
      status: "completed",
      pointsValue: allocatedPoints,
      feedback: feedbackText
    });

    const targetTeam = liveTeams.find(t => t.id === teamId);
    if (targetTeam) {
      const uids = [...new Set([targetTeam.leadId, ...(targetTeam.memberIds || [])])];
      for (const uid of uids) {
        if (uid) {
          const workerDoc = allMembers.find(m => m.id === uid);
          if (workerDoc && workerDoc.role !== "Owner") {
            await updateDoc(doc(db, "users", uid), {
              points: increment(allocatedPoints)
            });
          }
        }
      }
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <input
              value={draft}
              onChange={e => setDraft(e.target.value)}
              placeholder="Task Description / Title..."
              className="col-span-1 sm:col-span-2 lg:col-span-4 border px-3 py-2 text-xs outline-none"
              style={inputStyle}
            />
            <input
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              placeholder="Category (e.g. Core Hardware)"
              className="border px-3 py-2 text-xs outline-none"
              style={inputStyle}
            />
            <input
              value={selectedTaskType}
              onChange={e => setSelectedTaskType(e.target.value)}
              placeholder="Task Type (e.g. Feature, Bug)"
              className="border px-3 py-2 text-xs outline-none"
              style={inputStyle}
            />
            <select
              value={selectedTeam}
              onChange={e => setSelectedTeam(e.target.value)}
              className="border px-2 py-2 text-xs outline-none sm:col-span-2 lg:col-span-2"
              style={inputStyle}
            >
              <option value="" disabled style={{ background: C.bgCard, color: C.textFaint }}>Select Team Assignee...</option>
              {liveTeams.map((t) => <option key={t.id} value={t.id} style={{ background: C.surface }}>{t.name}</option>)}
            </select>
          </div>
          <div className="mt-3">
            <PrimaryBtn onClick={createTask} small disabled={!draft.trim() || !selectedTeam}>Deploy task to board</PrimaryBtn>
          </div>
        </Card>
      )}

      {/* TEAM FILTER */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
        {["All", ...liveTeams.map(t => t.id)].map(tId => {
          const label = tId === "All" ? "All Teams" : liveTeams.find(t => t.id === tId)?.name;
          return (
            <button key={tId} onClick={() => setTeamFilter(tId)} className="px-3 py-1.5 text-[11px] font-semibold border transition-colors whitespace-nowrap"
              style={{ background: teamFilter === tId ? C.goldSoft : "transparent", borderColor: teamFilter === tId ? C.goldLine : C.border, color: teamFilter === tId ? C.gold : C.textDim, fontFamily: FONT.head }}>
              {label}
            </button>
          );
        })}
      </div>

      {/* KANBAN BOARD */}
      <div className="flex overflow-x-auto pb-4 gap-4 md:grid md:grid-cols-2 xl:grid-cols-4">
        {cols.map(col => {
          const items = (liveTasks[col.key] || [])
            .filter(canViewTask)
            .filter(t => teamFilter === "All" || t.teamId === teamFilter);
            
          const isDropTarget = dragOverCol === col.key && dragFrom !== col.key && col.key !== "completed";
          
          return (
            <div
              key={col.key}
              className="min-w-[260px] md:min-w-0 flex-1"
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
                    <div className="flex flex-wrap items-center gap-2 mb-3 pb-2 border-b" style={{ borderColor: C.border }}>
                      <span className="text-[10px] uppercase font-bold tracking-wider" style={{ color: C.gold, fontFamily: FONT.head }}>{t.category || "General"}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded border" style={{ borderColor: C.border, color: C.textFaint, fontFamily: FONT.mono }}>{t.taskType || "Task"}</span>
                    </div>

                    <div className="text-xs leading-relaxed font-semibold mb-3" style={{ color: C.text, fontFamily: FONT.body }}>{t.title}</div>
                    
                    <div className="flex flex-col gap-1 text-[10px]" style={{ color: C.textFaint, fontFamily: FONT.mono }}>
                      <div>Assigned By: <span style={{ color: C.textDim }}>{t.assignedByName}</span></div>
                      <div>Assigned To: <span style={{ color: C.textDim }}>{t.teamName}</span></div>
                    </div>

                    {col.key === "completed" && (
                      <div className="mt-2 pt-2 border-t space-y-1" style={{ borderColor: C.border }}>
                        <div className="text-[11px] font-semibold" style={{ color: C.gold, fontFamily: FONT.mono }}>+{t.pointsValue || 0} score points per member</div>
                        <div className="text-[11px] italic leading-tight" style={{ color: C.textFaint, fontFamily: FONT.body }}>"{t.feedback}"</div>
                      </div>
                    )}

                    {col.key === "done" && userRole === "Owner" && (
                      <div className="mt-3 pt-3 border-t space-y-2" style={{ borderColor: C.border }}>
                        <input
                          type="number"
                          placeholder="Points per member (e.g., 500)"
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
                          onClick={() => finalizeTaskByOwner(t.id, t.teamId)}
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
                      <div className="flex items-center gap-1.5 text-[10px] mt-3 px-2 py-1" style={{ color: C.gold, background: C.goldSoft, border: `1px solid ${C.goldLine}`, fontFamily: FONT.mono }}>
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
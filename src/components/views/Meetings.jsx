import React, { useState } from "react";
import { Plus, Check, Clock, ChevronDown, CircleDot } from "lucide-react";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { C } from "../../theme";
import { Card, Eyebrow, SectionHeader, Badge, PrimaryBtn, GhostBtn, Avatar } from "../Primitives";

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
      <SectionHeader title="Meetings" subtitle="Schedule and track meetings."
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
            <input placeholder="Attendees (comma separated)" value={form.attendees} onChange={e => setForm({ ...form, attendees: e.target.value })}
              className="col-span-3 bg-transparent border px-3 py-2 text-sm outline-none" style={{ borderColor: C.border, color: C.text, fontFamily: "Inter" }} />
            <PrimaryBtn onClick={addMeeting} icon={Check}>Save</PrimaryBtn>
          </div>
        </Card>
      )}

      {liveMeetings.length === 0 ? (
        <Card className="text-center py-12 text-sm" style={{ color: C.textDim, fontFamily: "Inter" }}>
          No records found. Click "Schedule meeting" to add data.
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
import React, { useState } from "react";
import { Plus, Check, Pin, PinOff } from "lucide-react";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { C } from "../../theme";
import { Card, SectionHeader, Badge, PrimaryBtn, ProgressBar } from "../Primitives";

export function Notices({ liveNotices = [] }) {
  const [filter, setFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", body: "", team: "General" });
  const teams = ["All", "Engineering", "Ops", "General"];

  const togglePin = async (id, currentPinned) => {
    await updateDoc(doc(db, "notices", id), { pinned: !currentPinned });
  };

  const addNotice = async () => {
    if (!form.title.trim()) return;
    await addDoc(collection(db, "notices"), {
      title: form.title,
      body: form.body,
      team: form.team,
      pinned: false,
      reads: 0,
      total: 14,
      createdAt: new Date()
    });
    setForm({ title: "", body: "", team: "General" });
    setShowForm(false);
  };

  const filtered = liveNotices.filter(n => filter === "All" || n.team === filter).sort((a, b) => b.pinned - a.pinned);

  return (
    <div>
      <SectionHeader title="Notices" subtitle="Announcements track."
        action={<PrimaryBtn icon={Plus} onClick={() => setShowForm(!showForm)}>New notice</PrimaryBtn>} />

      <div className="flex items-center gap-2 mb-4">
        {teams.map(t => (
          <button key={t} onClick={() => setFilter(t)} className="px-3 py-1.5 text-xs font-medium border transition-colors"
            style={{ background: filter === t ? C.goldSoft : "transparent", borderColor: filter === t ? C.goldDim : C.border, color: filter === t ? C.gold : C.textDim, fontFamily: "Rajdhani" }}>
            {t}
          </button>
        ))}
      </div>

      {showForm && (
        <Card className="mb-4 space-y-3">
          <input placeholder="Notice title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
            className="w-full bg-transparent border px-3 py-2 text-sm outline-none" style={{ borderColor: C.border, color: C.text, fontFamily: "Inter" }} />
          <textarea placeholder="Details..." value={form.body} onChange={e => setForm({ ...form, body: e.target.value })} rows={2}
            className="w-full bg-transparent border px-3 py-2 text-sm outline-none resize-none" style={{ borderColor: C.border, color: C.text, fontFamily: "Inter" }} />
          <div className="flex items-center gap-3">
            <select value={form.team} onChange={e => setForm({ ...form, team: e.target.value })}
              className="bg-transparent border px-3 py-2 text-xs outline-none" style={{ borderColor: C.border, color: C.text, fontFamily: "Rajdhani" }}>
              {teams.slice(1).map(t => <option key={t} value={t} style={{ background: C.surface }}>{t}</option>)}
            </select>
            <PrimaryBtn onClick={addNotice} icon={Check} small>Post notice</PrimaryBtn>
          </div>
        </Card>
      )}

      {filtered.length === 0 ? (
        <Card className="text-center py-12 text-sm" style={{ color: C.textDim, fontFamily: "Inter" }}>
          No notices posted in this channel.
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {filtered.map(n => (
            <Card key={n.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge tone={n.team === "Engineering" ? "info" : n.team === "Ops" ? "gold" : "default"}>{n.team}</Badge>
                    {n.pinned && <Badge tone="gold">Pinned</Badge>}
                  </div>
                  <div className="text-sm mt-2" style={{ color: C.text, fontFamily: "Rajdhani", fontWeight: 600, fontSize: 15 }}>{n.title}</div>
                  <div className="text-xs mt-1" style={{ color: C.textDim, fontFamily: "Inter" }}>{n.body}</div>
                </div>
                <button onClick={() => togglePin(n.id, n.pinned)} className="shrink-0">
                  {n.pinned ? <Pin size={15} style={{ color: C.gold }} /> : <PinOff size={15} style={{ color: C.textFaint }} />}
                </button>
              </div>
              <div className="flex items-center gap-1.5 mt-3 pt-3" style={{ borderTop: `1px solid ${C.border}` }}>
                <Check size={12} style={{ color: C.textFaint }} />
                <span className="text-[11px]" style={{ color: C.textFaint, fontFamily: "JetBrains Mono" }}>{n.reads}/{n.total} read</span>
                <div className="flex-1 max-w-[100px] ml-2"><ProgressBar value={(n.reads / n.total) * 100} h={3} /></div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
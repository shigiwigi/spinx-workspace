import React, { useState } from "react";
import { Plus, Check, UserCircle } from "lucide-react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { C, FONT } from "../../theme";
import { Card, SectionHeader, PrimaryBtn, ProgressBar, Avatar, Badge } from "../Primitives";

const inputStyle = { borderColor: C.border, background: "transparent", color: C.text, fontFamily: FONT.body };

export function Team({ liveTeam = [] }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", role: "", attendance: "", log: "" });

  const addMember = async () => {
    if (!form.name.trim() || !form.role.trim()) return;
    await addDoc(collection(db, "team"), {
      name: form.name,
      role: form.role,
      attendance: Number(form.attendance) || 100,
      log: form.log || "Awaiting tracking.",
      createdAt: new Date()
    });
    setForm({ name: "", role: "", attendance: "", log: "" });
    setShowForm(false);
  };

  return (
    <div>
      <SectionHeader title="Team" subtitle="Members directory."
        action={<PrimaryBtn icon={Plus} onClick={() => setShowForm(!showForm)}>Add Member</PrimaryBtn>} />

      {showForm && (
        <Card className="mb-4 space-y-3" tag>
          <div className="grid grid-cols-3 gap-3">
            <input placeholder="Member Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              className="border px-3 py-2 text-sm outline-none" style={inputStyle} />
            <input placeholder="Role" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
              className="border px-3 py-2 text-sm outline-none" style={inputStyle} />
            <input placeholder="Attendance %" value={form.attendance} onChange={e => setForm({ ...form, attendance: e.target.value })}
              className="border px-3 py-2 text-sm outline-none" style={{ ...inputStyle, fontFamily: FONT.mono }} />
          </div>
          <input placeholder="Task status statement..." value={form.log} onChange={e => setForm({ ...form, log: e.target.value })}
            className="w-full border px-3 py-2 text-sm outline-none" style={inputStyle} />
          <PrimaryBtn onClick={addMember} icon={Check} small>Save Member</PrimaryBtn>
        </Card>
      )}

      {liveTeam.length === 0 ? (
        <Card className="text-center py-16 text-sm">
          <UserCircle size={32} className="mx-auto mb-2 opacity-40" style={{ color: C.gold }} />
          <div style={{ color: C.textDim, fontFamily: FONT.body }}>No team records found. Click "Add Member" to populate.</div>
        </Card>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {liveTeam.map((m) => (
            <Card key={m.id} tag>
              <div className="flex items-center gap-3">
                <Avatar name={m.name} size={40} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate" style={{ color: C.text, fontFamily: FONT.head, fontSize: 15 }}>{m.name}</div>
                  <Badge>{m.role}</Badge>
                </div>
              </div>
              <div className="mt-3 pt-3" style={{ borderTop: `1px solid ${C.border}` }}>
                <div className="flex items-center justify-between text-[11px] mb-1" style={{ fontFamily: FONT.mono }}>
                  <span style={{ color: C.textFaint }}>Attendance</span>
                  <span style={{ color: C.gold }}>{m.attendance}%</span>
                </div>
                <ProgressBar value={m.attendance} h={4} />
              </div>
              <div className="text-xs mt-3" style={{ color: C.textDim, fontFamily: FONT.body }}>
                <span style={{ color: C.textFaint }}>Working on: </span>{m.log}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

import React, { useState } from "react";
import { Users, Plus, Check, Shield, Trash2, Edit2, User } from "lucide-react";
import { C, FONT } from "../../theme";
import { Card, SectionHeader, PrimaryBtn, Badge } from "../Primitives";
import { db } from "../../firebase";
import { collection, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";

const inputStyle = { borderColor: C.border, background: "transparent", color: C.text, fontFamily: FONT.body };

export function Team({ liveTeams = [], allUsers = [], profile, userId }) {
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [form, setForm] = useState({ name: "", leadId: "", memberIds: [] });

  const canManageSystem = profile.role === "Owner" || profile.role === "Head Developer";
  const canEditTeam = (team) => canManageSystem || team.leadId === userId;

  const openForm = (team = null) => {
    if (team) {
      setEditingId(team.id);
      setForm({ name: team.name, leadId: team.leadId, memberIds: team.memberIds || [] });
    } else {
      setEditingId(null);
      setForm({ name: "", leadId: "", memberIds: [] });
    }
    setShowModal(true);
  };

  const toggleMember = (uid) => {
    setForm(prev => {
      if (prev.memberIds.includes(uid)) return { ...prev, memberIds: prev.memberIds.filter(id => id !== uid) };
      return { ...prev, memberIds: [...prev.memberIds, uid] };
    });
  };

  const handleSaveTeam = async () => {
    if (!form.name.trim()) return;
    
    if (editingId) {
      await updateDoc(doc(db, "team", editingId), form);
    } else {
      await addDoc(collection(db, "team"), { ...form, createdAt: new Date() });
    }
    setShowModal(false);
  };

  const handleDeleteTeam = async (id) => {
    if (confirm("Delete this team from the workspace?")) {
      await deleteDoc(doc(db, "team", id));
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <SectionHeader title="Workspace Teams" subtitle="Project teams and assigned members." />
        {canManageSystem && (
          <PrimaryBtn icon={Plus} onClick={() => openForm()} small>Assign Team</PrimaryBtn>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {liveTeams.map(team => {
          const leadUser = allUsers.find(u => u.id === team.leadId) || { name: "Unassigned", role: "N/A" };
          const teamMembers = allUsers.filter(u => (team.memberIds || []).includes(u.id));

          return (
            <Card key={team.id} pad="p-4 sm:p-5" className="relative">
              <div className="flex justify-between items-start border-b pb-3 mb-4" style={{ borderColor: C.border }}>
                <div>
                  <h3 className="text-base sm:text-lg font-bold" style={{ color: C.gold, fontFamily: FONT.head }}>{team.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Shield size={12} style={{ color: C.textFaint }} />
                    <span className="text-xs" style={{ color: C.textDim, fontFamily: FONT.body }}>Lead: {leadUser.name}</span>
                  </div>
                </div>
                {canEditTeam(team) && (
                  <div className="flex items-center gap-2">
                    <button onClick={() => openForm(team)}><Edit2 size={14} style={{ color: C.textFaint }} /></button>
                    {canManageSystem && (
                      <button onClick={() => handleDeleteTeam(team.id)}><Trash2 size={14} style={{ color: C.danger }} /></button>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-2.5">
                <div className="text-[10px] uppercase font-bold tracking-wider" style={{ color: C.textFaint, fontFamily: FONT.head }}>
                  Team Members ({teamMembers.length})
                </div>
                {teamMembers.length === 0 ? (
                  <div className="text-xs text-center py-2" style={{ color: C.textDim }}>No members assigned.</div>
                ) : (
                  teamMembers.map(m => (
                    <div key={m.id} className="flex items-center justify-between p-2 rounded border" style={{ borderColor: C.border, background: "rgba(255,255,255,0.02)" }}>
                      <div className="flex items-center gap-2 text-xs truncate max-w-[150px]" style={{ color: C.text, fontFamily: FONT.body }}>
                        <User size={13} style={{ color: C.gold }} />
                        <span className="truncate">{m.name}</span>
                      </div>
                      <Badge>{m.role}</Badge>
                    </div>
                  ))
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* TEAM CREATION / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.8)" }}>
          <Card pad="p-5 sm:p-6" className="w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto" tag>
            <h2 className="text-base sm:text-lg font-bold mb-4" style={{ color: C.gold, fontFamily: FONT.head }}>
              {editingId ? "Edit Team" : "Assign New Team"}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-bold mb-1" style={{ color: C.textFaint, fontFamily: FONT.head }}>Team / Project Name</label>
                <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full border px-3 py-2 text-sm outline-none" style={inputStyle} placeholder="e.g. Firmware Division" />
              </div>

              <div>
                <label className="block text-xs uppercase font-bold mb-1" style={{ color: C.textFaint, fontFamily: FONT.head }}>Assign Team Lead</label>
                <select value={form.leadId} onChange={e => setForm({...form, leadId: e.target.value})} className="w-full border px-3 py-2 text-sm outline-none" style={inputStyle}>
                  <option value="" disabled style={{ background: C.bgCard, color: C.textFaint }}>Select a lead...</option>
                  {allUsers.map(u => (
                    <option key={u.id} value={u.id} style={{ background: C.bgCard, color: C.text }}>{u.name} ({u.role})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase font-bold mb-1" style={{ color: C.textFaint, fontFamily: FONT.head }}>Assign Members</label>
                <div className="max-h-40 overflow-y-auto border p-2 space-y-1" style={{ borderColor: C.border }}>
                  {allUsers.map(u => (
                    <label key={u.id} className="flex items-center gap-3 p-2 hover:bg-slate-800/40 cursor-pointer rounded">
                      <input 
                        type="checkbox" 
                        checked={form.memberIds.includes(u.id)}
                        onChange={() => toggleMember(u.id)}
                        className="accent-yellow-600"
                      />
                      <span className="text-xs sm:text-sm truncate" style={{ color: C.text, fontFamily: FONT.body }}>{u.name}</span>
                      <span className="ml-auto text-[10px]" style={{ color: C.textFaint, fontFamily: FONT.mono }}>{u.role}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t" style={{ borderColor: C.border }}>
                <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 text-sm border" style={{ borderColor: C.border, color: C.textFaint, fontFamily: FONT.head }}>Cancel</button>
                <PrimaryBtn className="flex-1" icon={Check} onClick={handleSaveTeam}>Save Team</PrimaryBtn>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
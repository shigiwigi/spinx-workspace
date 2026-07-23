import React, { useState, useEffect } from "react";
import { Users, Plus, Check, Shield, Trash2, Edit2, User, Settings, Lock, X } from "lucide-react";
import { C, FONT } from "../../theme";
import { Card, SectionHeader, PrimaryBtn, Badge, GhostBtn } from "../Primitives";
import { db } from "../../firebase";
import { collection, addDoc, doc, updateDoc, deleteDoc, onSnapshot } from "firebase/firestore";

const inputStyle = { borderColor: C.border, background: "transparent", color: C.text, fontFamily: FONT.body };

const PERMISSION_LABELS = {
  viewTeams: "View Team Directory",
  manageTeams: "Manage Teams (Create/Edit)",
  manageProjects: "Manage Project Tasks",
  manageInventory: "Manage Inventory",
  manageFinance: "Manage Finances"
};

export function Team({ liveTeams = [], allUsers = [], profile, userId }) {
  const [view, setView] = useState("teams"); // "teams" | "roles"
  
  // Teams State
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: "", leadId: "", memberIds: [] });

  // Roles State
  const [roles, setRoles] = useState([]);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState(null);
  const [roleForm, setRoleForm] = useState({
    name: "",
    permissions: { viewTeams: true, manageTeams: false, manageProjects: false, manageInventory: false, manageFinance: false }
  });

  const isOwner = profile.role === "Owner";

  // Fetch dynamic roles from Firestore
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "roles"), (snapshot) => {
      setRoles(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  // Determine permissions dynamically based on the user's role
  const userRoleDoc = roles.find(r => r.name === profile.role);
  const canManageSystem = isOwner || profile.role === "Head Developer" || userRoleDoc?.permissions?.manageTeams;
  const canEditTeam = (team) => canManageSystem || team.leadId === userId;

  // --- TEAM FUNCTIONS ---
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

  // --- ROLE FUNCTIONS ---
  const openRoleForm = (role = null) => {
    if (role) {
      setEditingRoleId(role.id);
      setRoleForm({ name: role.name, permissions: role.permissions || {} });
    } else {
      setEditingRoleId(null);
      setRoleForm({
        name: "",
        permissions: { viewTeams: true, manageTeams: false, manageProjects: false, manageInventory: false, manageFinance: false }
      });
    }
    setShowRoleModal(true);
  };

  const handleSaveRole = async () => {
    if (!roleForm.name.trim()) return;
    if (editingRoleId) {
      await updateDoc(doc(db, "roles", editingRoleId), roleForm);
    } else {
      await addDoc(collection(db, "roles"), { ...roleForm, createdAt: new Date() });
    }
    setShowRoleModal(false);
  };

  const handleDeleteRole = async (id, name) => {
    if (name === "Owner") {
      alert("The Owner role is protected and cannot be deleted.");
      return;
    }
    if (confirm(`Delete the ${name} role? Existing users with this role will lose their custom permissions.`)) {
      await deleteDoc(doc(db, "roles", id));
    }
  };

  const togglePermission = (key) => {
    setRoleForm(prev => ({
      ...prev,
      permissions: { ...prev.permissions, [key]: !prev.permissions[key] }
    }));
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <SectionHeader title="Workspace Teams" subtitle="Manage teams, members, and access roles." />
        {canManageSystem && view === "teams" && (
          <PrimaryBtn icon={Plus} onClick={() => openForm()} small>Assign Team</PrimaryBtn>
        )}
        {isOwner && view === "roles" && (
          <PrimaryBtn icon={Plus} onClick={() => openRoleForm()} small>Create Role</PrimaryBtn>
        )}
      </div>

      {/* VIEW TOGGLE */}
      {isOwner && (
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => setView("teams")}
            className="px-3.5 py-1.5 text-xs font-semibold border transition-colors"
            style={{
              background: view === "teams" ? C.goldSoft : "transparent",
              borderColor: view === "teams" ? C.goldLine : C.border,
              color: view === "teams" ? C.gold : C.textDim,
              fontFamily: FONT.head,
            }}
          >
            Team Directory
          </button>
          <button
            onClick={() => setView("roles")}
            className="px-3.5 py-1.5 text-xs font-semibold border transition-colors"
            style={{
              background: view === "roles" ? C.goldSoft : "transparent",
              borderColor: view === "roles" ? C.goldLine : C.border,
              color: view === "roles" ? C.gold : C.textDim,
              fontFamily: FONT.head,
            }}
          >
            Roles & Permissions
          </button>
        </div>
      )}

      {/* --- TEAMS DIRECTORY VIEW --- */}
      {view === "teams" && (
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
      )}

      {/* --- ROLES & PERMISSIONS VIEW --- */}
      {view === "roles" && isOwner && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* HARDCODED OWNER CARD */}
          <Card pad="p-5" className="relative flex flex-col" style={{ border: `1px solid ${C.goldLine}`, background: C.goldSoft }}>
            <div className="flex items-center gap-2 mb-3">
              <Lock size={16} style={{ color: C.gold }} />
              <h3 className="text-lg font-bold" style={{ color: C.gold, fontFamily: FONT.head }}>Owner</h3>
            </div>
            <p className="text-xs mb-4" style={{ color: C.text, fontFamily: FONT.body }}>
              System administrator. Has unrestricted access to all modules, billing, and access controls. Cannot be edited or deleted.
            </p>
            <div className="flex flex-col gap-1.5 mt-auto pt-3 border-t" style={{ borderColor: "rgba(254,192,45,0.2)" }}>
              <span className="text-[10px] uppercase font-bold" style={{ color: C.gold, fontFamily: FONT.head }}>All Permissions Granted</span>
            </div>
          </Card>

          {/* DYNAMIC ROLES */}
          {roles.filter(r => r.name !== "Owner").map(role => (
            <Card key={role.id} pad="p-5" className="relative flex flex-col">
              <div className="flex justify-between items-start border-b pb-3 mb-3" style={{ borderColor: C.border }}>
                <div className="flex items-center gap-2">
                  <Settings size={16} style={{ color: C.textFaint }} />
                  <h3 className="text-lg font-bold" style={{ color: C.text, fontFamily: FONT.head }}>{role.name}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => openRoleForm(role)}><Edit2 size={14} style={{ color: C.textFaint }} /></button>
                  <button onClick={() => handleDeleteRole(role.id, role.name)}><Trash2 size={14} style={{ color: C.danger }} /></button>
                </div>
              </div>
              <div className="flex flex-col gap-2 flex-1">
                {Object.entries(PERMISSION_LABELS).map(([key, label]) => (
                  <div key={key} className="flex items-center gap-2 text-xs" style={{ color: role.permissions?.[key] ? C.text : C.textDim, fontFamily: FONT.body }}>
                    {role.permissions?.[key] ? <Check size={12} style={{ color: C.success }} /> : <X size={12} style={{ color: C.textFaint }} />}
                    <span style={{ textDecoration: role.permissions?.[key] ? "none" : "line-through" }}>{label}</span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}

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

      {/* ROLE CREATION / EDIT MODAL */}
      {showRoleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.8)" }}>
          <Card pad="p-5 sm:p-6" className="w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto" tag>
            <h2 className="text-base sm:text-lg font-bold mb-4" style={{ color: C.gold, fontFamily: FONT.head }}>
              {editingRoleId ? "Edit Access Role" : "Create New Role"}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-bold mb-1" style={{ color: C.textFaint, fontFamily: FONT.head }}>Role Name</label>
                <input 
                  value={roleForm.name} 
                  onChange={e => setRoleForm({...roleForm, name: e.target.value})} 
                  className="w-full border px-3 py-2 text-sm outline-none" 
                  style={inputStyle} 
                  placeholder="e.g. Guest, Hardware Engineer" 
                  disabled={roleForm.name === "Owner"}
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-bold mb-2" style={{ color: C.textFaint, fontFamily: FONT.head }}>Access Permissions</label>
                <div className="border p-2 space-y-1" style={{ borderColor: C.border }}>
                  {Object.entries(PERMISSION_LABELS).map(([key, label]) => (
                    <label key={key} className="flex items-center gap-3 p-2 hover:bg-slate-800/40 cursor-pointer rounded">
                      <input 
                        type="checkbox" 
                        checked={roleForm.permissions[key] || false}
                        onChange={() => togglePermission(key)}
                        className="accent-yellow-600"
                      />
                      <span className="text-sm" style={{ color: C.text, fontFamily: FONT.body }}>{label}</span>
                    </label>
                  ))}
                </div>
                <p className="text-[10px] mt-2 leading-relaxed" style={{ color: C.textFaint }}>
                  *Note: These permissions will apply dynamically to any user assigned to this role in the main system settings.
                </p>
              </div>

              <div className="flex gap-3 pt-4 border-t" style={{ borderColor: C.border }}>
                <button onClick={() => setShowRoleModal(false)} className="flex-1 px-4 py-2 text-sm border" style={{ borderColor: C.border, color: C.textFaint, fontFamily: FONT.head }}>Cancel</button>
                <PrimaryBtn className="flex-1" icon={Check} onClick={handleSaveRole}>Save Role</PrimaryBtn>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
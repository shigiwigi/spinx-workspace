import React, { useState } from "react";
import { Plus, Check, Search, QrCode, Boxes, Pencil, Trash2, X, FileText, ChevronDown, ArrowUpRight, FolderPlus } from "lucide-react";
import { collection, addDoc, doc, updateDoc, deleteDoc, arrayUnion } from "firebase/firestore";
import { db } from "../../firebase";
import { C, FONT } from "../../theme";
import { Card, SectionHeader, Badge, PrimaryBtn, GhostBtn } from "../Primitives";

const inputStyle = { borderColor: C.border, background: "transparent", color: C.text, fontFamily: FONT.body };

export function Inventory({ liveInventory = [], liveDocs = [] }) {
  const [tab, setTab] = useState("components");

  return (
    <div>
      <SectionHeader title="Inventory" subtitle="Components database & documentation." />

      <div className="flex items-center gap-2 mb-5">
        {[
          { key: "components", label: "Components" },
          { key: "docs", label: "Documentation" },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className="px-3.5 py-1.5 text-xs font-semibold border transition-colors"
            style={{
              background: tab === t.key ? C.goldSoft : "transparent",
              borderColor: tab === t.key ? C.goldLine : C.border,
              color: tab === t.key ? C.gold : C.textDim,
              fontFamily: FONT.head,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "components" ? <ComponentsTab liveInventory={liveInventory} /> : <DocsTab liveDocs={liveDocs} />}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* COMPONENTS TAB                                                     */
/* ------------------------------------------------------------------ */
function ComponentsTab({ liveInventory }) {
  const [showForm, setShowForm] = useState(false);
  const [qrItem, setQrItem] = useState(null);
  const [q, setQ] = useState("");
  const [form, setForm] = useState({ name: "", qty: "", low: "", supplier: "" });
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const addItem = async () => {
    if (!form.name.trim()) return;
    await addDoc(collection(db, "inventory"), {
      name: form.name,
      qty: Number(form.qty) || 0,
      low: Number(form.low) || 5,
      supplier: form.supplier || "—",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      createdAt: new Date()
    });
    setForm({ name: "", qty: "", low: "", supplier: "" });
    setShowForm(false);
  };

  const startEdit = (i) => {
    setEditId(i.id);
    setEditForm({ name: i.name, qty: i.qty, low: i.low, supplier: i.supplier });
  };

  const saveEdit = async (id) => {
    await updateDoc(doc(db, "inventory", id), {
      name: editForm.name,
      qty: Number(editForm.qty) || 0,
      low: Number(editForm.low) || 0,
      supplier: editForm.supplier || "—",
    });
    setEditId(null);
  };

  const removeItem = async (id) => {
    if (!confirm("Delete this component from inventory?")) return;
    await deleteDoc(doc(db, "inventory", id));
  };

  const filtered = liveInventory.filter(i => i.name?.toLowerCase().includes(q.toLowerCase()));

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center gap-2 px-3 py-2 border flex-1 max-w-sm" style={{ borderColor: C.border }}>
          <Search size={14} style={{ color: C.textFaint }} />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search components..."
            className="bg-transparent outline-none text-sm flex-1" style={{ color: C.text, fontFamily: FONT.body }} />
        </div>
        <PrimaryBtn icon={Plus} onClick={() => setShowForm(!showForm)} small>Add item</PrimaryBtn>
      </div>

      {showForm && (
        <Card className="mb-4" tag>
          <div className="grid grid-cols-5 gap-3">
            <input placeholder="Component name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              className="col-span-2 border px-3 py-2 text-sm outline-none" style={inputStyle} />
            <input type="number" placeholder="Qty" value={form.qty} onChange={e => setForm({ ...form, qty: e.target.value })}
              className="border px-3 py-2 text-sm outline-none" style={{ ...inputStyle, fontFamily: FONT.mono }} />
            <input type="number" placeholder="Low-stock at" value={form.low} onChange={e => setForm({ ...form, low: e.target.value })}
              className="border px-3 py-2 text-sm outline-none" style={{ ...inputStyle, fontFamily: FONT.mono }} />
            <input placeholder="Supplier" value={form.supplier} onChange={e => setForm({ ...form, supplier: e.target.value })}
              className="border px-3 py-2 text-sm outline-none" style={inputStyle} />
          </div>
          <div className="mt-3"><PrimaryBtn onClick={addItem} icon={Check} small>Save item</PrimaryBtn></div>
        </Card>
      )}

      {filtered.length === 0 ? (
        <Card className="text-center py-16 text-sm">
          <Boxes size={30} className="mx-auto mb-2 opacity-40" style={{ color: C.gold }} />
          <div style={{ color: C.textDim, fontFamily: FONT.body }}>No items found in system inventory.</div>
        </Card>
      ) : (
        <Card pad="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                {["Component", "Quantity", "Low at", "Supplier", "Purchased", "Status", ""].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[11px] uppercase tracking-wider font-medium" style={{ color: C.textFaint, fontFamily: FONT.head }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(i => {
                const low = i.qty <= i.low;
                const isEditing = editId === i.id;
                return (
                  <tr key={i.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                    {isEditing ? (
                      <>
                        <td className="px-4 py-2">
                          <input value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                            className="w-full border px-2 py-1.5 text-sm outline-none" style={inputStyle} />
                        </td>
                        <td className="px-4 py-2">
                          <input type="number" value={editForm.qty} onChange={e => setEditForm({ ...editForm, qty: e.target.value })}
                            className="w-20 border px-2 py-1.5 text-sm outline-none" style={{ ...inputStyle, fontFamily: FONT.mono }} />
                        </td>
                        <td className="px-4 py-2">
                          <input type="number" value={editForm.low} onChange={e => setEditForm({ ...editForm, low: e.target.value })}
                            className="w-16 border px-2 py-1.5 text-sm outline-none" style={{ ...inputStyle, fontFamily: FONT.mono }} />
                        </td>
                        <td className="px-4 py-2">
                          <input value={editForm.supplier} onChange={e => setEditForm({ ...editForm, supplier: e.target.value })}
                            className="w-full border px-2 py-1.5 text-sm outline-none" style={inputStyle} />
                        </td>
                        <td className="px-4 py-3" style={{ color: C.textFaint, fontFamily: FONT.mono, fontSize: 12 }}>{i.date}</td>
                        <td className="px-4 py-3">{low ? <Badge tone="danger">Low stock</Badge> : <Badge tone="success">In stock</Badge>}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button onClick={() => saveEdit(i.id)}><Check size={16} style={{ color: C.success }} /></button>
                            <button onClick={() => setEditId(null)}><X size={16} style={{ color: C.textFaint }} /></button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-3" style={{ color: C.text, fontFamily: FONT.body }}>{i.name}</td>
                        <td className="px-4 py-3" style={{ color: low ? C.danger : C.text, fontFamily: FONT.mono }}>{i.qty}</td>
                        <td className="px-4 py-3" style={{ color: C.textFaint, fontFamily: FONT.mono }}>{i.low}</td>
                        <td className="px-4 py-3" style={{ color: C.textDim, fontFamily: FONT.body, fontSize: 13 }}>{i.supplier}</td>
                        <td className="px-4 py-3" style={{ color: C.textFaint, fontFamily: FONT.mono, fontSize: 12 }}>{i.date}</td>
                        <td className="px-4 py-3">{low ? <Badge tone="danger">Low stock</Badge> : <Badge tone="success">In stock</Badge>}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <button onClick={() => setQrItem(qrItem === i.id ? null : i.id)}><QrCode size={15} style={{ color: C.textFaint }} /></button>
                            <button onClick={() => startEdit(i)}><Pencil size={14} style={{ color: C.textFaint }} /></button>
                            <button onClick={() => removeItem(i.id)}><Trash2 size={14} style={{ color: C.danger }} /></button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}

      {qrItem && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: "#000000CC" }} onClick={() => setQrItem(null)}>
          <Card pad="p-6" className="text-center" style={{ width: 220 }} tag>
            <div className="mx-auto mb-3" style={{ width: 140, height: 140, background: "repeating-conic-gradient(#F2F1EC 0% 25%, #0A0A0B 0% 50%) 0 0/20px 20px", border: `1px solid ${C.border}` }} />
            <div className="text-xs" style={{ color: C.text, fontFamily: FONT.mono }}>{liveInventory.find(i => i.id === qrItem)?.name}</div>
            <div className="text-[10px] mt-1" style={{ color: C.textFaint }}>SPINX-INV-{qrItem}</div>
          </Card>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* DOCUMENTATION TAB (folded into Inventory)                          */
/* ------------------------------------------------------------------ */
function DocsTab({ liveDocs }) {
  const [open, setOpen] = useState([]);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [docDraft, setDocDraft] = useState({});

  const toggle = (p) => setOpen(open.includes(p) ? open.filter(x => x !== p) : [...open, p]);

  const addProject = async () => {
    if (!projectName.trim()) return;
    await addDoc(collection(db, "documentation"), { project: projectName.trim(), docs: [], createdAt: new Date() });
    setProjectName("");
    setShowProjectForm(false);
  };

  const addDocToProject = async (groupId) => {
    const draft = docDraft[groupId];
    if (!draft?.name?.trim()) return;
    await updateDoc(doc(db, "documentation", groupId), {
      docs: arrayUnion({
        name: draft.name.trim(),
        v: draft.v?.trim() || "v1.0",
        updated: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      })
    });
    setDocDraft(prev => ({ ...prev, [groupId]: { name: "", v: "" } }));
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <GhostBtn icon={FolderPlus} onClick={() => setShowProjectForm(!showProjectForm)}>New project folder</GhostBtn>
      </div>

      {showProjectForm && (
        <Card className="mb-4" tag>
          <div className="flex items-center gap-3">
            <input placeholder="Project / subsystem name (e.g. SPINX-DRONE Firmware)" value={projectName}
              onChange={e => setProjectName(e.target.value)} onKeyDown={e => e.key === "Enter" && addProject()}
              className="flex-1 border px-3 py-2 text-sm outline-none" style={inputStyle} />
            <PrimaryBtn onClick={addProject} icon={Check} small>Create</PrimaryBtn>
          </div>
        </Card>
      )}

      {liveDocs.length === 0 ? (
        <Card className="text-center py-16 text-sm">
          <FileText size={32} className="mx-auto mb-2 opacity-40" style={{ color: C.gold }} />
          <div style={{ color: C.textDim, fontFamily: FONT.body }}>No project documentation logged yet.</div>
        </Card>
      ) : (
        <div className="space-y-3">
          {liveDocs.map(g => (
            <Card key={g.id} pad="p-0">
              <div className="flex items-center justify-between px-4 py-3 cursor-pointer" onClick={() => toggle(g.id)}>
                <span className="text-sm font-semibold" style={{ color: C.text, fontFamily: FONT.head, fontSize: 15 }}>{g.project}</span>
                <ChevronDown size={15} style={{ color: C.textFaint, transform: open.includes(g.id) ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
              </div>
              {open.includes(g.id) && (
                <div style={{ borderTop: `1px solid ${C.border}` }}>
                  {g.docs?.map((d, i) => (
                    <div key={i} className="flex items-center gap-3 px-4 py-3" style={{ borderTop: i > 0 ? `1px solid ${C.border}` : "none" }}>
                      <FileText size={16} style={{ color: C.gold }} />
                      <span className="text-sm flex-1" style={{ color: C.text, fontFamily: FONT.body }}>{d.name}</span>
                      <Badge>{d.v}</Badge>
                      <span className="text-[11px]" style={{ color: C.textFaint, fontFamily: FONT.mono }}>{d.updated}</span>
                      <ArrowUpRight size={14} style={{ color: C.textFaint }} />
                    </div>
                  ))}
                  <div className="flex items-center gap-2 px-4 py-3" style={{ borderTop: `1px solid ${C.border}` }}>
                    <input placeholder="Doc name" value={docDraft[g.id]?.name || ""}
                      onChange={e => setDocDraft({ ...docDraft, [g.id]: { ...docDraft[g.id], name: e.target.value } })}
                      className="flex-1 border px-2.5 py-1.5 text-xs outline-none" style={inputStyle} />
                    <input placeholder="Version" value={docDraft[g.id]?.v || ""}
                      onChange={e => setDocDraft({ ...docDraft, [g.id]: { ...docDraft[g.id], v: e.target.value } })}
                      className="w-24 border px-2.5 py-1.5 text-xs outline-none" style={{ ...inputStyle, fontFamily: FONT.mono }} />
                    <GhostBtn icon={Plus} onClick={() => addDocToProject(g.id)}>Add</GhostBtn>
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

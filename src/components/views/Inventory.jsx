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
  
  // States for adding a custom item to a selected location/section
  const [targetLocationId, setTargetLocationId] = useState("");
  const [targetSectionIdx, setTargetSectionIdx] = useState(0);
  const [targetBoxIdx, setTargetBoxIdx] = useState("-1"); // -1 for direct items, >=0 for subBoxes
  const [form, setForm] = useState({ name: "", qty: "" });

  const addItem = async () => {
    if (!form.name.trim() || !targetLocationId) return;

    const locTarget = liveInventory.find(l => l.id === targetLocationId);
    if (!locTarget) return;

    const updatedSections = [...locTarget.sections];
    const secIdx = Number(targetSectionIdx);
    const boxIdx = Number(targetBoxIdx);

    if (boxIdx === -1) {
      // Add directly to section items
      if (!updatedSections[secIdx].items) updatedSections[secIdx].items = [];
      updatedSections[secIdx].items.push({
        name: form.name.trim(),
        quantity: form.qty.trim() || "1"
      });
    } else {
      // Add to specific subBox
      if (!updatedSections[secIdx].subBoxes[boxIdx].items) {
        updatedSections[secIdx].subBoxes[boxIdx].items = [];
      }
      updatedSections[secIdx].subBoxes[boxIdx].items.push({
        name: form.name.trim(),
        quantity: form.qty.trim() || "1"
      });
    }

    await updateDoc(doc(db, "inventory", targetLocationId), {
      sections: updatedSections
    });

    setForm({ name: "", qty: "" });
    setShowForm(false);
  };

  const removeItem = async (locationId, secIdx, boxIdx, itemIdx) => {
    if (!confirm("Delete this component from inventory?")) return;

    const locTarget = liveInventory.find(l => l.id === locationId);
    if (!locTarget) return;

    const updatedSections = [...locTarget.sections];
    
    if (boxIdx === -1) {
      updatedSections[secIdx].items.splice(itemIdx, 1);
    } else {
      updatedSections[secIdx].subBoxes[boxIdx].items.splice(itemIdx, 1);
    }

    await updateDoc(doc(db, "inventory", locationId), {
      sections: updatedSections
    });
  };

  const matchesSearch = (str) => str?.toLowerCase().includes(q.toLowerCase());

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center gap-2 px-3 py-2 border flex-1 max-w-sm" style={{ borderColor: C.border }}>
          <Search size={14} style={{ color: C.textFaint }} />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search workspace components..."
            className="bg-transparent outline-none text-sm flex-1" style={{ color: C.text, fontFamily: FONT.body }} />
        </div>
        <PrimaryBtn icon={Plus} onClick={() => {
          if (liveInventory.length > 0 && !targetLocationId) {
            setTargetLocationId(liveInventory[0].id);
          }
          setShowForm(!showForm);
        }} small>Add item</PrimaryBtn>
      </div>

      {showForm && (
        <Card className="mb-4" tag>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <select
              value={targetLocationId}
              onChange={e => {
                setTargetLocationId(e.target.value);
                setTargetSectionIdx(0);
                setTargetBoxIdx("-1");
              }}
              className="border px-3 py-2 text-sm outline-none" style={inputStyle}
            >
              {liveInventory.map(l => (
                <option key={l.id} value={l.id} style={{ background: C.bgCard || "#111", color: C.text }}>
                  {l.location}
                </option>
              ))}
            </select>

            {targetLocationId && (
              <select
                value={targetSectionIdx}
                onChange={e => {
                  setTargetSectionIdx(Number(e.target.value));
                  setTargetBoxIdx("-1");
                }}
                className="border px-3 py-2 text-sm outline-none" style={inputStyle}
              >
                {liveInventory.find(l => l.id === targetLocationId)?.sections?.map((s, idx) => (
                  <option key={idx} value={idx} style={{ background: C.bgCard || "#111", color: C.text }}>
                    {s.name}
                  </option>
                ))}
              </select>
            )}

            {targetLocationId && (
              <select
                value={targetBoxIdx}
                onChange={e => setTargetBoxIdx(e.target.value)}
                className="border px-3 py-2 text-sm outline-none" style={inputStyle}
              >
                <option value="-1" style={{ background: C.bgCard || "#111", color: C.text }}>Direct Section Item</option>
                {liveInventory.find(l => l.id === targetLocationId)?.sections?.[targetSectionIdx]?.subBoxes?.map((b, idx) => (
                  <option key={idx} value={idx} style={{ background: C.bgCard || "#111", color: C.text }}>
                    📦 {b.boxName}
                  </option>
                ))}
              </select>
            )}

            <input placeholder="Component name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              className="border px-3 py-2 text-sm outline-none" style={inputStyle} />
            
            <input placeholder="Qty (e.g. 1, 10, Assorted)" value={form.qty} onChange={e => setForm({ ...form, qty: e.target.value })}
              className="border px-3 py-2 text-sm outline-none" style={{ ...inputStyle, fontFamily: FONT.mono }} />
          </div>
          <div className="mt-3 flex justify-end">
            <PrimaryBtn onClick={addItem} icon={Check} small>Save item to Firestore</PrimaryBtn>
          </div>
        </Card>
      )}

      {liveInventory.length === 0 ? (
        <Card className="text-center py-16 text-sm">
          <Boxes size={30} className="mx-auto mb-2 opacity-40" style={{ color: C.gold }} />
          <div style={{ color: C.textDim, fontFamily: FONT.body }}>No items found in system inventory.</div>
        </Card>
      ) : (
        <div className="space-y-6">
          {liveInventory.map(loc => (
            <Card key={loc.id} pad="p-5">
              <h2 className="text-xl font-bold mb-4 pb-2 border-b" style={{ color: C.gold, borderColor: C.border, fontFamily: FONT.head }}>
                📍 {loc.location}
              </h2>

              <div className="space-y-5">
                {loc.sections?.map((sec, secIdx) => {
                  const filteredItems = (sec.items || []).filter(i => !q || matchesSearch(i.name));
                  const hasSubBoxes = sec.subBoxes && sec.subBoxes.length > 0;

                  return (
                    <div key={secIdx} className="p-3 border rounded" style={{ borderColor: C.border, background: "rgba(255,255,255,0.01)" }}>
                      <h3 className="text-sm font-semibold mb-3" style={{ color: C.text, fontFamily: FONT.head }}>
                        {sec.name}
                      </h3>

                      {filteredItems.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 mb-3">
                          {filteredItems.map((item, itemIdx) => (
                            <div key={itemIdx} className="flex justify-between items-center p-2 border rounded text-xs" style={{ borderColor: C.border, background: "rgba(255,255,255,0.02)" }}>
                              <span style={{ color: C.text, fontFamily: FONT.body }}>{item.name}</span>
                              <div className="flex items-center gap-2">
                                <Badge>{item.quantity}</Badge>
                                <button onClick={() => setQrItem(`${loc.id}-${secIdx}-${itemIdx}`)}><QrCode size={13} style={{ color: C.textFaint }} /></button>
                                <button onClick={() => removeItem(loc.id, secIdx, -1, itemIdx)}><Trash2 size={13} style={{ color: C.danger }} /></button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {hasSubBoxes && (
                        <div className="space-y-3 mt-3">
                          {sec.subBoxes.map((box, boxIdx) => {
                            const filteredBoxItems = (box.items || []).filter(i => !q || matchesSearch(i.name));
                            if (q && filteredBoxItems.length === 0) return null;

                            return (
                              <div key={boxIdx} className="pl-3 border-l-2 my-2" style={{ borderColor: C.goldLine }}>
                                <h4 className="text-xs font-semibold mb-2" style={{ color: C.gold, fontFamily: FONT.head }}>📦 {box.boxName}</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                  {filteredBoxItems.map((bItem, bItemIdx) => (
                                    <div key={bItemIdx} className="flex justify-between items-center p-1.5 border rounded text-[11px]" style={{ borderColor: C.border, background: "rgba(0,0,0,0.2)" }}>
                                      <span style={{ color: C.textDim, fontFamily: FONT.body }}>{bItem.name}</span>
                                      <div className="flex items-center gap-1.5">
                                        <span className="font-mono text-[10px]" style={{ color: C.textFaint }}>x{bItem.quantity}</span>
                                        <button onClick={() => removeItem(loc.id, secIdx, boxIdx, bItemIdx)}><Trash2 size={12} style={{ color: C.danger }} /></button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
          ))}
        </div>
      )}

      {qrItem && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: "#000000CC" }} onClick={() => setQrItem(null)}>
          <Card pad="p-6" className="text-center" style={{ width: 220 }} tag>
            <div className="mx-auto mb-3" style={{ width: 140, height: 140, background: "repeating-conic-gradient(#F2F1EC 0% 25%, #0A0A0B 0% 50%) 0 0/20px 20px", border: `1px solid ${C.border}` }} />
            <div className="text-xs" style={{ color: C.text, fontFamily: FONT.mono }}>SPINX-ITEM</div>
            <div className="text-[10px] mt-1" style={{ color: C.textFaint }}>{qrItem}</div>
          </Card>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* DOCUMENTATION TAB                                                  */
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
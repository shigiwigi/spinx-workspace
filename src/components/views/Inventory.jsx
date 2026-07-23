import React, { useState } from "react";
import { Plus, Check, Search, Boxes, Pencil, Trash2, FileText, ChevronDown, ChevronUp, ArrowUpRight, FolderPlus, MapPin, PackagePlus } from "lucide-react";
import { collection, addDoc, doc, updateDoc, deleteDoc, arrayUnion } from "firebase/firestore";
import { db } from "../../firebase";
import { C, FONT } from "../../theme";
import { Card, SectionHeader, Badge, PrimaryBtn, GhostBtn } from "../Primitives";

const inputStyle = { borderColor: C.border, background: "transparent", color: C.text, fontFamily: FONT.body };

// Note: Pass `userRole={profile.role}` from App.jsx if you want strict owner editing, 
// otherwise this checks if role is passed, defaulting to true for safety if missing.
export function Inventory({ liveInventory = [], liveDocs = [], userRole = "Owner" }) {
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

      {tab === "components" ? <ComponentsTab liveInventory={liveInventory} userRole={userRole} /> : <DocsTab liveDocs={liveDocs} />}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* COMPONENTS TAB                                                     */
/* ------------------------------------------------------------------ */
function ComponentsTab({ liveInventory, userRole }) {
  const [q, setQ] = useState("");
  const [expandedLoc, setExpandedLoc] = useState(null);

  const isOwner = userRole === "Owner" || userRole === "Head Developer";

  // Reverses the list so it displays in natural seeded order instead of inverted
  const sortedInventory = [...liveInventory].reverse();
  const matchesSearch = (str) => str?.toLowerCase().includes(q.toLowerCase());

  // --- CORE FIRESTORE UPDATERS ---
  const updateFirestore = async (locId, newSections) => {
    await updateDoc(doc(db, "inventory", locId), { sections: newSections });
  };

  // --- ADDING NEW CATEGORIES / LOCATIONS ---
  const handleAddLocation = async () => {
    const locName = prompt("Enter new location name (e.g. Table 7, Storage Box A):");
    if (!locName?.trim()) return;
    await addDoc(collection(db, "inventory"), {
      location: locName.trim(),
      sections: [],
      createdAt: new Date()
    });
  };

  const handleAddSection = (loc) => {
    const secName = prompt("Enter section name (e.g. Drawer, Top Shelf):");
    if (!secName?.trim()) return;
    const newSections = [...(loc.sections || [])];
    newSections.push({ name: secName.trim(), items: [], subBoxes: [] });
    updateFirestore(loc.id, newSections);
  };

  const handleAddContainer = (loc, secIdx) => {
    const boxName = prompt("Enter container name (e.g. Grey Bag, Resistor Box):");
    if (!boxName?.trim()) return;
    const newSections = [...(loc.sections || [])];
    if (!newSections[secIdx].subBoxes) newSections[secIdx].subBoxes = [];
    newSections[secIdx].subBoxes.push({ boxName: boxName.trim(), items: [] });
    updateFirestore(loc.id, newSections);
  };

  // --- ITEM MANAGEMENT ---
  const handleAddItem = (loc, secIdx, boxIdx = -1) => {
    const name = prompt("Item Name:");
    if (!name?.trim()) return;
    const qty = prompt("Quantity (e.g. 1, 10, Assorted):", "1");
    if (qty === null) return;

    const newSections = [...(loc.sections || [])];
    if (boxIdx === -1) {
      if (!newSections[secIdx].items) newSections[secIdx].items = [];
      newSections[secIdx].items.push({ name: name.trim(), quantity: qty.trim() });
    } else {
      if (!newSections[secIdx].subBoxes[boxIdx].items) newSections[secIdx].subBoxes[boxIdx].items = [];
      newSections[secIdx].subBoxes[boxIdx].items.push({ name: name.trim(), quantity: qty.trim() });
    }
    updateFirestore(loc.id, newSections);
  };

  const handleEditItem = (loc, secIdx, boxIdx, itemIdx, currentItem) => {
    const newName = prompt("Update Name:", currentItem.name);
    if (!newName?.trim()) return;
    const newQty = prompt("Update Quantity:", currentItem.quantity || currentItem.qty);
    if (newQty === null) return;

    const newSections = [...loc.sections];
    if (boxIdx === -1) {
      newSections[secIdx].items[itemIdx] = { name: newName.trim(), quantity: newQty.trim() };
    } else {
      newSections[secIdx].subBoxes[boxIdx].items[itemIdx] = { name: newName.trim(), quantity: newQty.trim() };
    }
    updateFirestore(loc.id, newSections);
  };

  const handleDeleteItem = (loc, secIdx, boxIdx, itemIdx) => {
    if (!confirm("Remove this item entirely?")) return;
    const newSections = [...loc.sections];
    if (boxIdx === -1) {
      newSections[secIdx].items.splice(itemIdx, 1);
    } else {
      newSections[secIdx].subBoxes[boxIdx].items.splice(itemIdx, 1);
    }
    updateFirestore(loc.id, newSections);
  };

  const handleDeleteLocation = async (id) => {
    if (!confirm("Are you sure you want to delete this entire location/category?")) return;
    await deleteDoc(doc(db, "inventory", id));
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex items-center gap-2 px-3 py-2 border flex-1" style={{ borderColor: C.border }}>
          <Search size={14} style={{ color: C.textFaint }} />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search workspace components..."
            className="bg-transparent outline-none text-sm flex-1" style={{ color: C.text, fontFamily: FONT.body }} />
        </div>
        {isOwner && (
          <PrimaryBtn icon={Plus} onClick={handleAddLocation} small>Add Location</PrimaryBtn>
        )}
      </div>

      {sortedInventory.length === 0 ? (
        <Card className="text-center py-16 text-sm">
          <Boxes size={30} className="mx-auto mb-2 opacity-40" style={{ color: C.gold }} />
          <div style={{ color: C.textDim, fontFamily: FONT.body }}>No items found in system inventory.</div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedInventory.map(loc => {
            const isExpanded = expandedLoc === loc.id || q; // Auto-expand if searching
            
            return (
              <Card 
                key={loc.id} 
                pad="p-4" 
                className={`transition-all duration-300 ${isExpanded ? "col-span-1 md:col-span-2 lg:col-span-3 border-yellow-700/50" : "cursor-pointer hover:border-slate-600"}`}
                onClick={() => !isExpanded && setExpandedLoc(loc.id)}
              >
                {/* LOCATION HEADER */}
                <div 
                  className="flex items-center justify-between" 
                  onClick={() => isExpanded && !q && setExpandedLoc(null)}
                  style={{ cursor: isExpanded && !q ? "pointer" : "default" }}
                >
                  <div className="flex items-center gap-2">
                    <MapPin size={16} style={{ color: isExpanded ? C.gold : C.textFaint }} />
                    <h2 className="text-lg font-bold tracking-wide" style={{ color: isExpanded ? C.gold : C.text, fontFamily: FONT.head }}>
                      {loc.location}
                    </h2>
                  </div>
                  <div className="flex items-center gap-3">
                    {isExpanded && isOwner && (
                      <button onClick={(e) => { e.stopPropagation(); handleDeleteLocation(loc.id); }}>
                        <Trash2 size={14} style={{ color: C.danger }} />
                      </button>
                    )}
                    {isExpanded ? <ChevronUp size={16} style={{ color: C.textFaint }} /> : <ChevronDown size={16} style={{ color: C.textFaint }} />}
                  </div>
                </div>

                {/* EXPANDED CONTENT */}
                {isExpanded && (
                  <div className="mt-5 space-y-6 pt-4 border-t" style={{ borderColor: C.border }}>
                    {isOwner && (
                      <div className="flex justify-end">
                        <GhostBtn icon={Plus} onClick={() => handleAddSection(loc)} small>Add Section</GhostBtn>
                      </div>
                    )}

                    {(loc.sections || []).map((sec, secIdx) => {
                      const filteredDirect = (sec.items || []).filter(i => !q || matchesSearch(i.name));
                      const hasDirectItems = filteredDirect.length > 0;
                      const hasSubBoxes = sec.subBoxes && sec.subBoxes.length > 0;

                      // Hide section if searching and no matches found inside it
                      if (q && !hasDirectItems && !hasSubBoxes) return null; 

                      return (
                        <div key={secIdx} className="p-3 border rounded-lg bg-black/20" style={{ borderColor: C.border }}>
                          
                          {/* SECTION HEADER */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                            <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: C.text, fontFamily: FONT.head }}>
                              {sec.name || "General"}
                            </h3>
                            {isOwner && (
                              <div className="flex gap-2">
                                <button onClick={() => handleAddContainer(loc, secIdx)} className="text-[10px] uppercase font-bold px-2 py-1 rounded border hover:bg-white/5 transition-colors" style={{ borderColor: C.border, color: C.textFaint }}>+ Container</button>
                                <button onClick={() => handleAddItem(loc, secIdx, -1)} className="text-[10px] uppercase font-bold px-2 py-1 rounded border hover:bg-white/5 transition-colors" style={{ borderColor: C.border, color: C.gold }}>+ Item</button>
                              </div>
                            )}
                          </div>

                          {/* DIRECT ITEMS */}
                          {hasDirectItems && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-4">
                              {filteredDirect.map((item, itemIdx) => (
                                <div key={itemIdx} className="flex justify-between items-center p-2 border rounded" style={{ borderColor: C.border, background: C.surface }}>
                                  <span className="text-xs truncate font-medium pr-2" style={{ color: C.text, fontFamily: FONT.body }}>{item.name}</span>
                                  <div className="flex items-center gap-2 shrink-0">
                                    <Badge>{item.quantity || item.qty}</Badge>
                                    {isOwner && (
                                      <>
                                        <button onClick={() => handleEditItem(loc, secIdx, -1, itemIdx, item)}><Pencil size={12} style={{ color: C.textFaint }} className="hover:text-white" /></button>
                                        <button onClick={() => handleDeleteItem(loc, secIdx, -1, itemIdx)}><Trash2 size={12} style={{ color: C.danger }} /></button>
                                      </>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* SUB BOXES / CONTAINERS */}
                          {hasSubBoxes && (
                            <div className="space-y-4">
                              {sec.subBoxes.map((box, boxIdx) => {
                                const filteredBoxItems = (box.items || []).filter(i => !q || matchesSearch(i.name));
                                if (q && filteredBoxItems.length === 0) return null;

                                return (
                                  <div key={boxIdx} className="pl-3 border-l-2" style={{ borderColor: C.goldLine }}>
                                    <div className="flex items-center justify-between mb-2">
                                      <div className="flex items-center gap-1.5">
                                        <PackagePlus size={14} style={{ color: C.gold }} />
                                        <h4 className="text-xs font-bold" style={{ color: C.gold, fontFamily: FONT.head }}>{box.boxName}</h4>
                                      </div>
                                      {isOwner && (
                                        <button onClick={() => handleAddItem(loc, secIdx, boxIdx)} className="text-[10px] uppercase font-bold text-slate-400 hover:text-white transition-colors">
                                          + Add to container
                                        </button>
                                      )}
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                      {filteredBoxItems.map((bItem, bItemIdx) => (
                                        <div key={bItemIdx} className="flex justify-between items-center p-1.5 border rounded" style={{ borderColor: C.border, background: "rgba(0,0,0,0.3)" }}>
                                          <span className="text-[11px] truncate pr-2" style={{ color: C.textDim, fontFamily: FONT.body }}>{bItem.name}</span>
                                          <div className="flex items-center gap-2 shrink-0">
                                            <span className="font-mono text-[10px] px-1 bg-black/40 rounded" style={{ color: C.textFaint }}>Qty: {bItem.quantity || bItem.qty}</span>
                                            {isOwner && (
                                              <>
                                                <button onClick={() => handleEditItem(loc, secIdx, boxIdx, bItemIdx, bItem)}><Pencil size={11} style={{ color: C.textFaint }} className="hover:text-white" /></button>
                                                <button onClick={() => handleDeleteItem(loc, secIdx, boxIdx, bItemIdx)}><Trash2 size={11} style={{ color: C.danger }} /></button>
                                              </>
                                            )}
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
                )}
              </Card>
            );
          })}
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
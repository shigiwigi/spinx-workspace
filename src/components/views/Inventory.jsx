import React, { useState } from "react";
import { Plus, Check, Search, QrCode } from "lucide-react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { C } from "../../theme";
import { Card, SectionHeader, Badge, PrimaryBtn } from "../Primitives";

export function Inventory({ liveInventory = [] }) {
  const [showForm, setShowForm] = useState(false);
  const [qrItem, setQrItem] = useState(null);
  const [q, setQ] = useState("");
  const [form, setForm] = useState({ name: "", qty: "", low: "", supplier: "" });

  const addItem = async () => {
    if (!form.name.trim()) return;
    await addDoc(collection(db, "inventory"), {
      name: form.name,
      qty: Number(form.qty) || 0,
      low: Number(form.low) || 5,
      supplier: form.supplier || "—",
      date: "Jul 14",
      createdAt: new Date()
    });
    setForm({ name: "", qty: "", low: "", supplier: "" });
    setShowForm(false);
  };

  const filtered = liveInventory.filter(i => i.name?.toLowerCase().includes(q.toLowerCase()));

  return (
    <div>
      <SectionHeader title="Inventory" subtitle="Components database management."
        action={<PrimaryBtn icon={Plus} onClick={() => setShowForm(!showForm)}>Add item</PrimaryBtn>} />

      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center gap-2 px-3 py-2 border flex-1 max-w-sm" style={{ borderColor: C.border }}>
          <Search size={14} style={{ color: C.textFaint }} />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search components..."
            className="bg-transparent outline-none text-sm flex-1" style={{ color: C.text, fontFamily: "Inter" }} />
        </div>
      </div>

      {showForm && (
        <Card className="mb-4">
          <div className="grid grid-cols-5 gap-3">
            <input placeholder="Component name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              className="col-span-2 bg-transparent border px-3 py-2 text-sm outline-none" style={{ borderColor: C.border, color: C.text, fontFamily: "Inter" }} />
            <input placeholder="Qty" value={form.qty} onChange={e => setForm({ ...form, qty: e.target.value })}
              className="bg-transparent border px-3 py-2 text-sm outline-none" style={{ borderColor: C.border, color: C.text, fontFamily: "JetBrains Mono" }} />
            <input placeholder="Low-stock at" value={form.low} onChange={e => setForm({ ...form, low: e.target.value })}
              className="bg-transparent border px-3 py-2 text-sm outline-none" style={{ borderColor: C.border, color: C.text, fontFamily: "JetBrains Mono" }} />
            <input placeholder="Supplier" value={form.supplier} onChange={e => setForm({ ...form, supplier: e.target.value })}
              className="bg-transparent border px-3 py-2 text-sm outline-none" style={{ borderColor: C.border, color: C.text, fontFamily: "Inter" }} />
          </div>
          <div className="mt-3"><PrimaryBtn onClick={addItem} icon={Check} small>Save item</PrimaryBtn></div>
        </Card>
      )}

      {filtered.length === 0 ? (
        <Card className="text-center py-12 text-sm" style={{ color: C.textDim, fontFamily: "Inter" }}>
          No items found in system inventory.
        </Card>
      ) : (
        <Card pad="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                {["Component", "Quantity", "Supplier", "Purchased", "Status", ""].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[11px] uppercase tracking-wider font-medium" style={{ color: C.textFaint, fontFamily: "Rajdhani" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(i => {
                const low = i.qty <= i.low;
                return (
                  <tr key={i.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                    <td className="px-4 py-3" style={{ color: C.text, fontFamily: "Inter" }}>{i.name}</td>
                    <td className="px-4 py-3" style={{ color: low ? C.danger : C.text, fontFamily: "JetBrains Mono" }}>{i.qty}</td>
                    <td className="px-4 py-3" style={{ color: C.textDim, fontFamily: "Inter", fontSize: 13 }}>{i.supplier}</td>
                    <td className="px-4 py-3" style={{ color: C.textFaint, fontFamily: "JetBrains Mono", fontSize: 12 }}>{i.date}</td>
                    <td className="px-4 py-3">{low ? <Badge tone="danger">Low stock</Badge> : <Badge tone="success">In stock</Badge>}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => setQrItem(qrItem === i.id ? null : i.id)}><QrCode size={16} style={{ color: C.textFaint }} /></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}

      {qrItem && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: "#000000AA" }} onClick={() => setQrItem(null)}>
          <Card pad="p-6" className="text-center" style={{ width: 220 }}>
            <div className="mx-auto mb-3" style={{ width: 140, height: 140, background: "repeating-conic-gradient(#F2F1EC 0% 25%, #0A0A0B 0% 50%) 0 0/20px 20px" }} />
            <div className="text-xs" style={{ color: C.text, fontFamily: "JetBrains Mono" }}>{liveInventory.find(i => i.id === qrItem)?.name}</div>
            <div className="text-[10px] mt-1" style={{ color: C.textFaint }}>SPINX-INV-{qrItem}</div>
          </Card>
        </div>
      )}
    </div>
  );
}
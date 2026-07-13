import React, { useState } from "react";
import { Plus, Check, Wallet } from "lucide-react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { C, FONT } from "../../theme";
import { Card, Eyebrow, SectionHeader, Badge, PrimaryBtn, ProgressBar } from "../Primitives";

const inputStyle = { borderColor: C.border, background: "transparent", color: C.text, fontFamily: FONT.body };

export function Finance({ liveExpenses = [] }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ desc: "", cat: "Components", amt: "" });
  const expenseCategories = ["Components", "Tools", "Workshop", "Shipping", "Misc"];

  const addExpense = async () => {
    if (!form.desc.trim() || !form.amt) return;
    await addDoc(collection(db, "expenses"), {
      desc: form.desc,
      cat: form.cat,
      amt: Number(form.amt),
      date: "Jul 14",
      createdAt: new Date()
    });
    setForm({ desc: "", cat: "Components", amt: "" });
    setShowForm(false);
  };

  const totalSpent = liveExpenses.reduce((s, e) => s + e.amt, 0);
  const budget = 80000;

  return (
    <div>
      <SectionHeader title="Finance" subtitle="Expenses and budget logs."
        action={<PrimaryBtn icon={Plus} onClick={() => setShowForm(!showForm)}>Add expense</PrimaryBtn>} />

      <div className="grid grid-cols-3 gap-4 mb-5">
        <Card pad="p-4" tag>
          <Eyebrow>Total spent</Eyebrow>
          <div className="text-2xl mt-1.5" style={{ fontFamily: FONT.mono, color: C.text }}>₹{totalSpent.toLocaleString()}</div>
          <div className="mt-3"><ProgressBar value={(totalSpent / budget) * 100} /></div>
          <div className="text-[11px] mt-1.5" style={{ color: C.textFaint, fontFamily: FONT.mono }}>of ₹{budget.toLocaleString()} cap</div>
        </Card>
        <Card pad="p-4">
          <Eyebrow>Budget remaining</Eyebrow>
          <div className="text-2xl mt-1.5" style={{ fontFamily: FONT.mono, color: C.success }}>₹{(budget - totalSpent).toLocaleString()}</div>
          <div className="text-[11px] mt-1.5" style={{ color: C.textFaint, fontFamily: FONT.head }}>Active ledger tracking</div>
        </Card>
        <Card pad="p-4">
          <Eyebrow>Pending invoices</Eyebrow>
          <div className="text-2xl mt-1.5" style={{ fontFamily: FONT.mono, color: C.text }}>0</div>
          <div className="text-[11px] mt-1.5" style={{ color: C.textFaint, fontFamily: FONT.head }}>₹0 awaiting approval</div>
        </Card>
      </div>

      {showForm && (
        <Card className="mb-4" tag>
          <div className="grid grid-cols-4 gap-3">
            <input placeholder="Description" value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })}
              className="col-span-2 border px-3 py-2 text-sm outline-none" style={inputStyle} />
            <select value={form.cat} onChange={e => setForm({ ...form, cat: e.target.value })}
              className="border px-3 py-2 text-xs outline-none" style={{ ...inputStyle, fontFamily: FONT.head }}>
              {expenseCategories.map(c => <option key={c} value={c} style={{ background: C.surface }}>{c}</option>)}
            </select>
            <input placeholder="Amount ₹" value={form.amt} onChange={e => setForm({ ...form, amt: e.target.value })}
              className="border px-3 py-2 text-sm outline-none" style={{ ...inputStyle, fontFamily: FONT.mono }} />
          </div>
          <div className="mt-3"><PrimaryBtn onClick={addExpense} icon={Check} small>Save expense</PrimaryBtn></div>
        </Card>
      )}

      {liveExpenses.length === 0 ? (
        <Card className="text-center py-16 text-sm">
          <Wallet size={30} className="mx-auto mb-2 opacity-40" style={{ color: C.gold }} />
          <div style={{ color: C.textDim, fontFamily: FONT.body }}>No expenses logged yet.</div>
        </Card>
      ) : (
        <Card pad="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                {["Description", "Category", "Date", "Amount"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[11px] uppercase tracking-wider font-medium" style={{ color: C.textFaint, fontFamily: FONT.head }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {liveExpenses.map(e => (
                <tr key={e.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                  <td className="px-4 py-3" style={{ color: C.text, fontFamily: FONT.body }}>{e.desc}</td>
                  <td className="px-4 py-3"><Badge>{e.cat}</Badge></td>
                  <td className="px-4 py-3" style={{ color: C.textFaint, fontFamily: FONT.mono, fontSize: 12 }}>{e.date}</td>
                  <td className="px-4 py-3" style={{ color: C.text, fontFamily: FONT.mono }}>₹{e.amt.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}

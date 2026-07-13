import React from "react";
import { ShoppingCart, Check, X } from "lucide-react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { C } from "../../theme";
import { Card, SectionHeader, Badge } from "../Primitives";

export function Procurement({ liveProcurement = [] }) {
  const setStatus = async (id, status) => {
    await updateDoc(doc(db, "procurement", id), { status });
  };

  return (
    <div>
      <SectionHeader title="Procurement" subtitle="Purchase items ledger trackers." />
      {liveProcurement.length === 0 ? (
        <Card className="text-center py-16 text-sm" style={{ color: C.textDim, fontFamily: "Inter" }}>
          <ShoppingCart size={32} className="mx-auto mb-2 opacity-40" style={{ color: C.gold }} />
          No procurement track requests listed.
        </Card>
      ) : (
        <Card pad="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                {["Item", "Vendor", "Quotation", "Status", ""].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[11px] uppercase tracking-wider font-medium" style={{ color: C.textFaint, fontFamily: "Rajdhani" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {liveProcurement.map(r => (
                <tr key={r.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                  <td className="px-4 py-3" style={{ color: C.text, fontFamily: "Inter" }}>{r.item}</td>
                  <td className="px-4 py-3" style={{ color: C.textDim, fontFamily: "Inter", fontSize: 13 }}>{r.vendor}</td>
                  <td className="px-4 py-3" style={{ color: C.text, fontFamily: "JetBrains Mono" }}>₹{r.quote?.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <Badge tone={r.status === "Approved" ? "success" : r.status === "Rejected" ? "danger" : "gold"}>{r.status}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    {r.status === "Pending" && (
                      <div className="flex gap-2">
                        <button onClick={() => setStatus(r.id, "Approved")} title="Approve"><Check size={15} style={{ color: C.success }} /></button>
                        <button onClick={() => setStatus(r.id, "Rejected")} title="Reject"><X size={15} style={{ color: C.danger }} /></button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
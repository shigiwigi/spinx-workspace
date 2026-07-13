import React, { useState } from "react";
import { FileText, ChevronDown, ArrowUpRight } from "lucide-react";
import { C, FONT } from "../../theme";
import { Card, SectionHeader, Badge } from "../Primitives";

export function Documentation({ liveDocs = [] }) {
  const [open, setOpen] = useState([]);
  const toggle = (p) => setOpen(open.includes(p) ? open.filter(x => x !== p) : [...open, p]);

  return (
    <div>
      <SectionHeader title="Documentation" subtitle="Design docs and architecture links." />
      {liveDocs.length === 0 ? (
        <Card className="text-center py-16 text-sm">
          <FileText size={32} className="mx-auto mb-2 opacity-40" style={{ color: C.gold }} />
          <div style={{ color: C.textDim, fontFamily: FONT.body }}>No project documentation logged yet.</div>
        </Card>
      ) : (
        <div className="space-y-3">
          {liveDocs.map(g => (
            <Card key={g.id} pad="p-0">
              <div className="flex items-center justify-between px-4 py-3 cursor-pointer" onClick={() => toggle(g.project)}>
                <span className="text-sm font-semibold" style={{ color: C.text, fontFamily: FONT.head, fontSize: 15 }}>{g.project}</span>
                <ChevronDown size={15} style={{ color: C.textFaint, transform: open.includes(g.project) ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
              </div>
              {open.includes(g.project) && (
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
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

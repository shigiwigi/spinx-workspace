import React from "react";
import { Lock } from "lucide-react";
import { C, FONT } from "../../theme";
import { Badge } from "../Primitives";

export function AIFeatures() {
  const features = [
    "Summarize meeting notes automatically",
    "Search across all documents using natural language",
    "Suggest components based on previous projects",
    "Predict when inventory will run out",
    "Generate weekly progress reports",
  ];
  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <Badge tone="gold">In development</Badge>
      </div>
      <p className="text-xs mt-2 mb-4" style={{ color: C.textFaint, fontFamily: FONT.body }}>
        Coming to SpinX Workspace.
      </p>
      <div className="space-y-2.5">
        {features.map((f, i) => (
          <div key={i} className="flex items-center gap-2.5 text-sm" style={{ color: C.textDim, fontFamily: FONT.body }}>
            <Lock size={12} style={{ color: C.textFaint }} /> {f}
          </div>
        ))}
      </div>
    </div>
  );
}

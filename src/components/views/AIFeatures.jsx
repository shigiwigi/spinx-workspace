import React from "react";
import { Sparkles, Lock } from "lucide-react";
import { C } from "../../theme";
import { Card, SectionHeader, Badge, XMark } from "../Primitives";

export function AIFeatures() {
  const features = [
    "Summarize meeting notes automatically",
    "Search across all documents using natural language",
    "Suggest components based on previous projects",
    "Predict when inventory will run out",
    "Generate weekly progress reports",
  ];
  return (
    <div className="relative overflow-hidden">
      <SectionHeader title="AI Assistant" subtitle="Coming to SpinX Workspace." />
      <Card className="relative">
        <div className="absolute -right-6 -bottom-10 opacity-[0.04]"><XMark size={220} strokeWidth={5} /></div>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={16} style={{ color: C.gold }} />
          <Badge tone="gold">In development</Badge>
        </div>
        <div className="space-y-2.5">
          {features.map((f, i) => (
            <div key={i} className="flex items-center gap-2.5 text-sm" style={{ color: C.textDim, fontFamily: "Inter" }}>
              <Lock size={12} style={{ color: C.textFaint }} /> {f}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
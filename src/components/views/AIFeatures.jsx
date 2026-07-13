import React from "react";
import { Sparkles, Lock } from "lucide-react";
import { C, FONT } from "../../theme";
import { Card, SectionHeader, Badge, SprayStreak } from "../Primitives";

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
      <Card className="relative overflow-hidden" tag>
        <SprayStreak size={220} opacity={0.045} style={{ right: -30, bottom: -50 }} />
        <div className="relative flex items-center gap-2 mb-4">
          <Sparkles size={16} style={{ color: C.gold }} />
          <Badge tone="gold">In development</Badge>
        </div>
        <div className="relative space-y-2.5">
          {features.map((f, i) => (
            <div key={i} className="flex items-center gap-2.5 text-sm" style={{ color: C.textDim, fontFamily: FONT.body }}>
              <Lock size={12} style={{ color: C.textFaint }} /> {f}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

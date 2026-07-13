import React from "react";
import { C, clipCorner } from "../theme";

export const Card = ({ children, className = "", style = {}, corner = true, pad = "p-5" }) => (
  <div
    className={`relative border ${pad} ${className}`}
    style={{ background: C.surface, borderColor: C.border, ...(corner ? clipCorner(16) : {}), ...style }}
  >
    {children}
  </div>
);

export const Eyebrow = ({ children }) => (
  <div className="uppercase tracking-[0.18em] text-[11px] font-medium mb-1" style={{ color: C.textFaint, fontFamily: "Rajdhani" }}>
    {children}
  </div>
);

export const SectionHeader = ({ title, subtitle, action }) => (
  <div className="flex items-end justify-between mb-6">
    <div>
      <div className="flex items-center gap-3">
        <div style={{ width: 3, height: 22, background: C.gold }} />
        <h1 className="text-2xl" style={{ fontFamily: "Rajdhani", fontWeight: 700, color: C.text, letterSpacing: "0.01em" }}>
          {title}
        </h1>
      </div>
      {subtitle && <p className="text-sm mt-1 ml-[15px]" style={{ color: C.textDim, fontFamily: "Inter" }}>{subtitle}</p>}
    </div>
    {action}
  </div>
);

export const Badge = ({ children, tone = "default" }) => {
  const tones = {
    default: { bg: C.surface3, color: C.textDim, border: C.border },
    gold: { bg: C.goldSoft, color: C.gold, border: C.goldDim },
    success: { bg: "#3DD68C1A", color: C.success, border: "#3DD68C33" },
    danger: { bg: "#E5484D1A", color: C.danger, border: "#E5484D33" },
    info: { bg: "#5EA1F21A", color: C.info, border: "#5EA1F233" },
  };
  const t = tones[tone];
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 text-[11px] font-medium border"
      style={{ background: t.bg, color: t.color, borderColor: t.border, fontFamily: "JetBrains Mono" }}
    >
      {children}
    </span>
  );
};

export const IconBtn = ({ icon: Icon, onClick, active, title }) => (
  <button
    onClick={onClick}
    title={title}
    className="w-8 h-8 flex items-center justify-center border transition-colors"
    style={{ background: active ? C.goldSoft : "transparent", borderColor: active ? C.goldDim : C.border, color: active ? C.gold : C.textDim }}
  >
    <Icon size={15} />
  </button>
);

export const PrimaryBtn = ({ children, onClick, icon: Icon, small }) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center gap-2 ${small ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm"} font-semibold transition-all hover:brightness-110 active:scale-[0.98]`}
    style={{ background: C.gold, color: "#161608", fontFamily: "Rajdhani", clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)" }}
  >
    {Icon && <Icon size={14} />}
    {children}
  </button>
);

export const GhostBtn = ({ children, onClick, icon: Icon }) => (
  <button
    onClick={onClick}
    className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium border transition-colors hover:border-[#3A3A40]"
    style={{ borderColor: C.border, color: C.textDim, fontFamily: "Rajdhani" }}
  >
    {Icon && <Icon size={13} />}
    {children}
  </button>
);

export const ProgressBar = ({ value, tone = "gold", h = 6 }) => {
  const color = tone === "gold" ? C.gold : tone === "danger" ? C.danger : C.success;
  return (
    <div style={{ height: h, background: C.surface3 }}>
      <div style={{ width: `${Math.min(value, 100)}%`, height: "100%", background: color, transition: "width 0.6s cubic-bezier(.4,0,.2,1)" }} />
    </div>
  );
};

export const Avatar = ({ name, size = 28 }) => {
  const initials = name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
  return (
    <div
      className="flex items-center justify-center font-semibold shrink-0"
      style={{ width: size, height: size, background: C.surface3, border: `1px solid ${C.border}`, color: C.gold, fontSize: size * 0.36, fontFamily: "Rajdhani" }}
      title={name}
    >
      {initials}
    </div>
  );
};

export const XMark = ({ size = 20, color = C.gold, strokeWidth = 3 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M4 4L20 20M20 4L4 20" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
  </svg>
);

export const TT = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="px-3 py-2 border text-xs" style={{ background: C.surface2, borderColor: C.borderLit, fontFamily: "JetBrains Mono", color: C.text }}>
      <div style={{ color: C.textFaint }}>{label}</div>
      {payload.map((p, i) => <div key={i} style={{ color: C.gold }}>{p.value?.toLocaleString?.() ?? p.value}</div>)}
    </div>
  );
};
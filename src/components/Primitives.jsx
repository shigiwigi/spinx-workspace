import React from "react";
import { C, FONT, clipCorner } from "../theme";
import logo from "../assets/spinx-logo.jpeg";

/* ------------------------------------------------------------------ */
/* SIGNATURE MARK                                                     */
/* ------------------------------------------------------------------ */
export function XMark({ size = 20, strokeWidth = 4, color = C.gold }) {
  return (
    <img 
      src={logo} 
      alt="SpinX Mark" 
      style={{ width: size, height: size, objectFit: "contain" }} 
    />
  );
}

export function LogoMark({ size = 34 }) {
  return (
    <img 
      src={logo} 
      alt="SpinX Logo"
      className="w-full h-full object-contain" 
      style={{ width: size, height: size }}
    />
  );
}

export function SprayStreak({ size = 200, opacity = 0.05, style = {} }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      style={{ position: "absolute", opacity, pointerEvents: "none", ...style }}
    >
      <path
        d="M10 190 C 50 140, 60 120, 90 95 C 110 78, 120 60, 140 20 C 145 45, 130 65, 150 55 C 135 90, 110 110, 95 130 C 75 155, 55 170, 10 190 Z"
        fill={C.gold}
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* LAYOUT PRIMITIVES                                                  */
/* ------------------------------------------------------------------ */

export function Card({ children, className = "", pad = "p-5", style = {}, tag = false, ...rest }) {
  return (
    <div
      className={`relative ${pad} ${className}`}
      style={{
        background: C.surface,
        border: `1px solid ${C.border}`,
        ...(tag ? clipCorner(14, ["tr"]) : {}),
        ...style,
      }}
      {...rest}
    >
      {tag && (
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 14,
            height: 14,
            background: `linear-gradient(135deg, transparent 48%, ${C.goldLine} 50%)`,
          }}
        />
      )}
      {children}
    </div>
  );
}

export function Eyebrow({ children, style = {} }) {
  return (
    <div
      className="text-[10.5px] uppercase tracking-[0.14em] font-semibold"
      style={{ color: C.textFaint, fontFamily: FONT.head, ...style }}
    >
      {children}
    </div>
  );
}

export function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="relative flex items-start justify-between mb-5 pb-4" style={{ borderBottom: `1px solid ${C.border}` }}>
      <SprayStreak size={140} opacity={0.035} style={{ top: -30, left: -20 }} />
      <div className="relative flex items-center gap-3">
        <div style={{ width: 3, height: 30, background: C.gold, clipPath: "polygon(0 0, 100% 10%, 100% 100%, 0 90%)" }} />
        <div>
          <h1
            className="text-[22px] leading-tight tracking-wide"
            style={{ fontFamily: FONT.head, color: C.text, fontWeight: 700 }}
          >
            {title}
          </h1>
          {subtitle && (
            <p className="text-[12.5px] mt-0.5" style={{ color: C.textFaint, fontFamily: FONT.body }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {action && <div className="relative">{action}</div>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* BADGES + BUTTONS                                                   */
/* ------------------------------------------------------------------ */

const TONES = {
  default: { bg: C.surface3, fg: C.textDim, bd: C.border },
  gold: { bg: C.goldSoft, fg: C.gold, bd: C.goldLine },
  success: { bg: C.successSoft, fg: C.success, bd: "rgba(48,164,108,0.28)" },
  danger: { bg: C.dangerSoft, fg: C.danger, bd: "rgba(229,72,77,0.28)" },
  info: { bg: C.infoSoft, fg: C.info, bd: "rgba(91,141,239,0.28)" },
};

export function Badge({ children, tone = "default" }) {
  const t = TONES[tone] || TONES.default;
  return (
    <span
      className="inline-flex items-center px-2 py-[3px] text-[10.5px] font-semibold uppercase tracking-wide"
      style={{ background: t.bg, color: t.fg, border: `1px solid ${t.bd}`, fontFamily: FONT.head }}
    >
      {children}
    </span>
  );
}

export function PrimaryBtn({ children, icon: Icon, onClick, small = false, disabled = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 font-semibold transition-all ${small ? "px-3 py-1.5 text-xs" : "px-4 py-2.5 text-sm"}`}
      style={{
        background: disabled ? C.surface3 : C.gold,
        color: disabled ? C.textFaint : "#15110A",
        fontFamily: FONT.head,
        letterSpacing: "0.02em",
        clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
        opacity: disabled ? 0.6 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
      onMouseEnter={(e) => !disabled && (e.currentTarget.style.background = C.goldBright)}
      onMouseLeave={(e) => !disabled && (e.currentTarget.style.background = C.gold)}
    >
      {Icon && <Icon size={small ? 13 : 15} />}
      {children}
    </button>
  );
}

export function GhostBtn({ children, icon: Icon, onClick }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold transition-colors"
      style={{
        background: "transparent",
        color: C.textDim,
        border: `1px solid ${C.border}`,
        fontFamily: FONT.head,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = C.goldLine;
        e.currentTarget.style.color = C.gold;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = C.border;
        e.currentTarget.style.color = C.textDim;
      }}
    >
      {Icon && <Icon size={13} />}
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* DATA DISPLAY                                                       */
/* ------------------------------------------------------------------ */

export function Avatar({ name = "?", size = 28 }) {
  const initials = name
    .split(" ")
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div
      className="flex items-center justify-center shrink-0 border-2"
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: C.surface3,
        borderColor: C.bg,
        color: C.gold,
        fontFamily: FONT.head,
        fontWeight: 700,
        fontSize: size * 0.36,
      }}
    >
      {initials}
    </div>
  );
}

export function ProgressBar({ value = 0, h = 5, tone = "gold" }) {
  const t = TONES[tone] || TONES.gold;
  const pct = Math.min(100, Math.max(0, value));
  return (
    <div style={{ height: h, background: C.surface3, position: "relative", overflow: "hidden" }}>
      <div
        style={{
          height: "100%",
          width: `${pct}%`,
          background: pct > 85 ? C.danger : t.fg,
          transition: "width 0.5s ease",
        }}
      />
    </div>
  );
}
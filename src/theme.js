import { useEffect } from "react";

/**
 * SPINX WORKSPACE — DESIGN TOKENS
 * -------------------------------------------------
 * Palette: matte black chassis + a single stencilled gold, taken
 * directly off the SpinX brushstroke mark. No secondary accent hues —
 * status colors (danger/success/info) stay desaturated so gold is the
 * only thing that visually "shouts" anywhere in the product.
 *
 * Type system:
 *  - Orbitron   → wordmark / the SPINX lockup only. Never used in body copy.
 *  - Rajdhani   → all headings, nav, labels, eyebrows. Angular, technical,
 *                 reads like a stencil/gauge face — matches the drone/rig vibe.
 *  - Inter      → body copy, descriptions, form inputs.
 *  - JetBrains Mono → every number: stats, currency, timestamps, quantities.
 */

export const C = {
  bg: "#09090B",
  bgRaised: "#0E0E11",
  surface: "#131316",
  surface2: "#18181C",
  surface3: "#1F1F24",
  border: "#242429",
  borderStrong: "#33333A",

  gold: "#FEC02D",
  goldBright: "#FFD666",
  goldDim: "#8A6A1A",
  goldSoft: "rgba(254,192,45,0.10)",
  goldLine: "rgba(254,192,45,0.28)",

  text: "#F3F2ED",
  textDim: "#A6A4A0",
  textFaint: "#6C6B69",

  danger: "#E5484D",
  dangerSoft: "rgba(229,72,77,0.08)",
  success: "#30A46C",
  successSoft: "rgba(48,164,108,0.08)",
  info: "#5B8DEF",
  infoSoft: "rgba(91,141,239,0.08)",
};

export const FONT = {
  display: "Orbitron",
  head: "Rajdhani",
  body: "Inter",
  mono: "JetBrains Mono",
};

/** Clips one or more corners — the recurring "stencilled tag" silhouette
 *  used on cards, chips and nav pills instead of border-radius. */
export function clipCorner(size = 10, corners = ["tr"]) {
  const pts = {
    tr: `calc(100% - ${size}px) 0, 100% ${size}px, 100% 100%, 0 100%, 0 0`,
    tl: `0 ${size}px, ${size}px 0, 100% 0, 100% 100%, 0 100%`,
    br: `0 0, 100% 0, 100% calc(100% - ${size}px), calc(100% - ${size}px) 100%, 0 100%`,
    bl: `0 0, 100% 0, 100% 100%, ${size}px 100%, 0 calc(100% - ${size}px)`,
  };
  // Only single-corner cuts are composited here; combine by picking the
  // dominant corner passed in (kept simple & predictable across the app).
  return { clipPath: `polygon(${pts[corners[0]] || pts.tr})` };
}

export function useFonts() {
  useEffect(() => {
    const id = "spinx-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Orbitron:wght@600;700;800;900&family=Rajdhani:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap";
    document.head.appendChild(link);

    const styleId = "spinx-globals";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.innerHTML = `
        * { box-sizing: border-box; }
        body { background: ${C.bg}; }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${C.border}; }
        ::-webkit-scrollbar-thumb:hover { background: ${C.borderStrong}; }
        input::placeholder, textarea::placeholder { color: ${C.textFaint}; }
        input, select, textarea, button { font-family: inherit; }
        @keyframes spinxPulse { 0%,100% { opacity: 1 } 50% { opacity: .45 } }
        @keyframes spinxFadeUp { from { opacity: 0; transform: translateY(6px);} to { opacity: 1; transform: translateY(0);} }
      `;
      document.head.appendChild(style);
    }
  }, []);
}

import { useEffect } from "react";

export function useFonts() {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Orbitron:wght@700;800&family=Rajdhani:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);
}

export const C = {
  bg: "#0A0A0B", surface: "#131316", surface2: "#1A1A1E", surface3: "#212126",
  border: "#28282D", borderLit: "#3A3A40",
  gold: "#FEC02D", goldDim: "#8C6A1E", goldSoft: "#FEC02D22",
  text: "#F2F1EC", textDim: "#98979E", textFaint: "#5C5B62",
  danger: "#E5484D", success: "#3DD68C", info: "#5EA1F2",
};

export const clipCorner = (size = 14) => ({
  clipPath: `polygon(0 0, calc(100% - ${size}px) 0, 100% ${size}px, 100% 100%, 0 100%)`,
});
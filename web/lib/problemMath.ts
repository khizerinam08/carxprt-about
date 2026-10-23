import { clamp } from "@/hooks/useScroll";

/* Time follows scroll, price steps up per stage.
   Active time per step today: research and compare 6.5+ hrs, contact dealers ~3, negotiate 1–2 (1.5 used),
   dealership visit ~3; about 14 hrs in all, spread over 3 to 5+ days (Cox Automotive 2025 averages and
   typical dealer timelines). HOURS is how each step's time is written once it's printed. */
export const MIN = [0, 390, 570, 660, 840];
export const HOURS = ["6.5+ hrs", "~3 hrs", "1–2 hrs", "~3 hrs"];
export const TOTAL_HOURS = "~14 hrs";
/* Illustrative: advertised → + market adjustment → + fees and add-ons. */
export const PRICE = [38500, 38500, 40000, 42292];

export const minutesAt = (p: number) => {
  const x = clamp(p) * 4, i = Math.min(3, Math.floor(x));
  return MIN[i] + (MIN[i + 1] - MIN[i]) * (x - i);
};
export const stageAt = (p: number) => (p <= 0 ? -1 : Math.min(3, Math.floor(clamp(p) * 4)));
export const fmtTime = (m: number) => {
  m = Math.floor(m);
  return `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, "0")}m`;
};
export const fmtUSD = (v: number) => "$" + Math.round(v).toLocaleString("en-US");

// self-check: the meter math the section depends on
console.assert(
  minutesAt(0) === 0 && minutesAt(0.5) === 570 && minutesAt(1) === 840 &&
  stageAt(0) === -1 && stageAt(0.26) === 1 && stageAt(1) === 3 &&
  fmtTime(570) === "9h 30m" && fmtUSD(42292) === "$42,292",
  "problem meter math",
);

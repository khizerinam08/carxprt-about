import type { Car } from "@/components/CarCard";
import { clamp } from "@/hooks/useScroll";
import { HOURS, MIN, PRICE, TOTAL_HOURS, fmtUSD } from "./problemMath";

/* One sample buyer, one car, start to finish. Every price below adds up (see the check at the bottom).
   Dialogue, stock number and match count are sample content until real transcripts exist. */

export const PROMPT = "Find me a family SUV under $40k near 78701.";
export const REPLY = "23 matches near Austin. Here are the three that fit best.";
export const SUGGESTED = ["Show me low-mileage hybrids", "Seven seats under $40k", "SUVs with a clean history"];
export const FOUND = "23 vehicles found";
export const FILTERS = ["78701 · 25 mi", "Under $40,000", "SUV", "Family"];

export const CARS: Car[] = [
  { src: "/assets/suv-sage.jpg", alt: "Sage green hybrid SUV", name: "Hybrid SUV", price: "$34,200", location: "Austin, TX", distance: "2 mi", fuel: "Hybrid", miles: "18,400 mi" },
  { src: "/assets/suv-silver.jpg", alt: "Silver family SUV", name: "Family SUV", price: "$37,950", location: "Round Rock, TX", distance: "19 mi", fuel: "Gasoline", miles: "22,100 mi" },
  { src: "/assets/suv-copper.jpg", alt: "Copper midsize crossover", name: "Crossover", price: "$39,400", location: "Cedar Park, TX", distance: "20 mi", fuel: "Gasoline", miles: "9,800 mi" },
];
export const PICK = 0;

/* out-the-door quote lines: [label, first offer, negotiated]; tax is 8% of the vehicle price. The negotiator
   drops the add-on and takes the discount off the vehicle's price (the doc fee stays: dealers rarely move it) */
const TAX = 0.08;
const VEHICLE = [34200, 32899] as const;
export const QUOTE: [string, number, number][] = [
  ["Vehicle", VEHICLE[0], VEHICLE[1]],
  ["Sales tax (8%)", Math.round(VEHICLE[0] * TAX), Math.round(VEHICLE[1] * TAX)],
  ["Registration", 250, 250],
  ["Doc fee", 799, 799],
  ["Protection package", 995, 0],
];
export const OTD_FIRST = QUOTE.reduce((a, [, v]) => a + v, 0);
export const OTD_FINAL = QUOTE.reduce((a, [, , v]) => a + v, 0);

/* the thread on the deal page; `xprt` messages are the negotiator, writing as the buyer in the first
   person (it never claims to be a person), the rest are the dealer's sales rep */
export type Msg = { from: "xprt" | "dealer"; text: string };
export const THREAD: Msg[] = [
  { from: "xprt", text: "Hi, I’m interested in your Hybrid SUV, stock 4471. What’s your best out-the-door price?" },
  { from: "dealer", text: `${fmtUSD(OTD_FIRST)} out the door. That includes our $995 protection package.` },
  { from: "xprt", text: "I don’t need the package, and similar cars nearby list for less. Can you do $32,899 on the vehicle?" },
  { from: "dealer", text: "Let me check with my manager." },
  { from: "dealer", text: `We can do it. ${fmtUSD(OTD_FINAL)} out the door.` },
  { from: "xprt", text: "That works for me. I’ll confirm shortly." },
];

/* time today against time with CarXprt. Today: the same step minutes the Problem section uses (Cox
   Automotive 2025 averages and typical dealer timelines). With CarXprt, from customer journeys: research
   ~1 hr, contact ~5 min, negotiate ~15 min, visit ~2 hrs. */
export const USUAL = ["Research and compare", "Contact dealers", "Negotiate", "Dealership visit"]
  .map((label, i) => ({ label, time: HOURS[i], min: MIN[i + 1] - MIN[i] }));
export const USUAL_MIN = MIN[MIN.length - 1];
export const CARXPRT_MIN = 60 + 5 + 15 + 120;
export const TIME = { usual: TOTAL_HOURS, carxprt: "~3½ hrs", saved: "~10 hrs", less: "75%" };
export const USUAL_PRICE = PRICE[PRICE.length - 1];

/* what the negotiation took off the first quote: the add-on (protection package), then the discount on the
   vehicle price with its tax. The money screen only names the two kinds; the assert below keeps the split
   adding up to the deal */
const off = (...rows: number[]) => rows.reduce((a, i) => a + QUOTE[i][1] - QUOTE[i][2], 0);
export const KEPT = [
  { label: "Protection package", usd: off(4) },
  { label: "Price and tax", usd: off(0, 1) },
];
export const KEPT_USD = OTD_FIRST - OTD_FINAL;

/* Scroll script: [start, end] of each beat as a fraction of the pinned scroll (the 620vh section less one
   screen). The product screens and the time screen take the first ~78%, the money screen the rest. */
export const BEATS = {
  type: [0.024, 0.105],
  reply: [0.105, 0.162],
  toHub: [0.178, 0.226],
  chips: [0.226, 0.267],
  deal: [0.258, 0.323],
  pick: [0.331, 0.38],
  toDeal: [0.396, 0.444],
  thread: [0.444, 0.614],
  grow: [0.638, 0.703],
  end: [0.695, 0.775],
  // the money screen: it takes over from the time screen, then its bars draw
  swap: [0.81, 0.87],
  cash: [0.86, 0.95],
} as const satisfies Record<string, readonly [number, number]>;

export const span = (p: number, [a, b]: readonly [number, number]) => clamp((p - a) / (b - a));
/* which step of the list is lit: Ask, Choose, Negotiate, Drive away */
export const stepAt = (p: number) => (p < 0.202 ? 0 : p < 0.42 ? 1 : p < 0.646 ? 2 : 3);

// self-check: the sample deal and the time figures must add up
console.assert(
  OTD_FIRST === 38980 && OTD_FINAL === 36580 && OTD_FIRST - OTD_FINAL === 2400 &&
  KEPT.reduce((a, k) => a + k.usd, 0) === KEPT_USD && KEPT[0].usd === 995 && KEPT[1].usd === 1405 &&
  USUAL.reduce((a, s) => a + s.min, 0) === USUAL_MIN && USUAL_MIN === 840 && CARXPRT_MIN === 200 &&
  Math.round((1 - CARXPRT_MIN / USUAL_MIN) * 100) >= 75 && (USUAL_MIN - CARXPRT_MIN) / 60 >= 10 &&
  stepAt(0) === 0 && stepAt(0.3) === 1 && stepAt(0.6) === 2 && stepAt(0.9) === 3,
  "walkthrough numbers",
);

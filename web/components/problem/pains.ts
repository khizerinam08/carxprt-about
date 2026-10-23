import type { IconName } from "../Icons";
import { PRICE, fmtUSD } from "@/lib/problemMath";

/* The four steps of buying a car today. The step list tells the story (title, a one-line body, and the
   sub-steps it's made of); the receipt itemises what each step puts on the bill (label, bill lines). Each
   step's time is in lib/problemMath (MIN, HOURS). The money lines sum to PRICE there:
   $38,500 advertised + $1,500 market adjustment + $2,292 fees and add-ons = $42,292. */
export type BillLine = { label: string; usd?: number; text?: string };
export type Pain = { title: string; body: string; items: string[]; label: string; bill: BillLine[]; icon: IconName };

export const PAINS: Pain[] = [
  { title: "Research and compare", body: "Scattered info, and it’s on you to sort it out.",
    items: ["Listing sites", "Reviews and spec sheets", "Copy-pasting into AI"],
    label: "Research", bill: [{ label: "Advertised price", text: fmtUSD(PRICE[0]) }], icon: "tabs" },
  { title: "Contact dealers", body: "About a day of chasing dealers for answers.",
    items: ["Finding the right number", "Phone menus and emails", "Waiting on replies", "Spam after"],
    label: "Contact dealers", bill: [{ label: "Out-the-door price", text: "Not quoted yet" }], icon: "phone" },
  { title: "Negotiate and check the deal", body: "One to three days before you see a real number.",
    items: ["Calls and emails", "“Let me check with my manager”", "Checking the numbers"],
    label: "Negotiation", bill: [{ label: "Market adjustment", usd: 1500 }], icon: "chat" },
  { title: "Dealership visit", body: "Hours at the dealer before you can drive away.",
    items: ["Waiting for a salesperson", "Test drive", "Sales manager meeting", "Paperwork from scratch"],
    label: "Dealership visit", icon: "key",
    bill: [{ label: "Doc fee", usd: 799 }, { label: "Protection package", usd: 995 }, { label: "Window tint", usd: 299 }, { label: "Nitrogen tires", usd: 199 }] },
];

// what a step adds to the price
export const added = (p: Pain) => p.bill.reduce((a, l) => a + (l.usd ?? 0), 0);

console.assert(
  PAINS.every((p, i) => PRICE[i] === PRICE[Math.max(0, i - 1)] + added(p)),
  "pains: bill lines don't add up to PRICE",
);

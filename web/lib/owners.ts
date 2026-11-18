/* The owner page (/owners, 18 Nov 2026): Owner mode from the CarXprt-Redesign Figma file (owner home, Service,
   Ask Xprt, Marketplace, Mechanics, Upcoming events, Live Mode, Add a car), told as one car's first year. The car
   is the home page's render, the Hybrid SUV the family bought there. Shop names, dates and figures are
   illustrative; brand names in the Figma screens (the car maker, its dealer, the history report) are left out. */

export const CAR = { name: "Hybrid SUV", year: "2025", vin: "VIN ending 4821", src: "/home/car.png", w: 2100, h: 749 };

/* the five moments' title (the hero's words are in components/owners/OwnerHero) */
export const ROAD = {
  head: ["One car,", "its first year."],
  lead: "Follow the Hybrid SUV through its first year with Owner mode, from the day it comes home to the day you decide what’s next.",
};

export type Task = { icon: "doc" | "bolt" | "clock" | "phone" | "check"; head: string; line: string; state: string; tone: "lime" | "ink" | "line" | "done" };
export const FEED: Task[] = [
  { icon: "bolt", head: "Getting brake pad quotes", line: "3 shops contacted · 2 replied · Best so far $412", state: "Active", tone: "lime" },
  { icon: "clock", head: "Booking your 20k service", line: "Needs your OK · Tue 9:00 AM at Pro Auto Care", state: "Review", tone: "ink" },
  { icon: "check", head: "Registration renewed", line: "12 months · Done by your agent", state: "Done", tone: "done" },
];

/* ---------- one car's first year: a moment at each mileage ---------- */
export type Chapter = { id: string; rail: string; miles: number; head: string; body: string };
export const STORY: Chapter[] = [
  { id: "add", rail: "Add", miles: 18400, head: "Add your car in a minute.",
    body: "Upload the paperwork you already have. CarXprt reads the window sticker, receipts and records, and fills in the rest." },
  { id: "agent", rail: "Agent", miles: 20900, head: "Your agent does the chores.",
    body: "It gets quotes from mechanics near you, books the service and calls the shop, and asks for your OK before anything is final." },
  { id: "due", rail: "Due", miles: 24960, head: "Know what’s due before it’s due.",
    body: "Registration, coverage, brakes and tires on one calendar, with wear estimated from your mileage, driving and every receipt you drop in." },
  { id: "ask", rail: "Ask", miles: 27300, head: "Ask, or point your phone.",
    body: "Describe a dent or a noise and get the part that fits your VIN, checked before you buy. In the app, Live Mode reads a warning light or a worn tire through the camera." },
  { id: "sell", rail: "Sell", miles: 31200, head: "Ready for what’s next.",
    body: "A full service history backs your trade-in estimate, so when it’s time to sell, the listing is one step away." },
];

/* 1. add a car: the files read, then what was found, row by row */
export const FILES = ["Window sticker.pdf", "Bill of sale.pdf", "Insurance card.jpg"];
export const FOUND = [
  { k: "Car", v: `${CAR.year} ${CAR.name}` },
  { k: "VIN", v: "Ending 4821" },
  { k: "Odometer", v: "18,400 mi" },
  { k: "Coverage", v: "Policy ending 7731" },
];

/* 3. what's due: registration's countdown and the AI wear estimates */
export const REG = { days: 139, weeksLeft: 20, weeks: 52, by: "31 Mar 2027" };
export const WEAR = [
  { k: "Brake pads", v: "3 mm", of: "of 10 mm", w: .3, warn: true },
  { k: "Tire tread", v: "6/32", of: "about 2 years left", w: .6, warn: false },
  { k: "Battery", v: "96%", of: "health", w: .96, warn: false },
];

/* 4. Ask Xprt: the dented fender, and the part that fits */
export const ASK_THREAD = {
  q: "Someone backed into my front left fender. Can you find a replacement?",
  a: "Found it. This fender fits your Hybrid SUV, unpainted, in stock.",
  part: { name: "Front left fender", line: "Aftermarket · CAPA certified · New", price: "$118.61" },
  next: ["Fit it at Pro Auto Care", "Show the maker’s price"],
};

/* 5. sell: the trade-in estimate and what backs it */
export const TRADE = { value: "$29,800", low: "$28,100", high: "$31,400", pos: .53, basis: "Based on 31,200 mi and 6 records",
  checks: [{ k: "Full service history", v: "6 records on file" }, { k: "No open recalls", v: "Checked 11 Nov" }] };

export const CLOSE = {
  head: "Already own a car? Switch to Owner mode.",
  lead: "Add your car, and your agent starts on what’s due. Live Mode and reminders come with the app.",
};

/* Owner mode's price (the user's pricing table, 18 Nov 2026): monthly or yearly; members shop free and pay the
   same $19 Negotiator success fee as everyone */
export const PRICE = {
  plans: [
    { id: "month", name: "Monthly", price: "$10", per: "a month", note: "Cancel any time" },
    { id: "year", name: "Yearly", price: "$100", per: "a year", note: "Save $20, two months free" },
  ],
  features: [
    "Your AI agent for quotes, bookings and calls",
    "Reminders before every renewal and service",
    "Parts checked against your VIN",
    "Ask Xprt and Live Mode in the app",
    "Your full service record and trade-in estimate",
  ],
  shop: "Shopping stays free. If you buy your next car with the Negotiator, the same $19 success fee applies.",
};

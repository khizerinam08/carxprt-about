import { CARS, QUOTE, OTD_FINAL } from "./walkthrough";
import { fmtUSD } from "./problemMath";

/* The dealer page (/dealers): the words are dealership.carxprt.com's (17 Nov 2026), shortened. The shopper in the
   story is the home page's: the family looking for a hybrid SUV near 78701, whose deal closes at the home page's
   out-the-door price, here seen from the dealer's side. Names and counts are illustrative; the page says nothing about finance, leases or interest (the user, 17 Nov 2026). */

export const HERO = {
  head: ["Paying shoppers in.", "Sold cars out."],
  lead: "CarXprt helps your dealership close more deals, faster. See every shopper’s needs, budget, timeline and activity up front, while Xprt keeps each conversation moving toward the sale.",
};

/* the hero's dashboard chat, as on the live page, with the home page's cars */
export const BRIEF = {
  ask: "What are my leads for today?",
  checked: "Checked your leads",
  answer: "You have 9 leads today. Two are high priority:",
  leads: [
    { car: CARS[0], line: "Negotiating · active this morning", chip: "Hot" },
    { car: CARS[1], line: "New request · 2 hrs ago", chip: "New" },
  ],
  follow: "Yes, draft the Hybrid SUV follow-up first.",
  done: "Done. It’s waiting in the conversation for you to review, edit and send.",
};

/* the four figures (the live page's: paying buyers, full context, 24/7, seconds) */
export const STATS = [
  { big: "100%", label: "Paying buyers", line: "Every lead is a subscriber who pays to shop." },
  { big: "0", label: "Cold starts", line: "Every lead arrives with the buyer’s full requirements." },
  { big: "24/7", label: "Instant answers", line: "About your leads, deals and inventory." },
  { big: "Seconds", label: "To write an ad", line: "For Marketplace, Craigslist and more." },
];

/* ---------- the story: one lead, start to sale ---------- */
export const STORY_TITLE = {
  head: ["One lead,", "start to sale."],
  lead: "Follow one shopper from the moment they match your inventory to the deal they sign.",
};

export type StoryChapter = { id: string; rail: string; head: string; body: string };
export const STORY: StoryChapter[] = [
  { id: "lead", rail: "Lead", head: "Leads that arrive with the full story.",
    body: "Every lead is a paying subscriber, with their requirements and shopping activity already on record. Your team never starts from zero." },
  { id: "respond", rail: "Respond", head: "Never leave a lead waiting.",
    body: "Xprt Responder answers right away from your team’s notes, and hands off the moment it reaches price or negotiation." },
  { id: "quote", rail: "Quote", head: "Quotes ready in minutes.",
    body: "Build the out-the-door quote without leaving the deal. Fees and add-ons come from your saved defaults, so every quote adds up." },
  { id: "close", rail: "Close", head: "Know what’s working.",
    body: "Response times, your pipeline and stalled leads at a glance, with the deal you just closed already counted." },
];

export const SHOPPER = { name: "Sam R.", zip: "78701", deal: "Deal #4821" };
export const CAR = CARS[0];

export const PROFILE = [
  { k: "Wants", v: "Hybrid SUV, seats seven" },
  { k: "Budget", v: "Under $40,000 out the door" },
  { k: "Timeline", v: "This month" },
  { k: "Activity", v: "Viewed 3 of your listings, saved 1" },
];

/* the Responder's thread: the shopper on the left, Xprt on the right; the fourth line is the hand-off */
export const THREAD = [
  { mine: false, text: "Is the Hybrid SUV still available? Does it seat seven?" },
  { mine: true, text: "Yes, it’s on the lot and seats seven. Want a test drive this week?" },
  { mine: false, text: "Maybe. What’s your best out-the-door price?" },
  { mine: true, text: "Pricing goes to Marcus on our team. He’ll reply here shortly." },
];
export const REP = "Marcus";

/* Deal Builder: the home page's negotiated lines (the add-on already gone) and the out-the-door total */
export const LINES = QUOTE.filter(([, , v]) => v > 0).map(([k, , v]) => ({ k, v, saved: k === "Doc fee" || k === "Registration" }));
export const OTD = OTD_FINAL;

/* Analytics after the sale: the pipeline this week (Sold goes from 1 to 2 as the deal closes) */
export const PIPE = [
  { k: "New", v: 9 },
  { k: "Talking", v: 6 },
  { k: "Quoted", v: 4 },
  { k: "Sold", v: 2 },
];

/* ---------- the tools ---------- */
export const CHANNELS = ["Facebook Marketplace", "Craigslist", "CarGurus", "Cars.com"];
export const AD = {
  head: `${CARS[0].name} · ${CARS[0].miles} · ${CARS[0].fuel}`,
  body: "Sage green hybrid SUV with 18,400 miles, ready to see in Austin. Quiet in town, easy on fuel and roomy enough for the whole family.",
  tags: ["Description", "Headline", "SEO copy"],
};
export const STOCK = [
  { car: CARS[0], days: 6, flag: "Most viewed", tone: "lime" },
  { car: CARS[1], days: 41, flag: "Stale listing", tone: "alert" },
  { car: CARS[2], days: 12, flag: "Price gap", tone: "ink" },
] as const;

export const DEMO = {
  head: "See CarXprt on your own inventory.",
  lead: "Tell us about your store and we’ll set up a live walkthrough: your vehicles listed for CarXprt shoppers, real lead profiles and Xprt at work.",
  points: ["A 30-minute live demo with a real dashboard", "A custom quote for your dealership the same day", "We’ll reach out within one business day"],
};

console.assert(OTD === LINES.reduce((a, l) => a + l.v, 0) && fmtUSD(OTD) === "$37,629", "dealers: the quote adds up to the home page's price");

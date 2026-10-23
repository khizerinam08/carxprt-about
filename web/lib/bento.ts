import { CARS, OTD_FIRST, QUOTE } from "./walkthrough";

/* The home page bento: what CarXprt does besides the walkthrough's four steps, one product piece per cell.
   Facts come from the live site's FAQ and pricing page; the figures inside the pieces are sample content
   built on the About page's sample cars and first quote, and the checks below keep them adding up. */

export type Cell = { id: string; head: string; body: string; note?: string; wide?: boolean };
export const CELLS: Cell[] = [
  { id: "voice", head: "Talk to it", body: "Say it the way you’d tell a friend who knows cars: budget, must-haves and deal-breakers in one breath. CarXprt searches, filters and lines up the matches." },
  { id: "compare", head: "Compare up to three", body: "Price, cost to own and reliability side by side, with the trade-offs spelled out instead of a spec table.", note: "With CarXprt Plus." },
  { id: "private", head: "Your number stays yours", body: "Before the Xprt Negotiator writes to a dealer, you choose what they see. Stay anonymous and they get your name, ZIP and a deal ID, never your number or email.", note: "With CarXprt Plus." },
  { id: "cost", head: "The real number, not the sticker", body: "Insurance, fuel, maintenance and depreciation added up over five years, so you compare what each car really costs.", note: "With CarXprt Plus.", wide: true },
  { id: "quote", head: "Already have a quote? Bring it", body: "Attach a photo of the dealer’s quote. The validator checks every line, and the Xprt Negotiator takes it from there.", note: "With CarXprt Plus." },
  { id: "advisor", head: "A person, if you want one", body: "On Pro, a dedicated advisor runs your deal end to end and keeps looking for better cars nearby.", note: "With CarXprt Pro." },
];

/* voice: one breath, several asks (search, filters, a comparison), to show it's more than a voice remote */
export const VOICE = { said: "Hybrid SUV under $35k, one owner, no accidents. Compare the two closest to me.", result: "Comparing the 2 closest of 4" };

/* compare: the About page's three sample cars, with a five-year cost to own (the first is OWN's total below,
   so the cells agree) and a reliability score */
export const COMPARE = CARS.map((car, i) => ({
  car,
  own: [30600, 34900, 36200][i],
  reliability: [4.6, 4.2, 4.4][i],
}));
export const BEST = 0;

/* private: the replies the Xprt Responder files */
export const INBOX = [
  { from: "Riverside Auto", text: "Your out-the-door quote is ready.", kept: true },
  { from: "Northgate Cars", text: "Still interested? Call me back today.", kept: false },
  { from: "Lakeside Motors", text: "We can do $37,900 out the door.", kept: true },
];

/* cost to own: the sample Hybrid SUV over five years */
export const OWN = {
  price: CARS[0].price,
  parts: [
    { label: "Depreciation", usd: 13100 },
    { label: "Insurance", usd: 7400 },
    { label: "Fuel", usd: 6200 },
    { label: "Maintenance", usd: 3900 },
  ],
};
export const OWN_TOTAL = OWN.parts.reduce((a, p) => a + p.usd, 0);

/* quote: the About page's first quote, with the lines the negotiator will work on flagged */
export const FLAGS: Record<string, string> = { Vehicle: "Negotiable", "Protection package": "Optional" };
export const QUOTE_LINES = QUOTE.map(([label, first]) => ({ label, usd: first, flag: FLAGS[label] }));

export const ADVISOR = { status: "Working on 3 dealer offers", text: "Riverside is down to $36,580. Want me to push Northgate too?" };

console.assert(
  OWN_TOTAL === 30600 && COMPARE[BEST].own === OWN_TOTAL && QUOTE_LINES.reduce((a, l) => a + l.usd, 0) === OTD_FIRST &&
  COMPARE.every((c) => c.own >= COMPARE[BEST].own) && COMPARE.length === 3 && CELLS.length === 6,
  "bento numbers",
);

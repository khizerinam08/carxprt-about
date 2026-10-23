import { CARS } from "./walkthrough";

/* The home page bento: what CarXprt does besides the walkthrough's four steps. Facts come from the live site's
   FAQ and pricing page; the figures inside the pieces are sample content built on the About page's sample
   cars, and the check below keeps them consistent. */

export type Cell = { id: string; head: string; body: string; note?: string };
export const CELLS: Cell[] = [
  { id: "voice", head: "Talk to it", body: "Say it the way you’d tell a friend who knows cars: budget, must-haves and deal-breakers in one breath. CarXprt searches, filters and lines up the matches." },
  { id: "private", head: "Your number stays yours", body: "Before the Xprt Negotiator writes to a dealer, you choose what they see. Stay anonymous and they get your name, ZIP and a deal ID, never your number or email.", note: "With CarXprt Plus." },
  { id: "quote", head: "Already have a quote? Bring it", body: "Attach a photo of the dealer’s quote. The validator checks every line, and the Xprt Negotiator takes it from there.", note: "With CarXprt Plus." },
];

/* voice: one breath, several asks (search, filters, a comparison), to show it's more than a voice remote */
export const VOICE = { said: "Hybrid SUV under $35k, one owner, no accidents. Compare the two closest to me.", result: "Comparing the 2 closest of 4" };

/* compare (the bento's cell and the walkthrough's card): the About page's three sample cars, with a
   five-year cost to own (depreciation, insurance, fuel and maintenance) and a reliability score */
export const COMPARE = CARS.map((car, i) => ({
  car,
  own: [30600, 34900, 36200][i],
  reliability: [4.6, 4.2, 4.4][i],
}));
/* the best fit: the lowest cost to own and the most reliable */
export const BEST = 0;

console.assert(
  COMPARE.length === 3 && COMPARE.every((c) => c.own >= COMPARE[BEST].own && c.reliability <= COMPARE[BEST].reliability),
  "bento numbers",
);

import { clamp } from "@/hooks/useScroll";
import { fmtUSD } from "./problemMath";
import { CARS, FOUND, OTD_FINAL, PICK, THREAD, span } from "./walkthrough";

/* Home page, How it works: one map of the dealers around the buyer's ZIP, and a camera that moves between
   four chapters (townhouse.dev). It runs the About page's sample deal: Riverside Auto's quote is that deal,
   and the negotiator's chat is that page's thread, so the two pages agree. Dealer names and places are
   sample content. Map units: a 2400 × 1500 board, turned 8° so its grid doesn't sit square on screen. */

export type Pt = readonly [number, number];
export const MAP = { w: 2400, h: 1500, turn: 8 } as const;
/* at zoom 1 the frame shows this much of the board, which leaves room around it for the camera to move */
export const VIEW: Pt = [1900, 1150];

export const ZIP = "78701";
export const YOU: Pt = [1180, 760];

/* the avenues: routes run along these, minor streets fill the blocks between them */
const AVE_Y = [180, 470, 760, 1050, 1340];
const AVE_X = [380, 780, 1180, 1580, 1980];
const EDGE_X = [-700, ...AVE_X, 3100];
const EDGE_Y = [-500, ...AVE_Y, 2100];

export type Dealer = { id: string; name: string; at: Pt; cars: number; left?: boolean; car?: number; route?: Pt[] };
/* the first three have the cars you compare (`car`: lib/walkthrough's CARS, in order), and the first of them
   is the one the negotiator talks to. Dealers sit in a flat band across the board, so the wide shots can show
   them all above the words and the card (positions found with a search over common screen sizes) */
export const DEALERS: Dealer[] = [
  { id: "riverside", name: "Riverside Auto", at: [1580, 900], cars: 6, left: true, car: 0, route: [YOU, [1580, 760], [1580, 900]] },
  { id: "northgate", name: "Northgate Cars", at: [1980, 470], cars: 5, car: 1, route: [YOU, [1180, 470], [1980, 470]] },
  { id: "lakeside", name: "Lakeside Motors", at: [380, 620], cars: 4, left: true, car: 2, route: [YOU, [380, 760], [380, 620]] },
  { id: "hillcrest", name: "Hillcrest Auto Group", at: [780, 900], cars: 3, left: true },
  { id: "southpark", name: "Southpark Motors", at: [1980, 900], cars: 3 },
  { id: "westfield", name: "Westfield Autos", at: [780, 470], cars: 2, left: true },
];
export const WINNER = 0;
export const COMPARED = DEALERS.filter((d) => d.car !== undefined).length;

/* ---------- the drawing ---------- */
function rng(seed: number) {
  return () => (seed = (seed * 16807) % 2147483647) / 2147483647;
}
const r = rng(11);

/* minor streets: each block between avenues gets its own grid; the two blocks either side of you are denser */
const streets: string[] = [];
for (let i = 0; i < EDGE_X.length - 1; i++) {
  for (let j = 0; j < EDGE_Y.length - 1; j++) {
    const [x0, x1, y0, y1] = [EDGE_X[i], EDGE_X[i + 1], EDGE_Y[j], EDGE_Y[j + 1]];
    const core = (i === 2 || i === 3) && (j === 2 || j === 3);
    const gx = core ? 46 : 58 + Math.floor(r() * 4) * 8;
    const gy = core ? 46 : Math.round(gx * (1.2 + r() * 0.6));
    for (let x = x0 + gx / 2 + r() * 10; x < x1 - 10; x += gx) streets.push(`M${x.toFixed(0)} ${y0}V${y1}`);
    for (let y = y0 + gy / 2 + r() * 10; y < y1 - 10; y += gy) streets.push(`M${x0} ${y.toFixed(0)}H${x1}`);
  }
}
export const STREETS = streets.join("");
export const AVENUES = [
  ...AVE_Y.map((y) => `M-700 ${y}H3100`),
  ...AVE_X.map((x) => `M${x} -500V2100`),
  "M-700 2000L1180 760",
].join("");
export const HIGHWAY = "M1400 -500C1360 200 1460 430 1390 720S1300 1150 1400 2100";
export const RIVER = "M-700 1230C100 1150 600 1260 1000 1190S1700 1130 3100 1220";
export const PARKS: [number, number, number, number][] = [[880, 530, 220, 170], [2060, 560, 240, 180], [200, 1420, 260, 180], [1660, 220, 200, 160]];
export const PLACES: [string, number, number][] = [["North Loop", 1000, 330], ["East End", 2200, 720], ["South Shore", 900, 1490], ["West Hills", 60, 920]];

/* ---------- the chapters ---------- */
/* the product's flow: search (or ask the AI), compare the cars nearby, the negotiator talks to one dealer at a
   time, you approve. CarXprt has no price score, so the old "Check" chapter is now the comparison */
export type Chapter = { id: string; rail: string; head: string; body: string; note?: string };
export const TITLE = {
  head: ["One sentence in.", "One price out."],
  lead: "Watch one search become a deal. CarXprt finds the car, lines it up against the ones nearby and negotiates with the dealer for you, and you never take a sales call.",
};
export const CHAPTERS: Chapter[] = [
  { id: "ask", rail: "Ask", head: "Say what you want.", body: `Search and filter the usual way, or just tell CarXprt what you need. It looks at every dealer around your ZIP and brings back the cars that fit.` },
  { id: "compare", rail: "Compare", head: "Compare what’s nearby.", body: "Line up the cars around you side by side: price, mileage, distance and what each costs to own. Ask anything about them and get a straight answer.", note: "AI comparison comes with CarXprt Plus." },
  { id: "negotiate", rail: "Negotiate", head: "It negotiates. You stay hidden.", body: "Pick one, and the Xprt Negotiator opens a chat with that dealer, asks for the out-the-door price and talks it down. The dealer never gets your number or email.", note: "The Xprt Negotiator comes with CarXprt Plus." },
  { id: "approve", rail: "Approve", head: "Approve the price.", body: "When the dealer agrees, you approve the deal and book the test drive. Members save around $2,500 on a typical deal." },
];

/* the reply in the Ask card */
export const MATCHES = Number(FOUND.replace(/\D/g, ""));
export const REPLY = `${MATCHES} matches at ${DEALERS.length} dealers near ${ZIP}.`;

/* the negotiation card: the About page's thread with Riverside, less its two holding lines */
export const CHAT = [0, 1, 2, 4].map((i) => THREAD[i]);

/* the approval */
export const BOOKED = "Test drive booked · Saturday, 10:00 AM";

/* ---------- the scroll script ---------- */
/* where each chapter starts, as a fraction of the pinned scroll; before the first one the title shows */
export const CH = [0.06, 0.3, 0.52, 0.78] as const;
/* the camera moves during the first stretch of each chapter, then holds while the chapter plays */
const MOVE = 0.07;
export const BEATS = {
  type: [0.1, 0.18],
  reply: [0.18, 0.21],
  pins: [0.2, 0.27],
  // the routes out to the cars you compare, as Compare opens; /home-v2 (the user's Figma: no lines on the
  // title screen) draws them at the end of Ask instead, once the matches are in
  routes: [0.34, 0.39],
  routesEarly: [0.23, 0.27],
  compare: [0.37, 0.46],
  // the chat with the dealer, one message after another; the deal lands with the last
  chat: [0.56, 0.72],
  approve: [0.85, 0.875],
  drive: [0.86, 0.96],
  booked: [0.95, 0.985],
} as const satisfies Record<string, readonly [number, number]>;

export type Cam = { x: number; y: number; z: number };
/* each frames its chapter's pins clear of the words, the card and the chapter list at 1280–1920 wide */
export const CAM: Cam[] = [
  { x: 1360, y: 780, z: 0.55 }, // title: the whole board
  { x: 1360, y: 780, z: 0.6 }, // ask: every dealer with a match
  { x: 980, y: 900, z: 0.6 }, // compare: you and the three dealers with the cars you compare
  { x: 1365, y: 920, z: 1.7 }, // negotiate: closer, on you and the one dealer in the chat
  { x: 1380, y: 880, z: 1.3 }, // approve: the drive from you to the dealer
];
/* phones (the pinned stage stacked: words at the top, card at the foot, the map between, only Riverside and
   you keep tags), for an anchor at [.5, .45]; found by a search over common phone sizes */
export const CAM_PHONE: Cam[] = [
  { x: 1160, y: 670, z: 0.46 }, // title: closer in, so the streets fill the screen (pulled back for Ask)
  { x: 1160, y: 400, z: 0.28 }, // ask: every dealer
  { x: 1160, y: 400, z: 0.28 }, // compare: the same shot, the other dealers fading back
  { x: 1460, y: 840, z: 0.66 }, // negotiate: you and Riverside
  { x: 1380, y: 820, z: 1.22 }, // approve: closer, for the drive
];

const smooth = (t: number) => t * t * (3 - 2 * t);
/* pan in a straight line and zoom evenly in log space, pulling back a little on long moves */
function mix(a: Cam, b: Cam, t: number): Cam {
  const dist = Math.hypot(b.x - a.x, b.y - a.y);
  const dip = 1 - clamp(dist / 1500) * 0.3 * Math.sin(Math.PI * t);
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, z: Math.exp(Math.log(a.z) + (Math.log(b.z) - Math.log(a.z)) * t) * dip };
}

export const chapterAt = (p: number) => CH.reduce((c, start, i) => (p >= start ? i : c), -1);
const enter = (p: number, i: number) => smooth(span(p, [CH[i], CH[i] + MOVE]));

export function camAt(p: number, cams: Cam[] = CAM): Cam {
  let cam = cams[0];
  CH.forEach((start, i) => { if (p >= start) cam = mix(cams[i], cams[i + 1], enter(p, i)); });
  return cam;
}

/* everything the map and the cards show at scroll progress p; at p = 1 every chapter has played.
   `early` (/home-v2): the route lines draw during Ask instead of Compare. `cams`: the phone cameras */
export function frameAt(p: number, early = false, cams: Cam[] = CAM) {
  const compare = enter(p, 1);
  const negotiate = enter(p, 2);
  const pins = span(p, BEATS.pins);
  // the chat: m counts the messages in (each fades in over the first part of its slot); the deal is agreed
  // once the dealer's last one is in
  const m = span(p, BEATS.chat) * CHAT.length;
  const agreed = clamp((m - (CHAT.length - 1)) / 0.4) === 1;
  const draw = (beat: readonly [number, number]) => DEALERS.slice(0, COMPARED).map((_, i) => smooth(span(p, [beat[0] + 0.012 * i, beat[1] + 0.012 * i])));
  const routes = draw(early ? BEATS.routesEarly : BEATS.routes);

  return {
    chapter: chapterAt(p),
    cam: camAt(p, cams),
    // dealers pop in one by one; the ones out of play fade back: in Compare all but the three you compare,
    // from Negotiate on all but the one in the chat
    pin: DEALERS.map((d, i) => {
      const shown = clamp((pins - (i / DEALERS.length) * 0.7) * 3.5);
      const back = i === WINNER ? 0 : Math.max(d.car === undefined ? compare : 0, negotiate);
      return shown * (1 - 0.68 * back);
    }),
    // the tags: how many cars each has, then the compared cars' prices, then the chat and its outcome
    values: DEALERS.map((d, i) =>
      p < CH[1] || d.car === undefined ? `${d.cars} cars`
        : i === WINNER && p >= CH[2] ? (agreed ? fmtUSD(OTD_FINAL) : "Negotiating")
        : CARS[d.car].price),
    routes,
    routeOp: routes.map((_, i) => (i === WINNER ? 1 : 1 - 0.75 * negotiate)),
    win: span(p, BEATS.approve),
    drive: smooth(span(p, BEATS.drive)),
    // the cards
    type: span(p, BEATS.type),
    reply: span(p, BEATS.reply),
    compare: smooth(span(p, BEATS.compare)),
    messages: m,
    approved: span(p, BEATS.approve),
    booked: span(p, BEATS.booked),
  };
}
export type Frame = ReturnType<typeof frameAt>;
console.assert(
  frameAt(CH[0], true).routes.every((r) => r === 0) && frameAt(CH[1] + 0.01, true).routes.every((r) => r === 1) &&
  frameAt(CH[1] + 0.01).routes.every((r) => r === 0) && frameAt(CH[2]).routes.every((r) => r === 1),
  "howMap: the routes draw within Ask on /home-v2, as Compare opens on /home",
);

/* the finished state of chapter i, for the list version, and the pins its map frames */
export const endOf = (i: number) => (i < CH.length - 1 ? CH[i + 1] - 0.005 : 1);
export const FRAMED: { ids: number[]; you: boolean }[] = [
  { ids: DEALERS.map((_, i) => i), you: true },
  { ids: DEALERS.flatMap((d, i) => (d.car === undefined ? [] : [i])), you: true },
  { ids: [WINNER], you: true },
  { ids: [WINNER], you: true },
];

// self-check: the counts add up to the search; the compared dealers come first (the routes are indexed so) and
// hold the sample cars in order, Riverside's car is the one picked, and the chat ends on the sample deal
console.assert(
  DEALERS.reduce((a, d) => a + d.cars, 0) === MATCHES && MATCHES === 23 &&
  COMPARED === CARS.length && DEALERS.every((d, i) => d.car === undefined ? !d.route : d.car === i && !!d.route) &&
  DEALERS[WINNER].car === PICK && CHAT.length === 4 && CHAT[0].from === "xprt" && CHAT[3].text.includes(fmtUSD(OTD_FINAL)) &&
  chapterAt(0) === -1 && chapterAt(0.4) === 1 && chapterAt(1) === 3 &&
  frameAt(endOf(1)).values[1] === CARS[1].price && frameAt(endOf(2)).values[WINNER] === fmtUSD(OTD_FINAL) && frameAt(0.6).values[WINNER] === "Negotiating",
  "home map numbers",
);

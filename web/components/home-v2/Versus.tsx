"use client";

import { useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { clamp, useScrollFrame } from "@/hooks/useScroll";
import { Icon, Logo } from "../Icons";
import s from "./Versus.module.css";

/* The home page, in place of the first version's offers deck: a short comparison with the usual way (the review's missing "why
   switch"). CarXprt Plus against listing sites, i.e. Cars.com and CarGurus, which come out the same on every
   row (compare-sources.md; rechecked 23 Oct 2026: both now have AI search, Carson and CarGurus Discover, but
   contacting, negotiating and paperwork stay manual, through lead forms). The main difference first: the whole
   thing done by talking to the AI. As the table scrolls past the middle of the screen, the CarXprt column fills
   with lime from the top and each of its marks lights as the fill reaches it. Every row is Plus (the column
   says so) except the person, which is Pro */

type Kind = "yes" | "part" | "no";
const ROWS: { label: string; cx: Kind; plan?: "Pro"; them: Kind; note?: string }[] = [
  { label: "Do all of it just by talking to AI", cx: "yes", them: "part", note: "Search only" },
  { label: "Dynamic fair-price check", cx: "yes", them: "yes" },
  { label: "The full cost to own", cx: "yes", them: "no" },
  { label: "AI that negotiates with the dealer", cx: "yes", them: "no" },
  { label: "Dealers never get your number", cx: "yes", them: "no" },
  { label: "The out-the-door price before you go", cx: "yes", them: "part", note: "Fees, not tax" },
  { label: "A person to run the deal", cx: "yes", plan: "Pro", them: "no" },
];
const SAY: Record<Kind, string> = { yes: "Yes", part: "Partly", no: "Not offered" };
// server render and no JS: filled; the scroll loop takes over (the CSS grid has seven feature rows)
const FULL = { "--fill": 1 } as React.CSSProperties;
console.assert(ROWS.length === 7, "Versus: the grid's rows are set for seven");

function Mark({ kind }: { kind: Kind }) {
  return (
    <span className={`${s.mk} ${s[kind]}`}>
      {kind === "yes" && <Icon name="check" />}
      {kind === "no" && <Icon name="minus" />}
      {kind === "part" && <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="7.5" /><path d="M12 4.5a7.5 7.5 0 0 0 0 15z" /></svg>}
      <span className="sr-only">{SAY[kind]}</span>
    </span>
  );
}

export function Versus() {
  const grid = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // the fill: 0 as the table's top crosses 70% of the screen, 1 as its foot does
  useScrollFrame(({ vh }) => {
    const el = grid.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--fill", reduce ? "1" : clamp((vh * 0.7 - r.top) / r.height).toFixed(4));
  });

  return (
    <section className={`section ${s.versus}`} aria-labelledby="versus-title">
      <div className="wrap">
        <div className={s.head}>
          <h2 className="h2" id="versus-title">Why not just use a listings site?</h2>
          <p className={s.lead}>Listing sites help you find a car, and the rest is forms, calls and haggling. With CarXprt you just talk: it finds the car, works out what it really costs and negotiates the price, and your number stays yours.</p>
        </div>
        <div className={s.grid} ref={grid} role="table" aria-labelledby="versus-title" style={FULL}>
          <i className={s.panel} aria-hidden="true" />
          <div className={s.row} role="row" style={{ "--r": 1 } as React.CSSProperties}>
            <span role="columnheader"><span className="sr-only">Feature</span></span>
            <span role="columnheader" className={s.cxHead}>
              <Logo className={s.logo} />
              <svg className={s.markOnly} viewBox="0 0 15.68 15.68" aria-hidden="true"><use href="#mark" /></svg>
              <span className="sr-only">CarXprt</span>
              <em className={s.headPlan}>Plus</em>
            </span>
            <span role="columnheader" className={s.themHead}>Listing sites<small>Cars.com, CarGurus</small></span>
          </div>
          {ROWS.map((r, i) => (
            <div key={r.label} className={s.row} role="row" style={{ "--r": i + 2, "--t": ((i + 1.5) / (ROWS.length + 1)).toFixed(3) } as React.CSSProperties}>
              <span role="rowheader" className={s.label}>{r.label}</span>
              <span role="cell" className={s.cx}>
                <Mark kind={r.cx} />
                {r.plan && <em className={`${s.side} ${s.plan}`}>{r.plan}</em>}
              </span>
              <span role="cell" className={s.them}><Mark kind={r.them} />{r.note && <small className={s.side}>{r.note}</small>}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

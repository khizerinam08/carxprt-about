"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { BETA_NOTE, PLANS, type Plan } from "@/lib/plans";
import { CARS, OTD_FINAL } from "@/lib/walkthrough";
import { DEALERS, WINNER } from "@/lib/howMap";
import { OWN_TOTAL } from "@/lib/bento";
import { fmtUSD } from "@/lib/problemMath";
import { Icon } from "../Icons";
import s from "./Plans.module.css";

/* The plans, as mailerbot.com's tabbed features: an ink panel on the left lists Free, Plus and Pro, and the
   board on the right (the hero's dot grid) shows what the selected plan gives you. Switching tabs rebuilds the
   board, piece by piece. Prices and features are carxprt.com/pricing's; the pieces reuse the page's sample
   cars, dealers and costs. */

const k = (n: number, span = 3) => ({ "--k": n, gridColumn: `span ${span}` }) as React.CSSProperties;
const dealer = DEALERS[WINNER];

function FreeBoard() {
  return (
    <>
      <div className={`${s.p} ${s.search}`} style={k(0, 6)}><Icon name="search" />Find me a family SUV under $40k</div>
      <div className={`${s.p} ${s.chips}`} style={k(1, 6)}>{["SUV", "Under $40,000", "78701 · 25 mi", "Hybrid"].map((c) => <span key={c}>{c}</span>)}</div>
      {CARS.slice(0, 2).map((car, i) => (
        <div key={car.src} className={`${s.p} ${s.result}`} style={k(2 + i)}>
          <span className={s.thumb}><Image src={car.src} alt="" width={960} height={640} sizes="200px" /></span>
          <b>{car.name}</b><span>{car.price} · {car.miles}</span>
        </div>
      ))}
      {/* Free has limited AI voice and chat, but no identity protection (that's Plus) */}
      <div className={`${s.p} ${s.chat}`} style={k(4, 6)}>
        <span className={s.anon}><Icon name="chat" />AI chat</span>
        <p><b>CarXprt</b> 23 matches near 78701. The hybrid is the closest, 2 mi away.</p>
      </div>
    </>
  );
}

function PlusBoard() {
  return (
    <>
      <div className={`${s.p} ${s.compare}`} style={k(1, 6)}>
        <small>Compare up to 3</small>
        <span>{CARS.map((car) => <span key={car.src} className={s.mini}><Image src={car.src} alt="" width={960} height={640} sizes="80px" /></span>)}</span>
      </div>
      <div className={`${s.p} ${s.owncost}`} style={k(2, 6)}>
        <small>5-year cost to own</small><b>{fmtUSD(OWN_TOTAL)}</b>
        <span className={s.bar}>{[13100, 7400, 6200, 3900].map((v) => <i key={v} style={{ flexGrow: v }} />)}</span>
      </div>
      <div className={`${s.p} ${s.negotiator}`} style={k(3, 4)}>
        <span className={s.bolt}><Icon name="bolt" /></span>
        <span><b>Talking to {dealer.name}</b><small>Out-the-door price, agreed</small></span>
        <b className={s.best}>{fmtUSD(OTD_FINAL)}</b>
      </div>
      <div className={`${s.p} ${s.identity}`} style={k(4, 2)}><Icon name="hat-glasses" />Identity protected</div>
    </>
  );
}

function ProBoard() {
  return (
    <>
      <div className={`${s.p} ${s.advisor}`} style={k(0, 6)}>
        <span className={s.face}><Icon name="user-round" /></span>
        <span><b>Your CarXprt advisor</b><small><i />Running your deal</small></span>
        <span className={s.plusChip}><Icon name="check" />Everything in Plus</span>
      </div>
      <div className={`${s.p} ${s.dealers}`} style={k(1, 6)}>
        <small>Cheaper ones I found nearby</small>
        <ol>
          {[["Hybrid SUV · 2022", 35240], ["Crossover · 2021", 35690]].map(([name, usd], i) => (
            <li key={name} className={i === 0 ? s.win : ""} style={{ "--k": 2 + i } as React.CSSProperties}>
              <span>{name}</span><b>{fmtUSD(usd as number)}</b>
            </li>
          ))}
        </ol>
      </div>
      <p className={`${s.p} ${s.note}`} style={k(6, 6)}>I got {dealer.name} down to {fmtUSD(OTD_FINAL)}, but these two come in even cheaper. Want a look?</p>
    </>
  );
}

const BOARDS: Record<Plan["id"], () => React.JSX.Element> = { free: FreeBoard, plus: PlusBoard, pro: ProBoard };

export function Plans() {
  const [on, setOn] = useState<Plan["id"]>("plus");
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  // arrow keys move between the tabs, as a tab list should
  const onKey = (e: React.KeyboardEvent, i: number) => {
    const d = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const n = (i + d + PLANS.length) % PLANS.length;
    setOn(PLANS[n].id);
    tabs.current[n]?.focus();
  };

  return (
    <section className={s.plans} aria-labelledby="plans-title">
      <div className={s.panel}>
        <div className={s.inner}>
          <h2 className="h2" id="plans-title">Start free. Upgrade when it counts.</h2>
          <p className={s.lead}>Search everything for free. Plus adds the negotiator and the price tools, and Pro hands your deal to a person.</p>
          <div className={s.tabs} role="tablist" aria-label="Plans">
            {PLANS.map((p, i) => (
              <button key={p.id} ref={(el) => { tabs.current[i] = el; }} type="button" role="tab" id={`plan-${p.id}`} aria-selected={p.id === on}
                aria-controls={`panel-${p.id}`} tabIndex={p.id === on ? 0 : -1} className={s.tab} onClick={() => setOn(p.id)} onKeyDown={(e) => onKey(e, i)}>
                <span className={s.tabName}>{p.name}{p.popular && <small className={s.popular}>Most popular</small>}</span>
                <span className={s.tabPrice}><b>{p.price}</b> {p.per}</span>
              </button>
            ))}
          </div>
          {/* all three panels share one cell, so the section keeps the tallest one's height whichever is shown */}
          <div className={s.details}>
            {PLANS.map((p) => (
              <div key={p.id} className={`${s.detail} ${p.id === on ? s.shown : ""}`} role="tabpanel" id={`panel-${p.id}`} aria-labelledby={`plan-${p.id}`} hidden={p.id !== on}>
                <p className={s.line}>{p.line}</p>
                <ul className={s.features}>
                  {p.features.map((f) => <li key={f.text}><Icon name="check" />{f.text}{f.beta && <sup>*</sup>}</li>)}
                </ul>
                <Link className={`btn ${p.id === "plus" ? "btn-lime" : s.ghost}`} href={`/pricing?plan=${p.id}`}>{p.cta}<Icon name="arrow" /></Link>
                <p className={s.beta}>* {BETA_NOTE}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* the three boards share one cell too (a steady height); the shown one rebuilds each time it's picked */}
      <div className={s.board} data-ui="" aria-hidden="true">
        {PLANS.map((p) => {
          const Board = BOARDS[p.id];
          return <div key={p.id} className={`${s.pieces} ${p.id === on ? s.current : ""}`}><Board /></div>;
        })}
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { PLANS, type Plan } from "@/lib/plans";
import { CARS, OTD_FINAL, OTD_FIRST, PROMPT } from "@/lib/walkthrough";
import { DEALERS, MATCHES, WINNER } from "@/lib/howMap";
import { fmtUSD } from "@/lib/problemMath";
import { ChatBar } from "../ChatBar";
import { Icon } from "../Icons";
import { CompareCard, NegotiateCard } from "../home/HowCards";
import s from "./Plans.module.css";

/* home-v2: light, one rounded card (no ink panel); the styles say how.
   The plans, as mailerbot.com's tabbed features: a panel on the left lists Free, Plus and Pro, and the
   board on the right (the hero's dot grid) shows what the selected plan gives you. Switching tabs rebuilds the
   board, piece by piece. The boards add no new visuals: they're made of pieces the visitor has already met
   (the user asked for few, familiar pieces over new ones in every section):
   - Free: the hero's search bar, and the results under it (the walkthrough's car row, no pick)
   - Plus: the same row with the AI's best fit, and the walkthrough's negotiator chat, its last two lines
   - Pro: a fuller chat with your advisor (a person at CarXprt, not the dealer): the agreed price, two cheaper
     finds nearby, your question and its answer, the message bar. The user preferred it to a trimmed one */

const k = (n: number, col: string) => ({ "--k": n, gridColumn: col }) as React.CSSProperties;

const kk = (n: number) => ({ "--k": n }) as React.CSSProperties;
const dealer = DEALERS[WINNER].name.split(" ")[0];

/* Pro: what the advisor turns up after the deal is agreed, both under it (sample listings; the photos are
   the sample cars', mirrored) */
const CHEAPER = [
  { src: CARS[0].src, name: "Hybrid SUV · 2022", meta: `${DEALERS[5].name} · 31,200 mi`, otd: 35240 },
  { src: CARS[1].src, name: "Family SUV · 2021", meta: `${DEALERS[4].name} · 27,900 mi`, otd: 35690 },
];
console.assert(CHEAPER.every((c) => c.otd < OTD_FINAL), "plans: the advisor's finds are cheaper");

function FreeBoard() {
  return (
    <>
      <div className={s.p} style={k(0, "1 / -1")}><ChatBar typed={PROMPT} /></div>
      <div className={s.p} style={k(1, "1 / -1")}><CompareCard title={`${MATCHES} matches`} pick={false} /></div>
    </>
  );
}

function PlusBoard() {
  return (
    <>
      <div className={s.p} style={k(0, "1 / span 5")}><CompareCard /></div>
      <div className={s.p} style={k(1, "2 / -1")}><NegotiateCard from={2} /></div>
    </>
  );
}

/* Pro (the user preferred this fuller version): the advisor's chat, the messages arriving one by one */
function ProBoard() {
  return (
    <div className={`${s.p} ${s.proChat}`} style={k(0, "1 / -1")}>
      <p className={s.proHead}>
        <span className={s.face}><Icon name="user-round" /></span>
        <span><b>Your CarXprt advisor</b><small><i />Online now</small></span>
        <span className={s.proChip}>Pro</span>
      </p>
      <ol className={s.proMsgs}>
        <li className={s.fromA} style={kk(1)}>Done. {dealer} agreed to <b>{fmtUSD(OTD_FINAL)}</b> out the door on the {CARS[0].name}, {fmtUSD(OTD_FIRST - OTD_FINAL)} under their first quote.</li>
        <li className={s.fromA} style={kk(2)}>
          Before you sign: I found two more nearby that come in even cheaper.
          <span className={s.finds}>
            {CHEAPER.map((c) => (
              <span key={c.name} className={s.find}>
                <span className={s.findPic}><Image src={c.src} alt="" width={960} height={640} sizes="64px" /></span>
                <span className={s.findText}><b>{c.name}</b><small>{c.meta}</small></span>
                <em>{fmtUSD(c.otd)}</em>
              </span>
            ))}
          </span>
        </li>
        <li className={s.fromYou} style={kk(3)}>Is the 2022 hybrid as good?</li>
        <li className={s.fromA} style={kk(4)}>Same trim, one owner, clean history. I’ll hold {dealer}’s price while you test-drive it on Saturday.</li>
      </ol>
      <p className={s.composer} style={kk(5)}>Message your advisor<span><Icon name="arrow" /></span></p>
    </div>
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
          <p className={s.lead}>Search for free. Plus adds the AI comparison and the Xprt Negotiator; Pro hands your deal to a person.</p>
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
                <ul className={s.features}>
                  {p.features.map((f) => (
                    <li key={f.text}><span className={s.fIcon}><Icon name={f.icon} /></span>{f.text}</li>
                  ))}
                </ul>
                <Link className={`${s.ctaBtn} ${s[p.id]}`} href={`/pricing?plan=${p.id}`}>
                  {p.cta}<span className={s.ctaArrow}><Icon name="arrow" /></span>
                </Link>
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

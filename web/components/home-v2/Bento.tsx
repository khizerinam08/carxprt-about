"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { BEST, CELLS, COMPARE } from "@/lib/bento";
import { OTD_FINAL, OTD_FIRST, QUOTE } from "@/lib/walkthrough";
import { fmtUSD } from "@/lib/problemMath";
import { Icon } from "../Icons";
import { BentoCell } from "../home/Bento";
import s from "./Bento.module.css";

/* home-v2 bento, as the user laid it out in Figma (CarXprt-Redesign 1103:3095): a row of four tilted cards
   (the "chaos" reference): ~14 hrs, a drive, ~$2,500, a lone car in its bay. Then the grid:
   - Talk to it and Your number stays yours: /home's own cells (BentoCell), their pieces assembling on view
   - Compare up to three, two columns wide under them, with its Price / 5-year cost / Reliability switch
   - a tall cell on the right: a dealer's quote, uploaded and picked apart (the sample deal's own lines)
   The boards' dots are at 12% here (--board-dot), as in the Figma. */

const METRICS = [
  { id: "price", name: "Price", value: (i: number) => COMPARE[i].car.price },
  { id: "own", name: "5-year cost", value: (i: number) => fmtUSD(COMPARE[i].own) },
  { id: "rel", name: "Reliability", value: (i: number) => `${COMPARE[i].reliability.toFixed(1)} / 5` },
];
const cell = (id: string) => CELLS.find((c) => c.id === id)!;

/* the quote: the first offer's lines, then what negotiating did to them (lib/walkthrough's sample deal: the
   vehicle's price comes down, with its tax, and the add-on goes; the doc fee stays) */
const [VEHICLE, TAX, REG, DOC, PACKAGE] = QUOTE;
const d = (n: number) => ({ "--d": n }) as React.CSSProperties;
console.assert(DOC[1] === DOC[2] && REG[1] === REG[2] && PACKAGE[2] === 0 && VEHICLE[2] < VEHICLE[1], "bento quote: only the price, its tax and the add-on change");

/* Your number stays yours: the choice made before the negotiator writes to a dealer, as the user drew it in
   Figma (CarXprt-Redesign 1138:2239: the two choices and Confirm). Its icons are that frame's */
function Anon() {
  return (
    <div className={s.anon}>
      <div className={`${s.aIn} ${s.aOpt} ${s.aOn}`} style={d(0)}>
        <span className={s.aIcon}><Image src="/home/icon-hat-glasses.svg" alt="" width={22} height={22} /></span>
        <span className={s.aText}><b>Stay Anonymous</b><small>Dealership sees only name, ZIP Code and Deal ID</small></span>
        <span className={s.aTick}><Image src="/home/icon-check.svg" alt="" width={14} height={14} /></span>
      </div>
      <div className={`${s.aIn} ${s.aOpt}`} style={d(1)}>
        <span className={`${s.aIcon} ${s.aLime}`}><Image src="/home/icon-share-info.svg" alt="" width={24} height={24} /></span>
        <span className={s.aText}><b>Share My Info</b><small>Dealership can see and use contact details to reach out</small></span>
        <span className={s.aRadio} />
      </div>
      <span className={`${s.aIn} ${s.aConfirm}`} style={d(2)}>Confirm</span>
    </div>
  );
}

function Compare() {
  const [m, setM] = useState(0);
  const metric = METRICS[m];
  return (
    <article className={`${s.card} ${s.compare}`}>
      <div className={s.compareText}>
        <h3>Compare up to three</h3>
        <p>Price, cost to own and reliability side by side, with the trade-offs spelled out.</p>
      </div>
      <div className={s.cars} data-ui="" aria-hidden="true">
        {COMPARE.map((c, i) => (
          <figure key={c.car.src} className={i === BEST ? s.best : ""}>
            <Image src={c.car.src} alt="" width={960} height={640} sizes="260px" />
            <figcaption><span>{c.car.name}</span><b key={metric.id}>{metric.value(i)}</b></figcaption>
          </figure>
        ))}
      </div>
      <div className={s.segment} role="radiogroup" aria-label="Compare by">
        {METRICS.map((x, i) => (
          <button key={x.id} type="button" role="radio" aria-checked={i === m} onClick={() => setM(i)}>{x.name}</button>
        ))}
      </div>
    </article>
  );
}

/* the tall cell: the uploaded quote lands, its lines come in, then the padding is struck out and the total
   drops (on first view, like the other boards). The words are in the cell's text */
function Quote() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting && e.intersectionRatio >= 0.15) el.setAttribute("data-in", ""); }, { threshold: [0, 0.15] });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const q = cell("quote");
  return (
    <article ref={ref} className={`${s.card} ${s.quote}`}>
      <div className={s.qBoard} data-ui="" aria-hidden="true">
        {/* a photo of the quote, attached, and the validator's tick */}
        <span className={`${s.in} ${s.upload}`} style={d(0)}>
          <i className={s.photo}><i /><i /><i /></i>riverside-quote.jpg<b><Icon name="check" />Validated</b>
        </span>
        <div className={`${s.in} ${s.receipt}`} style={d(1)}>
          <div className={s.rBody}>
            <p className={s.rHead}><Icon name="doc" />Dealer quote · Riverside Auto</p>
            <p className={s.rSub}>Hybrid SUV · first offer</p>
            <ul className={s.rLines}>
              <li className={s.in} style={d(2)}>
                <span>{VEHICLE[0]} <em className={`${s.chip} ${s.limeChip} ${s.late}`}>Negotiated</em></span>
                <span><s className={s.strike}>{fmtUSD(VEHICLE[1])}</s> <b className={s.late}>{fmtUSD(VEHICLE[2])}</b></span>
              </li>
              <li className={s.in} style={d(3)}>
                <span>{TAX[0]}</span>
                <span><s className={s.strike}>{fmtUSD(TAX[1])}</s> <b className={s.late}>{fmtUSD(TAX[2])}</b></span>
              </li>
              <li className={s.in} style={d(4)}><span>{REG[0]}</span><span>{fmtUSD(REG[1])}</span></li>
              <li className={s.in} style={d(5)}><span>{DOC[0]}</span><span>{fmtUSD(DOC[1])}</span></li>
              <li className={`${s.in} ${s.gone}`} style={d(6)}>
                <span><s className={s.strike}>{PACKAGE[0]}</s> <em className={`${s.chip} ${s.inkChip} ${s.late}`}>Removed</em></span>
                <span><s className={s.strike}>{fmtUSD(PACKAGE[1])}</s></span>
              </li>
            </ul>
            <div className={`${s.in} ${s.rTotal}`} style={d(7)}>
              <span>Out the door</span>
              <span className={s.totals}><s className={s.strike}>{fmtUSD(OTD_FIRST)}</s><b className={s.late}>{fmtUSD(OTD_FINAL)}</b></span>
            </div>
            <p className={`${s.saved} ${s.late}`}><em className={`${s.chip} ${s.savedChip}`}>−{fmtUSD(OTD_FIRST - OTD_FINAL)} from the first quote</em></p>
          </div>
          <svg className={s.torn} viewBox="0 0 292 7" preserveAspectRatio="none">
            <path d={`M0 0${Array.from({ length: 25 }, (_, i) => ` L${i * 12 + 6} 7 L${Math.min(i * 12 + 12, 292)} 0`).join("")} Z`} />
          </svg>
        </div>
      </div>
      <div className={s.qText}>
        <h3>{q.head}</h3>
        <p>{q.body}</p>
        {q.note && <p className={s.note}>{q.note}</p>}
      </div>
    </article>
  );
}

export function Bento() {
  const ref = useRef<HTMLElement>(null);
  const [on, setOn] = useState(false);
  // the proof cards tip into place when the section comes into view
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting), { rootMargin: "0px 0px -10% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} className={`section ${s.bento}`} data-on={on ? "" : undefined} aria-labelledby="bento-title">
      <div className="wrap">
        <div className={s.head}>
          <h2 className="h2" id="bento-title">Everything else it does.</h2>
          <p className={s.lead}>The tools that take on the slow parts of buying a car, so all that’s left for you is the decisions.</p>
        </div>

        {/* the figures, as tilted cards between two pictures (the user's Figma) */}
        <ul className={s.proof}>
          <li className={s.stat}>
            <b>~14 hrs</b>
            <span className={s.statFoot}><span className={s.statLabel}>Time Saved</span><span className={s.statLine}>From research, dealer calls and showroom waits on a typical purchase.</span></span>
          </li>
          <li className={s.pic}>
            <Image src="/home/proof-drive.jpg" alt="Driving a new car along a lakeside road" fill sizes="250px" />
            <span className={s.tag}>Test drive booked</span>
          </li>
          <li className={`${s.stat} ${s.lime}`}>
            <b>~$2,500</b>
            <span className={s.statFoot}><span className={s.statLabel}>Money Saved</span><span className={s.statLine}>From a price talked down, add-ons dropped and incentives you’d have missed.</span></span>
          </li>
          <li className={s.pic}>
            <Image src="/home/proof-park.jpg" alt="A silver car alone in a parking bay, seen from above" fill sizes="250px" />
            <span className={s.tag}>Fair price, checked</span>
          </li>
        </ul>

        <div className={s.grid}>
          <BentoCell c={cell("voice")} i={0} />
          <BentoCell c={cell("private")} i={1} piece={Anon} />
          <Quote />
          <Compare />
        </div>
      </div>
    </section>
  );
}

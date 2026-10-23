"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { ADVISOR, BEST, CELLS, COMPARE, INBOX, OWN, OWN_TOTAL, QUOTE_LINES, VOICE, type Cell } from "@/lib/bento";
import { OTD_FIRST } from "@/lib/walkthrough";
import { fmtUSD } from "@/lib/problemMath";
import { Icon } from "../Icons";
import s from "./Bento.module.css";

/* Everything else CarXprt does, as a bento (wafer.ai's feature grid): three cells, one wide cell, two cells.
   Each cell has a board (the hero's dot grid) where its product piece builds itself the first time the cell
   comes into view, piece by piece, the way mailerbot.com's features assemble on their grid; a few keep a
   quiet loop going while they're on screen. The pieces are inert pictures of the product (data-ui, hidden
   from assistive tech); each cell's heading and text carry the words. */

/* --k: the order a piece lands in */
const k = (n: number) => ({ "--k": n }) as React.CSSProperties;

function Voice() {
  return (
    <div className={s.voice}>
      <span className={`${s.p} ${s.listen}`} style={k(0)}>
        <span className={s.bars}>{[0, 1, 2, 3, 4, 5, 6].map((b) => <i key={b} style={{ "--b": b } as React.CSSProperties} />)}</span>
        Listening
      </span>
      <p className={`${s.p} ${s.said}`} style={k(1)}>“{VOICE.said}”</p>
      <span className={`${s.p} ${s.result}`} style={k(2)}><Icon name="arrow" />{VOICE.result}</span>
    </div>
  );
}

function Compare() {
  return (
    <div className={s.compare}>
      {COMPARE.map((c, i) => (
        <div key={c.car.src} className={`${s.p} ${s.col} ${i === BEST ? s.best : ""}`} style={k(i)}>
          <span className={s.thumb}><Image src={c.car.src} alt="" width={960} height={640} sizes="96px" /></span>
          <b className={s.colName}>{c.car.name}</b>
          <span className={`${s.p} ${s.val}`} style={k(3 + i)}><small>Price</small>{c.car.price}</span>
          <span className={`${s.p} ${s.val}`} style={k(6 + i)}><small>5-yr cost</small>{fmtUSD(c.own)}</span>
          <span className={`${s.p} ${s.val}`} style={k(9 + i)}><small>Reliability</small>{c.reliability.toFixed(1)} / 5</span>
        </div>
      ))}
    </div>
  );
}

function Private() {
  return (
    <div className={s.private}>
      <span className={`${s.p} ${s.hidden}`} style={k(0)}><Icon name="hat-glasses" />Your number: hidden</span>
      <ul className={s.inbox}>
        {INBOX.map((m, i) => (
          <li key={m.from} className={`${s.p} ${m.kept ? "" : s.filtered}`} style={k(1 + i)}>
            <span className={s.from}>{m.from}</span>
            <span className={s.msg}>{m.text}</span>
            {!m.kept && <b className={s.tag}>Filtered</b>}
          </li>
        ))}
      </ul>
      <span className={`${s.p} ${s.typing}`} style={k(4)}>Riverside Auto is typing<i /><i /><i /></span>
    </div>
  );
}

function Cost() {
  return (
    <div className={s.cost}>
      <div className={`${s.p} ${s.sticker}`} style={k(0)}>
        <small>Sticker</small><b>{OWN.price}</b>
      </div>
      <div className={s.own}>
        <p className={`${s.p} ${s.ownHead}`} style={k(1)}><small>5-year cost to own</small><b>{fmtUSD(OWN_TOTAL)}</b></p>
        <div className={s.stack}>
          {OWN.parts.map((part, i) => (
            <span key={part.label} className={s.seg} style={{ ...k(2 + i), flexGrow: part.usd }}>
              <b>{fmtUSD(part.usd)}</b>{part.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Quote() {
  return (
    <div className={s.quote}>
      <div className={`${s.p} ${s.doc}`} style={k(0)}>
        <p className={s.docHead}><Icon name="doc" />Dealer quote · Riverside Auto</p>
        <ul>
          {QUOTE_LINES.map((l, i) => (
            <li key={l.label} className={s.p} style={k(1 + i)}>
              <span>{l.label}</span>
              {l.flag && <b className={`${s.p} ${s.flag}`} style={k(7 + i)}>{l.flag}</b>}
              <span className={s.usd}>{fmtUSD(l.usd)}</span>
            </li>
          ))}
          <li className={`${s.p} ${s.total}`} style={k(6)}><span>Out the door</span><span className={s.usd}>{fmtUSD(OTD_FIRST)}</span></li>
        </ul>
      </div>
      <span className={`${s.p} ${s.sent}`} style={k(12)}><Icon name="bolt" />Sent to the Xprt Negotiator</span>
    </div>
  );
}

function Advisor() {
  return (
    <div className={s.advisor}>
      <div className={`${s.p} ${s.person}`} style={k(0)}>
        <span className={s.face}><Icon name="user-round" /></span>
        <span className={s.who}><b>Your CarXprt advisor</b><small><i />{ADVISOR.status}</small></span>
      </div>
      <p className={`${s.p} ${s.bubble}`} style={k(1)}>{ADVISOR.text}</p>
      <span className={`${s.p} ${s.reply}`} style={k(2)}>Yes, go ahead</span>
    </div>
  );
}

const PIECES: Record<string, () => React.JSX.Element> = { voice: Voice, compare: Compare, private: Private, cost: Cost, quote: Quote, advisor: Advisor };

/* data-in: set once, when the cell first comes into view (the piece assembles); data-live: while it's on
   screen (the loops run). Exported for /home-v2's bento, which places its own grid around it and can bring
   its own `piece` */
export function BentoCell({ c, i, piece }: { c: Cell; i: number; piece?: () => React.JSX.Element }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      el.toggleAttribute("data-live", e.isIntersecting);
      // early enough that a row resting at the bottom of the screen never sits there empty
      if (e.isIntersecting && e.intersectionRatio >= 0.15) el.setAttribute("data-in", "");
    }, { threshold: [0, 0.15] });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const Piece = piece ?? PIECES[c.id];
  return (
    <article ref={ref} className={`${s.cell} ${c.wide ? s.wide : ""}`} style={{ "--c": i } as React.CSSProperties}>
      <div className={s.board} data-ui="" aria-hidden="true"><Piece /></div>
      <div className={s.text}>
        <h3>{c.head}</h3>
        <p>{c.body}</p>
        {c.note && <p className={s.note}>{c.note}</p>}
      </div>
    </article>
  );
}

export function Bento() {
  return (
    <section className={`section ${s.bento}`} aria-labelledby="bento-title">
      <div className="wrap">
        <div className={s.head}>
          <h2 className="h2" id="bento-title">Everything else it does.</h2>
          <p className={s.lead}>The tools that take on the slow parts of buying a car, so all that’s left for you is the decisions.</p>
        </div>
        <div className={s.grid}>
          {CELLS.map((c, i) => <BentoCell key={c.id} c={c} i={i} />)}
        </div>
      </div>
    </section>
  );
}

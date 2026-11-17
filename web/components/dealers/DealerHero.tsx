"use client";

import Image from "next/image";
import { BRIEF, HERO } from "@/lib/dealers";
import { Icon } from "../Icons";
import s from "./DealerHero.module.css";

/* The dealer page's hero: the home hero's centred words on its dotted ground, then the dealer dashboard's
   Xprt Assistant answering "What are my leads for today?" (the live dealer page's own example, with the home
   page's cars). The messages arrive once on load (--k staggers them); the chat is a picture of the product */
export function DealerHero() {
  const k = (n: number) => ({ "--k": n }) as React.CSSProperties;
  return (
    <section className={s.hero} aria-labelledby="dealer-title">
      <div className={s.copy}>
        <p className={s.kicker}>CarXprt for dealerships</p>
        <h1 className={s.title} id="dealer-title">{HERO.head.map((l) => <span key={l}>{l}</span>)}</h1>
        <p className={s.sub}>{HERO.lead}</p>
        <div className={s.ctas}>
          <a className="btn btn-lime" href="#demo">Book a demo</a>
          <a className={`btn ${s.outline}`} href="#how-it-works">See how it works</a>
        </div>
      </div>

      <div className={s.window} data-ui="" aria-hidden="true">
        <p className={s.bar}>
          <span className={s.avatar}><svg viewBox="0 0 15.68 15.68"><use href="#mark" /></svg></span>
          <b>Xprt Assistant</b>
          <span className={s.where}>Dealer dashboard</span>
        </p>
        <ol className={s.msgs}>
          <li className={s.mine} style={k(0)}>{BRIEF.ask}</li>
          <li className={s.status} style={k(1)}><Icon name="check" />{BRIEF.checked}</li>
          <li className={s.theirs} style={k(2)}>
            <p>{BRIEF.answer}</p>
            <ul className={s.leads}>
              {BRIEF.leads.map((l) => (
                <li key={l.car.src}>
                  <span className={s.thumb}><Image src={l.car.src} alt="" width={960} height={640} sizes="48px" /></span>
                  <span className={s.who}><b>{l.car.name} · {l.car.price}</b><small>{l.line}</small></span>
                  <em className={l.chip === "Hot" ? s.hot : s.new}>{l.chip}</em>
                </li>
              ))}
            </ul>
          </li>
          <li className={s.mine} style={k(3)}>{BRIEF.follow}</li>
          <li className={s.theirs} style={k(4)}><p>{BRIEF.done}</p></li>
        </ol>
        <p className={s.ask}><span>Ask anything…</span><span className={s.send}><Icon name="arrow-up" /></span></p>
      </div>
    </section>
  );
}

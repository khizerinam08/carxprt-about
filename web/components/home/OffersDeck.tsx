"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { clamp, useScrollFrame } from "@/hooks/useScroll";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { CASH_OFFERS, type CashOffer } from "@/lib/offers";
import { fmtUSD } from "@/lib/problemMath";
import { Icon } from "../Icons";
import s from "./OffersDeck.module.css";

/* This week's cash offers as a deck (extrafazant.nl's "Recent werk"): a pinned stage where each offer card
   slides up and lands on the stack, and the cards underneath step back with their top edges showing. Each card
   is the redesign's Cashback Card (Figma 990:2132) at deck size. Reduced motion and short screens get the
   cards as a plain list. */

const PIN = "(min-height: 600px)";
const N = CASH_OFFERS.length;
const smooth = (t: number) => t * t * (3 - 2 * t);
/* how far through the pinned scroll each card has landed; the first is down from the start, and the last
   lands with a little scroll to spare so it can be read */
const landed = (p: number, i: number) => (i === 0 ? 1 : smooth(clamp((p * 1.1 - (i - 1) / (N - 1)) * (N - 1))));

function OfferCard({ o, i, depth }: { o: CashOffer; i: number; depth: number }) {
  return (
    <article className={s.card} data-ui="" style={{ "--d": depth, "--tilt": `${i % 2 ? -3 : 3}deg` } as React.CSSProperties}>
      <div className={s.media}>
        {/* eager: the cards wait off-stage and slide in, so they must already be loaded when they arrive */}
        <Image src={o.photo} alt={o.alt} width={768} height={1376} sizes="(max-width: 720px) 100vw, 480px" loading="eager" />
        <span className={s.expiry}><Icon name="clock" />Expires in {o.expiresIn} days</span>
        <span className={s.index}>{String(i + 1).padStart(2, "0")}</span>
      </div>
      <div className={s.body}>
        <p className={s.title}><span>{o.model}</span><b className={s.pill}>Cash</b></p>
        <div className={s.value}>
          <p className={s.amount}><b>{fmtUSD(o.amount)}</b>back</p>
          <p className={s.terms}>Customer cash · applied at purchase</p>
        </div>
        <p className={s.valid}>Valid on cash purchase</p>
        <div className={s.source}>
          <span className={s.avatar}>{o.initials}</span>
          <span className={s.brand}><b>{o.brand}</b><small>Manufacturer</small></span>
          <span className={s.pin} aria-hidden="true"><Icon name="map-pin" /></span>
        </div>
      </div>
    </article>
  );
}

function Head() {
  return (
    <div className={s.head}>
      <h2 className="h2" id="offers-title">Cash back, straight off the price.</h2>
      <p className={s.lead}>This week’s manufacturer cash offers, taken off the price when you buy outright. No loan, no interest.</p>
    </div>
  );
}

export function OffersDeck() {
  const root = useRef<HTMLElement>(null);
  const deck = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const mq = matchMedia(PIN);
    const on = () => setLive(mq.matches && !reduce);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [reduce]);

  useEffect(() => { if (live) dispatchEvent(new Event("scroll")); }, [live]);

  useScrollFrame(({ vh }) => {
    const el = root.current;
    if (!live || !el || !deck.current) return;
    const r = el.getBoundingClientRect();
    const p = clamp(-r.top / (r.height - vh));
    const y = CASH_OFFERS.map((_, i) => landed(p, i));
    [...deck.current.children].forEach((card, i) => {
      // a card steps back once for every card that has landed on top of it
      const d = y.slice(i + 1).reduce((a, v) => a + v, 0);
      (card as HTMLElement).style.setProperty("--y", y[i].toFixed(4));
      (card as HTMLElement).style.setProperty("--d", d.toFixed(4));
      // once a card is fully under the next one, its words are hidden rather than lying under it
      card.toggleAttribute("data-under", d > 0.98);
    });
  });

  return (
    <section ref={root} id="offers" className={`${s.offers} ${live ? s.live : s.rest}`} aria-labelledby="offers-title" style={{ "--n": N } as React.CSSProperties}>
      <div className={s.stage}>
        <Head />
        {live && (
          <ul className="sr-only">
            {CASH_OFFERS.map((o) => (
              <li key={o.model}>{o.model}: {fmtUSD(o.amount)} cash back from {o.brand}, customer cash applied at purchase, valid on a cash purchase, expires in {o.expiresIn} days.</li>
            ))}
          </ul>
        )}
        <div className={s.deck} ref={deck} aria-hidden={live || undefined}>
          {CASH_OFFERS.map((o, i) => <OfferCard key={o.model} o={o} i={i} depth={N - 1 - i} />)}
        </div>
        <Link className={`btn btn-lime ${s.cta}`} href="/offers">See all cash offers<Icon name="arrow" /></Link>
      </div>
    </section>
  );
}

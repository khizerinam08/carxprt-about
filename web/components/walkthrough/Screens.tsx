"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { CarCard } from "../CarCard";
import { ChatBar } from "../ChatBar";
import { Icon } from "../Icons";
import { CARS, FILTERS, FOUND, OTD_FINAL, OTD_FIRST, PICK, PROMPT, REPLY, SUGGESTED, THREAD } from "@/lib/walkthrough";
import { fmtUSD } from "@/lib/problemMath";
import u from "./Screens.module.css";

/* Crops of the product's own screens, one per step. Each is an inert picture of the interface
   (data-ui, hidden from assistive tech; the step list carries the words). Every moving part reads a
   CSS variable from the walkthrough (--r, --c, --d, --k, --v, --sv) that defaults to 1, the finished state. */

/* the CarXprt mark from the logo, used as the assistant's avatar */
export function Mark({ className = "" }: { className?: string }) {
  return <svg className={className} viewBox="0 0 28 28" aria-hidden="true"><use href="#logo" width="130" height="28" /></svg>;
}

/* Figma 239:57778, only the chat card: the prompt, then CarXprt's reply where the suggestions were */
export function AskScreen({ textRef, caret = false }: { textRef?: React.Ref<HTMLSpanElement>; caret?: boolean }) {
  return (
    <div className={`${u.screen} ${u.ask}`} data-ui="" aria-hidden="true">
      <ChatBar typed={PROMPT} placeholder={PROMPT} caret={caret} textRef={textRef} sending />
      <div className={u.after}>
        <div className={u.suggest}>
          <p className={u.label}>Suggested searches</p>
          <ul>{SUGGESTED.map((q) => <li key={q}><Icon name="search" />{q}</li>)}</ul>
        </div>
        <div className={u.reply}>
          <div className={u.said}>
            <span className={u.avatar}><Mark /></span>
            <p className={u.bubble}>{REPLY}</p>
          </div>
          <ul className={u.peek}>
            {CARS.map((car) => (
              <li key={car.src}>
                <Image src={car.src} alt="" width={960} height={640} sizes="120px" />
                <span><b>{car.price}</b>{car.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* Figma 359:4011, only the results bar and the three cards; the pick is saved to the Garage.
   Each card is laid out at its drawn width and zoomed to fit three across, so it stays the Figma card. */
const CARD_W = 304.75;

export function HubScreen() {
  const cards = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = cards.current;
    if (!el) return;
    const fit = () => {
      const slot = el.firstElementChild as HTMLElement | null;
      if (slot?.clientWidth) el.style.setProperty("--z", (slot.clientWidth / CARD_W).toFixed(4));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div className={`${u.screen} ${u.hub}`} data-ui="" aria-hidden="true">
      <div className={u.bar}>
        <b className={u.found}>{FOUND}</b>
        <ul className={u.chips}>
          {FILTERS.map((f, i) => <li key={f} style={{ "--i": i } as React.CSSProperties}>{f}<Icon name="x" /></li>)}
        </ul>
      </div>
      <div className={u.cards} ref={cards}>
        {CARS.map((car, i) => (
          <div key={car.src} className={`${u.slot} ${i === PICK ? u.pick : ""}`} style={{ "--i": i } as React.CSSProperties}>
            <CarCard car={car} rank={i + 1} saved={i === PICK} sizes="304px" />
          </div>
        ))}
      </div>
      <p className={u.toast}><Icon name="bookmark" />Saved to your Garage</p>
    </div>
  );
}

/* Figma 812:12632, the deal page's chat panel on the Negotiator tab, with the quote it is working on */
export function DealScreen({ listRef, priceRef }: { listRef?: React.Ref<HTMLOListElement>; priceRef?: React.Ref<HTMLElement> }) {
  const car = CARS[PICK];
  return (
    <div className={`${u.screen} ${u.deal}`} data-ui="" aria-hidden="true">
      <div className={u.tabs}>
        <span><Icon name="chat" />Chat</span>
        <span><Icon name="quote" />Quotes &amp; Docs</span>
        <span className={u.tabOn}><Icon name="bolt" />Negotiator</span>
      </div>
      <div className={u.head}>
        <span className={u.thumb}><Image src={car.src} alt="" width={960} height={640} sizes="48px" /></span>
        <span className={u.who}><b>{car.name}</b><small>Dealer in {car.location} · Deal ID 4471</small></span>
        <span className={u.otd}><small>Out the door</small><b ref={priceRef}>{fmtUSD(OTD_FINAL)}</b></span>
        <span className={u.saved}>−{fmtUSD(OTD_FIRST - OTD_FINAL)}</span>
      </div>
      <div className={u.thread}>
        <ol className={u.msgs} ref={listRef}>
          {THREAD.map((m, i) => (
            <li key={i} className={`${u.msg} ${m.from === "xprt" ? u.mine : u.theirs}`}>
              {m.from === "dealer" && <span className={u.rep}>SR</span>}
              <p>{m.text}</p>
              {m.from === "xprt" && <span className={u.bolt}><Icon name="bolt" /></span>}
            </li>
          ))}
        </ol>
      </div>
      <div className={u.composer}>
        <span className={u.hint}>Send a message…</span>
        <div className={u.tools}>
          <Icon name="plus" />
          <span className={u.private}><Icon name="hat-glasses" />Info: Private</span>
          <span className={u.xprt}><Icon name="bolt" />Xprt Negotiator</span>
          <span className={u.send}><Icon name="up" /></span>
        </div>
      </div>
    </div>
  );
}

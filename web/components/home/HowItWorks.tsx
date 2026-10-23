"use client";

import { useEffect, useRef, useState } from "react";
import { clamp, useScrollFrame } from "@/hooks/useScroll";
import { useInView } from "@/hooks/useInView";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { CAM, CAM_PHONE, CH, CHAPTERS, FRAMED, TITLE, endOf, frameAt, type Chapter } from "@/lib/howMap";
import { PROMPT } from "@/lib/walkthrough";
import { Icon } from "../Icons";
import { DealerMap, type MapHandle } from "./DealerMap";
import { AskCard, ApproveCard, CompareCard, NegotiateCard } from "./HowCards";
import s from "./HowItWorks.module.css";

/* How it works on the home page (townhouse.dev's walkthrough): one pinned stage over a map of the dealers
   around the buyer's ZIP. The camera moves to a new spot for each chapter (Ask, Compare, Negotiate,
   Approve); the chapter's words sit bottom left, the product card floats over the map, and the chapter
   list on the right jumps between them. Phones get the same pinned stage, stacked: progress bars and the
   words at the top, the card at the foot, the map between with cameras of its own. Tablets, short screens
   and reduced motion get the same chapters as a list, each with its map and card at the finished state. */

const PIN = "(min-width: 1200px) and (min-height: 700px)";
const PIN_PHONE = "(max-width: 720px) and (min-height: 600px)";
const CARDS = [AskCard, CompareCard, NegotiateCard, ApproveCard];
const EMPTY = "Describe the car you want";
/* where the camera's point lands in the stage (lib/howMap's cameras are found for these anchors) */
const ANCHOR = [0.5, 0.4] as const;
const ANCHOR_PHONE = [0.5, 0.45] as const;

function Copy({ c, i }: { c: Chapter; i: number }) {
  return (
    <div className={s.chap} data-c={i}>
      <h3>{c.head}</h3>
      <p>{c.body}</p>
      {c.note && <p className={s.note}>{c.note}</p>}
    </div>
  );
}

function Title() {
  return <h2 className="h2" id="how-title">{TITLE.head.map((l) => <span key={l} className={s.line}>{l}</span>)}</h2>;
}

/* one chapter of the list version: its words, then its map as the chapter ends, with the card under it.
   The map frames the chapter's pins itself, clear of the card's overlap; on phones the other dealers are dots */
function RestChapter({ c, i, early }: { c: Chapter; i: number; early: boolean }) {
  const map = useRef<MapHandle>(null);
  const [ref, inView] = useInView<HTMLLIElement>();
  const [compact, setCompact] = useState(false);
  const Card = CARDS[i];
  useEffect(() => {
    const mq = matchMedia("(max-width: 720px)");
    const on = () => setCompact(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  useEffect(() => { map.current?.apply(frameAt(endOf(i), early), { ...FRAMED[i], inset: [24, 24, 84, 24] }); }, [i, compact, early]);
  return (
    <li ref={ref} className={`${s.restCh} reveal ${inView ? "in" : ""}`}>
      <Copy c={c} i={i} />
      <figure className={s.fig}>
        <div className={s.frame}><DealerMap ref={map} compact={compact} /></div>
        <div className={s.figCard}><Card /></div>
      </figure>
    </li>
  );
}

/* `joined`: it follows the hero directly, so the map starts where the hero's floor ends (no section gap).
   `curtain` (/home-v2): it follows the hero bridge with no gap, whose curved lime band rises over its top; its
   list version gets room at the top, a centred heading and each chapter on a card */
export function HowItWorks({ joined = false, curtain = false }: { joined?: boolean; curtain?: boolean }) {
  const root = useRef<HTMLElement>(null);
  const map = useRef<MapHandle>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const approveRef = useRef<HTMLDivElement>(null);
  const typed = useRef(-1);
  const [chapter, setChapter] = useState(-1);
  // which pinned stage plays: the wide one, the phone one, or none (the list)
  const [mode, setMode] = useState<"" | "wide" | "phone">("");
  const live = mode !== "", phone = mode === "phone";
  const reduce = useReducedMotion();

  useEffect(() => {
    const wide = matchMedia(PIN), small = matchMedia(PIN_PHONE);
    const on = () => setMode(reduce ? "" : wide.matches ? "wide" : small.matches ? "phone" : "");
    on();
    wide.addEventListener("change", on);
    small.addEventListener("change", on);
    return () => { wide.removeEventListener("change", on); small.removeEventListener("change", on); };
  }, [reduce]);

  // entering the pinned version: start from the current scroll; leaving it: the list shows finished cards
  useEffect(() => {
    typed.current = -1;
    if (live) dispatchEvent(new Event("scroll"));
    else root.current?.removeAttribute("style");
  }, [live, phone]);

  useScrollFrame(({ vh }) => {
    const el = root.current;
    if (!live || !el) return;
    const r = el.getBoundingClientRect();
    const p = clamp(-r.top / (r.height - vh));
    // /home-v2 (`curtain`): the route lines draw at the end of Ask, as in the user's Figma
    const f = frameAt(p, curtain, phone ? CAM_PHONE : CAM);
    map.current?.apply(f);
    el.dataset.ch = String(f.chapter);
    setChapter(f.chapter);

    // ask: type the prompt (the voice pill turns into Send with the first letter), then the reply
    const n = Math.round(f.type * PROMPT.length);
    if (n !== typed.current && textRef.current) {
      typed.current = n;
      textRef.current.textContent = n ? PROMPT.slice(0, n) : EMPTY;
      textRef.current.style.color = n ? "" : "#6E6E6E";
      textRef.current.closest("[data-ui]")?.toggleAttribute("data-typing", n > 0);
    }
    el.style.setProperty("--r", f.reply.toFixed(3));
    // compare: the cars come in, then the best fit lights; negotiate: the chat's messages arrive
    el.style.setProperty("--cp", f.compare.toFixed(3));
    el.style.setProperty("--m", f.messages.toFixed(3));
    // approve: the button, then the booking
    approveRef.current?.toggleAttribute("data-approved", f.approved > 0.5);
    el.style.setProperty("--bk", f.booked.toFixed(3));
  });

  // the chapter list scrolls to the point where a chapter has arrived
  const go = (i: number) => {
    const el = root.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + scrollY, run = el.offsetHeight - innerHeight;
    const p = i < CH.length ? CH[i] + 0.075 : 1;
    scrollTo({ top: top + p * run + (i < CH.length ? 0 : innerHeight), behavior: "smooth" });
  };

  return (
    <section ref={root} id="how-it-works" className={`${s.how} ${live ? s.live : s.rest} ${phone ? s.phone : ""} ${joined ? s.joined : ""} ${curtain ? s.curtain : ""}`} aria-labelledby="how-title" data-ch="-1">
      {live ? (<>
        {/* the words, once, for screen readers (outside the pinned stage); the stage shows one chapter at a time */}
        <div className="sr-only">
          <Title />
          <p>{TITLE.lead}</p>
          <ol>{CHAPTERS.map((c) => <li key={c.id}><h3>{c.head}</h3><p>{c.body}</p>{c.note && <p>{c.note}</p>}</li>)}</ol>
        </div>
        <div className={s.stage}>
          {/* on phones only Riverside and you keep their tags; the rest are dots */}
          <DealerMap ref={map} anchor={phone ? ANCHOR_PHONE : ANCHOR} compact={phone} />
          <div className={s.scrim} />
          <div className={s.copy} aria-hidden="true">
            <div className={s.title} data-c="-1">
              <p className="h2">{TITLE.head.map((l) => <span key={l} className={s.line}>{l}</span>)}</p>
              <p className={s.lead}>{TITLE.lead}</p>
            </div>
            {CHAPTERS.map((c, i) => <Copy key={c.id} c={c} i={i} />)}
          </div>
          {/* data-stage: the cards keep their wide layout here, phones included (see HowCards' phone rules) */}
          <div className={s.cards} data-stage="">
            <div data-c="0"><AskCard textRef={textRef} /></div>
            <div data-c="1"><CompareCard /></div>
            <div data-c="2"><NegotiateCard /></div>
            <div data-c="3"><ApproveCard cardRef={approveRef} /></div>
          </div>
          <nav className={s.rail} aria-label="How it works">
            {CHAPTERS.map((c, i) => (
              <button key={c.id} type="button" aria-current={i === chapter ? "step" : undefined} onClick={() => go(i)}>{c.rail}</button>
            ))}
            <button type="button" className={s.next} onClick={() => go(chapter + 1)}>
              {chapter < CHAPTERS.length - 1 ? "Next" : "Skip ahead"}<Icon name="down" />
            </button>
          </nav>
        </div>
      </>) : (
        <div className="wrap">
          <div className={s.head}>
            <Title />
            <p className={s.lead}>{TITLE.lead}</p>
          </div>
          <ol className={s.list}>
            {CHAPTERS.map((c, i) => <RestChapter key={c.id} c={c} i={i} early={curtain} />)}
          </ol>
        </div>
      )}
    </section>
  );
}

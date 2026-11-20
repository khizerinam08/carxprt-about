"use client";

import { useEffect, useRef, useState } from "react";
import { clamp, useScrollFrame } from "@/hooks/useScroll";
import { CAM, CAM_PHONE, CH, CHAPTERS, TITLE, frameAt, type Chapter } from "@/lib/howMap";
import { PROMPT } from "@/lib/walkthrough";
import { Icon } from "../Icons";
import { DealerMap, type MapHandle } from "./DealerMap";
import { AskCard, ApproveCard, CompareCard, NegotiateCard } from "./HowCards";
import s from "./HowItWorks.module.css";

/* How it works on the home page (townhouse.dev's walkthrough): one pinned stage over a map of the dealers
   around the buyer's ZIP. The camera moves to a new spot for each chapter (Ask, Compare, Negotiate,
   Approve); the chapter's words sit bottom left, the product card floats over the map, and the chapter
   list on the right jumps between them; on shorter or narrower screens the words, card and list are drawn
   smaller. Phones and portrait tablets get the same pinned stage, stacked: progress bars and the words at the
   top, the card at the foot, the map between with cameras of its own; down to 420px tall (a phone with its
   browser bars showing, a small window), with the card drawn smaller under 620px. There is no list version: every
   screen, short ones and reduced motion included, gets the pinned scroll (the user, 20 Nov 2026: no cards).
   (Laptops at 125-150% scaling have viewports around 1280 × 600: they get the wide stage, scaled.) */

const NARROW = "(max-width: 959px)";
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

/* `curtain` (the home page): it follows the hero bridge with no gap, whose curved lime band rises over its top;
   */
export function HowItWorks({ curtain = false }: { curtain?: boolean }) {
  const root = useRef<HTMLElement>(null);
  const map = useRef<MapHandle>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const approveRef = useRef<HTMLDivElement>(null);
  const typed = useRef(-1);
  const [chapter, setChapter] = useState(-1);
  // which pinned stage plays: the wide one or the phone one
  const [phone, setPhone] = useState(false);
  // narrow screens (phones, and the wide stage under 1200px): only Brindlemoor and you keep their tags
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const narrow = matchMedia(NARROW), roomy = matchMedia("(min-width: 1200px)");
    const on = () => {
      setPhone(narrow.matches);
      setCompact(!roomy.matches);
    };
    on();
    [narrow, roomy].forEach((m) => m.addEventListener("change", on));
    return () => [narrow, roomy].forEach((m) => m.removeEventListener("change", on));
  }, []);

  // switching stages: start from the current scroll
  useEffect(() => {
    typed.current = -1;
    dispatchEvent(new Event("scroll"));
  }, [phone]);

  useScrollFrame(({ vh }) => {
    const el = root.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const p = clamp(-r.top / (r.height - vh));
    // the home page (`curtain`): the route lines draw at the end of Ask, as in the user's Figma
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
    <section ref={root} id="how-it-works" className={`${s.how} ${s.live} ${phone ? s.phone : ""} ${curtain ? s.curtain : ""}`} aria-labelledby="how-title" data-ch="-1">
      <>
        {/* the words, once, for screen readers (outside the pinned stage); the stage shows one chapter at a time */}
        <div className="sr-only">
          <Title />
          <p>{TITLE.lead}</p>
          <ol>{CHAPTERS.map((c) => <li key={c.id}><h3>{c.head}</h3><p>{c.body}</p>{c.note && <p>{c.note}</p>}</li>)}</ol>
        </div>
        <div className={s.stage}>
          {/* on narrow screens only Brindlemoor and you keep their tags; the rest are dots */}
          <DealerMap ref={map} anchor={phone ? ANCHOR_PHONE : ANCHOR} compact={compact} />
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
      </>
    </section>
  );
}

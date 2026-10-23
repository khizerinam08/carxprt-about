"use client";

import { useEffect, useRef, useState } from "react";
import { clamp, useScrollFrame } from "@/hooks/useScroll";
import { useInView } from "@/hooks/useInView";
import { useLift } from "@/hooks/useLift";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { fmtUSD } from "@/lib/problemMath";
import { BEATS, CARXPRT_MIN, KEPT_USD, OTD_FINAL, OTD_FIRST, PROMPT, THREAD, TIME, USUAL, USUAL_MIN, span, stepAt } from "@/lib/walkthrough";
import { AskScreen, DealScreen, HubScreen } from "./Screens";
import s from "./Walkthrough.module.css";

/* The product flow, told with the product's own screens (RothFinder "Benefits"): a pinned stage with
   the steps on the left and a track of screens on the right that slides one screen per step. Inside
   each screen, scroll types the prompt, deals the cards, plays the thread. At the end the deal screen
   opens into a lime field where the time bars draw. Phones, short screens and reduced motion get the same
   content as an ordinary list of finished screens. */

type Step = { title: string; body: string; note?: string };
const STEPS: Step[] = [
  { title: "Ask", body: "Say what you need in plain words, typed or spoken. One chat replaces the tabs: CarXprt already knows the cars and runs the extra searches." },
  { title: "Choose", body: "Real listings from local dealers that fit your budget. Save the one you like and start a deal, and the dealer is in the thread." },
  { title: "Negotiate", body: "The Xprt Negotiator takes over and the Deal Validator checks the numbers. You read the updates and approve. The dealer never gets your number.", note: "The Xprt Negotiator comes with CarXprt Plus." },
  { title: "Drive away", body: "Your test drive is booked for a set time, and the documents are already sorted in chat." },
];
const SCREENS = [AskScreen, HubScreen, DealScreen];
const EMPTY = "Describe the car you want";
const smooth = (t: number) => t * t * (3 - 2 * t);

function Head() {
  return (
    <div className={s.head}>
      <h2 className="h2" id="how-title">From one sentence to the keys.</h2>
      <p className={s.lead}>One search, start to finish. CarXprt does the legwork, and you make two decisions.</p>
    </div>
  );
}

/* the time screen: where the hours went, today against with CarXprt */
function Finale() {
  return (
    <div className={`${s.end} ${s.time}`}>
      <p className={s.big}>{TIME.saved} back.</p>
      <p className={s.endLine}>{TIME.less} less active time. The back-and-forth runs without you: you pick a car and approve one price.</p>
      <div className={s.bars}>
        <div className={s.row}>
          <p className={s.rowName}>Today</p>
          <div className={`${s.bar} ${s.usual}`}>
            {USUAL.map((seg) => <span key={seg.label} style={{ flexGrow: seg.min }}><b>{seg.label}</b>{seg.time}</span>)}
          </div>
          <p className={s.rowTotal}>{TIME.usual}</p>
        </div>
        <div className={s.row}>
          <p className={s.rowName}>With CarXprt</p>
          <div className={`${s.bar} ${s.ours}`}>
            <span style={{ flexGrow: CARXPRT_MIN }} />
            <span className={s.back} style={{ flexGrow: USUAL_MIN - CARXPRT_MIN }}>{TIME.saved} back</span>
          </div>
          <p className={s.rowTotal}>{TIME.carxprt}</p>
        </div>
      </div>
      <p className={s.src}>Today: Cox Automotive 2025 averages and typical dealer timelines. With CarXprt: customer journeys.</p>
    </div>
  );
}

/* the money screen, in the same format. Both bars split the same way: the price paid either way, then the
   $2,400 the first quote added (ink) or CarXprt kept (the white glowing bar). That slice is drawn wider than
   its share so it can say what's in it; the totals on the right carry the real figures. */
const PAID = 1.35, SLICE = 1;
function Kept() {
  return (
    <div className={`${s.end} ${s.cash}`}>
      <p className={s.big}>{fmtUSD(KEPT_USD)} kept.</p>
      <p className={s.endLine}>
        The Xprt Negotiator removed the add-ons and cosmetic extras you didn’t need, then got a discount on the price.
        You approved one number.
      </p>
      <div className={s.bars}>
        <div className={s.row}>
          <p className={s.rowName}>First quote</p>
          <div className={`${s.bar} ${s.usual}`}>
            <span style={{ flexGrow: PAID }}><b>{fmtUSD(OTD_FINAL)}</b><small>Paid either way</small></span>
            <span style={{ flexGrow: SLICE }}><b>+{fmtUSD(KEPT_USD)}</b><small>Unnecessary add-ons and cosmetic extras</small></span>
          </div>
          <p className={s.rowTotal}>{fmtUSD(OTD_FIRST)}</p>
        </div>
        <div className={s.row}>
          <p className={s.rowName}>With CarXprt</p>
          <div className={`${s.bar} ${s.ours}`}>
            <span style={{ flexGrow: PAID }}><b>{fmtUSD(OTD_FINAL)}</b><small>Paid either way</small></span>
            <span className={s.back} style={{ flexGrow: SLICE }}>
              <b>{fmtUSD(KEPT_USD)} kept</b>
              <small>Add-ons removed and discount applied</small>
            </span>
          </div>
          <p className={s.rowTotal}>{fmtUSD(OTD_FINAL)}</p>
        </div>
      </div>
    </div>
  );
}

/* one step of the static version: its words, then its finished screen */
function RestStep({ step, i }: { step: Step; i: number }) {
  const [ref, inView] = useInView<HTMLLIElement>();
  const Screen = SCREENS[i];
  return (
    <li ref={ref} className={`${s.restStep} reveal ${inView ? "in" : ""}`}>
      <div className={s.restCopy}>
        <h3>{step.title}</h3>
        <p>{step.body}</p>
        {step.note && <p className={s.note}>{step.note}</p>}
      </div>
      {Screen ? <div className={s.restFrame}><Screen /></div> : <>
        <div className={s.restEnd}><Finale /></div>
        <div className={s.restEnd}><Kept /></div>
      </>}
    </li>
  );
}

export function Walkthrough() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const port = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const priceRef = useRef<HTMLElement>(null);
  const typed = useRef(-1);
  const [step, setStep] = useState(0);
  const [live, setLive] = useState(false);
  const reduce = useReducedMotion();

  // the pinned version needs a wide, tall screen and motion; everything else gets the list
  useEffect(() => {
    const mq = matchMedia("(min-width: 1000px) and (min-height: 640px)");
    const on = () => setLive(mq.matches && !reduce);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [reduce]);

  // leaving the pinned version: drop the scroll-written variables so the list shows finished screens
  // entering it: ask the shared scroll loop for a frame so the stage starts at its first beat
  useEffect(() => {
    typed.current = -1;
    if (!live) root.current?.removeAttribute("style");
    else dispatchEvent(new Event("scroll"));
  }, [live]);

  // on a tall screen the steps and the screens sit in the middle of the stage (see useLift); the lime
  // finale centres itself
  useLift(root, "(min-width: 1000px) and (min-height: 640px)", () => {
    const st = stage.current, pt = port.current, copy = pt?.previousElementSibling as HTMLElement | null;
    if (!st || !pt || !copy?.lastElementChild) return 0;
    const cs = getComputedStyle(st);
    const room = st.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
    const copyH = copy.lastElementChild.getBoundingClientRect().bottom - copy.getBoundingClientRect().top;
    return room - Math.max(copyH, pt.offsetHeight);
  }, [live]);

  useScrollFrame(({ vh }) => {
    const el = root.current;
    if (!live || !el) return;
    const r = el.getBoundingClientRect();
    const p = clamp(-r.top / (r.height - vh));
    const set = (k: string, v: number) => el.style.setProperty(k, v.toFixed(4));

    // ask: type the prompt, then the reply replaces the suggestions
    const n = Math.round(span(p, BEATS.type) * PROMPT.length);
    if (n !== typed.current && textRef.current) {
      typed.current = n;
      textRef.current.textContent = n ? PROMPT.slice(0, n) : EMPTY;
      textRef.current.style.color = n ? "" : "#6E6E6E";
      // the voice pill becomes "Send" with the first letter
      textRef.current.closest("[data-ui]")?.toggleAttribute("data-typing", n > 0);
    }
    set("--r", span(p, BEATS.reply));

    // choose: filters, cards, the pick
    set("--c", span(p, BEATS.chips));
    set("--d", span(p, BEATS.deal));
    set("--k", span(p, BEATS.pick));

    // the track slides one screen per step; screens off to the side dim
    const seg = smooth(span(p, BEATS.toHub)) + smooth(span(p, BEATS.toDeal));
    set("--seg", seg);
    [...(track.current?.children ?? [])].forEach((f, i) =>
      (f as HTMLElement).style.setProperty("--o", (1 - 0.5 * clamp(Math.abs(seg - i))).toFixed(3)));

    // negotiate: messages arrive one by one and push the thread up; the price drops when the dealer agrees
    const m = span(p, BEATS.thread), N = THREAD.length;
    const vis = (i: number) => clamp((m - i / N) * N * 1.6);
    let off = 0;
    [...(listRef.current?.children ?? [])].forEach((li, i) => {
      const v = vis(i), h = (li as HTMLElement).offsetHeight + 12;
      (li as HTMLElement).style.setProperty("--v", v.toFixed(3));
      off += (1 - v) * h;
    });
    listRef.current?.style.setProperty("--off", `${off.toFixed(1)}px`);
    if (priceRef.current) priceRef.current.textContent = fmtUSD(OTD_FIRST + (OTD_FINAL - OTD_FIRST) * vis(4));
    set("--sv", vis(5));

    // drive away: the deal screen opens into the lime field, then the bars draw and the hours count
    const g = smooth(span(p, BEATS.grow));
    set("--g", g);
    if (g > 0 && stage.current && port.current) {
      const a = stage.current.getBoundingClientRect(), b = port.current.getBoundingClientRect();
      el.style.setProperty("--ct", `${(b.top - a.top).toFixed(1)}px`);
      el.style.setProperty("--cr", `${(a.right - b.right).toFixed(1)}px`);
      el.style.setProperty("--cb", `${(a.bottom - b.bottom).toFixed(1)}px`);
      el.style.setProperty("--cl", `${(b.left - a.left).toFixed(1)}px`);
    }
    set("--e", span(p, BEATS.end));

    // then the money screen takes over from the time screen, and its bars draw
    const swap = smooth(span(p, BEATS.swap));
    set("--m", swap);
    set("--me", span(p, BEATS.cash));
    // whichever screen is fully out of sight is hidden, not merely transparent
    el.toggleAttribute("data-cash", swap > 0.001);
    el.toggleAttribute("data-cash-full", swap > 0.999);
    // once the field is full, the steps and screens underneath are gone, not merely covered
    el.toggleAttribute("data-end", g > 0.98);

    setStep(stepAt(p));
  });

  return (
    <section ref={root} id="how-it-works" className={`${s.walk} ${live ? s.live : s.rest}`} aria-labelledby="how-title">
      {live ? (
        <div className={s.stage} ref={stage}>
          <div className={`wrap ${s.grid}`}>
            <div className={s.copy}>
              <Head />
              <ol className={s.steps}>
                {STEPS.map((st, i) => (
                  <li key={st.title} className={`${s.step} ${i === step ? s.on : ""}`} aria-current={i === step ? "step" : undefined}>
                    <h3>{st.title}</h3>
                    <div className={s.body}>
                      <div>
                        <p>{st.body}</p>
                        {st.note && <p className={s.note}>{st.note}</p>}
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <div className={s.port} ref={port}>
              <div className={s.track} ref={track}>
                <div className={s.frame}><AskScreen textRef={textRef} caret /></div>
                <div className={s.frame}><HubScreen /></div>
                <div className={s.frame}><DealScreen listRef={listRef} priceRef={priceRef} /></div>
              </div>
            </div>
          </div>
          <div className={s.finale}>
            <div className="wrap"><Finale /><Kept /></div>
          </div>
        </div>
      ) : (
        <div className="wrap">
          <Head />
          <ol className={s.list}>
            {STEPS.map((st, i) => <RestStep key={st.title} step={st} i={i} />)}
          </ol>
        </div>
      )}
    </section>
  );
}

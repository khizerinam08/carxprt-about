"use client";

import { useEffect, useRef, useState } from "react";
import { clamp, useScrollFrame } from "@/hooks/useScroll";
import { useInView } from "@/hooks/useInView";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { STORY, STORY_TITLE, type StoryChapter } from "@/lib/dealers";
import { Icon } from "../Icons";
import { STORY_CARDS } from "./StoryCards";
import s from "./LeadStory.module.css";

/* One lead, start to sale: the dealer page's walkthrough, laid out like the home page's but with no map and no
   camera (the board stays still; only the card changes). Pinned: the words on the left (the title, then one
   chapter at a time), a chapter switch under them, the dashboard card on a dotted board at the right. Each
   chapter's card plays as you scroll through it (--a, --m, --q, --s). Phones get the same stage stacked;
   very short screens and reduced motion get the chapters as a list, each card finished */

const PIN = "(min-width: 960px) and (min-height: 560px)";
const PIN_PHONE = "(max-width: 959px) and (min-height: 600px)";
/* the title holds the first 10% of the run, then four even chapters */
const INTRO = 0.1;
const SPAN = (1 - INTRO) / STORY.length;

function Copy({ c, i }: { c: StoryChapter; i: number }) {
  return (
    <div className={s.chap} data-c={i}>
      <p className={s.step}>{String(i + 1).padStart(2, "0")} · {c.rail}</p>
      <h3>{c.head}</h3>
      <p>{c.body}</p>
    </div>
  );
}

function RestChapter({ c, i }: { c: StoryChapter; i: number }) {
  const [ref, inView] = useInView<HTMLLIElement>();
  const Card = STORY_CARDS[i];
  return (
    <li ref={ref} className={`${s.restCh} reveal ${inView ? "in" : ""}`}>
      <Copy c={c} i={i} />
      <div className={`${s.board} dots`}><div className={s.slot}><Card /></div></div>
    </li>
  );
}

export function LeadStory() {
  const root = useRef<HTMLElement>(null);
  const [mode, setMode] = useState<"" | "wide" | "phone">("");
  const [chapter, setChapter] = useState(-1);
  const reduce = useReducedMotion();
  const live = mode !== "";

  useEffect(() => {
    const wide = matchMedia(PIN), small = matchMedia(PIN_PHONE);
    const on = () => setMode(reduce ? "" : wide.matches ? "wide" : small.matches ? "phone" : "");
    on();
    [wide, small].forEach((m) => m.addEventListener("change", on));
    return () => [wide, small].forEach((m) => m.removeEventListener("change", on));
  }, [reduce]);

  useEffect(() => {
    if (live) dispatchEvent(new Event("scroll"));
    else root.current?.removeAttribute("style");
  }, [live]);

  useScrollFrame(({ vh }) => {
    const el = root.current;
    if (!live || !el) return;
    const r = el.getBoundingClientRect();
    const p = clamp(-r.top / (r.height - vh));
    const ch = p < INTRO ? -1 : Math.min(STORY.length - 1, Math.floor((p - INTRO) / SPAN));
    // each chapter's card plays over its first 70%, then holds
    const t = (i: number) => clamp((p - INTRO - i * SPAN) / (SPAN * 0.7));
    el.style.setProperty("--a", t(0).toFixed(3));
    el.style.setProperty("--m", (t(1) * 4.4).toFixed(3));
    el.style.setProperty("--q", (t(2) * 1.25).toFixed(3));
    el.style.setProperty("--s", t(3).toFixed(3));
    el.toggleAttribute("data-shared", t(2) > 0.92);
    el.dataset.ch = String(ch);
    setChapter(ch);
  });

  // the switch scrolls to the point where a chapter's card has played
  const go = (i: number) => {
    const el = root.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + scrollY, run = el.offsetHeight - innerHeight;
    const p = i < STORY.length ? INTRO + i * SPAN + SPAN * 0.72 : 1;
    scrollTo({ top: top + p * run + (i < STORY.length ? 0 : innerHeight), behavior: "smooth" });
  };

  const title = <h2 className="h2" id="story-title">{STORY_TITLE.head.map((l) => <span key={l} className={s.line}>{l}</span>)}</h2>;

  return (
    <section ref={root} id="how-it-works" className={`${s.story} ${live ? s.live : s.rest} ${mode === "phone" ? s.phone : ""}`}
      aria-labelledby="story-title" data-ch="-1" data-live={live ? "" : undefined}>
      {live ? (<>
        <div className="sr-only">
          {title}
          <p>{STORY_TITLE.lead}</p>
          <ol>{STORY.map((c) => <li key={c.id}><h3>{c.head}</h3><p>{c.body}</p></li>)}</ol>
        </div>
        <div className={s.stage}>
          <div className={s.left}>
            <div className={s.copy} aria-hidden="true">
              <div className={s.title} data-c="-1">
                <p className="h2">{STORY_TITLE.head.map((l) => <span key={l} className={s.line}>{l}</span>)}</p>
                <p className={s.lead}>{STORY_TITLE.lead}</p>
              </div>
              {STORY.map((c, i) => <Copy key={c.id} c={c} i={i} />)}
            </div>
            <nav className={s.rail} aria-label="One lead, start to sale">
              {STORY.map((c, i) => (
                <button key={c.id} type="button" aria-current={i === chapter ? "step" : undefined} onClick={() => go(i)}>{c.rail}</button>
              ))}
              <button type="button" className={s.next} onClick={() => go(chapter + 1)} aria-label={chapter < STORY.length - 1 ? "Next step" : "Skip ahead"}>
                <Icon name="down" />
              </button>
            </nav>
          </div>
          <div className={`${s.board} dots`}>
            {STORY_CARDS.map((Card, i) => <div key={i} className={s.slot} data-c={i}><Card /></div>)}
          </div>
        </div>
      </>) : (
        <div className="wrap">
          <div className={s.head}>
            {title}
            <p className={s.lead}>{STORY_TITLE.lead}</p>
          </div>
          <ol className={s.list}>
            {STORY.map((c, i) => <RestChapter key={c.id} c={c} i={i} />)}
          </ol>
        </div>
      )}
    </section>
  );
}

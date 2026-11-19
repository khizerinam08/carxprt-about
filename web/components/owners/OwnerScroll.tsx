"use client";

import { useEffect, useRef, useState } from "react";
import { clamp, useScrollFrame } from "@/hooks/useScroll";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { ROAD, STORY, type Chapter } from "@/lib/owners";
import { Icon } from "../Icons";
import { OWNER_CARDS } from "./OwnerCards";
import { OwnerStops } from "./OwnerStops";
import s from "./OwnerScroll.module.css";

/* What your car does for you, as a sideways scroll: pinned, the title first, then the five moments slide in one
   screen at a time. Each moment's card plays once it's in place (--oa, --og, --od, --ok, --os); a thin line at
   the foot fills as you go. No car and no road (the user didn't like them). Short screens and reduced motion get
   the moments as a list (OwnerStops) */

const PIN = "(min-width: 960px) and (min-height: 600px)";
const PIN_PHONE = "(max-width: 959px) and (min-height: 600px)";
const VARS = ["--oa", "--og", "--od", "--ok", "--os"];
const ease = (x: number) => (x < .5 ? 2 * x * x : 1 - (-2 * x + 2) ** 2 / 2);

function Words({ c, i }: { c: Chapter; i: number }) {
  return (
    <div className={s.words}>
      <p className={s.step}><span>{String(i + 1).padStart(2, "0")}</span>{c.rail}</p>
      <h3>{c.head}</h3>
      <p>{c.body}</p>
    </div>
  );
}

export function OwnerScroll() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
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

  useEffect(() => { if (live) dispatchEvent(new Event("scroll")); }, [live]);

  useScrollFrame(({ vh }) => {
    const el = root.current, tr = track.current;
    if (!live || !el || !tr) return;
    const r = el.getBoundingClientRect();
    const p = clamp(-r.top / (r.height - vh));
    // one segment per moment: slide for the first half, then hold while its card plays
    const n = STORY.length, seg = p * n, k = Math.min(n - 1, Math.floor(seg)), local = seg - k;
    const move = ease(clamp(local / .5));
    const shift = (k + move) * (tr.firstElementChild as HTMLElement).offsetWidth;
    tr.style.transform = `translate3d(${-shift.toFixed(1)}px, 0, 0)`;
    STORY.forEach((_, i) => el.style.setProperty(VARS[i], (i < k ? 1 : i > k ? 0 : clamp((local - .45) / .45)).toFixed(3)));
    el.style.setProperty("--p", p.toFixed(4));
    el.toggleAttribute("data-ready", k === n - 1 && local > .9);
    const ch = p < .02 ? -1 : move > .5 ? k : k - 1;
    el.dataset.ch = String(ch);
    setChapter(ch);
  });

  if (!live) return <OwnerStops />;

  return (
    <section ref={root} id="how-it-works" className={`${s.scroll} ${mode === "phone" ? s.phone : ""}`} aria-labelledby="scroll-title"
      data-ch="-1" data-live="" style={{ "--n": STORY.length } as React.CSSProperties}>
      <div className={s.stage}>
        <div className={s.track} ref={track}>
          <div className={s.panel}>
            <div className={s.intro}>
              <h2 className="h2" id="scroll-title">{ROAD.head.map((l) => <span key={l}>{l}</span>)}</h2>
              <p className={s.lead}>{ROAD.lead}</p>
              <p className={s.hint}>Scroll to follow it<Icon name="down" /></p>
            </div>
          </div>
          {STORY.map((c, i) => {
            const Card = OWNER_CARDS[i];
            return (
              <article key={c.id} className={s.panel} data-past={i < chapter ? "" : undefined}>
                <div className={s.stop}>
                  <Words c={c} i={i} />
                  <div className={s.slot}><Card /></div>
                </div>
              </article>
            );
          })}
        </div>
        <ol className={s.progress} aria-hidden="true">
          {STORY.map((c, i) => <li key={c.id} data-on={i <= chapter ? "" : undefined}><span>{c.rail}</span></li>)}
        </ol>
      </div>
    </section>
  );
}

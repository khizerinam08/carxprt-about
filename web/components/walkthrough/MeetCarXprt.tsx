"use client";

import { useRef } from "react";
import { clamp, useScrollFrame } from "@/hooks/useScroll";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import s from "./MeetCarXprt.module.css";

/* RothFinder's "Meet Angie" move: the two words slide in from the sides and settle around the
   CarXprt mark, which turns and grows into place. Scrubbed by scroll, not pinned; settled by the
   time the section's middle reaches the middle of the screen. */
export function MeetCarXprt() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  useScrollFrame(({ vh }) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const k = reduce ? 1 : clamp((vh - r.top) / (vh * 0.5 + r.height * 0.5));
    el.style.setProperty("--q", (1 - Math.pow(1 - k, 3)).toFixed(4));
  });

  return (
    <section ref={ref} className={`section wrap ${s.meet}`} aria-labelledby="meet-title">
      <h2 className={s.title} id="meet-title">
        <span className={`${s.word} ${s.left}`}>Meet</span>
        <span className={s.mark} aria-hidden="true">
          <svg viewBox="0 0 15.68 15.68"><use href="#mark" /></svg>
        </span>
        <span className={`${s.word} ${s.right}`}>CarXprt</span>
      </h2>
      <p className={s.line}>Your AI car expert. It searches, compares and negotiates. You make the call.</p>
    </section>
  );
}

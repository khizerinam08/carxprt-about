"use client";

import { useRef } from "react";
import { clamp, useScrollFrame } from "@/hooks/useScroll";
import s from "./Bridge.module.css";

/* One statement whose words light up in reading order as it scrolls through the screen. */
const SENTENCE = "Buying a car should feel exciting. Not like hours of tabs, haggling and fine print. We built CarXprt to bring back the good part.";

export function Bridge() {
  const textRef = useRef<HTMLParagraphElement>(null);

  useScrollFrame(({ vh }) => {
    const el = textRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    // 0 when the sentence's top reaches 85% of the viewport, 1 when its bottom reaches 45%
    const progress = clamp((vh * 0.85 - r.top) / (vh * 0.4 + r.height));
    const words = el.querySelectorAll<HTMLElement>("[data-w]");
    words.forEach((w, i) => w.style.setProperty("--k", clamp(progress * (words.length + 3) - i).toFixed(3)));
  });

  return (
    <section className={`wrap ${s.bridge}`} id="why" aria-label="Why CarXprt exists">
      <p className="sr-only">{SENTENCE}</p>
      <p className={s.text} ref={textRef} aria-hidden="true">
        {SENTENCE.split(" ").map((word, i) => <span key={i} data-w="" className={s.w}>{word} </span>)}
      </p>
    </section>
  );
}

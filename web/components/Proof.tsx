"use client";

import { useRef } from "react";
import { Icon } from "./Icons";
import { useScrollFrame } from "@/hooks/useScroll";
import s from "./Proof.module.css";

const STATS = [
  ["5M+", "Vehicles available to search"],
  ["500+", "Participating dealerships"],
  ["10,000+", "Successful dealer connections"],
  ["$2,500", "Average buyer savings"],
  ["~10 hrs", "Average time saved"],
  // "4.8/5 Customer satisfaction" is held back until it has a source (no Trustpilot reviews yet)
];

/* Stat list where the number nearest the middle of the screen lights up (Abatable). */
export function Proof() {
  const listRef = useRef<HTMLUListElement>(null);
  useScrollFrame(({ vh }) => {
    const items = listRef.current ? [...listRef.current.children] : [];
    let best = 0, bd = Infinity;
    items.forEach((el, i) => {
      const b = el.getBoundingClientRect(), d = Math.abs(b.top + b.height / 2 - vh / 2);
      if (d < bd) { bd = d; best = i; }
    });
    items.forEach((el, i) => el.classList.toggle(s.on, i === best));
  });

  return (
    <section className="section wrap" aria-labelledby="proof-title">
      <div className={s.panel}>
        <div className={s.copy}>
          <h2 className="h2" id="proof-title">Real buyers. Real numbers.</h2>
          <p>Less time spent, more money kept, and a negotiator chasing the deal instead of the buyer.</p>
          <a className="btn btn-lime" href="#how-it-works">How it works <Icon name="arrow" /></a>
        </div>
        <ul className={s.stats} ref={listRef}>
          {STATS.map(([n, l], i) => (
            <li key={l} className={`${s.stat} ${i === 0 ? s.on : ""}`}><span className={s.n}>{n}</span><span className={s.l}>{l}</span></li>
          ))}
        </ul>
      </div>
    </section>
  );
}

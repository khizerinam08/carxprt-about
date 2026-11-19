"use client";

import { useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { clamp, useScrollFrame } from "@/hooks/useScroll";
import { CLOSE } from "@/lib/owners";
import { SIGN_IN } from "@/lib/links";
import h from "../home-v2/HomeClose.module.css";
import s from "./OwnerClose.module.css";

/* The close, as the home page's: soft lime glows rise from its foot and flood the screen lime (HomeClose's bloom
   and styles, reused), then the words come in. The heading, one sentence and one action (the user) */
const REST = { "--p": 1 } as React.CSSProperties;

export function OwnerClose() {
  const field = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // --p runs 0 → 1 as the band's top travels from the foot of the screen to its top
  useScrollFrame(({ vh }) => {
    const el = field.current;
    if (!el) return;
    const p = reduce ? 1 : clamp((vh - el.getBoundingClientRect().top) / vh);
    el.style.setProperty("--p", p.toFixed(3));
    el.toggleAttribute("data-on", p > 0.9);
  });

  return (
    <section id="start" className={s.close} aria-labelledby="start-title">
      <div className={h.field} ref={field} data-on="" style={REST}>
        <div className={h.glow} aria-hidden="true"><i /><i /><i /></div>
        <div className={h.flood} aria-hidden="true" />
        <div className={`wrap ${h.content} ${s.content}`}>
          <h2 className={`${h.title} ${s.title}`} id="start-title">{CLOSE.head.map((l) => <span key={l}>{l}</span>)}</h2>
          <p className={h.lead}>
            <span className="sr-only">{CLOSE.lead}</span>
            <span aria-hidden="true">{CLOSE.lead.split(" ").map((w, i) => <span key={i} style={{ "--i": i } as React.CSSProperties}>{w} </span>)}</span>
          </p>
          <a className={`btn btn-dark ${s.cta}`} href={SIGN_IN}>Sign in to Owner mode</a>
        </div>
      </div>
    </section>
  );
}

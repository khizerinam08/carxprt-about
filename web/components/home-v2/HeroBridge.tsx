"use client";

import { useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { clamp, useScrollFrame } from "@/hooks/useScroll";
import { Logo } from "../Icons";
import { HomeHero } from "../home/HomeHero";
import s from "./HeroBridge.module.css";

/* The home page: the hero, its foot fading into the page, then one line under it with the full CarXprt logo as its
   subject (the user's take on "Meet CarXprt", without saying it). The line plays with the scroll as it comes in
   (the logo slides in, each word goes faint to sharp); once it's read it holds still, and the walkthrough comes
   up over it through a curved arch, rimmed in lime, that widens until it's the whole map at the top.
   The walkthrough (HowItWorks `curtain`) is
   pulled up a screen to overlap the line's hold; the map's curve is a clip-path on it, the lime an SVG under it. */

const WORDS = "does the searching, the price‑checking and the negotiating. You just make the call.".split(" ");

export function HeroBridge() {
  const root = useRef<HTMLDivElement>(null);
  const line = useRef<HTMLParagraphElement>(null);
  const lime = useRef<SVGSVGElement>(null);
  const limePath = useRef<SVGPathElement>(null);
  const reduce = useReducedMotion();

  useScrollFrame(({ vh }) => {
    const el = root.current, l = line.current, sv = lime.current, lp = limePath.current;
    const sec = el?.nextElementSibling as HTMLElement | null;
    if (!el || !l || !sv || !lp || !sec) return;
    if (reduce) { l.style.setProperty("--q", "1"); sec.style.clipPath = ""; return; }

    // the line: q runs 0 → 1 as its top rises from the foot of the screen to about a third of the way down
    l.style.setProperty("--q", clamp((vh - l.getBoundingClientRect().top) / (vh * 0.65)).toFixed(4));

    // the walkthrough: p runs 0 → 1 as its top rises from the foot of the screen to its top (where the map pins).
    // The map comes up through an arch: a curved top (half an ellipse, its crown on the walkthrough's top edge)
    // over straight sides. It starts narrow and round, then just widens (eased, growing evenly in scale) until
    // its curve runs off both sides of the screen, and at the top it's the whole map. A thin lime rim traces it
    const st = sec.getBoundingClientRect(), rt = el.getBoundingClientRect();
    const p = clamp((vh - st.top) / vh), e = p * p * (3 - 2 * p);
    const W = el.clientWidth, cx = W / 2, H = st.height + 10;
    const rx0 = W * 0.3, rx1 = W * 4;
    const rx = rx0 * (rx1 / rx0) ** e, ry = rx * (1 - 0.5 * e); // round at first, flatter as it opens
    const left = cx - rx, right = cx + rx;
    const T = Math.min(22, Math.max(12, W * 0.012));
    if (p >= 1) { sec.style.clipPath = ""; lp.setAttribute("d", ""); return; }
    sec.style.clipPath = `path("M${left} ${H}V${ry}A${rx} ${ry} 0 0 1 ${right} ${ry}V${H}Z")`;
    // the rim's SVG covers the screen below the walkthrough's top (and T above it); its stroke straddles the edge
    // and sits under the map, so what shows is a lime line just outside the arch
    const h = vh + 2 * T;
    sv.style.top = `${st.top - rt.top - T}px`;
    sv.style.height = `${h}px`;
    sv.setAttribute("viewBox", `0 0 ${W} ${h}`);
    lp.setAttribute("stroke-width", String(T * 2));
    lp.setAttribute("d", `M${left} ${h}V${ry + T}A${rx} ${ry} 0 0 1 ${right} ${ry + T}V${h}`);
  });

  return (
    <div className={s.bridge} ref={root}>
      <div className={s.hero}>
        <HomeHero />
        <i className={s.fade} aria-hidden="true" />
      </div>
      {/* the line holds while the walkthrough comes up over it: the spacer is that hold */}
      <div className={s.run}>
        <p className={s.line} ref={line} style={{ "--q": 1 } as React.CSSProperties}>
          <Logo className={s.logo} label="CarXprt" />
          {WORDS.map((w, i) => (
            <span key={i}>{" "}<span className={s.word} style={{ "--t": (0.14 + (i / WORDS.length) * 0.66).toFixed(3) } as React.CSSProperties}>{w}</span></span>
          ))}
        </p>
        <i className={s.hold} aria-hidden="true" />
      </div>
      <svg ref={lime} className={s.lime} preserveAspectRatio="none" aria-hidden="true"><path ref={limePath} /></svg>
    </div>
  );
}

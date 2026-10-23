"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { clamp, useScrollFrame } from "@/hooks/useScroll";
import { app } from "@/lib/links";
import { POPULAR } from "@/lib/popular";
import { ChatBar } from "../ChatBar";
import s from "./HomeClose.module.css";

/* The home page's close: the first version's "finish the sentence" lime band, centred, with no figures. It arrives the way Augment's
   hero does (the user's video): as it scrolls in, soft lime glows rise from its foot and swell until the screen
   is lime, then the words come in. The glows only live during the bloom; at rest the band is flat lime (the
   user rules out gradient backgrounds). "Find me a…" completes itself with real requests; a click on the line
   puts that request in the search bar, and whatever the visitor types in the bar becomes the headline. Then the
   live site's "Popular on CarXprt" links on the light ground (no ink band), into the footer. */

const REQUESTS = ["family SUV under $40k", "hybrid with a third row", "AWD SUV for the snow", "first car under $15k"];
// server render and no JS: the bloom at its end (flat lime, everything in); the scroll loop takes over from here
const REST = { "--p": 1 } as React.CSSProperties;
const LEAD = "Tell CarXprt the car you want. It finds it, compares it with the ones nearby and negotiates the price, and you never take a sales call.";

export function HomeClose() {
  const field = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  // where the typing is: which request, how many letters, typing on (1) or taking back (-1)
  const at = useRef({ i: 0, n: REQUESTS[0].length, dir: -1 });
  const [shown, setShown] = useState(REQUESTS[0]);
  const [own, setOwn] = useState<string | null>(null);
  const [onScreen, setOnScreen] = useState(false);
  const reduce = useReducedMotion();

  // the bloom: --p runs 0 → 1 as the band's top travels from the foot of the screen to its top. The typing and
  // the word reveal start once the screen is lime, and the typing stops when the band leaves the screen
  useScrollFrame(({ vh }) => {
    const el = field.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const p = reduce ? 1 : clamp((vh - r.top) / vh);
    el.style.setProperty("--p", p.toFixed(3));
    const on = p > 0.9 && r.bottom > 0;
    el.toggleAttribute("data-on", on || p >= 1);
    setOnScreen(on);
  });

  // once the visitor types in the bar, their words are the headline
  useEffect(() => {
    const el = input.current;
    if (!el) return;
    const on = () => setOwn(el.value.trim() ? el.value : null);
    el.addEventListener("input", on);
    return () => el.removeEventListener("input", on);
  }, []);

  // type a request, hold it, take it back, type the next
  useEffect(() => {
    if (!onScreen || reduce || own !== null) return;
    let t = 0;
    const step = () => {
      const a = at.current, full = REQUESTS[a.i];
      a.n += a.dir;
      setShown(full.slice(0, a.n));
      if (a.dir > 0 && a.n >= full.length) { a.dir = -1; t = window.setTimeout(step, 2200); return; }
      if (a.dir < 0 && a.n <= 0) { a.dir = 1; a.i = (a.i + 1) % REQUESTS.length; t = window.setTimeout(step, 350); return; }
      t = window.setTimeout(step, a.dir > 0 ? 60 : 24);
    };
    t = window.setTimeout(step, at.current.dir < 0 && at.current.n === REQUESTS[at.current.i].length ? 2200 : 60);
    return () => window.clearTimeout(t);
  }, [onScreen, reduce, own]);

  // the line on show goes into the bar, ready to send
  const use = () => {
    const el = input.current;
    if (!el) return;
    el.value = REQUESTS[at.current.i];
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.focus();
  };

  return (
    <section className={s.close} aria-labelledby="close-title">
      <div className={s.field} ref={field} data-on="" style={REST}>
        <div className={s.glow} aria-hidden="true"><i /><i /><i /></div>
        <div className={s.flood} aria-hidden="true" />
        <div className={`wrap ${s.content}`}>
          <h2 className={s.title} id="close-title">
            <span>Find me a</span>
            {own !== null
              ? <span className={s.line}><span className={s.text}>{own}</span></span>
              : (
                <button type="button" className={`${s.line} ${s.pick}`} onClick={use} aria-label={`Search for a ${REQUESTS[at.current.i]}`}>
                  <span className={s.text} aria-hidden="true">{shown}</span>
                  <i className={s.caret} aria-hidden="true" />
                </button>
              )}
          </h2>
          {/* word by word, pale and soft to sharp ink, once the screen is lime */}
          <p className={s.lead}>
            <span className="sr-only">{LEAD}</span>
            <span aria-hidden="true">{LEAD.split(" ").map((w, i) => <span key={i} style={{ "--i": i } as React.CSSProperties}>{w} </span>)}</span>
          </p>
          <div className={s.bar}>
            <ChatBar name="q" id="q-close" placeholder="Or describe it in your own words" inputRef={input} />
          </div>
        </div>
      </div>
      <div className={s.popular}>
        <div className="wrap">
          <h2 className={s.popTitle}>Popular on CarXprt</h2>
          <div className={s.groups}>
            {POPULAR.map((g) => (
              <nav key={g.name} className={s.group} aria-label={g.name}>
                <h3>{g.name}</h3>
                <ul>{g.links.map(([label, href]) => <li key={label}><a href={app(href)}>{label}</a></li>)}</ul>
              </nav>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

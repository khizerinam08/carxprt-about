"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { POPULAR } from "@/lib/popular";
import { ChatBar } from "../ChatBar";
import s from "./HomeClose.module.css";

/* The close: finish the sentence. "Find me a…" completes itself with real requests in display type. A click on
   the line puts that request in the search bar below, and whatever the visitor types in the bar becomes the
   headline. Beside the bar, the three figures the page has argued for; under it all, the ink band with the
   live site's search links. */

const REQUESTS = ["family SUV under $40k", "hybrid with a third row", "AWD SUV for the snow", "first car under $15k"];
const PROOF = [
  { big: "~10 hrs", small: "back on a typical purchase" },
  { big: "~$2,500", small: "kept on a typical deal" },
  { big: "0", small: "sales calls, because dealers never get your number" },
];

export function HomeClose() {
  const field = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  // where the typing is: which request, how many letters, typing on (1) or taking back (-1)
  const at = useRef({ i: 0, n: REQUESTS[0].length, dir: -1 });
  const [shown, setShown] = useState(REQUESTS[0]);
  const [own, setOwn] = useState<string | null>(null);
  const [onScreen, setOnScreen] = useState(false);
  const reduce = useReducedMotion();

  // the typing only runs while the field is on screen
  useEffect(() => {
    const el = field.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

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
      <div className={s.field} ref={field}>
        <div className="wrap">
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
          <div className={s.row}>
            <div className={s.bar}>
              <ChatBar name="q" id="q-close" placeholder="Or describe it in your own words" inputRef={input} />
            </div>
            <ul className={s.proof}>
              {PROOF.map((p) => <li key={p.big}><b>{p.big}</b><small>{p.small}</small></li>)}
            </ul>
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
                <ul>{g.links.map(([text, href]) => <li key={text}><Link href={href}>{text}</Link></li>)}</ul>
              </nav>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

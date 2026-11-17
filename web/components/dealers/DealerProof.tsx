"use client";

import { useEffect, useRef, useState } from "react";
import { STATS } from "@/lib/dealers";
import b from "../home-v2/Bento.module.css";
import s from "./DealerProof.module.css";

/* The four figures, as the home bento's tilted cards (they tip into place as the section arrives), white and
   lime in turn: paying buyers, full context, 24/7, seconds (the live dealer page's own) */
export function DealerProof() {
  const ref = useRef<HTMLElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting), { rootMargin: "0px 0px -10% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} className={`section ${b.bento} ${s.proof}`} data-on={on ? "" : undefined} aria-labelledby="proof-title">
      <div className="wrap">
        <div className={s.head}>
          <h2 className="h2" id="proof-title">Leads worth answering.</h2>
          <p className={s.lead}>Every shopper who reaches you has paid to search, and arrives knowing what they want.</p>
        </div>
        <ul className={b.proof}>
          {STATS.map((x, i) => (
            <li key={x.label} className={`${b.stat} ${i % 2 ? b.lime : ""} ${x.big.length > 4 ? s.word : ""}`}>
              <b>{x.big}</b>
              <span className={b.statFoot}><span className={b.statLabel}>{x.label}</span><span className={b.statLine}>{x.line}</span></span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

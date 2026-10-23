"use client";

import { useRef } from "react";
import { ChatBar } from "./ChatBar";
import { Icon } from "./Icons";
import { useInView } from "@/hooks/useInView";
import { SUGGESTED } from "@/lib/walkthrough";
import s from "./MidCta.module.css";

/* Straight after the walkthrough: its first screen, for real. The same chat card from the Figma
   chat page (239:57778), now a working search, with the suggested searches filling the field. */
export function MidCta() {
  const [ref, inView] = useInView<HTMLDivElement>();
  const q = useRef<HTMLInputElement>(null);
  return (
    <section className="section wrap" aria-labelledby="mid-title">
      <div className={`${s.split} reveal ${inView ? "in" : ""}`} ref={ref}>
        <div className={s.copy}>
          <h2 className={s.title} id="mid-title">Your turn.</h2>
          <p className="lead">Tell CarXprt what you’re looking for, the way you’d say it to a friend. Searching is free.</p>
        </div>
        <div className={s.card} data-ui="">
          <ChatBar name="q" placeholder="Find me a family SUV under $40k near 78701" inputRef={q} />
          <div className={s.suggest}>
            <p className={s.label}>Suggested searches</p>
            <ul>
              {SUGGESTED.map((c) => (
                <li key={c}>
                  <button type="button" onClick={() => { if (q.current) { q.current.value = c; q.current.focus(); } }}>
                    <Icon name="search" />{c}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

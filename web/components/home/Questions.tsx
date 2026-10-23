"use client";

import { useRef, useState } from "react";
import { FAQ, FAQ_SCHEMA } from "@/lib/faq";
import s from "./Questions.module.css";

/* Questions, laid out like wearedirect.co: the heading and the topics stay put on the left while the answers
   scroll on the right. Each answer is a filled tile; one opens at a time (details with a shared name), and the
   open one turns lime. The live site's FAQ, word for word, with its FAQPage schema. */

export function Questions() {
  const [on, setOn] = useState(FAQ[0].id);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const topic = FAQ.find((t) => t.id === on)!;

  // arrow keys move between the topics, as a tab list should
  const onKey = (e: React.KeyboardEvent, i: number) => {
    const d = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const n = (i + d + FAQ.length) % FAQ.length;
    setOn(FAQ[n].id);
    tabs.current[n]?.focus();
  };

  return (
    <section className={`section ${s.questions}`} aria-labelledby="faq-title">
      <div className={`wrap ${s.grid}`}>
        <div className={s.side}>
          <h2 className="h2" id="faq-title">Questions, answered.</h2>
          <p className={s.lead}>What people ask before they start. Anything else, write to <a href="mailto:support@carxprt.com">support@carxprt.com</a>.</p>
          <div className={s.topics} role="tablist" aria-label="Topics" aria-orientation="vertical">
            {FAQ.map((t, i) => (
              <button key={t.id} ref={(el) => { tabs.current[i] = el; }} type="button" role="tab" id={`faq-${t.id}`} aria-selected={t.id === on}
                aria-controls="faq-panel" tabIndex={t.id === on ? 0 : -1} className={s.topic} onClick={() => setOn(t.id)} onKeyDown={(e) => onKey(e, i)}>
                {t.name}<span>{t.items.length}</span>
              </button>
            ))}
          </div>
        </div>
        {/* key: a new topic starts with its answers closed and fades in */}
        <div className={s.list} role="tabpanel" id="faq-panel" aria-labelledby={`faq-${on}`} key={on}>
          {topic.items.map((qa, i) => (
            <details key={qa.q} name={`faq-${on}`} className={s.item} open={i === 0} style={{ "--i": i } as React.CSSProperties}>
              <summary><span>{qa.q}</span><i aria-hidden="true" /></summary>
              <p>{qa.a}</p>
            </details>
          ))}
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />
    </section>
  );
}

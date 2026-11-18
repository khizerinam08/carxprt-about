"use client";

import { useInView } from "@/hooks/useInView";
import { ROAD, STORY, type Chapter } from "@/lib/owners";
import { OWNER_CARDS } from "./OwnerCards";
import s from "./OwnerStops.module.css";

/* One car, its first year: the five Owner mode moments as a list, the words beside the product card on a
   dotted board, sides alternating. The cards are shown finished (no scroll scene); each row rises in on view */

function Stop({ c, i }: { c: Chapter; i: number }) {
  const [ref, inView] = useInView<HTMLLIElement>();
  const Card = OWNER_CARDS[i];
  return (
    <li ref={ref} className={`${s.stop} reveal ${inView ? "in" : ""}`}>
      <div className={s.words}>
        <p className={s.step}><span>{String(i + 1).padStart(2, "0")}</span>{c.miles.toLocaleString("en-US")} mi</p>
        <h3>{c.head}</h3>
        <p>{c.body}</p>
      </div>
      <div className={`${s.board} dots`}><div className={s.slot}><Card /></div></div>
    </li>
  );
}

export function OwnerStops() {
  return (
    <section id="how-it-works" className={`section ${s.stops}`} aria-labelledby="stops-title">
      <div className="wrap">
        <div className={s.head}>
          <h2 className="h2" id="stops-title">{ROAD.head.map((l) => <span key={l}>{l}</span>)}</h2>
          <p className={s.lead}>{ROAD.lead}</p>
        </div>
        <ol className={s.list}>
          {STORY.map((c, i) => <Stop key={c.id} c={c} i={i} />)}
        </ol>
      </div>
    </section>
  );
}

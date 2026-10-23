import { Icon } from "../Icons";
import { HOURS, PRICE, TOTAL_HOURS, fmtUSD } from "@/lib/problemMath";
import { PAINS, added } from "./pains";
import s from "./Receipt.module.css";

/* The old way as one itemised bill, set in the Figma design system: the car card's surface, an H4
   title, H5 lines with what each step puts on the bill listed underneath, and H2 totals. The four lines
   are on the form from the start; each one prints its time and money as the Problem section reaches it,
   and the line in play is tinted lime, runs its clock and prints its bill lines one by one (--f, 0..1
   through the step). The step list beside it carries the sub-steps; phones and short screens hide that
   list, so there each line shows its sub-steps instead of its bill lines.
   `stage` is -1..3. Problem writes the running figures into the refs, the [data-rt] times and --f; the
   markup itself holds the finished bill, which is what phones and short screens show. */
export function Receipt({ stage, over, timeRef, barRef, priceRef }: {
  stage: number;
  over: number;
  timeRef: React.Ref<HTMLSpanElement>;
  barRef: React.Ref<HTMLSpanElement>;
  priceRef: React.Ref<HTMLSpanElement>;
}) {
  return (
    <div className={s.receipt} data-ui="">
      <header className={s.head}>
        <p className={s.title}>Your car purchase</p>
        <p className={s.sub}>The usual way, step by step</p>
      </header>
      <ol className={s.rows}>
        {PAINS.map((p, i) => (
          <li key={p.label} data-row={i} className={`${i <= stage ? s.in : ""} ${i === stage ? s.now : ""}`}>
            <div className={s.line}>
              <span className={s.icon} aria-hidden="true"><Icon name={p.icon} /></span>
              <span className={s.label} data-label="">{p.label}</span>
              <span className={s.time} data-rt={i}>{HOURS[i]}</span>
              {added(p) ? <span className={s.add}>+{fmtUSD(added(p))}</span> : <span className={s.none} />}
              <div className={s.detail}>
                <div>
                  <ul className={s.bill}>
                    {p.bill.map((l, j) => (
                      <li key={l.label} style={{ "--j": (j / p.bill.length) * 0.85 } as React.CSSProperties}>
                        <span>{l.label}</span>
                        {l.usd ? <b className={s.plus}>+{fmtUSD(l.usd)}</b> : <b>{l.text}</b>}
                      </li>
                    ))}
                  </ul>
                  <ul className={s.points}>
                    {p.items.map((it) => <li key={it}>{it}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ol>
      <div className={s.totals}>
        <div className={s.total}>
          <span className={s.k}>Time spent</span>
          <span className={s.v} ref={timeRef}>{TOTAL_HOURS}</span>
          <span className={s.track}><span className={s.fill} ref={barRef} /></span>
          <span className={s.note}>Spread over 3 to 5+ days</span>
        </div>
        <div className={s.total}>
          <span className={s.k}>You sign for</span>
          <span className={`${s.v} ${over > 0 ? s.up : ""}`} ref={priceRef}>{fmtUSD(PRICE[PRICE.length - 1])}</span>
          <span className={s.note}>
            {over > 0 && <b className={s.delta}>+{fmtUSD(over)}</b>}
            Advertised {fmtUSD(PRICE[0])}
          </span>
        </div>
      </div>
    </div>
  );
}

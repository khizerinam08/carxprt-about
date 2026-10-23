"use client";

import { Icon, Logo } from "./Icons";
import { useInView } from "@/hooks/useInView";
import s from "./Compare.module.css";

type Kind = "yes" | "paid" | "part" | "no";

/* Labels once on the left, icons only under each company; CarXprt's column sits on its own raised panel.
   "paid" = only on a paid plan (CarXprt Plus/Pro included). Every cell is sourced in compare-sources.md (checked Oct 2026). */
const COLS = ["CarXprt", "Cars.com", "CarGurus"];
const ROWS: [string, Kind, Kind, Kind][] = [
  ["Plain-language search", "yes", "yes", "yes"],
  ["Multi-dealer inventory", "yes", "yes", "yes"],
  ["Fair-price score", "yes", "yes", "yes"],
  ["Full cost to own", "yes", "no", "no"],
  ["AI negotiator", "paid", "no", "no"],
  ["Private contact details", "yes", "no", "no"],
  ["Out-the-door price", "yes", "part", "part"],
  ["Human expert", "paid", "no", "no"],
];

const SAY: Record<Kind, string> = { yes: "Yes", paid: "Paid plan", part: "Partly", no: "Not offered" };

function Mark({ kind, label = true }: { kind: Kind; label?: boolean }) {
  return (
    <span className={`${s.mk} ${s[kind]}`}>
      {(kind === "yes" || kind === "paid") && <Icon name="check" />}
      {kind === "no" && <Icon name="minus" />}
      {label && <span className="sr-only">{SAY[kind]}</span>}
    </span>
  );
}

export function Compare() {
  const [headRef, headIn] = useInView<HTMLDivElement>();
  const [tableRef, tableIn] = useInView<HTMLTableElement>();

  return (
    <section className="section wrap" id="compare" aria-labelledby="compare-title">
      <div className={`head ${s.head} reveal ${headIn ? "in" : ""}`} ref={headRef}>
        <h2 className="h2" id="compare-title">CarXprt vs. the usual places to shop.</h2>
      </div>
      <table className={`${s.cmp} reveal ${tableIn ? "in" : ""}`} ref={tableRef} aria-labelledby="compare-title">
        <thead>
          <tr>
            <th scope="col"><span className="sr-only">Feature</span></th>
            {COLS.map((name, j) => (
              <th scope="col" key={name} className={j === 0 ? s.cx : ""}>
                {j === 0
                  ? <>
                      <Logo className={s.full} />
                      {/* the logo's lime mark alone, for narrow screens */}
                      <svg className={s.mark} viewBox="0 0 28 28" aria-hidden="true"><use href="#logo" width="130" height="28" /></svg>
                      <span className="sr-only">{name}</span>
                    </>
                  : name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROWS.map(([label, ...cells]) => (
            <tr key={label}>
              <th scope="row">{label}</th>
              {cells.map((kind, j) => <td key={COLS[j]} className={j === 0 ? s.cx : ""}><Mark kind={kind} /></td>)}
            </tr>
          ))}
        </tbody>
      </table>
      <p className={s.legend}>
        <span><Mark kind="paid" label={false} />Paid plan</span>
        <span><Mark kind="part" label={false} />Partly</span>
      </p>
    </section>
  );
}

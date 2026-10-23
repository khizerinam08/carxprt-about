"use client";

import { useEffect, useRef, useState } from "react";
import { clamp, useScrollFrame } from "@/hooks/useScroll";
import { useLift } from "@/hooks/useLift";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { HOURS, MIN, PRICE, TOTAL_HOURS, fmtTime, fmtUSD, minutesAt, stageAt } from "@/lib/problemMath";
import { PAINS } from "./pains";
import { Receipt } from "./Receipt";
import s from "./Problem.module.css";

/* Sticky journey: the steps beside one receipt that prints a line per step. Time follows scroll;
   the price steps up per stage. Phones and short screens get the finished receipt in normal flow. */
const TOTAL = MIN[MIN.length - 1];
const LAST = PAINS.length - 1;
// where the section pins (the same media query as the CSS)
const PIN = "(min-width: 721px) and (min-height: 651px)";
// least space between one step's text and the next step's title when steps follow their receipt lines
const GAP = 12;

export function Problem() {
  const sectionRef = useRef<HTMLElement>(null);
  const timeRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const priceRef = useRef<HTMLSpanElement>(null);
  const pinned = useRef(false);
  const shown = useRef(PRICE[LAST]);
  // the finished bill until the scroll says otherwise (what phones and no-script see)
  const [stage, setStage] = useState(LAST);
  const reduce = useReducedMotion();

  // the receipt only prints along the scroll where the section pins
  useEffect(() => {
    const mq = matchMedia(PIN);
    const on = () => {
      pinned.current = mq.matches;
      if (!mq.matches) {
        setStage(LAST);
        // back to the finished bill: every line's hours and every sub-step
        sectionRef.current?.querySelectorAll<HTMLElement>("[data-row]").forEach((row) => row.style.removeProperty("--f"));
        sectionRef.current?.querySelectorAll<HTMLElement>("[data-rt]").forEach((t) => { t.textContent = HOURS[Number(t.dataset.rt)]; });
        if (timeRef.current) timeRef.current.textContent = TOTAL_HOURS;
      }
      dispatchEvent(new Event("scroll"));
    };
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  // pinned: each step sits level with its receipt line and follows it as lines open and close. If a step's
  // text runs taller than its line, the next receipt line moves down to make room, so the pairs stay level.
  useEffect(() => {
    const sec = sectionRef.current;
    const steps = [...(sec?.querySelectorAll<HTMLElement>("[data-step]") ?? [])];
    const rows = [...(sec?.querySelectorAll<HTMLElement>("[data-row]") ?? [])];
    const list = steps[0]?.parentElement;
    if (!sec || !list) return;
    const mq = matchMedia(PIN);
    const clear = () => {
      sec.removeAttribute("data-aligned");
      list.style.height = "";
      steps.forEach((st) => { st.style.top = ""; });
      rows.forEach((row) => { row.style.marginTop = ""; });
    };
    const align = () => {
      if (!mq.matches) return clear();
      sec.setAttribute("data-aligned", "");
      const base = list.getBoundingClientRect().top;
      let bottom = -Infinity;
      steps.forEach((st, i) => {
        const row = rows[i], label = row?.querySelector<HTMLElement>("[data-label]"), title = st.firstElementChild as HTMLElement;
        if (!row || !label) return;
        row.style.marginTop = "";
        // centre the step's title on the line's label
        const l = label.getBoundingClientRect();
        let top = l.top + l.height / 2 - base - title.offsetHeight / 2;
        const push = bottom + GAP - top;
        if (push > 0) {
          row.style.marginTop = `${push.toFixed(1)}px`;
          top += push;
        }
        st.style.top = `${top.toFixed(1)}px`;
        bottom = top + st.offsetHeight;
      });
      list.style.height = `${Math.max(0, bottom).toFixed(1)}px`;
    };
    // sizes change while lines and steps open (their transitions), on resize and when fonts load
    const ro = new ResizeObserver(align);
    [...steps, ...rows].forEach((el) => ro.observe(el));
    mq.addEventListener("change", align);
    align();
    return () => {
      ro.disconnect();
      mq.removeEventListener("change", align);
      clear();
    };
  }, []);

  // pinned on a tall screen: the title, steps and receipt sit in the middle of the stage (see useLift)
  useLift(sectionRef, PIN, () => {
    const sec = sectionRef.current, sticky = sec?.firstElementChild as HTMLElement | null;
    const title = sec?.querySelector("h2"), bill = sec?.querySelector("[data-ui]");
    if (!sticky || !title || !bill) return 0;
    const cs = getComputedStyle(sticky);
    const room = sticky.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
    const list = sec?.querySelector("[data-step]")?.parentElement;
    const bottom = Math.max(bill.getBoundingClientRect().bottom, list?.getBoundingClientRect().bottom ?? 0);
    return room - (bottom - title.getBoundingClientRect().top);
  });

  useScrollFrame(({ vh }) => {
    const el = sectionRef.current;
    if (!el || !pinned.current) return;
    const r = el.getBoundingClientRect();
    const p = clamp(-r.top / (r.height - vh));
    const m = minutesAt(p);
    const now = r.top > vh * 0.25 ? -1 : stageAt(Math.max(p, 0.001));
    if (timeRef.current) timeRef.current.textContent = m >= TOTAL ? TOTAL_HOURS : fmtTime(m);
    barRef.current?.style.setProperty("--t", (m / TOTAL).toFixed(4));
    // printed lines show their hours, the line in play runs its own clock, lines ahead stay blank
    el.querySelectorAll<HTMLElement>("[data-rt]").forEach((t) => {
      const i = Number(t.dataset.rt);
      t.textContent = i > now ? "—" : i < now || m >= TOTAL ? HOURS[i] : fmtTime(clamp(m - MIN[i], 0, MIN[i + 1] - MIN[i]));
    });
    // how far through its step each line is (the line in play prints its sub-steps as this grows)
    el.querySelectorAll<HTMLElement>("[data-row]").forEach((row) => {
      const i = Number(row.dataset.row);
      row.style.setProperty("--f", (i < now ? 1 : i > now ? 0 : clamp((m - MIN[i]) / (MIN[i + 1] - MIN[i]))).toFixed(3));
    });
    setStage(now);
  });

  // count the price up (or back) to the stage's value
  const target = PRICE[Math.max(0, stage)];
  useEffect(() => {
    const from = shown.current, t0 = performance.now();
    let raf = 0;
    const step = (t: number) => {
      const k = reduce ? 1 : clamp((t - t0) / 700), e = 1 - Math.pow(1 - k, 3);
      shown.current = from + (target - from) * e;
      if (priceRef.current) priceRef.current.textContent = fmtUSD(shown.current);
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, reduce]);

  const over = target - PRICE[0];
  const active = Math.max(0, stage);

  return (
    <section className={s.problem} ref={sectionRef} id="old-way" aria-labelledby="old-way-title">
      <div className={s.sticky}>
        <div className={`wrap ${s.grid}`}>
          {/* across both columns so the heading holds two lines */}
          <h2 className={`h2 ${s.title}`} id="old-way-title">Four steps. Fourteen hours. Surprises at the end.</h2>
          <div className={s.copy}>
            <ol className={s.steps}>
              {PAINS.map((p, i) => (
                <li key={p.title} data-step="" className={`${s.step} ${i === active ? s.on : ""}`}>
                  <h3>{p.title}</h3>
                  <div className={s.more}>
                    <div>
                      <p>{p.body}</p>
                      <ul className={s.points}>{p.items.map((it) => <li key={it}>{it}</li>)}</ul>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className={s.visual}>
            <Receipt stage={stage} over={over} timeRef={timeRef} barRef={barRef} priceRef={priceRef} />
          </div>
        </div>
      </div>
    </section>
  );
}

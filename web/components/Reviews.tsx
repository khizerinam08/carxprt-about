"use client";

import { animate, motion, useMotionValue, type PanInfo } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "./Icons";
import { useInView } from "@/hooks/useInView";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { PLACEHOLDER_REVIEWS, REVIEWS, TRUSTPILOT_URL, type Review } from "@/lib/reviews";
import s from "./Reviews.module.css";

const DEV = process.env.NODE_ENV !== "production";

// Apple's momentum projection (Designing Fluid Interfaces): where a flick would come to rest
const project = (v: number, d = 0.998) => ((v / 1000) * d) / (1 - d);
// critically damped by default (no overshoot); a touch of bounce only after a real flick
const settle = { type: "spring", bounce: 0, duration: 0.45 } as const;
const flickSettle = { type: "spring", bounce: 0.15, duration: 0.5 } as const;

function Stars({ rating, small = false }: { rating: number; small?: boolean }) {
  return (
    <span className={`${s.stars} ${small ? s.small : ""}`} role="img" aria-label={`Rated ${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => <span key={n} className={n <= Math.round(rating) ? s.on : ""}><Icon name="star" /></span>)}
    </span>
  );
}

/* one cell of the strip: the rating, the review as a quote, then who wrote it and when */
function Quote({ r }: { r: Review }) {
  return (
    <article className={s.cell}>
      <Stars rating={r.rating} small />
      <p className={s.quote}>“{r.text}”</p>
      <p className={s.who}><b>{r.name}</b><span>{r.date}</span></p>
    </article>
  );
}

function Wordmark() {
  return <a className={s.brand} href={TRUSTPILOT_URL} target="_blank" rel="noopener noreferrer"><span className={s.brandStar}><Icon name="star" /></span>Trustpilot</a>;
}

/* While the Trustpilot profile has no reviews, production shows no review section at all
   (an empty state under "Real buyers. Real numbers." read as a contradiction). Dev shows placeholders. */
export function Reviews() {
  return REVIEWS.length || DEV ? <ReviewStrip /> : null;
}

/* One bordered strip (Missive's testimonials): the overall rating in the first cell, then the reviews
   as quote cells divided by rules, moved with the arrows underneath. The rating is worked out from the
   reviews shown, so it can only ever say what the list says. Direct manipulation per the apple-design
   skill: 1:1 drag, momentum projected from release velocity, snap to the nearest cell, rubber-band at
   the ends. Arrow buttons and arrow keys do the same. */
function ReviewStrip() {
  const list = REVIEWS.length ? REVIEWS : PLACEHOLDER_REVIEWS;
  const avg = list.reduce((a, r) => a + r.rating, 0) / list.length;
  const reduce = useReducedMotion();
  const [headRef, headIn] = useInView<HTMLDivElement>();

  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const opacity = useMotionValue(1);
  const [index, setIndex] = useState(0);
  const [bounds, setBounds] = useState({ step: 1, max: 0, last: 0 });

  // cell step and how far the track can travel, re-measured on resize
  useEffect(() => {
    const measure = () => {
      const v = viewport.current, t = track.current;
      if (!v || !t || !t.children.length) return;
      const step = (t.children[0] as HTMLElement).offsetWidth;
      const max = Math.max(0, t.scrollWidth - v.clientWidth);
      setBounds({ step, max, last: Math.ceil(max / step) });
    };
    measure();
    addEventListener("resize", measure);
    return () => removeEventListener("resize", measure);
  }, [list.length]);

  const go = useCallback((i: number, velocity = 0) => {
    const next = Math.min(bounds.last, Math.max(0, i));
    const target = -Math.min(bounds.max, next * bounds.step);
    setIndex(next);
    if (reduce) {
      // cross-fade instead of travel
      animate(opacity, [0, 1], { duration: 0.25 });
      x.set(target);
      return;
    }
    const v = Math.max(-4000, Math.min(4000, velocity)); // guard against absurd synthetic velocities
    animate(x, target, { ...(Math.abs(v) > 400 ? flickSettle : settle), velocity: v });
  }, [bounds, reduce, opacity, x]);

  useEffect(() => { go(Math.min(index, bounds.last)); }, [bounds]); // eslint-disable-line react-hooks/exhaustive-deps

  const onDragEnd = (_: unknown, info: PanInfo) => {
    const resting = x.get() + project(info.velocity.x);
    go(Math.round(-resting / bounds.step), info.velocity.x);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") { e.preventDefault(); go(index + 1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); go(index - 1); }
  };

  return (
    <section className="section" aria-labelledby="reviews-title">
      <div className="wrap">
        <div className={`${s.head} reveal ${headIn ? "in" : ""}`} ref={headRef}>
          <h2 className="h2" id="reviews-title">What buyers say.</h2>
        </div>

        <div className={s.strip}>
          <div className={s.summary}>
            <p className={s.score}>{avg.toFixed(1)}</p>
            <Stars rating={avg} />
            <p className={s.count}>Based on {list.length} {list.length === 1 ? "review" : "reviews"}</p>
            <Wordmark />
          </div>
          <div className={s.viewport} ref={viewport} role="region" aria-roledescription="carousel" aria-label="Reviews" tabIndex={0} onKeyDown={onKey}>
            <motion.div
              ref={track}
              className={s.track}
              style={{ x, opacity }}
              drag="x"
              dragConstraints={{ left: -bounds.max, right: 0 }}
              dragElastic={0.14}
              dragMomentum={false}
              onDragEnd={onDragEnd}
            >
              {list.map((r, i) => <Quote key={i} r={r} />)}
            </motion.div>
          </div>
        </div>

        {bounds.last > 0 && (
          <div className={s.nav}>
            <button type="button" className={s.navBtn} onClick={() => go(index - 1)} disabled={index === 0} aria-label="Previous reviews"><Icon name="arrow" /></button>
            <button type="button" className={s.navBtn} onClick={() => go(index + 1)} disabled={index >= bounds.last} aria-label="Next reviews"><Icon name="arrow" /></button>
          </div>
        )}
      </div>
    </section>
  );
}

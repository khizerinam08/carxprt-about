"use client";

import { useEffect, useRef } from "react";
import { VOICE, type Cell } from "@/lib/bento";
import { Icon } from "../Icons";
import s from "./Bento.module.css";

/* A bento cell (wafer.ai's feature grid): a board (the hero's dot grid) where the cell's product piece builds
   itself the first time it comes into view, piece by piece, the way mailerbot.com's features assemble on their
   grid; a few keep a quiet loop going while they're on screen. The pieces are inert pictures of the product
   (data-ui, hidden from assistive tech); the heading and text carry the words. The home page's bento
   (components/home-v2/Bento) places these in its own grid. */

/* --k: the order a piece lands in */
const k = (n: number) => ({ "--k": n }) as React.CSSProperties;

function Voice() {
  return (
    <div className={s.voice}>
      <span className={`${s.p} ${s.listen}`} style={k(0)}>
        <span className={s.bars}>{[0, 1, 2, 3, 4, 5, 6].map((b) => <i key={b} style={{ "--b": b } as React.CSSProperties} />)}</span>
        Listening
      </span>
      <p className={`${s.p} ${s.said}`} style={k(1)}>“{VOICE.said}”</p>
      <span className={`${s.p} ${s.result}`} style={k(2)}><Icon name="arrow" />{VOICE.result}</span>
    </div>
  );
}

const PIECES: Record<string, () => React.JSX.Element> = { voice: Voice };

/* data-in: set once, when the cell first comes into view (the piece assembles); data-live: while it's on
   screen (the loops run). `piece` replaces the cell's own (Your number stays yours brings its own) */
export function BentoCell({ c, i, piece }: { c: Cell; i: number; piece?: () => React.JSX.Element }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      el.toggleAttribute("data-live", e.isIntersecting);
      // early enough that a row resting at the bottom of the screen never sits there empty
      if (e.isIntersecting && e.intersectionRatio >= 0.15) el.setAttribute("data-in", "");
    }, { threshold: [0, 0.15] });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const Piece = piece ?? PIECES[c.id];
  return (
    <article ref={ref} className={s.cell} style={{ "--c": i } as React.CSSProperties}>
      <div className={s.board} data-ui="" aria-hidden="true"><Piece /></div>
      <div className={s.text}>
        <h3>{c.head}</h3>
        <p>{c.body}</p>
        {c.note && <p className={s.note}>{c.note}</p>}
      </div>
    </article>
  );
}

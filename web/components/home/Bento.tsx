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

/* the live voice session pill from the redesign's voice bar (Figma 1561:22583): its waveform (these bar heights),
   mic, end call and expand; the waveform talks while the cell is on screen. Under it, what you said and the agent's reply */
const WAVE = [15.68, 7.35, 3.43, 9.31, 15.68, 9.31, 13.23, 7.35, 4.41, 15.68, 13.23, 9.31, 13.23, 22.05, 18.13, 12.25, 8.33, 12.25, 6.37, 14.21, 11.27, 19.11, 14.21, 11.27, 18.13, 8.33, 3.43, 11.27, 19.11, 11.27];

function Voice() {
  return (
    <div className={s.voice}>
      <span className={`${s.p} ${s.session}`} style={k(0)}>
        <span className={s.wave}>{WAVE.map((h, b) => <i key={b} style={{ "--h": `${h}px`, "--b": b } as React.CSSProperties} />)}</span>
        <span className={s.ctrls}>
          <span className={s.mic}><Icon name="mic" /></span>
          <span className={s.end}><Icon name="phone-off" /></span>
          <span className={s.exp}><Icon name="expand" /></span>
        </span>
      </span>
      <p className={`${s.p} ${s.said}`} style={k(1)}>“{VOICE.said}”</p>
      <p className={`${s.p} ${s.agent}`} style={k(2)}>
        <span className={s.avatar}><svg viewBox="0 0 15.68 15.68"><use href="#mark" /></svg></span>
        <span className={s.reply}>{VOICE.reply}</span>
      </p>
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

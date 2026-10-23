"use client";

import { useEffect, useImperativeHandle, useRef } from "react";
import { AVENUES, DEALERS, HIGHWAY, MAP, PARKS, PLACES, RIVER, STREETS, VIEW, WINNER, YOU, ZIP, type Frame, type Pt } from "@/lib/howMap";
import s from "./DealerMap.module.css";

/* A flat map of the dealers around the buyer's ZIP, drawn from lib/howMap. The board moves as one layer
   (the camera); the pins sit in a layer above it at a constant size, placed on the board's points each
   time the parent calls `apply`. Decorative: the chapter copy carries the words. */

/* `fit` (the list version): instead of the frame's camera, place these pins as large as they fit, with their
   tags inside the frame and clear of `inset` (px: top, right, bottom, left) */
export type Fit = { ids: number[]; you: boolean; inset: [number, number, number, number] };
export type MapHandle = { apply: (f: Frame, fit?: Fit) => void };

const rad = (MAP.turn * Math.PI) / 180, COS = Math.cos(rad), SIN = Math.sin(rad);
const turn = ([x, y]: Pt): Pt => {
  const dx = x - MAP.w / 2, dy = y - MAP.h / 2;
  return [MAP.w / 2 + dx * COS - dy * SIN, MAP.h / 2 + dx * SIN + dy * COS];
};
const line = (pts: Pt[]) => "M" + pts.map((p) => p.join(" ")).join("L");

/* the largest scale (and the offsets) at which every pin's box fits the frame. A box is [x, y, left, right,
   up, down]: its point in board units, then how far its dot and tag reach in px. For a given scale each
   axis leaves a range of offsets that fit, so search the scale */
function fitIn(boxes: number[][], w: number, h: number, inset: Fit["inset"], lo: number, hi: number) {
  const [t, r, b, l] = inset;
  const range = (sc: number, axis: 0 | 1) => {
    const [min, max] = axis ? [t, h - b] : [l, w - r];
    const from = Math.max(...boxes.map((x) => min + x[2 + axis * 2] - x[axis] * sc));
    const to = Math.min(...boxes.map((x) => max - x[3 + axis * 2] - x[axis] * sc));
    return [from, to];
  };
  const ok = (sc: number) => {
    const [a, z] = range(sc, 0), [c, d] = range(sc, 1);
    return a <= z && c <= d;
  };
  let sc = lo;
  if (ok(hi)) sc = hi;
  else for (let i = 0, a = lo, z = hi; i < 24; i++) { const m = (a + z) / 2; if (ok(m)) { sc = m; a = m; } else z = m; }
  const [a, z] = range(sc, 0), [c, d] = range(sc, 1);
  return { sc, tx: (a + z) / 2, ty: (c + d) / 2 };
}

/* `anchor`: where the camera's point lands in the frame, as fractions of its width and height.
   `compact` (small frames): dealers other than the winner are plain dots */
export function DealerMap({ ref, anchor = [0.5, 0.5], compact = false }: { ref?: React.Ref<MapHandle>; anchor?: Pt; compact?: boolean }) {
  const box = useRef<HTMLDivElement>(null);
  const world = useRef<HTMLDivElement>(null);
  const board = useRef<SVGSVGElement>(null);
  const you = useRef<HTMLDivElement>(null);
  const pins = useRef<(HTMLDivElement | null)[]>([]);
  const routes = useRef<(SVGGElement | null)[]>([]);
  const car = useRef<SVGGElement>(null);
  const size = useRef({ w: 0, h: 0 });
  const last = useRef<[Frame, Fit?] | null>(null);
  const shown = useRef<string[]>([]);

  const apply = (f: Frame, fit?: Fit) => {
    last.current = [f, fit];
    const { w, h } = size.current;
    if (!w || !world.current) return;
    // write the labels first, so a fit measures the tags as they will read
    DEALERS.forEach((_, i) => {
      const em = pins.current[i]?.querySelector("em");
      if (em && shown.current[i] !== f.values[i]) { shown.current[i] = f.values[i]; em.textContent = f.values[i]; }
    });
    const base = Math.max(w / VIEW[0], h / VIEW[1]);
    let sc = base * f.cam.z, tx: number, ty: number;
    if (fit) {
      const box = (el: HTMLElement | null, pt: Pt, left = false): number[] => {
        const tag = (el?.querySelector("span")?.offsetWidth ?? 0) + 16;
        return [...turn(pt), left ? tag : 12, left ? 12 : tag, 20, 20];
      };
      const boxes = fit.ids.map((i) => box(pins.current[i], DEALERS[i].at, DEALERS[i].left));
      if (fit.you) boxes.push(box(you.current, YOU));
      ({ sc, tx, ty } = fitIn(boxes, w, h, fit.inset, base * 0.3, base * 2.4));
    } else {
      const [cx, cy] = turn([f.cam.x, f.cam.y]);
      tx = anchor[0] * w - cx * sc;
      ty = anchor[1] * h - cy * sc;
    }
    world.current.style.transform = `translate(${tx.toFixed(1)}px,${ty.toFixed(1)}px) scale(${sc.toFixed(4)})`;
    const place = (el: HTMLElement, pt: Pt) => {
      const [x, y] = turn(pt);
      el.style.transform = `translate(${(tx + x * sc).toFixed(1)}px,${(ty + y * sc).toFixed(1)}px)`;
    };

    if (you.current) {
      place(you.current, YOU);
      // a fit that leaves you out would otherwise show you half cut at the frame's edge
      you.current.style.opacity = fit && !fit.you ? "0" : "";
    }
    DEALERS.forEach((d, i) => {
      const el = pins.current[i];
      if (!el) return;
      place(el, d.at);
      el.style.opacity = f.pin[i].toFixed(3);
      el.toggleAttribute("data-win", i === WINNER && f.win > 0.5);
    });
    routes.current.forEach((g, i) => {
      if (!g) return;
      g.style.setProperty("--d", f.routes[i].toFixed(4));
      g.style.opacity = f.routeOp[i].toFixed(3);
    });

    // the car drives the winner's route from you to the dealer, nose first (the picture faces left)
    const path = routes.current[WINNER]?.querySelector("path");
    if (car.current && path) {
      car.current.style.opacity = f.drive > 0 ? "1" : "0";
      if (f.drive > 0) {
        const len = path.getTotalLength(), d = len * 0.93 * f.drive;
        const a = path.getPointAtLength(Math.max(0, d - 1)), b = path.getPointAtLength(d + 1);
        const deg = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI + 180;
        car.current.setAttribute("transform", `translate(${b.x.toFixed(1)} ${b.y.toFixed(1)}) rotate(${deg.toFixed(1)})`);
      }
    }
  };

  useImperativeHandle(ref, () => ({ apply }));

  // keep the frame's size, and re-place everything when it changes
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      size.current = { w: el.clientWidth, h: el.clientHeight };
      if (last.current) apply(...last.current);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div ref={box} className={`${s.map} ${compact ? s.compact : ""}`} aria-hidden="true">
      <div ref={world} className={s.world}>
        <svg ref={board} className={s.board} viewBox={`0 0 ${MAP.w} ${MAP.h}`} width={MAP.w} height={MAP.h}>
          <g transform={`rotate(${MAP.turn} ${MAP.w / 2} ${MAP.h / 2})`}>
            <path className={s.streets} d={STREETS} />
            {PARKS.map(([x, y, w, h]) => <rect key={`${x}-${y}`} className={s.park} x={x} y={y} width={w} height={h} rx={22} />)}
            <path className={s.water} d={RIVER} />
            <path className={s.edge} d={AVENUES} />
            <path className={s.avenue} d={AVENUES} />
            <path className={s.highway} d={HIGHWAY} />
            {PLACES.map(([name, x, y]) => <text key={name} className={s.place} x={x} y={y}>{name}</text>)}
            {DEALERS.map((d, i) => d.route && (
              <g key={d.id} ref={(el) => { routes.current[i] = el; }} className={s.route}>
                <path className={s.casing} d={line(d.route)} pathLength={1} />
                <path className={s.lime} d={line(d.route)} pathLength={1} />
              </g>
            ))}
            <g ref={car} className={s.car}>
              <image href="/car-top.webp" x={-28} y={-10} width={56} height={20} />
            </g>
          </g>
        </svg>
      </div>
      <div ref={you} className={`${s.pin} ${s.you}`}>
        <i className={s.dot} />
        <span className={s.tag}><b>You</b><em>{ZIP}</em></span>
      </div>
      {DEALERS.map((d, i) => (
        <div key={d.id} ref={(el) => { pins.current[i] = el; }} className={`${s.pin} ${d.left ? s.left : ""} ${i === WINNER ? s.focus : ""}`} style={{ opacity: 0 }}>
          <i className={s.dot} />
          <span className={s.tag}><b>{d.name}</b><em>{d.cars} cars</em></span>
        </div>
      ))}
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";

/* One shared requestAnimationFrame loop for every scroll-linked effect on the page.
   Subscribers write straight to the DOM through refs, so scrolling never re-renders React. */
type Frame = { vh: number; y: number };
type Listener = (f: Frame) => void;

const listeners = new Set<Listener>();
let queued = false;
let bound = false;

function run() {
  queued = false;
  const f = { vh: window.innerHeight, y: window.scrollY };
  listeners.forEach((fn) => fn(f));
}
function queue() {
  if (queued) return;
  queued = true;
  requestAnimationFrame(run);
}

export function useScrollFrame(cb: Listener) {
  const ref = useRef(cb);
  ref.current = cb;
  useEffect(() => {
    const fn: Listener = (f) => ref.current(f);
    listeners.add(fn);
    if (!bound) {
      bound = true;
      addEventListener("scroll", queue, { passive: true });
      addEventListener("resize", queue);
    }
    queue();
    return () => { listeners.delete(fn); };
  }, []);
}

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

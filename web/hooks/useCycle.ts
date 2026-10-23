"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "./useReducedMotion";

/* Types each line, holds it, takes it back, then types the next, while `on`. Returns the text so far and the
   index of the line in play. With reduced motion it stays on the first line. */
export function useCycle(lines: string[], on: boolean) {
  const [text, setText] = useState(lines[0]);
  const [index, setIndex] = useState(0);
  const at = useRef({ i: 0, n: lines[0].length, dir: -1 });
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!on || reduce) return;
    let t = 0;
    const step = () => {
      const a = at.current, full = lines[a.i];
      a.n += a.dir;
      setText(full.slice(0, a.n));
      if (a.dir > 0 && a.n >= full.length) { a.dir = -1; t = window.setTimeout(step, 2000); return; }
      if (a.dir < 0 && a.n <= 0) { a.dir = 1; a.i = (a.i + 1) % lines.length; setIndex(a.i); t = window.setTimeout(step, 300); return; }
      t = window.setTimeout(step, a.dir > 0 ? 55 : 22);
    };
    t = window.setTimeout(step, 1600);
    return () => window.clearTimeout(t);
  }, [on, reduce, lines]);

  return { text, index };
}

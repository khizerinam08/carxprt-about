"use client";

import { useEffect, type RefObject } from "react";

/* Centres a pinned stage's content on tall screens. `measure` returns the stage's spare height (its inner
   height less its content); half of it is written to the section as --lift (px), or 0 when `query` doesn't
   match. The section's CSS moves its content down by --lift and takes --lift off its own top margin, so the
   content sits in the middle while pinned and still arrives the same distance after the section above.
   Measured on mount, on resize (which includes browser zoom), when the query flips and once fonts load. */
export function useLift(ref: RefObject<HTMLElement | null>, query: string, measure: () => number, deps: unknown[] = []) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mq = matchMedia(query);
    const update = () => {
      const lift = mq.matches ? Math.max(0, measure() / 2) : 0;
      el.style.setProperty("--lift", `${Math.round(lift)}px`);
    };
    update();
    addEventListener("resize", update);
    mq.addEventListener("change", update);
    document.fonts?.ready.then(update);
    return () => {
      removeEventListener("resize", update);
      mq.removeEventListener("change", update);
    };
  }, [ref, query, ...deps]); // eslint-disable-line react-hooks/exhaustive-deps
}

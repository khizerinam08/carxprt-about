"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { clamp, useScrollFrame } from "@/hooks/useScroll";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import s from "./Hero.module.css";

/* Compact, centred title (Autohaus reference) over a top-down car parked across the
   black and lime stripes from the redesign's Home hero. The car drives in from the right
   (its nose points left) and keeps rolling a little as you scroll. */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const [play, setPlay] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => { requestAnimationFrame(() => setPlay(true)); }, []);
  useScrollFrame(({ vh }) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    // 0 while the hero is in place, 1 once it has scrolled a full screen away
    el.style.setProperty("--hp", reduce ? "0" : clamp(-r.top / vh).toFixed(4));
  });

  return (
    <section className={`${s.hero} ${play ? s.play : ""}`} ref={ref} id="hero">
      <div className={`wrap ${s.head}`}>
        <h1 className={s.title}>About us</h1>
        <p className={s.sub}>CarXprt finds, checks and negotiates for you. All that’s left is the drive.</p>
      </div>
      <div className={s.road} aria-hidden="true">
        <div className={`${s.band} ${s.bandA}`} />
        <div className={`${s.band} ${s.bandB}`} />
        <div className={s.carTrack}>
          <div className={s.car}>
            <Image src="/car-top.webp" alt="" width={1594} height={700} priority sizes="(max-width: 720px) 92vw, 880px" />
          </div>
        </div>
      </div>
    </section>
  );
}

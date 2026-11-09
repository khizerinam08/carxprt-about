"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "@/hooks/useInView";
import { Icon } from "../Icons";
import s from "./Film.module.css";

/* The product film (47s, with sound), its own section after the walkthrough: the map explains the idea, then you see
   the real product. It plays muted while it's on screen and stops off screen; turning the sound on starts it again
   from the top, once through. Reduced motion: it waits for the play button */
export function Film() {
  const ref = useRef<HTMLVideoElement>(null);
  const [headRef, headIn] = useInView<HTMLDivElement>();
  const [frameRef, frameIn] = useInView<HTMLDivElement>();
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  // held: the visitor paused it, so scrolling doesn't restart it; heard: the sound has been turned on before
  const held = useRef(false), heard = useRef(false);

  useEffect(() => {
    const v = ref.current;
    if (!v || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) v.pause();
      else if (!held.current) v.play().catch(() => {});
    }, { threshold: 0.4 });
    io.observe(v);
    return () => io.disconnect();
  }, []);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    held.current = !v.paused;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  };
  const sound = () => {
    const v = ref.current;
    if (!v) return;
    if (v.muted && !heard.current) { heard.current = true; v.currentTime = 0; }
    v.muted = !v.muted;
    held.current = false;
    v.play().catch(() => {});
  };

  return (
    <section className={`section ${s.film}`} aria-labelledby="film-title">
      <div className="wrap">
        <div className={`${s.head} reveal ${headIn ? "in" : ""}`} ref={headRef}>
          <h2 className="h2" id="film-title">Watch it work.</h2>
          <p className={s.lead}>Find a car, narrow it down and message the dealer, all by voice.</p>
        </div>
        <div className={`${s.frame} reveal ${frameIn ? "in" : ""}`} ref={frameRef}>
          <video ref={ref} poster="/home/film-poster.jpg" muted loop={muted} playsInline preload="none" aria-label="CarXprt product film: finding, narrowing down and contacting a dealer about a car by voice"
            onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onVolumeChange={(e) => setMuted(e.currentTarget.muted)}>
            <source src="/home/film-sm.mp4" type="video/mp4" media="(max-width: 720px)" />
            <source src="/home/film.mp4" type="video/mp4" />
          </video>
          <div className={s.controls}>
            <button type="button" onClick={toggle} aria-label={playing ? "Pause the film" : "Play the film"}><Icon name={playing ? "pause" : "play"} /></button>
            <i aria-hidden="true" />
            <button type="button" className={muted ? s.sound : ""} onClick={sound} aria-label={muted ? undefined : "Turn the sound off"}>
              <Icon name={muted ? "volume-x" : "volume"} />{muted && "Turn sound on"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

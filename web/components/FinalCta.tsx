"use client";

import Image from "next/image";
import { Icon } from "./Icons";
import { useInView } from "@/hooks/useInView";
import { PLANS, app } from "@/lib/links";
import s from "./FinalCta.module.css";

/* Full-width closer built like the redesign Home hero (Figma 192:12102): big centred headline,
   two actions, and the side-view car parked across a black and a lime stripe of equal weight. */
export function FinalCta() {
  const [ref, inView] = useInView<HTMLDivElement>();
  return (
    <section className={`${s.final} ${inView ? s.in : ""}`} aria-labelledby="final-title">
      <div className={`wrap ${s.head}`}>
        <h2 className={s.title} id="final-title">Ready to find your next&nbsp;car?</h2>
        <p className={s.sub}>Real inventory, honest pricing, and an AI that does the heavy lifting.</p>
        <div className={s.actions}>
          <a className="btn btn-lime" href={app("/search")}>Start browsing <Icon name="arrow" /></a>
          <a className={`btn ${s.ghost}`} href={PLANS}>See pricing</a>
        </div>
      </div>
      <div className={s.road} ref={ref} aria-hidden="true">
        <span className={`${s.band} ${s.black}`} />
        <span className={`${s.band} ${s.lime}`} />
        <span className={s.floor} />
        <div className={s.car}>
          <Image src="/car-side.png" alt="" width={1728} height={578} sizes="(max-width: 720px) 92vw, 61vw" />
          <Image className={s.mirror} src="/car-side.png" alt="" width={1728} height={578} sizes="(max-width: 720px) 92vw, 61vw" />
        </div>
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { AD, CHANNELS, STOCK } from "@/lib/dealers";
import { CARS } from "@/lib/walkthrough";
import { LISTER, LISTER_CHROME } from "@/lib/links";
import { Icon } from "../Icons";
import s from "./Tools.module.css";

/* Run your lot from one place: the dealer tools the story doesn't cover, as a bento in the home page's manner
   (each cell different, its own piece of the product). Listing distribution two wide on top with the Lister
   links, inventory two wide under it, the ad generator tall on the right. The pieces assemble on first view */

const d = (n: number) => ({ "--d": n }) as React.CSSProperties;
const src = CARS[1];

function Distribute() {
  return (
    <article className={`${s.card} ${s.dist}`}>
      <div className={s.text}>
        <h3>Post everywhere, from one place.</h3>
        <p>Create a listing in CarXprt, or bring one in from your site with Lightning Lister. Then publish it to every channel and keep them in sync.</p>
        <div className={s.links}>
          <a className={`btn ${s.btnInk}`} href={LISTER_CHROME} target="_blank" rel="noopener noreferrer">Add to Chrome</a>
          <a className={s.more} href={LISTER}>More about CarXprt Lister<Icon name="arrow" /></a>
        </div>
      </div>
      <div className={s.flow} data-ui="" aria-hidden="true">
        <div className={`${s.in} ${s.source}`} style={d(0)}>
          <span className={s.thumb}><Image src={src.src} alt="" width={960} height={640} sizes="64px" /></span>
          <span className={s.who}><b>{src.name} · {src.price}</b><small>Source listing · imported with Lister</small></span>
        </div>
        <ul className={s.channels}>
          {CHANNELS.map((c, i) => (
            <li key={c} className={s.in} style={d(i + 1)}>
              <span>{c}</span>
              {i === CHANNELS.length - 1
                ? <em className={s.sync}><Icon name="flag" />Price changed · sync</em>
                : <em className={s.live}><Icon name="check" />Live</em>}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

function Ads() {
  return (
    <article className={`${s.card} ${s.ads}`}>
      <div className={s.text}>
        <h3>Listings that write themselves.</h3>
        <p>Descriptions, headlines and marketplace-ready copy for every vehicle, in seconds.</p>
      </div>
      <div className={`${s.in} ${s.doc}`} style={d(0)} data-ui="" aria-hidden="true">
        <p className={s.tabs}>{AD.tags.map((t, i) => <span key={t} className={i === 0 ? s.tabOn : ""}>{t}</span>)}</p>
        <span className={s.photo}><Image src={CARS[0].src} alt="" width={960} height={640} sizes="320px" /></span>
        <b className={`${s.in} ${s.adHead}`} style={d(1)}>{AD.head}</b>
        <p className={`${s.in} ${s.adBody}`} style={d(2)}>{AD.body}</p>
        <span className={`${s.in} ${s.generate}`} style={d(3)}><Icon name="star" />Generated · ready to post</span>
      </div>
    </article>
  );
}

function Inventory() {
  return (
    <article className={`${s.card} ${s.stock}`}>
      <div className={s.text}>
        <h3>Your whole lot, live.</h3>
        <p>Every vehicle in one table, with stale listings and pricing gaps flagged for you.</p>
      </div>
      <div className={s.table} data-ui="" aria-hidden="true">
        <p className={s.th}><span>Vehicle</span><span>Price</span><span>Listed</span><span>Status</span></p>
        {STOCK.map((r, i) => (
          <p key={r.car.src} className={`${s.in} ${s.tr}`} style={d(i)}>
            <span className={s.cell}><span className={s.thumbSm}><Image src={r.car.src} alt="" width={960} height={640} sizes="40px" /></span>{r.car.name}</span>
            <span>{r.car.price}</span>
            <span>{r.days} days</span>
            <span><em className={s[r.tone]}>{r.flag}</em></span>
          </p>
        ))}
      </div>
    </article>
  );
}

export function Tools() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.setAttribute("data-in", ""); io.disconnect(); } }, { rootMargin: "0px 0px -15% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} id="tools" className={`section ${s.tools}`} aria-labelledby="tools-title">
      <div className="wrap">
        <div className={s.head}>
          <h2 className="h2" id="tools-title">Run your lot from one place.</h2>
          <p className={s.lead}>Listings, ads and inventory in the same dashboard as your leads, so nothing gets typed twice.</p>
        </div>
        <div className={s.grid}>
          <Distribute />
          <Ads />
          <Inventory />
        </div>
      </div>
    </section>
  );
}

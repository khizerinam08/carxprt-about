import Image from "next/image";
import Link from "next/link";
import { XPRT_SEARCH } from "@/lib/links";
import { ChatBar } from "../ChatBar";
import s from "./HomeHero.module.css";

/* Home hero, from the redesign (Figma tdkZAGZd2a4B8EMYIpxLSt, node 192:12102): the headline and the AI search
   bar on the dotted ground, then the side-view car on the ink and lime stripes. The stage under the words is
   laid out in Figma pixels and scales with the page (--u is one Figma pixel at 1440 wide). The car and its
   reflection are the Figma images with the wheel badges painted out, as on the About page. */
export function HomeHero() {
  return (
    <section className={s.hero} aria-labelledby="home-title">
      <div className={s.copy}>
        <h1 className={s.title} id="home-title"><span>Find Your Perfect Car.</span> <span>Let Us Handle the Rest.</span></h1>
        <p className={s.sub}>Voice-powered AI that finds your car, negotiates the best price, and never charges hidden fees.</p>
        <div className={s.search}>
          <ChatBar name="q" placeholder="Find me a 2024 BMW M4 under $70,000 with low mileage...." />
          <p className={s.voice} aria-hidden="true">
            <span className={s.arrow}><span><Image src="/home/arrow.svg" alt="" width={17} height={35} unoptimized /></span></span>
            <span className={s.voiceText}>Try Voice Mode</span>
          </p>
        </div>
        <p className={s.unsure}>
          Not sure what car works for you?
          <Link className={s.xprt} href={XPRT_SEARCH}>
            <Image src="/home/binoculars.svg" alt="" width={14} height={14} unoptimized />
            Try Xprt Search
          </Link>
        </p>
      </div>
      <div className={s.stage} aria-hidden="true">
        <i className={s.floor} />
        <i className={s.ink} />
        <i className={s.lime} />
        <Image className={s.reflection} src="/home/car-reflection.png" alt="" width={1983} height={793} sizes="(min-width: 1440px) 1080px, 75vw" />
        <Image className={s.car} src="/home/car.png" alt="" width={2101} height={748} sizes="(min-width: 1440px) 1290px, 75vw" priority />
        <Image className={s.shadow} src="/home/car-shadow.svg" alt="" width={859} height={35} unoptimized />
      </div>
    </section>
  );
}

import Image from "next/image";
import { SIGN_IN } from "@/lib/links";
import s from "./OwnerHero.module.css";

/* The owner page's hero: the car is the subject. The words and one action (sign in to Owner mode) on the dotted
   ground, then the owner's car large in the middle, front three-quarter, on the home page's ink and lime stripes,
   which run in from the sides as the page opens. No prompt bar: that is the buyer's way in (the user) */
export function OwnerHero() {
  return (
    <section className={s.hero} aria-labelledby="owner-title">
      <div className={s.copy}>
        <h1 className={s.title} id="owner-title"><span>Manage Your Car</span> <span>Without the Hassle.</span></h1>
        <p className={s.sub}>Talk to your car. It keeps track of service, renewals and repairs, so you don’t have to.</p>
        <a className={`btn btn-lime ${s.cta}`} href={SIGN_IN}>Sign in to Owner mode</a>
      </div>
      <div className={s.stage} aria-hidden="true">
        <i className={s.floor} />
        <i className={s.ink} />
        <i className={s.lime} />
        <i className={s.shadow} />
        <Image className={s.car} src="/owners/car-front.webp" alt="" width={1460} height={826} sizes="(min-width: 1200px) 1000px, 90vw" priority />
      </div>
    </section>
  );
}

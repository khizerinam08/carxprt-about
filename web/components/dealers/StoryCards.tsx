import Image from "next/image";
import { CAR, LINES, OTD, PIPE, PROFILE, REP, SHOPPER, THREAD } from "@/lib/dealers";
import { fmtUSD } from "@/lib/problemMath";
import { ChatCard } from "../home/HowCards";
import { Icon } from "../Icons";
import c from "./StoryCards.module.css";

/* The dealer story's product cards: inert pictures of the dealer dashboard (data-ui, hidden from assistive tech;
   the chapter words carry the meaning). The markup is the finished state; in the pinned story the scroll writes
   --a (the lead's profile filling in), --m (the Responder's messages), --q (the quote shared) and --s (the sale
   counted), and each defaults to done */

const k = (n: number) => ({ "--k": n }) as React.CSSProperties;

function Car({ meta }: { meta: string }) {
  return (
    <div className={c.car}>
      <span className={c.thumb}><Image src={CAR.src} alt="" width={960} height={640} sizes="56px" /></span>
      <span className={c.who}><b>{CAR.name} · {CAR.price}</b><small>{meta}</small></span>
    </div>
  );
}

/* 1. the lead lands: who (name, ZIP and deal ID only), the car they matched, then their profile row by row */
export function LeadCard() {
  return (
    <div className={c.card} data-ui="" aria-hidden="true">
      <p className={c.head}>
        <span className={c.initials}>SR</span>
        <span className={c.thread}><b>New lead · {SHOPPER.name}</b><small>{SHOPPER.zip} · {SHOPPER.deal}</small></span>
        <span className={c.paid}><Icon name="check" />Paying subscriber</span>
      </p>
      <Car meta={`Matched your listing · ${CAR.miles}`} />
      <dl className={c.profile}>
        {PROFILE.map((p, i) => <div key={p.k} style={k(i)}><dt>{p.k}</dt><dd>{p.v}</dd></div>)}
      </dl>
    </div>
  );
}

/* 2. Xprt Responder answers, then hands pricing to a person (the home walkthrough's chat card) */
export function RespondCard() {
  return (
    <div className={c.respond}>
      <ChatCard
        icon={<Icon name="bolt" />} title="Xprt Responder"
        sub={<>with {SHOPPER.name} · replied in seconds</>}
        chip={<span className={c.handoff}><Icon name="user" />To {REP}</span>}
        lines={THREAD}
      />
    </div>
  );
}

/* 3. Deal Builder: the lines (saved defaults marked), the out-the-door total, then shared */
export function QuoteCard() {
  return (
    <div className={c.card} data-ui="" aria-hidden="true">
      <p className={c.head}>
        <span className={c.bolt}><Icon name="doc" /></span>
        <span className={c.thread}><b>Deal Builder</b><small>{SHOPPER.name} · {CAR.name}</small></span>
      </p>
      <ul className={c.lines}>
        {LINES.map((l, i) => (
          <li key={l.k} style={k(i)}>
            <span>{l.k}{l.saved && <em>Saved default</em>}</span>
            <span>{fmtUSD(l.v)}</span>
          </li>
        ))}
      </ul>
      <div className={c.total}>
        <span><small>Out the door</small><b>{fmtUSD(OTD)}</b></span>
        <span className={c.defaults}><Icon name="check" />Saved defaults applied</span>
      </div>
      <span className={c.share}>
        <span className={c.idle}>Share quote</span>
        <span className={c.sent}><Icon name="check" />Sent to {SHOPPER.name}</span>
      </span>
    </div>
  );
}

/* 4. Analytics: the deal marked sold, the week's pipeline (Sold ticks from 1 to 2), and a missed-lead alert */
export function CloseCard() {
  const max = Math.max(...PIPE.map((p) => p.v));
  return (
    <div className={c.card} data-ui="" aria-hidden="true">
      <p className={c.head}>
        <span className={c.bolt}><Icon name="gauge" /></span>
        <span className={c.thread}><b>Analytics</b><small>This week</small></span>
      </p>
      <div className={c.sold}>
        <Car meta={`${SHOPPER.name} · ${fmtUSD(OTD)}`} />
        <em className={c.soldChip}><Icon name="check" />Sold</em>
      </div>
      <ul className={c.pipe}>
        {PIPE.map((p, i) => (
          <li key={p.k} className={i === PIPE.length - 1 ? c.last : ""} style={{ "--w": p.v / max } as React.CSSProperties}>
            <span>{p.k}</span>
            <i />
            {i === PIPE.length - 1
              ? <b className={c.tick}><span>{p.v - 1}</span><span>{p.v}</span></b>
              : <b>{p.v}</b>}
          </li>
        ))}
      </ul>
      <p className={c.alert}><Icon name="flag" />2 leads waiting over 24 hrs<span>Follow up</span></p>
    </div>
  );
}

export const STORY_CARDS = [LeadCard, RespondCard, QuoteCard, CloseCard];

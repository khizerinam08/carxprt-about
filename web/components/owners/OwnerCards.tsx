import Image from "next/image";
import { ASK_THREAD, CAR, FEED, FILES, FOUND, REG, TRADE, WEAR } from "@/lib/owners";
import { Icon } from "../Icons";
import c from "../dealers/StoryCards.module.css";
import o from "./OwnerCards.module.css";

/* The owner story's product cards: inert pictures of Owner mode (data-ui, hidden from assistive tech; the
   chapter words carry the meaning). The markup is the finished state; in the pinned story the scroll writes
   --oa (files read), --og (the agent's tasks), --od (what's due), --ok (the answer) and --os (the estimate),
   each 0 → 1, and each defaults to done */

const k = (n: number) => ({ "--k": n }) as React.CSSProperties;

function Head({ icon, title, sub }: { icon: React.ReactNode; title: string; sub: string }) {
  return (
    <p className={c.head}>
      <span className={c.bolt}>{icon}</span>
      <span className={c.thread}><b>{title}</b><small>{sub}</small></span>
    </p>
  );
}

/* 1. add a car: the paperwork is read file by file, then what was found fills in */
export function AddCard() {
  return (
    <div className={`${c.card} ${o.add}`} data-ui="" aria-hidden="true">
      <Head icon={<Icon name="plus" />} title="Add a car" sub="Step 3 · Reading your files" />
      <ul className={o.files}>
        {FILES.map((f, i) => (
          <li key={f} style={k(i)}>
            <span className={o.fileIc}><Icon name="doc" /></span>{f}
            <em><span>Reading…</span><span><Icon name="check" />Read</span></em>
          </li>
        ))}
      </ul>
      <p className={o.label}>What we found</p>
      <dl className={o.found}>
        {FOUND.map((r, i) => <div key={r.k} style={k(i + 3)}><dt>{r.k}</dt><dd>{r.v}</dd></div>)}
      </dl>
    </div>
  );
}

/* 2. your car's to-do feed (Owner mode talks as the car, not an agent: the user, 18 Nov 2026): three tasks come in, then the booking gets your OK */
export function AgentCard() {
  return (
    <div className={`${c.card} ${o.agent}`} data-ui="" aria-hidden="true">
      <Head icon={<Icon name="bolt" />} title="Your car" sub="Live feed · 3 tasks" />
      <ul className={o.tasks}>
        {FEED.map((t, i) => (
          <li key={t.head} style={k(i)}>
            <span className={o.ic}><Icon name={t.icon} /></span>
            <span className={o.what}><b>{t.head}</b><small>{t.line}</small></span>
            {t.tone === "ink"
              ? <em className={o.swap}><span className={o.ink}>Review</span><span className={o.lime}><Icon name="check" />Approved</span></em>
              : <em className={o[t.tone]}>{t.state}</em>}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* 3. what's due: registration counts down on a ring, and the wear estimates fill in */
export function DueCard() {
  const R = 42, L = 2 * Math.PI * R;
  return (
    <div className={`${c.card} ${o.due}`} data-ui="" aria-hidden="true">
      <div className={o.reg}>
        <span className={o.regText}>
          <small>Registration · renews every 12 months</small>
          <b>{REG.days}<span> days</span></b>
          <small>left, expires {REG.by}</small>
          <span className={o.renew}>Renew it<Icon name="arrow" /></span>
        </span>
        <svg className={o.ring} viewBox="0 0 100 100" style={{ "--len": L, "--fill": REG.weeksLeft / REG.weeks } as React.CSSProperties}>
          <circle cx="50" cy="50" r={R} />
          <circle cx="50" cy="50" r={R} strokeDasharray={L} />
          <text x="50" y="50">{REG.weeksLeft} wks</text>
        </svg>
      </div>
      <p className={o.label}>Maintenance <em><Icon name="star" />Estimate</em></p>
      <ul className={o.wear}>
        {WEAR.map((w, i) => (
          <li key={w.k} style={{ ...k(i), "--w": w.w } as React.CSSProperties} className={w.warn ? o.warn : ""}>
            <span>{w.k}</span>
            <i />
            <b>{w.v}</b>
            <small>{w.of}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* 4. talk to your car: the question, the answer, the part that fits, what to do next */
export function AskCard() {
  const p = ASK_THREAD.part;
  return (
    <div className={`${c.card} ${o.ask}`} data-ui="" aria-hidden="true">
      <Head icon={<svg viewBox="0 0 15.68 15.68"><use href="#mark" /></svg>} title={`Your ${CAR.name}`} sub="Chatting with you" />
      <ol className={o.chat}>
        <li className={o.mine} style={k(0)}>{ASK_THREAD.q}</li>
        <li className={o.theirs} style={k(1)}>{ASK_THREAD.a}</li>
        <li className={o.part} style={k(2)}>
          <span className={o.what}><b>{p.name}</b><small>{p.line}</small><em><Icon name="check" />Fits your {CAR.name}</em></span>
          <span className={o.price}><b>{p.price}</b><small>Best price</small></span>
        </li>
        <li className={o.next} style={k(3)}>{ASK_THREAD.next.map((n, i) => <span key={n} className={i === 0 ? o.lime : ""}>{n}</span>)}</li>
      </ol>
    </div>
  );
}

/* 5. sell: the trade-in estimate settles in its range, then what backs it */
export function SellCard() {
  return (
    <div className={`${c.card} ${o.sell}`} data-ui="" aria-hidden="true">
      <div className={o.sellTop}>
        <span className={o.thumb}><Image src={CAR.src} alt="" width={CAR.w} height={CAR.h} sizes="120px" /></span>
        <span className={o.what}><small>Trade-in estimate</small><b className={o.value}>{TRADE.value}</b><small>{TRADE.basis}</small></span>
      </div>
      <div className={o.range} style={{ "--x": TRADE.pos } as React.CSSProperties}>
        <span><i /></span>
        <small><span>{TRADE.low}</span><span>{TRADE.high}</span></small>
      </div>
      <ul className={o.checks}>
        {TRADE.checks.map((x, i) => <li key={x.k} style={k(i)}><span><Icon name="check" /></span><b>{x.k}</b><small>{x.v}</small></li>)}
      </ul>
      <span className={o.list}>List your car<Icon name="arrow" /></span>
    </div>
  );
}

export const OWNER_CARDS = [AddCard, AgentCard, DueCard, AskCard, SellCard];

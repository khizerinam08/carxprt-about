import Image from "next/image";
import { ChatBar } from "../ChatBar";
import { Icon } from "../Icons";
import { BOOKED, CHAT, DEALERS, REPLY, WINNER, ZIP } from "@/lib/howMap";
import { BEST, COMPARE } from "@/lib/bento";
import { CARS, OTD_FINAL, OTD_FIRST, PICK, PROMPT } from "@/lib/walkthrough";
import { fmtUSD } from "@/lib/problemMath";
import c from "./HowCards.module.css";

/* The product card that floats over the map in each chapter. Inert pictures of the interface (data-ui,
   hidden from assistive tech; the chapter copy carries the words). Markup is the finished state; in the
   pinned version the scroll writes --r, --cp, --m, --bk and the live text over it. */

const car = CARS[PICK];
const dealer = DEALERS[WINNER];

function Listing({ meta }: { meta: string }) {
  return (
    <div className={c.listing}>
      <span className={c.thumb}><Image src={car.src} alt="" width={960} height={640} sizes="56px" /></span>
      <span className={c.who}><b>{car.name}</b><small>{meta}</small></span>
    </div>
  );
}

export function AskCard({ textRef }: { textRef?: React.Ref<HTMLSpanElement> }) {
  return (
    <div className={c.ask} data-ui="" aria-hidden="true">
      <ChatBar typed={PROMPT} placeholder={PROMPT} caret={!!textRef} textRef={textRef} sending />
      <div className={c.reply}>
        <span className={c.avatar}><svg viewBox="0 0 15.68 15.68"><use href="#mark" /></svg></span>
        <p className={c.bubble}>{REPLY}</p>
      </div>
    </div>
  );
}

/* a row of cars: photo, name and price, nothing else. The walkthrough's comparison (they come in one after another
   with --cp, then the best fit lights lime) and, on the plans board, Free's search results (`pick` off) */
export function CompareCard({ title = `Comparing ${COMPARE.length} cars`, pick = true, cars = COMPARE.map((x) => x.car) }: {
  title?: string; pick?: boolean; cars?: Tile[];
}) {
  return (
    <div className={c.card} data-ui="" aria-hidden="true">
      <p className={c.head}>
        <span className={c.avatarSm}><svg viewBox="0 0 15.68 15.68"><use href="#mark" /></svg></span>
        <b>{title}</b>
        <small className={c.headMeta}>near {ZIP}</small>
      </p>
      <CarRow cars={cars} best={pick ? BEST : -1} />
    </div>
  );
}

/* the tiles themselves */
type Tile = { src: string; name: string; price: string };
export function CarRow({ cars, best = -1 }: { cars: Tile[]; best?: number }) {
  return (
    <div className={c.cmp} style={{ "--n": cars.length } as React.CSSProperties}>
      {cars.map((x, i) => (
        <div key={x.src + x.price} className={c.col} data-best={i === best ? "" : undefined} style={{ "--k": i } as React.CSSProperties}>
          <span className={c.cmpThumb}>
            <Image src={x.src} alt="" width={960} height={640} sizes="160px" />
            {i === best && <em className={c.bestTag}>Best fit</em>}
          </span>
          <span className={c.cmpText}><small className={c.cmpName}>{x.name}</small><b className={c.cmpPrice}>{x.price}</b></span>
        </div>
      ))}
    </div>
  );
}

/* a chat card: who it's with, then the messages (ours right in lime, theirs left). They come in one after
   another with --m (all shown by default) */
export type Line = { mine: boolean; text: React.ReactNode };
export function ChatCard({ icon, title, sub, chip, lines }: { icon: React.ReactNode; title: string; sub: React.ReactNode; chip?: React.ReactNode; lines: Line[] }) {
  return (
    <div className={c.card} data-ui="" aria-hidden="true">
      <p className={c.head}>
        <span className={c.bolt}>{icon}</span>
        <span className={c.thread}><b>{title}</b><small>{sub}</small></span>
        {chip}
      </p>
      <ol className={c.msgs}>
        {lines.map((l, i) => <li key={i} className={l.mine ? c.out : c.in} style={{ "--k": i } as React.CSSProperties}>{l.text}</li>)}
      </ol>
    </div>
  );
}

/* negotiate: the Xprt Negotiator's chat with the one dealer (it writes as the buyer; the dealer's rep answers).
   The status turns to agreed with the last message. `from` drops the opening lines (the plans board) */
export function NegotiateCard({ from = 0 }: { from?: number }) {
  return (
    <ChatCard
      icon={<Icon name="bolt" />} title="Xprt Negotiator"
      sub={<>with {dealer.name} · <span className={c.status}><span>Negotiating</span><span>Deal agreed</span></span></>}
      chip={<span className={c.private}><Icon name="hat-glasses" />Private</span>}
      lines={CHAT.slice(from).map((m) => ({ mine: m.from === "xprt", text: m.text }))}
    />
  );
}

export function ApproveCard({ cardRef }: { cardRef?: React.Ref<HTMLDivElement> }) {
  return (
    <div className={c.card} data-ui="" aria-hidden="true" data-approved="" ref={cardRef}>
      <Listing meta={`${dealer.name} · ${car.distance}`} />
      <div className={c.otd}>
        <small>Out the door</small>
        <b>{fmtUSD(OTD_FINAL)}</b>
        <span className={c.cut}>−{fmtUSD(OTD_FIRST - OTD_FINAL)} from the first quote</span>
      </div>
      <span className={c.approve}>
        <span className={c.idle}>Approve this price</span>
        <span className={c.done}><Icon name="check" />Approved</span>
      </span>
      <p className={c.booked}><Icon name="clock" />{BOOKED}</p>
    </div>
  );
}

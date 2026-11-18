import { CLOSE } from "@/lib/owners";
import { SIGN_IN } from "@/lib/links";
import s from "./OwnerClose.module.css";

/* The close, kept simple (the user): the heading, one sentence and one action, centred */
export function OwnerClose() {
  return (
    <section id="start" className={`section ${s.close}`} aria-labelledby="start-title">
      <div className={`wrap ${s.copy}`}>
        <h2 className="h2" id="start-title">{CLOSE.head}</h2>
        <p className={s.lead}>{CLOSE.lead}</p>
        <a className={`btn btn-lime ${s.cta}`} href={SIGN_IN}>Sign in to Owner mode</a>
      </div>
    </section>
  );
}

import { PRICE } from "@/lib/owners";
import { SIGN_IN } from "@/lib/links";
import { Icon } from "../Icons";
import s from "./OwnerPricing.module.css";

/* Owner mode's price: one white card, what you get on the left, the two ways to pay on the right (yearly marked
   as the better deal), the sign-in under them, and a line on how buying your next car works */
export function OwnerPricing() {
  return (
    <section id="pricing" className={`section ${s.pricing}`} aria-labelledby="pricing-title">
      <div className="wrap">
        <div className={s.card}>
          <div className={s.copy}>
            <h2 className="h2" id="pricing-title">One plan for the car you own.</h2>
            <ul className={s.features}>
              {PRICE.features.map((f) => <li key={f}><Icon name="check" />{f}</li>)}
            </ul>
          </div>
          <div className={s.side}>
            <ul className={s.plans}>
              {PRICE.plans.map((p) => (
                <li key={p.id} className={p.id === "year" ? s.best : ""}>
                  <span className={s.name}>{p.name}{p.id === "year" && <em>Best value</em>}</span>
                  <span className={s.price}><b>{p.price}</b> {p.per}</span>
                  <small>{p.note}</small>
                </li>
              ))}
            </ul>
            <a className={`btn ${s.cta}`} href={SIGN_IN}>Sign in to Owner mode</a>
          </div>
        </div>
      </div>
    </section>
  );
}

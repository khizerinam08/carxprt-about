"use client";

import { useState } from "react";
import { DEMO } from "@/lib/dealers";
import { DEALER_MAIL } from "@/lib/links";
import { Icon } from "../Icons";
import s from "./BookDemo.module.css";

/* Book a demo: the live dealer page's form (name, dealership, email, phone, website) on a lime panel. This site
   has no backend, so the request opens the visitor's email app addressed to the dealership inbox with the
   details filled in; swap `send` for the real endpoint when there is one */
const FIELDS = [
  { id: "name", label: "Name", type: "text", auto: "name", required: true },
  { id: "dealership", label: "Dealership name", type: "text", auto: "organization", required: true },
  { id: "email", label: "Work email", type: "email", auto: "email", required: true },
  { id: "phone", label: "Phone number", type: "tel", auto: "tel", required: false },
  { id: "website", label: "Website", type: "url", auto: "url", required: false },
] as const;

export function BookDemo() {
  const [sent, setSent] = useState(false);

  const send = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const body = FIELDS.map((x) => `${x.label}: ${String(f.get(x.id) || "").trim() || "—"}`).join("\n");
    const subject = `Demo request: ${String(f.get("dealership") || "").trim()}`;
    location.href = `mailto:${DEALER_MAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return (
    <section id="demo" className={`section ${s.demo}`} aria-labelledby="demo-title">
      <div className="wrap">
        <div className={s.panel}>
          <div className={s.copy}>
            <h2 className="h2" id="demo-title">{DEMO.head}</h2>
            <p className={s.lead}>{DEMO.lead}</p>
            <ul className={s.points}>
              {DEMO.points.map((p) => <li key={p}><Icon name="check" />{p}</li>)}
            </ul>
          </div>
          <form className={s.form} onSubmit={send}>
            {FIELDS.map((x) => (
              <label key={x.id} className={s.field}>
                <span>{x.label}{!x.required && <small> · optional</small>}</span>
                <input name={x.id} type={x.type} autoComplete={x.auto} required={x.required} />
              </label>
            ))}
            <button className={`btn ${s.submit}`} type="submit">Request a demo<Icon name="arrow" /></button>
            <p className={s.note} role="status">
              {sent ? <>Your email app should open with the request filled in. If it doesn’t, write to <a href={`mailto:${DEALER_MAIL}`}>{DEALER_MAIL}</a>.</>
                : <>Or write to us at <a href={`mailto:${DEALER_MAIL}`}>{DEALER_MAIL}</a>.</>}
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

import { Icon } from "./Icons";
import s from "./ChatBar.module.css";

const ZIP = "78701";

/* The redesign's AI search bar (Figma 192:15894): white field in a lime glow, a location chip
   and the "Speak to CarXprt" voice pill, which turns into "Send" as soon as there is text.
   - demo: pass `typed` to show a prompt being written (no input, used inside product screens);
     `sending` starts it in the Send state, and a scroll scene can flip `data-typing` itself
   - live: pass `name` to get a real input inside a GET /search form */
export function ChatBar({ typed, caret = false, sending = false, name, id = name, placeholder, inputRef, textRef }: {
  typed?: string;
  caret?: boolean;
  sending?: boolean;
  name?: string;
  /* the input's id, when a page has two live bars with the same field name */
  id?: string;
  placeholder?: string;
  inputRef?: React.Ref<HTMLInputElement>;
  /* demo only: lets a scroll scene write the prompt without re-rendering */
  textRef?: React.Ref<HTMLSpanElement>;
}) {
  const label = (
    <>
      <span className={s.idle}>Speak to CarXprt<Icon name="wave" /></span>
      <span className={s.send}>Send<Icon name="up" /></span>
    </>
  );
  const row = (
    <div className={s.row}>
      <span className={s.zip}><Icon name="pin" />{ZIP}</span>
      {name
        ? <button className={s.speak} type="submit">{label}</button>
        : <span className={s.speak}>{label}</span>}
    </div>
  );

  if (name) {
    return (
      <form className={s.bar} data-ui="" action="/search" method="get" role="search">
        <label className="sr-only" htmlFor={id}>Describe the car you want</label>
        <input className={s.field} id={id} name={name} type="text" placeholder={placeholder} autoComplete="off" ref={inputRef} />
        <input type="hidden" name="zip" value={ZIP} />
        {row}
      </form>
    );
  }
  return (
    <div className={s.bar} data-ui="" data-typing={sending ? "" : undefined}>
      <p className={`${s.field} ${typed ? s.filled : ""}`}>
        <span ref={textRef}>{typed || placeholder}</span>
        {caret && <span className={s.caret} aria-hidden="true" />}
      </p>
      {row}
    </div>
  );
}

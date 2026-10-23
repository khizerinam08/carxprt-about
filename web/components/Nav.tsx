"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Icon, Logo } from "./Icons";
import { useScrollFrame } from "@/hooks/useScroll";
import s from "./Nav.module.css";

const LINKS = [
  { href: "/search", label: "Discovery Hub" },
  { href: "/offers", label: "Offers" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About us" },
];

function ThemeToggle({ className = "" }: { className?: string }) {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    setDark(document.documentElement.dataset.theme === "dark");
    const mo = new MutationObserver(() => setDark(document.documentElement.dataset.theme === "dark"));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => mo.disconnect();
  }, []);
  const toggle = () => {
    const next = dark ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("cx-theme", next); } catch {}
  };
  return (
    <button className={`${s.theme} ${className}`} type="button" aria-pressed={dark} aria-label={dark ? "Switch to light mode" : "Switch to dark mode"} onClick={toggle}>
      <span className={s.knob} />
      <Icon name="sun" className={s.sun} />
      <Icon name="moon" className={s.moon} />
    </button>
  );
}

/* `current`: the link for the page this nav sits on */
export function Nav({ current = "/about" }: { current?: string }) {
  const ref = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const lastY = useRef(0);
  // slides away while you scroll down, comes back as soon as you scroll up
  useScrollFrame(({ y }) => {
    const el = ref.current;
    if (!el) return;
    el.classList.toggle(s.scrolled, y > 8);
    const dy = y - lastY.current;
    if (Math.abs(dy) < 6) return;
    el.classList.toggle(s.hidden, dy > 0 && y > 120 && !open);
    lastY.current = y;
  });

  return (
    <header className={s.nav} ref={ref}>
      <div className={s.left}>
        <Link href="/" aria-label="CarXprt home"><Logo /></Link>
        <nav aria-label="Main">
          <ul className={s.links}>
            {LINKS.map((l) => (
              <li key={l.href}><Link href={l.href} aria-current={l.href === current ? "page" : undefined}>{l.label}</Link></li>
            ))}
          </ul>
        </nav>
      </div>
      <div className={s.right}>
        <ThemeToggle className={s.desktopOnly} />
        <Link className={`btn btn-lime ${s.signin}`} href="/signin">Sign In</Link>
        <button className={s.menuBtn} type="button" aria-expanded={open} aria-controls="nav-sheet" aria-label="Menu" onClick={() => setOpen(!open)}>
          <Icon name="menu" />
        </button>
      </div>
      <div className={s.sheet} id="nav-sheet" hidden={!open}>
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} aria-current={l.href === current ? "page" : undefined}>{l.label}</Link>
        ))}
        <ThemeToggle />
      </div>
    </header>
  );
}

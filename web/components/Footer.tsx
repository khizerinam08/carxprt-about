import Link from "next/link";
import { Icon, Logo } from "./Icons";
import s from "./Footer.module.css";

/* Copied from the current carxprt.com footer. */
export function Footer() {
  return (
    <footer className={s.foot}>
      <div className="wrap">
        <div className={s.grid}>
          <div className={s.brand}>
            <Logo />
            <p>Car buying should feel exciting, not exhausting. CarXprt takes care of the hard parts, guiding you to the right vehicle with clarity, ease, and zero pressure.</p>
            <Link className={`btn btn-lime ${s.feedback}`} href="/feedback"><Icon name="chat" />Share Feedback</Link>
          </div>
          <div><h4>Links</h4><ul><li><Link href="/">Home</Link></li><li><Link href="/search">Discovery Hub</Link></li><li><Link href="/how-it-works">How It Works</Link></li><li><Link href="/pricing">Pricing</Link></li><li><Link href="/contact">Contact Us</Link></li><li><Link href="/blog">Blog</Link></li></ul></div>
          <div><h4>Terms &amp; Policies</h4><ul><li><Link href="/terms">Terms and Conditions</Link></li></ul></div>
          <div><h4>Partner With CarXprt</h4><ul><li><Link href="/dealers">Dealership Portal</Link></li></ul></div>
          <div>
            <h4>Contact info</h4>
            <ul>
              <li><small>For Customer Support</small><a href="mailto:support@carxprt.com">support@carxprt.com</a></li>
              <li><small>For Dealership Support</small><a href="mailto:dealership@carxprt.com">dealership@carxprt.com</a></li>
            </ul>
            <div className={s.socials}><a href="#" aria-label="Instagram">Ig</a><a href="#" aria-label="LinkedIn">in</a><a href="#" aria-label="Facebook">f</a><a href="#" aria-label="X">X</a></div>
          </div>
        </div>
        <div className={s.disclosure}>
          <b>Disclosure</b>
          <p>CarXprt is not affiliated with any automotive manufacturer or their trademarks. Manufacturer names and vehicle photos are for identification purposes only. Vehicle listings, photos, and pricing are provided by dealerships and content partners; CarXprt does not warrant the accuracy, completeness, or timeliness of this data. See participating dealer for full details.</p>
          <p>© 2026 AltaiLabs, Inc. dba CarXprt™. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

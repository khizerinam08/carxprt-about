import Link from "next/link";
import { Icon, Logo } from "./Icons";
import { DEALERS, HOW, PLANS, SOCIAL, app } from "@/lib/links";
import s from "./Footer.module.css";

/* Copied from the current carxprt.com footer; its links go to this site's sections or the live product
   (lib/links). Feedback goes to the support inbox (the live site has no feedback page). */
export function Footer() {
  return (
    <footer className={s.foot}>
      <div className="wrap">
        <div className={s.grid}>
          <div className={s.brand}>
            <Logo />
            <p>Car buying should feel exciting, not exhausting. CarXprt takes care of the hard parts, guiding you to the right vehicle with clarity, ease, and zero pressure.</p>
            <a className={`btn btn-lime ${s.feedback}`} href="mailto:support@carxprt.com?subject=Feedback"><Icon name="chat" />Share Feedback</a>
          </div>
          <div><h4>Links</h4><ul><li><Link href="/">Home</Link></li><li><a href={app("/search")}>Discovery Hub</a></li><li><Link href={HOW}>How It Works</Link></li><li><Link href={PLANS}>Pricing</Link></li><li><a href={app("/contact")}>Contact Us</a></li><li><a href={app("/blog")}>Blog</a></li></ul></div>
          <div><h4>Terms &amp; Policies</h4><ul><li><a href={app("/terms")}>Terms and Conditions</a></li></ul></div>
          <div><h4>Partner With CarXprt</h4><ul><li><a href={DEALERS}>Dealership Portal</a></li></ul></div>
          <div>
            <h4>Contact info</h4>
            <ul>
              <li><small>For Customer Support</small><a href="mailto:support@carxprt.com">support@carxprt.com</a></li>
              <li><small>For Dealership Support</small><a href="mailto:dealership@carxprt.com">dealership@carxprt.com</a></li>
            </ul>
            <div className={s.socials}>{SOCIAL.map((x) => <a key={x.label} href={x.href} aria-label={x.label} target="_blank" rel="noopener noreferrer">{x.short}</a>)}</div>
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

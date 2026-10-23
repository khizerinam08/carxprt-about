/* Where the site's links go. This site is the front of CarXprt (the home page and About us); the product itself
   (search, offers, pricing, sign-in, contact, the blog) lives on carxprt.com, so those links go there. Every
   address below was checked live on 24 Oct 2026. */

export const APP = "https://carxprt.com";
export const app = (path: string) => APP + path;

/* this site's own sections */
export const PLANS = "/#plans";
export const HOW = "/#how-it-works";

export const NAV = [
  { href: app("/search"), label: "Discovery Hub" },
  { href: app("/offers"), label: "Offers" },
  { href: PLANS, label: "Pricing" },
  { href: "/about", label: "About us" },
];

export const SIGN_IN = app("/login");
export const XPRT_SEARCH = app("/Xprt_Search");
export const DEALERS = "https://dealership.carxprt.com/sign-in";
export const SOCIAL = [
  { label: "Instagram", short: "Ig", href: "https://www.instagram.com/carxprt" },
  { label: "LinkedIn", short: "in", href: "https://www.linkedin.com/company/carxprt" },
  { label: "Facebook", short: "f", href: "https://www.facebook.com/people/CarXprt/61590269736451/" },
  { label: "X", short: "X", href: "https://x.com/carxprt_" },
];

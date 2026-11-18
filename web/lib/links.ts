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

/* the dealer page (/dealers): the dealer portal and its tools live on dealership.carxprt.com (checked 17 Nov 2026) */
export const LISTER = "https://dealership.carxprt.com/lister";
export const LISTER_CHROME = "https://chromewebstore.google.com/detail/carxprt-lightning-lister/nfpnkiknibofeiicekdehonjmpnonaeh";
export const DEALER_MAIL = "dealership@carxprt.com";
export const DEALER_NAV = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#tools", label: "Tools" },
  { href: "#faq", label: "Questions" },
  { href: "/", label: "For shoppers" },
];
/* the owner page (/owners): its own sections, then back to the shopper's home */
export const OWNER_NAV = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "Questions" },
  { href: "/", label: "For shoppers" },
];
export const SOCIAL = [
  { label: "Instagram", short: "Ig", href: "https://www.instagram.com/carxprt" },
  { label: "LinkedIn", short: "in", href: "https://www.linkedin.com/company/carxprt" },
  { label: "Facebook", short: "f", href: "https://www.facebook.com/people/CarXprt/61590269736451/" },
  { label: "X", short: "X", href: "https://x.com/carxprt_" },
];

import type { Topic } from "./faq";

/* the dealer page's questions, apart from lib/dealers so the server page can read them (lib/dealers reaches
   the client-only scroll helpers through the sample deal) */
export const DEALER_FAQ: Topic[] = [
  {
    id: "leads", name: "Leads", items: [
      { q: "Where do the leads come from?", a: "Every lead comes from a CarXprt shopper: a paying subscriber who is actively searching for vehicles on the buyer site and matching against your inventory." },
      { q: "How are CarXprt leads different from other marketplaces?", a: "Two ways. First, intent: CarXprt shoppers are paying subscribers who have put money down just to search, which filters out casual browsers before a lead ever reaches you. Second, context: every lead includes the buyer’s full requirement profile and shopping activity, so your team knows what they want before the first reply." },
      { q: "Can Xprt respond to customers on its own?", a: "Yes. Xprt Responder answers basic questions using notes your team has already added, keeps the conversation moving when you’re busy or offline, and hands off the moment pricing, negotiation or anything only a person should handle comes up." },
    ],
  },
  {
    id: "tools", name: "Tools", items: [
      { q: "Do I need to replace my CRM or DMS?", a: "No. CarXprt sits alongside the systems you already use. Your team works leads, deals and listings in CarXprt without ripping out your CRM or DMS." },
      { q: "How does Deal Builder get its numbers?", a: "Deal Builder pulls fees and add-ons from your dealership’s saved defaults and builds the out-the-door quote from them, so every quote stays accurate and consistent." },
      { q: "Which platforms does the ad generator support?", a: "Generate marketplace-ready listings and publish from one place, including Facebook Marketplace, Craigslist, CarGurus, Cars.com and more as your distribution channels grow." },
    ],
  },
  {
    id: "start", name: "Getting started", items: [
      { q: "How much does CarXprt cost?", a: "Pricing depends on your store size and the tools you need. Book a demo and we’ll walk through a live dashboard with your inventory, then send a custom quote the same day." },
      { q: "How long does onboarding take?", a: "Most dealerships are live quickly after connecting inventory. We’ll run a 30-minute live demo on your own vehicles, then get you set up so Xprt can start engaging shoppers." },
    ],
  },
];


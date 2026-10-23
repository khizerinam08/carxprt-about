/* The home page questions, from the live carxprt.com FAQ (23 Oct 2026) in its four topics. Five answers are
   corrected to how the product works (the user, 23 Oct): no price confidence score, the negotiator talks to one
   dealer at a time, and no "dealers competing"; the live FAQ still says the old things. */

export type QA = { q: string; a: string };
export type Topic = { id: string; name: string; items: QA[] };

export const FAQ: Topic[] = [
  {
    id: "discovery", name: "Discovery", items: [
      { q: "Can I just describe the car I want instead of using filters?", a: "Yes — that's the main way people use CarXprt. Type or say something like \"hybrid SUV with third row, under $45K, within 50 miles\" and we'll pull matching listings. You can keep refining in plain language: \"actually make it AWD,\" \"drop the sunroof.\"" },
      { q: "Can I search by voice?", a: "Yes. Tap the mic anywhere on the site and talk. Voice works for searching, comparing, and even navigating — \"show me my saved cars,\" \"take me to offers.\"" },
      { q: "Can I compare cars side by side?", a: "Yes. Pick up to three and we'll break down price, cost of ownership, reliability, and the trade-offs that actually matter — not just a spec table you have to interpret yourself." },
      { q: "How do I know if a listing is priced fairly?", a: "Every car gets a dynamic fair-price check against similar cars for sale in your area, and Plus adds a full ownership cost breakdown — insurance, fuel, maintenance, depreciation — so you're comparing the real number, not the sticker." },
    ],
  },
  {
    id: "offers", name: "Offers", items: [
      { q: "What is the Offers page?", a: "It's every current manufacturer incentive we can find, in one place — lease specials, low-APR financing, cash back — pulled across all major brands and updated as programs change. Instead of visiting twelve manufacturer sites, you check one." },
      { q: "How is that different from what I see on a dealer's website?", a: "Dealers show you their inventory. Manufacturers set the incentives — and those often aren't advertised prominently, or expire before shoppers hear about them. We surface them independently, so you know what's available before you ever talk to a salesperson." },
      { q: "Will you tell me if the car I'm looking at has an offer on it?", a: "Yes. When you're browsing new cars, we flag right on the listing whether the manufacturer currently has a lease, finance, or cash offer on that exact vehicle — so you never accidentally leave money on the table." },
      { q: "Why are some offer details locked?", a: "Full offer terms — payment, APR, expiration, regional availability — are available to Plus and Pro members. Browsing offers is free; unlocking the numbers is part of a paid plan." },
      { q: "Are these offers guaranteed?", a: "Incentives vary by region, dealer, and credit tier, and they change often. We show you what the manufacturer is publishing so you can walk in knowing what to ask for — always confirm final terms with the dealer." },
    ],
  },
  {
    id: "deals", name: "Deals and negotiation", items: [
      { q: "What does \"AI negotiates for me\" actually mean?", a: "You pick the car and tell us your target. The Xprt Negotiator opens a chat with that dealer, asks for the out-the-door price and works it down, one dealer at a time, with every message in one thread. You never negotiate live, and you approve everything before anything is committed." },
      { q: "Do dealers get my phone number and email?", a: "No. All communication runs through CarXprt anonymously until you decide to share your details. No 6 a.m. sales calls, no follow-up email chains." },
      { q: "Is there a real person involved?", a: "On Pro, yes — a dedicated human advisor runs your deal end to end, handles the back-and-forth and keeps looking for better options nearby. Think of it as hiring someone who buys cars for a living." },
      { q: "How much do people actually save?", a: "Around $2,500 on a typical deal, mostly from a negotiated price, dropped add-ons and manufacturer incentives buyers would have missed." },
      { q: "Can I use this on a car I already found somewhere else?", a: "Yes. Bring us the quote or the link and we will do the negotiation." },
    ],
  },
  {
    id: "plans", name: "Plans", items: [
      { q: "What's included in the free plan?", a: "Full inventory browsing, all traditional filters, and AI voice and chat access. Enough to shop seriously — you'd upgrade when you want comparisons, unlocked offer details, and dealer negotiation." },
      { q: "What's the difference between Plus and Pro?", a: "Plus is the full self-serve AI experience — you shop, our AI negotiates. Pro is hands-off: everything in Plus, plus a human advisor who runs your deal for you from start to finish. Plus is monthly; Pro is a one-time fee for a single purchase." },
      { q: "Is Pro worth it on one car?", a: "If it moves the price even 1%, it pays for itself on most vehicles. That's the pitch — you're paying for the deal, not for the software." },
      { q: "Can I cancel Plus anytime?", a: "Yes, cancel any time from your account." },
    ],
  },
];

/* schema.org FAQPage, as the live home page publishes it */
export const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.flatMap((t) => t.items).map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
};

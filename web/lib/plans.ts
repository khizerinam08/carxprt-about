import type { IconName } from "@/components/Icons";

/* The three plans, from carxprt.com/pricing (23 Oct 2026) with the user's corrections: Free has no identity
   protection or anonymous chat (the pricing page shows those two without a tick), and Plus has no price
   confidence score (the pricing page still lists it; the user says it isn't a feature). Kept short on
   purpose: the four that matter per plan. Features marked `beta` carry the pricing page's footnote on /home;
   /home-v2 drops the footnote (the user: "unnecessary disclaimers"). */

export type Plan = {
  id: "free" | "plus" | "pro";
  name: string;
  price: string;
  per: string;
  line: string;
  features: { text: string; icon: IconName; beta?: boolean }[];
  cta: string;
  popular?: boolean;
};

export const PLANS: Plan[] = [
  {
    id: "free", name: "Free", price: "$0", per: "forever",
    line: "Search everything, by typing or just by talking.",
    features: [
      { text: "Search the full inventory", icon: "search" },
      { text: "AI voice and chat, limited", icon: "wave", beta: true },
      { text: "All the usual filters", icon: "tabs" },
    ],
    cta: "Start free",
  },
  {
    id: "plus", name: "Plus", price: "$59.99", per: "a month", popular: true,
    line: "The full AI experience: find, compare and reach dealers by voice or chat.",
    features: [
      { text: "Unlimited AI voice and chat", icon: "wave", beta: true },
      { text: "AI comparison, up to 3 cars", icon: "tabs", beta: true },
      { text: "The Xprt Negotiator", icon: "bolt", beta: true },
      { text: "Identity protection", icon: "hat-glasses" },
    ],
    cta: "Start Plus",
  },
  {
    id: "pro", name: "Pro", price: "$799.99", per: "one time",
    line: "Hand it off. A human expert runs your deal end to end.",
    features: [
      { text: "Everything in Plus", icon: "plus" },
      { text: "A dedicated advisor", icon: "user-round" },
      { text: "Our highest AI limits", icon: "wave", beta: true },
      { text: "Multi-dealer strategy", icon: "map-pin" },
    ],
    cta: "Get Pro",
  },
];

export const BETA_NOTE = "AI features are in beta. Check the accuracy of every response. Usage limits apply.";

import type { IconName } from "@/components/Icons";

/* The three plans, from carxprt.com/pricing (23 Oct 2026) with the user's corrections: Free has no identity
   protection or anonymous chat (the pricing page shows those two without a tick), and Plus has no price
   confidence score (the pricing page still lists it; the user says it isn't a feature). Kept short on
   purpose: the few that matter per plan, and no beta footnote (the user: "unnecessary disclaimers"). */

export type Plan = {
  id: "free" | "plus" | "pro";
  name: string;
  price: string;
  per: string;
  features: { text: string; icon: IconName }[];
  cta: string;
  popular?: boolean;
};

export const PLANS: Plan[] = [
  {
    id: "free", name: "Free", price: "$0", per: "forever",
    features: [
      { text: "Search the full inventory", icon: "search" },
      { text: "AI voice and chat, limited", icon: "wave" },
      { text: "All the usual filters", icon: "tabs" },
    ],
    cta: "Start free",
  },
  {
    id: "plus", name: "Plus", price: "$59.99", per: "a month", popular: true,
    features: [
      { text: "Unlimited AI voice and chat", icon: "wave" },
      { text: "AI comparison, up to 3 cars", icon: "tabs" },
      { text: "The Xprt Negotiator", icon: "bolt" },
      { text: "Identity protection", icon: "hat-glasses" },
    ],
    cta: "Start Plus",
  },
  {
    id: "pro", name: "Pro", price: "$799.99", per: "one time",
    features: [
      { text: "Everything in Plus", icon: "plus" },
      { text: "A dedicated advisor", icon: "user-round" },
      { text: "Our highest AI limits", icon: "wave" },
      { text: "Multi-dealer strategy", icon: "map-pin" },
    ],
    cta: "Get Pro",
  },
];

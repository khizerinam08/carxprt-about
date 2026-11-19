import type { IconName } from "@/components/Icons";

/* The three offers on the home page (the user's pricing table, 18 Nov 2026): searching is free, the Xprt
   Negotiator is $19 only when it gets you a discount (the user: not "after you buy"), and Human Concierge is a one-time fee ("$299 once", not per car). Owner mode's price lives on its own
   page, so it isn't here. */

export type Plan = {
  id: "free" | "negotiator" | "concierge";
  name: string;
  price: string;
  per: string;
  features: { text: string; icon: IconName }[];
  cta: string;
  popular?: boolean;
};

export const PLANS: Plan[] = [
  {
    id: "free", name: "Free", price: "$0", per: "always",
    features: [
      { text: "Browse and search every car", icon: "search" },
      { text: "Compare cars side by side", icon: "tabs" },
      { text: "Ask anything about a car", icon: "chat" },
      { text: "Save the cars you like", icon: "bookmark" },
    ],
    cta: "Start free",
  },
  {
    id: "negotiator", name: "Xprt Negotiator", price: "$19", per: "only on a discount",
    features: [
      { text: "Talks the price down", icon: "bolt" },
      { text: "Pay only if you save $200+", icon: "star" },
      { text: "Based on your quote", icon: "doc" },
    ],
    cta: "Start negotiating",
  },
  {
    id: "concierge", name: "Human Concierge", price: "$299", per: "once",
    features: [
      { text: "A person runs your purchase", icon: "user-round" },
      { text: "30 days of support", icon: "clock" },
      { text: "Extend up to 60 days, if approved", icon: "plus" },
      { text: "One payment, no subscription", icon: "check" },
    ],
    cta: "Get Concierge",
  },
];

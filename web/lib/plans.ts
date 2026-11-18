import type { IconName } from "@/components/Icons";

/* The three offers on the home page (the user's pricing table, 18 Nov 2026): shopping is free, the Negotiator
   is a one-time success fee, and Human Concierge is a one-time fee ("$299 once", not per car). Owner mode's price lives on its own
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
      { text: "Negotiate on 3 cars at a time", icon: "bolt" },
      { text: "Save the cars you like", icon: "bookmark" },
    ],
    cta: "Start free",
  },
  {
    id: "negotiator", name: "Negotiator", price: "$19", per: "once, if you save",
    features: [
      { text: "Charged only after you buy", icon: "check" },
      { text: "Only if you save $200 or more", icon: "star" },
      { text: "Against a documented out-the-door quote for the same VIN", icon: "doc" },
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

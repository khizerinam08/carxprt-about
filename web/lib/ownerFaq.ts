import type { Topic } from "./faq";

/* the owner page's questions (Owner mode as the Figma screens show it, 18 Nov 2026) */
export const OWNER_FAQ: Topic[] = [
  {
    id: "car", name: "Your car", items: [
      { q: "How do I add my car?", a: "Switch to Owner mode from the menu and add your car. Upload the paperwork you have, like the window sticker, bill of sale or insurance card, and CarXprt reads it and fills in the details. You confirm what it found before it’s saved." },
      { q: "Can I add more than one car?", a: "Yes. Add every car in the household and switch between them from the top of the owner home. Each one keeps its own records, reminders and agent tasks." },
      { q: "Why should I upload receipts?", a: "Receipts update your car’s record and sharpen the estimates. Your agent uses them to know what was done, when it’s due again and what your car is worth." },
    ],
  },
  {
    id: "agent", name: "Your agent", items: [
      { q: "What does the agent do on its own?", a: "It gathers quotes from shops, prepares bookings, tracks renewals and follows up when a shop doesn’t answer. Anything that commits you, like a booking or a payment, waits for your OK." },
      { q: "How are wear and due dates predicted?", a: "Your agent estimates wear and due dates from your mileage, how you drive and your service records. Every record you add makes the estimate sharper, and each one is marked as an estimate." },
      { q: "Are parts really checked against my car?", a: "Yes. Parts and accessories are matched to your VIN before you buy. If a seller’s fit check doesn’t match your car, CarXprt tells you before you order." },
    ],
  },
  {
    id: "app", name: "Pricing and the app", items: [
      { q: "How much does Owner mode cost?", a: "$10 a month, or $100 a year (two months free). Shopping stays free for members, and if you buy your next car with the Negotiator, the same $19 success fee applies." },
      { q: "What is Live Mode?", a: "Live Mode is in the CarXprt app for iPhone and Android. Point your phone at a warning light, a tire or a part and Xprt tells you what it sees and what to do next." },
      { q: "Can I go back to shopping?", a: "Any time. Switch between Buyer and Owner mode from the menu; your searches, saved cars and owner records stay where they are." },
    ],
  },
];

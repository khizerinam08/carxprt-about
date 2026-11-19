import type { Topic } from "./faq";

/* the owner page's questions (Owner mode as the Figma screens show it, 18 Nov 2026) */
export const OWNER_FAQ: Topic[] = [
  {
    id: "start", name: "Getting started", items: [
      { q: "How do I add my car?", a: "Switch to Owner mode from the menu and add your car. Upload the paperwork you have, like the window sticker, bill of sale or insurance card, and CarXprt reads it and fills in the details. You confirm what it found before it’s saved." },
      { q: "Can I add more than one car?", a: "Yes. Add every car in the household and switch between them from the top of the owner home. Each one keeps its own records, reminders and to-dos." },
      { q: "Why should I upload receipts?", a: "Receipts update your car’s record and sharpen the estimates. Your car uses them to know what was done, when it’s due again and what your car is worth." },
    ],
  },
  {
    id: "car", name: "Your car", items: [
      { q: "What does my car do on its own?", a: "It gathers quotes from shops, prepares bookings, tracks renewals and follows up when a shop doesn’t answer. Anything that commits you, like a booking or a payment, waits for your OK." },
      { q: "How are wear and due dates predicted?", a: "Your car estimates wear and due dates from your mileage, how you drive and your service records. Every record you add makes the estimate sharper, and each one is marked as an estimate." },
      { q: "Are parts really checked against my car?", a: "Yes. Parts and accessories are matched to your VIN before you buy. If a seller’s fit check doesn’t match your car, CarXprt tells you before you order." },
    ],
  },
  {
    id: "app", name: "Pricing and the app", items: [
      { q: "How much does Owner mode cost?", a: "$10 a month, or $100 a year (two months free). Cancel any time." },
      { q: "What is Live Mode?", a: "A live video chat with your car, in the CarXprt app. Show it a warning light or a worn tire and talk it through in real time." },
      { q: "Can I go back to shopping?", a: "Any time. Switch between Buyer and Owner mode from the menu; your searches, saved cars and owner records stay where they are." },
    ],
  },
];

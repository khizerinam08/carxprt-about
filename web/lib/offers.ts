/* Manufacturer cash offers for the home page deck: customer cash, valid on a cash purchase, so no loan and no
   interest. Taken from the Offers screen in the redesign (Figma tdkZAGZd2a4B8EMYIpxLSt, "Offers - Cashback"
   991:2132, Cashback Card 990:2132), biggest first. The figures are the design's placeholders until this reads
   the live Offers feed. */

export type CashOffer = {
  model: string;
  brand: string;
  initials: string;
  amount: number;
  expiresIn: number; // days
  photo: string;
  alt: string;
};

export const CASH_OFFERS: CashOffer[] = [
  { model: "Bentley Continental GT Speed", brand: "Bentley", initials: "BE", amount: 5000, expiresIn: 30, photo: "/home/offers/bentley-continental-gt.jpg", alt: "Green Bentley Continental GT outside a country house" },
  { model: "Hyundai Ioniq 6 Limited AWD", brand: "Hyundai", initials: "HY", amount: 3500, expiresIn: 26, photo: "/home/offers/hyundai-ioniq-6.jpg", alt: "White Hyundai Ioniq 6 in a city at dusk" },
  { model: "Polestar 2 Long Range Dual Motor", brand: "Polestar", initials: "PO", amount: 3000, expiresIn: 44, photo: "/home/offers/polestar-2.jpg", alt: "Dark Polestar 2 parked on a city street" },
  { model: "Mercedes-AMG GT 63 S Coupe", brand: "Mercedes-Benz", initials: "MB", amount: 2500, expiresIn: 9, photo: "/home/offers/mercedes-amg-gt-63.jpg", alt: "Black Mercedes-AMG GT 63 S on a wet track" },
  { model: "Alfa Romeo Giulia Quadrifoglio", brand: "Alfa Romeo", initials: "AR", amount: 1750, expiresIn: 18, photo: "/home/offers/alfa-romeo-giulia.jpg", alt: "Red Alfa Romeo Giulia on a country road" },
];

console.assert(
  CASH_OFFERS.every((o, i, a) => i === 0 || a[i - 1].amount >= o.amount),
  "cash offers sorted by amount",
);

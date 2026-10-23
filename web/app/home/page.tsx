import type { Metadata } from "next";
import { IconSprite } from "@/components/Icons";
import { Nav } from "@/components/Nav";
import { HomeHero } from "@/components/home/HomeHero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { OffersDeck } from "@/components/home/OffersDeck";
import { Bento } from "@/components/home/Bento";
import { Plans } from "@/components/home/Plans";
import { Questions } from "@/components/home/Questions";
import { HomeClose } from "@/components/home/HomeClose";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Home · CarXprt",
  description: "Find the car, compare what’s nearby, and let CarXprt negotiate the price for you.",
};

/* Home page redesign, built section by section. So far: the hero (Figma 192:12102), How it works
   (the dealer-map walkthrough), this week's cash offers (the deck), the feature bento, the plans, the questions and the close. */
export default function HomePage() {
  return (
    <>
      <IconSprite />
      <Nav current="/" />
      <main>
        <HomeHero />
        <HowItWorks joined />
        <OffersDeck />
        <Bento />
        <Plans />
        <Questions />
        <HomeClose />
      </main>
      <Footer />
    </>
  );
}

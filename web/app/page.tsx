import type { Metadata } from "next";
import { IconSprite } from "@/components/Icons";
import { Nav } from "@/components/Nav";
import { HeroBridge } from "@/components/home-v2/HeroBridge";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Versus } from "@/components/home-v2/Versus";
import { Bento } from "@/components/home-v2/Bento";
import { Plans } from "@/components/home-v2/Plans";
import { Questions } from "@/components/home/Questions";
import { HomeClose } from "@/components/home-v2/HomeClose";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "CarXprt · Find your perfect car. Let us handle the rest.",
  description: "Find the car, compare what’s nearby, and let CarXprt negotiate the price for you.",
};

/* The home page (the redesign's second version, moved here from /home-v2 on 24 Oct 2026; the first version is
   gone). Its bridge, comparison, bento, plans and close live in components/home-v2; the hero, walkthrough and
   questions in components/home. */
export default function HomePage() {
  return (
    <>
      <IconSprite />
      <Nav current="/" />
      {/* on phones the home page's margin is wider than the site's 16px (globals.css) */}
      <main className="v2">
        {/* the hero fading into a line with the full logo, then a curved lime band rising into the walkthrough */}
        <HeroBridge />
        <HowItWorks curtain />
        {/* in place of the cash-offers deck (removed at the user's request): CarXprt against listing sites */}
        <Versus />
        <Bento />
        <Plans />
        <Questions />
        <HomeClose />
      </main>
      <Footer />
    </>
  );
}

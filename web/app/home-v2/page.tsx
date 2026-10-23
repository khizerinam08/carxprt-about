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
  title: "Home v2 · CarXprt",
  description: "Find the car, compare what’s nearby, and let CarXprt negotiate the price for you.",
};

/* Fork of /home (23 Oct 2026) for the second round: its bridge, comparison, bento, plans and close live in
   components/home-v2 (the hero, walkthrough and questions are shared), so /home stays as it was and this can be
   dropped if it doesn't work out.
   Home page redesign, built section by section. So far: the hero (Figma 192:12102), How it works
   (the dealer-map walkthrough), this week's cash offers (the deck), the feature bento, the plans, the questions and the close. */
export default function HomeV2Page() {
  return (
    <>
      <IconSprite />
      <Nav current="/" />
      {/* v2: on phones the page margin is wider than the site's 16px (globals.css) */}
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

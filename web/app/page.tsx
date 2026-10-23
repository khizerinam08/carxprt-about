import { IconSprite } from "@/components/Icons";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Bridge } from "@/components/Bridge";
import { Problem } from "@/components/problem/Problem";
import { MeetCarXprt } from "@/components/walkthrough/MeetCarXprt";
import { Walkthrough } from "@/components/walkthrough/Walkthrough";
import { Proof } from "@/components/Proof";
import { Reviews } from "@/components/Reviews";
import { MidCta } from "@/components/MidCta";
import { Compare } from "@/components/Compare";
import { FinalCta } from "@/components/FinalCta";
import { Footer } from "@/components/Footer";

export default function AboutPage() {
  return (
    <>
      <IconSprite />
      <Nav />
      <main>
        <Hero />
        <Bridge />
        <Problem />
        <MeetCarXprt />
        <Walkthrough />
        <MidCta />
        <Proof />
        <Reviews />
        <Compare />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}

import type { Metadata } from "next";
import { IconSprite } from "@/components/Icons";
import { Nav } from "@/components/Nav";
import { OwnerHero } from "@/components/owners/OwnerHero";
import { OwnerScroll } from "@/components/owners/OwnerScroll";
import { OwnerPricing } from "@/components/owners/OwnerPricing";
import { Questions } from "@/components/home/Questions";
import { OwnerClose } from "@/components/owners/OwnerClose";
import { Footer } from "@/components/Footer";
import { OWNER_FAQ } from "@/lib/ownerFaq";
import { OWNER_NAV, SIGN_IN } from "@/lib/links";

export const metadata: Metadata = {
  title: "CarXprt Owner mode · Manage your car without the hassle.",
  description: "Talk to your car. It keeps track of service, renewals and repairs, so you don’t have to.",
};

/* The owner page (18 Nov 2026): the car-first hero with one action, the five Owner mode moments of the car's
   first year (a sideways scroll), Owner mode's price, questions, and the sign-in with Live Mode */
export default function OwnersPage() {
  return (
    <>
      <IconSprite />
      <Nav current="" links={OWNER_NAV} cta={{ href: SIGN_IN, label: "Sign In" }} home="/owners" />
      <main className="v2 owners">
        <OwnerHero />
        <OwnerScroll />
        <OwnerPricing />
        <Questions faq={OWNER_FAQ} title="Questions from owners."
          lead="What owners ask before they switch. Anything else, ask your car once you’re in." />
        <OwnerClose />
      </main>
      <Footer />
    </>
  );
}

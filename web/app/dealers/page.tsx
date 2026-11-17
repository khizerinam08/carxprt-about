import type { Metadata } from "next";
import { IconSprite } from "@/components/Icons";
import { Nav } from "@/components/Nav";
import { DealerHero } from "@/components/dealers/DealerHero";
import { DealerProof } from "@/components/dealers/DealerProof";
import { LeadStory } from "@/components/dealers/LeadStory";
import { Tools } from "@/components/dealers/Tools";
import { Questions } from "@/components/home/Questions";
import { BookDemo } from "@/components/dealers/BookDemo";
import { Footer } from "@/components/Footer";
import { DEALER_FAQ } from "@/lib/dealerFaq";
import { DEALERS, DEALER_MAIL, DEALER_NAV } from "@/lib/links";

export const metadata: Metadata = {
  title: "CarXprt for Dealerships · Paying shoppers in. Sold cars out.",
  description: "Leads from paying shoppers with their full requirements, an assistant that replies instantly, quotes in minutes and every listing in one place.",
};

/* The dealer page, meant for dealership.carxprt.com (option A, 17 Nov 2026): the home page's parts told from the
   dealer's side. Hero with the dashboard assistant, the four figures, one lead from match to sale (pinned), the
   tools bento, questions, and a demo request. The words are the live dealer page's */
export default function DealersPage() {
  return (
    <>
      <IconSprite />
      <Nav current="" links={DEALER_NAV} cta={{ href: DEALERS, label: "Dealer sign in" }} home="/dealers" />
      <main className="v2 dealers">
        <DealerHero />
        <DealerProof />
        <LeadStory />
        <Tools />
        <Questions faq={DEALER_FAQ} title="Questions from dealers."
          lead={<>What dealerships ask before they start. Anything else, write to <a href={`mailto:${DEALER_MAIL}`}>{DEALER_MAIL}</a>.</>} />
        <BookDemo />
      </main>
      <Footer />
    </>
  );
}

import type { Metadata } from "next";
import { PageHero } from "@/components/marketing/page-hero";
import { Work } from "@/components/marketing/work";
import { CtaBand } from "@/components/marketing/cta-band";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Websites, brand systems, drone films, apps, social campaigns and AI creative from BMU.Marketing.",
};

export default function PortfolioPage() {
  return (
    <>
      <PageHero
        eyebrow="Portfolio"
        title="Work we can show"
        lede="A selection across websites, branding, social, drone, apps and AI creative. Some launches are still under NDA - ask on a call and we'll walk you through those."
      />
      <Work heading={false} />
      <CtaBand
        title="Want something like this built?"
        secondary={{ href: "/case-studies", label: "See the numbers" }}
      />
    </>
  );
}

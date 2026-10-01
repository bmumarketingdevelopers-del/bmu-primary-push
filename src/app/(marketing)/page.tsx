import { Hero, type HeroContent, type HeroStat } from "@/components/marketing/hero";
import { TrustedMarquee } from "@/components/marketing/trusted-marquee";
import { Services } from "@/components/marketing/services";
import { Products } from "@/components/marketing/products";
import { StoreStrip } from "@/components/marketing/store-strip";
import { Industries } from "@/components/marketing/industries";
// Recent work is hidden for now. Uncomment this and <Work /> below to bring it back.
// import { Work } from "@/components/marketing/work";
// Case studies are hidden for now. Uncomment this and <Results /> below to bring them back.
// import { Results } from "@/components/marketing/results";
import { Testimonials } from "@/components/marketing/testimonials";
import { Pricing } from "@/components/marketing/pricing";
import { Faq } from "@/components/marketing/faq";
import { ContactCta } from "@/components/marketing/contact-cta";
import { JsonLd } from "@/components/json-ld";
import { faqSchema } from "@/lib/structured-data";
import { getBlock } from "@/lib/cms";

export default async function HomePage() {
  // Every section below is editable from Admin → Site content.
  const hero = await getBlock<HeroContent>("home.hero");
  const stats = await getBlock<{ items: HeroStat[] }>("home.stats");
  const trusted = await getBlock<{ heading: string; names: string[] }>("home.trusted");
  const testimonials = await getBlock<{ items: { quote: string; author: string; role: string }[] }>("home.testimonials");
  const faqs = await getBlock<{ items: { q: string; a: string }[] }>("home.faqs");

  return (
    <>
      <JsonLd data={faqSchema(faqs.items ?? [])} />
      <Hero content={hero} stats={stats.items} />
      <TrustedMarquee heading={trusted.heading} names={trusted.names} />
      <Services />
      <Products />
      <StoreStrip />
      <Industries />
      {/* <Work /> */}
      {/* <Results /> */}
      <Testimonials items={testimonials.items} />
      <Pricing />
      <Faq items={faqs.items} />
      <ContactCta />
    </>
  );
}

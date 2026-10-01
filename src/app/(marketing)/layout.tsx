import { AnnouncementBar } from "@/components/marketing/announcement-bar";
import { SiteHeader } from "@/components/marketing/site-header";
import { getNavPages } from "@/lib/repos/pages";
import { SiteFooter } from "@/components/marketing/site-footer";
import { ServicesFooter } from "@/components/marketing/services-footer";
import { FooterSwitch } from "@/components/marketing/footer-switch";
import { WelcomePopup } from "@/components/marketing/welcome-popup";

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const navPages = await getNavPages();
  return (
    <>
      <AnnouncementBar />
      <SiteHeader extraPages={navPages} />
      <main>{children}</main>
      <FooterSwitch full={<SiteFooter />} services={<ServicesFooter />} />
      <WelcomePopup />
    </>
  );
}

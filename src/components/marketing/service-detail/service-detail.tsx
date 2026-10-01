import type { ServicePageWithDetail } from "@/lib/service-pages-data";
import { ServiceHero } from "./service-hero";
import { ServiceReasons } from "./service-reasons";
import { ServiceOfferings } from "./service-offerings";
import { ServiceProcess } from "./service-process";
import { ServiceResults } from "./service-results";
import { ServiceCta } from "./service-cta";

/** Full page for one of the six services in lib/service-pages-data.ts. */
export function ServiceDetail({ service }: { service: ServicePageWithDetail }) {
  const { notes } = service.detail;

  return (
    <>
      <ServiceHero service={service} />
      <ServiceReasons note={notes?.reasons} />
      <ServiceOfferings service={service} note={notes?.offerings} />
      <ServiceProcess checks={service.detail.processChecks} />
      <ServiceResults service={service} note={notes?.results} />
      <ServiceCta {...service.detail.cta} />
    </>
  );
}

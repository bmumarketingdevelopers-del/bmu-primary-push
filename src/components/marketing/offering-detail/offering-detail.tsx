import type { OfferingPage } from "@/lib/service-pages-data";
import { OfferingHero } from "./offering-hero";
import { OfferingIncluded } from "./offering-included";
import { OfferingSteps } from "./offering-steps";
import { OfferingBundle } from "./offering-bundle";
import { OfferingCta } from "./offering-cta";

/** Page for one offering inside a service, e.g. /services/marketing-and-visibility/digital-marketing. */
export function OfferingDetail({ service, offering }: OfferingPage) {
  return (
    <>
      <OfferingHero service={service} offering={offering} />
      <OfferingIncluded offering={offering} />
      <OfferingSteps />
      <OfferingBundle service={service} offering={offering} />
      <OfferingCta offering={offering} />
    </>
  );
}

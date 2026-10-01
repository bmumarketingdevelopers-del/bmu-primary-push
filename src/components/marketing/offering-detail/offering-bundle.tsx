import { Reveal } from "../reveal";
import { BundleRow, type BundleItem } from "./bundle-row";
import { offeringHref, type OfferingPage } from "@/lib/service-pages-data";
import { cn } from "@/lib/utils";
import styles from "./offering-bundle.module.css";

/** The offering being viewed, followed by the other offerings from the same service. */
export function OfferingBundle({ service, offering }: OfferingPage) {
  const toItem = (o: (typeof service.detail.offerings)[number]): BundleItem => {
    const Icon = o.icon;
    return {
      slug: o.slug,
      title: o.title,
      priceFrom: o.priceFrom,
      href: o.detail ? offeringHref(service, o) : undefined,
      icon: <Icon strokeWidth={1.8} />,
    };
  };

  const others = service.detail.offerings.filter((o) => o.slug !== offering.slug).slice(0, 3);

  return (
    <section className={styles.section}>
      <div className="container">
        <Reveal>
          <span className={cn("eyebrow", styles.eyebrow)}>Build your bundle</span>
          <h2 className={cn("display", styles.title)}>Often added together</h2>
        </Reveal>
        <Reveal delay={0.08}>
          <BundleRow current={toItem(offering)} others={others.map(toItem)} />
        </Reveal>
      </div>
    </section>
  );
}

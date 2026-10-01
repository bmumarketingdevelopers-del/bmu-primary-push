import Link from "next/link";
import { PRODUCT_DETAILS, productHref } from "@/lib/products-data";
import { FOOTER_SERVICE_LINKS } from "@/lib/nav";
import { cn } from "@/lib/utils";
import styles from "./services-footer.module.css";

const PRODUCT_LINKS = PRODUCT_DETAILS.map((p) => ({ href: productHref(p), label: p.name }));

const COMPANY_LINKS = [
  { href: "/case-studies", label: "Case studies" },
  { href: "/pricing", label: "Pricing" },
  { href: "/resources", label: "Resources" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

// A link without an href (a coming-soon product) is listed as plain text
function LinkList({ links, className }: { links: { href: string | null; label: string }[]; className?: string }) {
  return (
    <ul className={cn(styles.links, className)}>
      {links.map((l) => (
        <li key={l.label}>
          {l.href ? (
            <Link href={l.href} className={styles.link}>{l.label}</Link>
          ) : (
            <span className={styles.text}>{l.label}</span>
          )}
        </li>
      ))}
    </ul>
  );
}

/** Footer for /services and its pages, and for every page on phones (see FooterSwitch). */
export function ServicesFooter() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.grid}>
          <div>
            <Link href="/" className={cn("display", styles.brand)}>BMU.Marketing</Link>
            <p className={styles.about}>
              AI-first growth partner for businesses and real estate. Strategy, creative, media and software from one
              team.
            </p>
            <address className={styles.contact}>
              <span>Bengaluru, Karnataka</span>
              <a href="mailto:hello@bmu.marketing" className={styles.contactLink}>hello@bmu.marketing</a>
              <a href="tel:+918000000000" className={styles.contactLink}>+91 80000 00000</a>
            </address>
          </div>

          <div className={styles.navGrid}>
            <nav aria-label="Services">
              <h4 className={styles.colTitle}>Services</h4>
              <LinkList links={FOOTER_SERVICE_LINKS} />
            </nav>
            <nav aria-label="Products">
              <h4 className={styles.colTitle}>Products</h4>
              <LinkList links={PRODUCT_LINKS} />
            </nav>
            <nav aria-label="Company" className={styles.company}>
              <h4 className={styles.colTitle}>Company</h4>
              <LinkList links={COMPANY_LINKS} className={styles.companyLinks} />
            </nav>
          </div>
        </div>

        <div className={styles.bottom}>
          <span>© {new Date().getFullYear()} BMU.Marketing — Bengaluru, India</span>
          <span>Privacy · Terms · Sitemap</span>
        </div>
      </div>
    </footer>
  );
}

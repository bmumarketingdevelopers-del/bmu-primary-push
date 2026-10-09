import Link from "next/link";
import { Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { PRODUCT_DETAILS, productHref } from "@/lib/products-data";
import { FOOTER_NAV, FOOTER_SERVICE_LINKS } from "@/lib/nav";
import { Logo } from "./logo";
import { cn } from "@/lib/utils";
import styles from "./services-footer.module.css";

const PRODUCT_LINKS = PRODUCT_DETAILS.map((p) => ({ href: productHref(p), label: p.name }));

// Same Company links as the main footer (site-footer), so both footers list the same pages
const COMPANY_LINKS = FOOTER_NAV.find((col) => col.title === "Company")?.links ?? [];

const SOCIAL = [
  { Icon: Instagram, label: "Instagram", href: "https://www.instagram.com/bmu.marketing?stkn=MTl4ajc4MDZwdGpiMQ==" },
  { Icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/company/buildmyuniversee/" },
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
            <Logo tone="onDark" className={styles.brand} />
            <p className={styles.about}>
              AI-first growth partner for businesses and real estate. Strategy, creative, media and software from one
              team.
            </p>
            {/* icons, colours and social buttons as in the main footer (site-footer) */}
            <address className={styles.contact}>
              <span className={styles.contactItem}>
                <MapPin className={styles.contactIcon} aria-hidden="true" />
                376, Phase 9, Royal Park Residency Layout, JP Nagar 9th Phase, J. P. Nagar, Bengaluru, Karnataka 560108
              </span>
              <a href="mailto:buildmyuniversee@gmail.com" className={cn(styles.contactItem, styles.contactLink)}>
                <Mail className={styles.contactIcon} aria-hidden="true" />
                buildmyuniversee@gmail.com
              </a>
              <a href="tel:+918105491414" className={cn(styles.contactItem, styles.contactLink)}>
                <Phone className={styles.contactIcon} aria-hidden="true" />
                +91 81054 91414
              </a>
            </address>
            <div className={styles.social}>
              {SOCIAL.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={styles.socialLink}
                >
                  <Icon className={styles.socialIcon} />
                </a>
              ))}
            </div>
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
          <span>© {new Date().getFullYear()} BMU.Marketing - Bengaluru, India</span>
          <span>Privacy · Terms · Sitemap</span>
        </div>
      </div>
    </footer>
  );
}

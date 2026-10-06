import Link from "next/link";
import { Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import { Logo } from "./logo";
import { FOOTER_NAV } from "@/lib/nav";
import styles from "./site-footer.module.css";

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.grid}>
          <div>
            <Logo tone="onDark" className={styles.logo} />
            <p className={styles.about}>
              AI-first growth partner for businesses and real estate. Strategy, creative, media and software from one team.
            </p>
            <ul className={styles.contact}>
              <li className={styles.contactItem}><MapPin className={styles.contactIcon} /> 376, Phase 9, Royal Park Residency Layout, JP Nagar 9th Phase, J. P. Nagar, Bengaluru, Karnataka 560108</li>
              <li className={styles.contactItem}><Mail className={styles.contactIcon} /> buildmyuniversee@gmail.com</li>
              <li className={styles.contactItem}><Phone className={styles.contactIcon} /> +91 81054 91414</li>
            </ul>
            <div className={styles.social}>
              {[
                { Icon: Instagram, label: "Instagram", href: "https://www.instagram.com/bmu.marketing?stkn=MTl4ajc4MDZwdGpiMQ==" },
                { Icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/company/buildmyuniversee/" },
              ].map(({ Icon, label, href }) => (
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

          {FOOTER_NAV.map((col) => (
            <div key={col.title}>
              <h4 className={styles.colTitle}>{col.title}</h4>
              <ul className={styles.links}>
                {col.links.map((l) => (
                  <li key={l.label}>
                    {l.href ? (
                      <Link href={l.href} className={styles.link}>
                        {l.label}
                      </Link>
                    ) : (
                      // Coming-soon product: shown, not linked
                      <span className={styles.text}>{l.label}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className={styles.bottom}>
          <span>© {new Date().getFullYear()} BMU.Marketing - Bengaluru, India</span>
          <span>Privacy · Terms · Sitemap</span>
        </div>
      </div>
    </footer>
  );
}

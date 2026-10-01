import Link from "next/link";
import { Instagram, Linkedin, Youtube, MessageCircle, Mail, Phone, MapPin } from "lucide-react";
import { Logo } from "./logo";
import { FOOTER_NAV } from "@/lib/nav";
import styles from "./site-footer.module.css";

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.grid}>
          <div>
            <Logo className={styles.logo} />
            <p className={styles.about}>
              AI-first growth partner for businesses and real estate. Strategy, creative, media and software from one team.
            </p>
            <ul className={styles.contact}>
              <li className={styles.contactItem}><MapPin className={styles.contactIcon} /> Bengaluru, Karnataka</li>
              <li className={styles.contactItem}><Mail className={styles.contactIcon} /> hello@bmu.marketing</li>
              <li className={styles.contactItem}><Phone className={styles.contactIcon} /> +91 80000 00000</li>
            </ul>
            <div className={styles.social}>
              {[
                { Icon: Instagram, label: "Instagram" },
                { Icon: Linkedin, label: "LinkedIn" },
                { Icon: Youtube, label: "YouTube" },
                { Icon: MessageCircle, label: "WhatsApp" },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
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
                  <li key={l.href}>
                    <Link href={l.href} className={styles.link}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className={styles.bottom}>
          <span>© {new Date().getFullYear()} BMU.Marketing — Bengaluru, India</span>
          <span>Privacy · Terms · Sitemap</span>
        </div>
      </div>
    </footer>
  );
}

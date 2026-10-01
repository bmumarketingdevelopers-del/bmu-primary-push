"use client";

import { usePathname } from "next/navigation";
import styles from "./footer-switch.module.css";

/**
 * /services and its sub-pages use the services footer everywhere. Every other page keeps the full
 * site footer from tablet up, and shows the services footer on phones.
 */
export function FooterSwitch({ full, services }: { full: React.ReactNode; services: React.ReactNode }) {
  const pathname = usePathname();
  const isServices = pathname === "/services" || pathname.startsWith("/services/");

  if (isServices) return services;

  return (
    <>
      <div className={styles.phone}>{services}</div>
      <div className={styles.wide}>{full}</div>
    </>
  );
}

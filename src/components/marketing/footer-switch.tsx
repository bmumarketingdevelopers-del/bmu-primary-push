"use client";

import { usePathname } from "next/navigation";

/** /services and its sub-pages use the services footer; every other page keeps the full site footer. */
export function FooterSwitch({ full, services }: { full: React.ReactNode; services: React.ReactNode }) {
  const pathname = usePathname();
  const isServices = pathname === "/services" || pathname.startsWith("/services/");

  return isServices ? services : full;
}

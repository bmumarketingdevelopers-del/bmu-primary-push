import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getBlock } from "@/lib/cms";
import { cn } from "@/lib/utils";
import styles from "./announcement-bar.module.css";

/** Hidden entirely when the CMS message is empty — no blank strip. */
export async function AnnouncementBar() {
  const bar = await getBlock<{ message: string; linkLabel: string; linkHref: string }>(
    "global.announcement"
  );

  if (!bar.message?.trim()) return null;

  return (
    <div className={styles.bar}>
      <div className={cn("container", styles.inner)}>
        <span>{bar.message}</span>
        {bar.linkLabel && bar.linkHref && (
          <Link
            href={bar.linkHref}
            className={styles.link}
          >
            {bar.linkLabel} <ArrowRight className={styles.arrow} />
          </Link>
        )}
      </div>
    </div>
  );
}

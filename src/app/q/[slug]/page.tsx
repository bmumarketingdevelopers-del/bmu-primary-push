import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { QrCode } from "lucide-react";
import { PasswordGate } from "@/components/qr/password-gate";
import { Logo } from "@/components/marketing/logo";
import { absoluteTarget, recordScan, resolveQr } from "@/lib/qr";
import { cn } from "@/lib/utils";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Scan",
  robots: { index: false, follow: false },
};

export default async function QrRedirect({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const code = await resolveQr(slug);

  // Open code: record the scan, then leave. redirect() throws, so it must be last.
  if (code?.isActive && !code.password) {
    await recordScan(code);
    redirect(absoluteTarget(code.target));
  }

  return (
    <main className={styles.main}>
      <div className={styles.inner}>
        {code?.isActive && code.password ? (
          <PasswordGate slug={code.slug} label={code.label} />
        ) : (
          <div className={styles.notice}>
            <span className={styles.noticeIcon}>
              <QrCode className={styles.noticeGlyph} strokeWidth={1.8} />
            </span>
            <h1 className={cn("display", styles.title)}>
              {code ? "This code is paused" : "Code not found"}
            </h1>
            <p className={styles.message}>
              {code
                ? "The business has turned this one off for now. Nothing needs reprinting — it can be switched back on at any time."
                : "Check the code scanned fully, or ask the business for a current one."}
            </p>
          </div>
        )}

        <Link href="/" className={styles.homeLink}>
          <Logo />
        </Link>
      </div>
    </main>
  );
}

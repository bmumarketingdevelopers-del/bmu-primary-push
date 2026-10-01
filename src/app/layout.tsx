import type { Metadata } from "next";
import { Zen_Dots, Albert_Sans } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@/components/analytics";
import { JsonLd } from "@/components/json-ld";
import { organizationSchema } from "@/lib/structured-data";
import "./globals.css";

const display = Zen_Dots({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const sans = Albert_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: {
    default: "BMU.Marketing - AI Powered Growth Partner",
    template: "%s · BMU.Marketing",
  },
  description:
    "AI-first growth agency. Social media, UGC, performance marketing, SEO, websites, apps, automation and real estate marketing - plus SaaS products that keep working after the campaign ends.",
  keywords: [
    "digital marketing agency Bengaluru",
    "real estate marketing",
    "performance marketing",
    "AI content",
    "SEO agency India",
  ],
  openGraph: {
    title: "BMU.Marketing - AI Powered Growth Partner",
    description: "Strategy, creative, media and software from one team.",
    type: "website",
    locale: "en_IN",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${display.variable} ${sans.variable}`}>
      <body>
        <JsonLd data={organizationSchema()} />
        <SessionProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
            {children}
          </ThemeProvider>
        </SessionProvider>
        <Analytics />
      </body>
    </html>
  );
}

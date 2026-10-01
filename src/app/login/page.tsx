import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { SigninForm } from "@/components/auth/signin-form";
import { isDemoMode } from "@/lib/demo-users";

export const metadata: Metadata = {
  title: "Log in",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <AuthShell title="Welcome back" lede="Log in to access your BMU dashboard.">
      {/* The form reads ?next= from the URL, which needs a Suspense boundary */}
      <Suspense>
        <SigninForm demoMode={isDemoMode()} />
      </Suspense>
    </AuthShell>
  );
}

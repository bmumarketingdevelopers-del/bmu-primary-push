import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata: Metadata = {
  title: "Create account",
  robots: { index: false, follow: false },
};

export default function SignupPage() {
  return (
    <AuthShell title="Create new account" lede="Sign up to access your BMU client dashboard.">
      <SignupForm />
    </AuthShell>
  );
}

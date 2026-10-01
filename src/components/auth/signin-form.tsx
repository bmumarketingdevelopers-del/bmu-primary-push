"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { getSession, signIn } from "next-auth/react";
import { AlertCircle, Eye, EyeOff, Loader2, User } from "lucide-react";
import { DemoAccounts } from "@/components/login-form";
import { isAdmin } from "@/lib/roles";
import { cn } from "@/lib/utils";
import styles from "./auth-form.module.css";

type Field = "identifier" | "password";
type Errors = Partial<Record<Field, string>>;

/**
 * Signs in with the existing credentials provider. The Username field takes an email (what the
 * provider checks today) or a phone number, for when phone sign-in is added.
 * Replace the body to plug in different logic; return an error message, or null on success.
 */
async function logIn(
  identifier: string,
  password: string,
): Promise<string | null> {
  const res = await signIn("credentials", {
    email: identifier,
    password,
    redirect: false,
  });
  return res?.error ? "Those details don't match an account." : null;
}

export function SigninForm({ demoMode = false }: { demoMode?: boolean }) {
  const router = useRouter();
  const next = useSearchParams().get("next");

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [pending, setPending] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // The dev-only demo account list fills the form
  const fill = (email: string, pw: string) => {
    setIdentifier(email);
    setPassword(pw);
    setErrors({});
    setFormError(null);
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const found: Errors = {};
    if (!identifier.trim())
      found.identifier = "Enter your email or phone number.";
    if (!password) found.password = "Enter your password.";
    setErrors(found);
    if (Object.keys(found).length) {
      document.getElementById(`signin-${Object.keys(found)[0]}`)?.focus();
      return;
    }

    setPending(true);
    setFormError(null);
    try {
      const error = await logIn(identifier.trim(), password);
      if (error) {
        setFormError(error);
        setPending(false);
        return;
      }
      // Admins land on the admin portal; everyone else keeps their usual home. Middleware
      // still redirects if `next` isn't allowed for their role.
      const session = await getSession();
      const home = isAdmin(session?.user?.role) ? "/admin-portal" : "/dashboard";
      router.push(next ?? home);
      router.refresh();
    } catch {
      setFormError("Something went wrong. Please try again.");
      setPending(false);
    }
  }

  return (
    <>
      <form onSubmit={onSubmit} noValidate className={styles.form}>
        {/* Username: email or phone */}
        <div className={styles.field}>
          <label htmlFor="signin-identifier" className={styles.label}>
            Username
          </label>
          <div
            className={cn(styles.control, errors.identifier && styles.invalid)}
          >
            <User className={styles.leadIcon} aria-hidden="true" />
            <input
              id="signin-identifier"
              name="username"
              autoComplete="username"
              placeholder="E-mail/Phone number"
              value={identifier}
              onChange={(e) => {
                setIdentifier(e.target.value);
                if (errors.identifier)
                  setErrors((er) => ({ ...er, identifier: undefined }));
              }}
              aria-invalid={!!errors.identifier}
              aria-describedby={
                errors.identifier ? "signin-identifier-error" : undefined
              }
              className={styles.input}
            />
          </div>
          {errors.identifier && (
            <p id="signin-identifier-error" className={styles.error}>
              {errors.identifier}
            </p>
          )}
        </div>

        {/* Password */}
        <div className={cn(styles.field, styles.fieldSpaced)}>
          <label htmlFor="signin-password" className={styles.label}>
            Password
          </label>
          <div
            className={cn(styles.control, errors.password && styles.invalid)}
          >
            <input
              id="signin-password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password)
                  setErrors((er) => ({ ...er, password: undefined }));
              }}
              aria-invalid={!!errors.password}
              aria-describedby={
                errors.password
                  ? "signin-password-error"
                  : "signin-password-hint"
              }
              className={cn(styles.input, styles.inputFlush)}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              className={styles.eye}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
          {errors.password ? (
            <p id="signin-password-error" className={styles.error}>
              {errors.password}
            </p>
          ) : (
            <p id="signin-password-hint" className={styles.hint}>
              At least 8 characters, with a number or symbol.
            </p>
          )}
        </div>

        {formError && (
          <p className={styles.formError} role="alert">
            <AlertCircle aria-hidden="true" />
            {formError}
          </p>
        )}

        <div className={cn(styles.footer, styles.footerSpaced)}>
          <button type="submit" disabled={pending} className={styles.submit}>
            {pending ? (
              <>
                <Loader2 className={styles.spinner} aria-hidden="true" />{" "}
                Logging in…
              </>
            ) : (
              "Log in"
            )}
          </button>
          <p className={styles.switch}>
            Don&apos;t have an account?{" "}
            <Link href="/signup" className={styles.switchLink}>
              Sign up
            </Link>
          </p>
        </div>
      </form>

      {/* Development only (never in production builds) */}
      {demoMode && (
        <div className={styles.demo}>
          <DemoAccounts onPick={fill} />
        </div>
      )}
    </>
  );
}

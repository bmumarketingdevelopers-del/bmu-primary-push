"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle2, ChevronDown, Eye, EyeOff, Loader2, User } from "lucide-react";
import { cn } from "@/lib/utils";
import styles from "./auth-form.module.css";

const COUNTRY_CODES = [
  { code: "+91", label: "India", digits: [10, 10] },
  { code: "+971", label: "UAE", digits: [8, 9] },
  { code: "+1", label: "USA / Canada", digits: [10, 10] },
  { code: "+44", label: "UK", digits: [10, 10] },
  { code: "+65", label: "Singapore", digits: [8, 8] },
] as const;

export type SignupValues = {
  username: string;
  countryCode: string;
  phone: string;
  password: string;
};

type Field = "username" | "phone" | "password";
type Errors = Partial<Record<Field, string>>;

/**
 * Placeholder for the real sign-up call. Replace the body with the API request
 * (e.g. `fetch("/api/signup", …)`) and throw an Error with a readable message on failure.
 */
async function createAccount(values: SignupValues): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 900));
  if (process.env.NODE_ENV !== "production") console.info("[signup] would create account:", values);
}

function validate(v: SignupValues): Errors {
  const errors: Errors = {};
  const username = v.username.trim();
  if (!username) errors.username = "Choose a username.";
  else if (username.length < 3) errors.username = "Use at least 3 characters.";
  else if (!/^[a-zA-Z0-9._-]+$/.test(username)) errors.username = "Use letters, numbers, dots, dashes or underscores.";

  const country = COUNTRY_CODES.find((c) => c.code === v.countryCode) ?? COUNTRY_CODES[0];
  const [min, max] = country.digits;
  if (!v.phone) errors.phone = "Enter your phone number.";
  else if (v.phone.length < min || v.phone.length > max)
    errors.phone = min === max ? `Enter a ${min}-digit number.` : `Enter a ${min}–${max} digit number.`;

  if (!v.password) errors.password = "Create a password.";
  else if (v.password.length < 8 || !/[\d\W_]/.test(v.password))
    errors.password = "At least 8 characters, with a number or symbol.";

  return errors;
}

export function SignupForm() {
  const [values, setValues] = useState<SignupValues>({ username: "", countryCode: "+91", phone: "", password: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [formError, setFormError] = useState<string | null>(null);

  const set = (key: keyof SignupValues, value: string) => {
    setValues((v) => ({ ...v, [key]: value }));
    // Clear a field's error as soon as they start fixing it
    if (key in errors) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) {
      document.getElementById(`signup-${Object.keys(found)[0]}`)?.focus();
      return;
    }

    setStatus("sending");
    setFormError(null);
    try {
      await createAccount({ ...values, username: values.username.trim() });
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setFormError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  if (status === "done") {
    return (
      <div className={styles.success} role="status">
        <CheckCircle2 className={styles.successIcon} />
        <p className={styles.successTitle}>Account created</p>
        <p className={styles.successText}>
          Welcome aboard, {values.username.trim()}. You can now sign in to your dashboard.
        </p>
        <Link href="/login" className={styles.submit}>
          Continue to sign in
        </Link>
      </div>
    );
  }

  const describedBy = (field: Field, extra?: string) =>
    [errors[field] ? `signup-${field}-error` : null, extra].filter(Boolean).join(" ") || undefined;

  return (
    <form onSubmit={onSubmit} noValidate className={styles.form}>
      {/* Username */}
      <div className={styles.field}>
        <label htmlFor="signup-username" className={styles.label}>
          Username
        </label>
        <div className={cn(styles.control, errors.username && styles.invalid)}>
          <User className={styles.leadIcon} aria-hidden="true" />
          <input
            id="signup-username"
            name="username"
            autoComplete="username"
            placeholder="Choose a username"
            value={values.username}
            onChange={(e) => set("username", e.target.value)}
            aria-invalid={!!errors.username}
            aria-describedby={describedBy("username")}
            className={styles.input}
          />
        </div>
        {errors.username && (
          <p id="signup-username-error" className={styles.error}>
            {errors.username}
          </p>
        )}
      </div>

      {/* Phone number */}
      <div className={styles.field}>
        <label htmlFor="signup-phone" className={styles.label}>
          Phone number
        </label>
        <div className={cn(styles.control, errors.phone && styles.invalid)}>
          <div className={styles.country}>
            <select
              aria-label="Country code"
              value={values.countryCode}
              onChange={(e) => set("countryCode", e.target.value)}
              className={styles.countrySelect}
            >
              {COUNTRY_CODES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} {c.label}
                </option>
              ))}
            </select>
            {/* The visible label shows just the code; the native list names the country */}
            <span aria-hidden="true" className={styles.countryLabel}>
              {values.countryCode}
              <ChevronDown />
            </span>
          </div>
          <span aria-hidden="true" className={styles.divider} />
          <input
            id="signup-phone"
            name="phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            placeholder="98450 00000"
            maxLength={14}
            value={values.phone}
            onChange={(e) => set("phone", e.target.value.replace(/\D/g, ""))}
            aria-invalid={!!errors.phone}
            aria-describedby={describedBy("phone")}
            className={styles.input}
          />
        </div>
        {errors.phone && (
          <p id="signup-phone-error" className={styles.error}>
            {errors.phone}
          </p>
        )}
      </div>

      {/* Password */}
      <div className={styles.field}>
        <label htmlFor="signup-password" className={styles.label}>
          Password
        </label>
        <div className={cn(styles.control, errors.password && styles.invalid)}>
          <input
            id="signup-password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Create a password"
            value={values.password}
            onChange={(e) => set("password", e.target.value)}
            aria-invalid={!!errors.password}
            aria-describedby={describedBy("password", errors.password ? undefined : "signup-password-hint")}
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
          <p id="signup-password-error" className={styles.error}>
            {errors.password}
          </p>
        ) : (
          <p id="signup-password-hint" className={styles.hint}>
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

      <div className={styles.footer}>
        <button type="submit" disabled={status === "sending"} className={styles.submit}>
          {status === "sending" ? (
            <>
              <Loader2 className={styles.spinner} aria-hidden="true" /> Signing up…
            </>
          ) : (
            "Sign up"
          )}
        </button>
        <p className={styles.switch}>
          Already have an account?{" "}
          <Link href="/login" className={styles.switchLink}>
            Log in
          </Link>
        </p>
      </div>
    </form>
  );
}

import type { NextAuthConfig } from "next-auth";
import { guardFor, homeFor, isAdmin, type AppRole } from "@/lib/roles";

/**
 * Edge-safe half of the auth setup: no database client, no bcrypt.
 * Middleware imports this file. Providers live in `src/auth.ts`, which
 * runs on the Node runtime only.
 */
export const authConfig = {
  /**
   * Session signing key.
   *
   * A published fallback is a session-forgery key — anyone reading this repo
   * could mint an OWNER cookie. So it's development-only, and production
   * fails loudly at boot rather than starting with a known secret.
   */
  secret:
    process.env.AUTH_SECRET ??
    (process.env.NODE_ENV === "production"
      ? (() => {
          throw new Error(
            "AUTH_SECRET is not set. Generate one with `npx auth secret` and add it to your environment before deploying."
          );
        })()
      : "dev-only-insecure-secret-change-me"),
  /** Needed when the app isn't hosted on Vercel (local dev, Railway, a VPS). */
  trustHost: true,
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: { strategy: "jwt" },
  providers: [],
  callbacks: {
    /** Persist role and client scope on the token at sign-in. */
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.clientId = user.clientId ?? null;
      }
      return token;
    },

    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        // next-auth nests its own @auth/core, so the JWT augmentation in
        // src/types/next-auth.d.ts never reaches this token. We set these in jwt() above.
        session.user.role = token.role as AppRole;
        session.user.clientId = (token.clientId as string | null | undefined) ?? null;
      }
      return session;
    },

    /** Runs in the proxy (src/proxy.ts) on every matched request. */
    authorized({ auth, request }) {
      const { pathname, search } = request.nextUrl;
      const user = auth?.user;
      const guard = guardFor(pathname);

      // Already signed in and heading to /login — send them home instead.
      if (pathname === "/login" && user) {
        const home = isAdmin(user.role) ? "/admin-portal" : homeFor(user.role);
        return Response.redirect(new URL(home, request.nextUrl));
      }

      if (!guard) return true;

      // Not signed in: bounce to login, remembering where they were going.
      if (!user) {
        const url = new URL("/login", request.nextUrl);
        url.searchParams.set("next", pathname + search);
        return Response.redirect(url);
      }

      // Signed in but wrong role: send them to the area they do own.
      if (!guard.allow.includes(user.role as never)) {
        return Response.redirect(new URL(homeFor(user.role), request.nextUrl));
      }

      return true;
    },
  },
} satisfies NextAuthConfig;

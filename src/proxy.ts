import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

/**
 * Network-boundary auth check.
 *
 * Next 16 renamed `middleware.ts` to `proxy.ts` and expects the handler to be
 * exported as `proxy` rather than as the default. The name change reflects
 * what it actually is — a proxy at the network edge, not middleware in the
 * Express sense.
 *
 * Only the edge-safe config is used here; the `authorized` callback in
 * auth.config.ts decides who gets through. Nothing that touches Prisma or
 * bcrypt can run at this layer.
 */
const { auth } = NextAuth(authConfig);

export const proxy = auth;

export const config = {
  /**
   * Only routes that need a session decision. The marketing site is public,
   * so keeping it out of the matcher avoids decoding a JWT on every page view.
   */
  matcher: [
    "/admin/:path*",
    "/admin-portal/:path*",
    "/dashboard/:path*",
    "/creators/:path*",
    "/business/:path*",
    "/login",
  ],
};

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { z } from "zod";
import { authConfig } from "@/auth.config";
import { DEMO_USERS } from "@/lib/demo-users";
import type { AppRole } from "@/lib/roles";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

/** Google is only registered when both env vars are present. */
const oauthProviders = process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET ? [Google] : [];

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    ...oauthProviders,
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(raw) {
        const parsed = credentialsSchema.safeParse(raw);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;
        const normalised = email.trim().toLowerCase();

        // --- Database path ---
        if (process.env.DATABASE_URL) {
          try {
            const [{ prisma }, bcrypt] = await Promise.all([
              import("@/lib/prisma"),
              import("bcryptjs"),
            ]);

            const user = await prisma.user.findUnique({ where: { email: normalised } });

            if (user?.passwordHash) {
              const ok = await bcrypt.compare(password, user.passwordHash);
              if (!ok) return null;

              await prisma.user.update({
                where: { id: user.id },
                data: { lastLoginAt: new Date() },
              });

              return {
                id: user.id,
                email: user.email,
                name: user.name,
                image: user.image,
                role: user.role as AppRole,
                clientId: user.clientId,
              };
            }
            /**
             * The database answered and this email either doesn't exist or
             * has no password. That's a failed login, not a reason to try
             * the demo list — otherwise admin@bmu.marketing / bmu-admin
             * signs in on production the moment someone guesses it.
             */
            return null;
          } catch (err) {
            // Only a genuine outage reaches here, and only in development.
            console.warn("[auth] database unreachable:", err);

            if (process.env.NODE_ENV === "production") {
              return null;
            }
          }
        }

        /**
         * Demo accounts. Development only, and only when there's no working
         * database. These must never authenticate a production request.
         */
        if (process.env.NODE_ENV === "production") return null;

        const demo = DEMO_USERS.find((u) => u.email === normalised && u.password === password);
        if (!demo) return null;

        return {
          id: demo.id,
          email: demo.email,
          name: demo.name,
          role: demo.role,
          clientId: demo.clientId,
        };
      },
    }),
  ],
});

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { z } from "zod";
import { authConfig } from "@/auth.config";
import { DEMO_USERS, isDemoMode } from "@/lib/demo-users";
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
            // Not in the database — fall through to the demo accounts (if enabled)
          } catch (err) {
            console.warn("[auth] database unreachable:", err);
          }
        }

        /** Demo accounts, unless switched off with DEMO_ACCOUNTS=off. */
        if (!isDemoMode()) return null;

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

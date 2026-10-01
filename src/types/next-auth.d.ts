import type { DefaultSession } from "next-auth";
import type { AppRole } from "@/lib/roles";

declare module "next-auth" {
  interface User {
    role: AppRole;
    clientId?: string | null;
  }

  interface Session {
    user: {
      id: string;
      role: AppRole;
      clientId?: string | null;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: AppRole;
    clientId?: string | null;
  }
}

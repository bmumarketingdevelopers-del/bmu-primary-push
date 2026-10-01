import "server-only";
import { auth } from "@/auth";
import { isAdmin } from "@/lib/roles";

/** The signed-in admin (OWNER / ADMIN), or null. For admin-portal actions and API routes. */
export async function currentAdmin() {
  const session = await auth();
  return session?.user && isAdmin(session.user.role) ? session.user : null;
}

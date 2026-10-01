import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { homeFor, isStaff, type AppRole } from "@/lib/roles";

/** Current user or null. Safe to call in any server component. */
export async function getCurrentUser() {
  const session = await auth();
  return session?.user ?? null;
}

/**
 * Defence in depth behind the proxy: if someone reaches a protected
 * layout without a valid session, they never see the markup.
 */
export async function requireUser(allow?: AppRole[]) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (allow && !allow.includes(user.role)) redirect(homeFor(user.role));
  return user;
}

export async function requireStaff() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!isStaff(user.role)) redirect("/dashboard");
  return user;
}

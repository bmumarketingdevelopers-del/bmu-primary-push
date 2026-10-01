"use server";

import { revalidatePath } from "next/cache";
import { currentAdmin } from "@/lib/admin-guard";
import { isLeadStatus, setLeadStatuses } from "@/lib/website-leads";

/** Sets one lead's review status from the dashboard. */
export async function updateLeadStatus(id: string, status: string): Promise<{ ok: boolean; error?: string }> {
  if (!(await currentAdmin())) return { ok: false, error: "Your session has expired. Sign in again." };
  if (typeof id !== "string" || !id || !isLeadStatus(status)) return { ok: false, error: "Invalid status." };

  try {
    await setLeadStatuses([{ id, status }]);
    revalidatePath("/admin-portal");
    return { ok: true };
  } catch (err) {
    console.error("[admin-portal] status update failed:", err);
    return { ok: false, error: "Couldn't save the status. Try again." };
  }
}

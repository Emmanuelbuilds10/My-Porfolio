"use server";

import { revalidatePath } from "next/cache";
import { listAllSubscribers } from "@/lib/admin/data";
import { adminGuard } from "@/lib/admin/guard";
import type { ExportResult, SaveResult } from "@/lib/admin/schemas";
import { isServiceConfigured, createServiceClient } from "@/lib/supabase/admin";

export async function removeSubscriber(id: string): Promise<SaveResult> {
  const denied = await adminGuard();
  if (denied) return denied;

  if (!isServiceConfigured()) {
    return { ok: false, message: "The service-role key is required to manage subscribers." };
  }

  const { error } = await createServiceClient().from("subscribers").delete().eq("id", id);
  if (error) return { ok: false, message: error.message };

  revalidatePath("/admin");
  revalidatePath("/admin/subscribers");
  return { ok: true, message: "Subscriber removed." };
}

function csvCell(value: string) {
  return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

export async function exportSubscribers(): Promise<ExportResult> {
  const denied = await adminGuard();
  if (denied) return denied;

  if (!isServiceConfigured()) {
    return { ok: false, message: "The service-role key is required to export subscribers." };
  }

  const rows = await listAllSubscribers();
  const body = rows.map((row) => `${csvCell(row.email)},${row.createdAt}`).join("\n");

  return {
    ok: true,
    message: `Exported ${rows.length} subscriber${rows.length === 1 ? "" : "s"}.`,
    csv: `email,subscribed_at\n${body}\n`,
    filename: `subscribers-${new Date().toISOString().slice(0, 10)}.csv`,
  };
}

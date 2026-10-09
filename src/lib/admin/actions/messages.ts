"use server";

import { revalidatePath } from "next/cache";
import { adminGuard } from "@/lib/admin/guard";
import type { SaveResult } from "@/lib/admin/schemas";
import { createAuthClient } from "@/lib/supabase/server";

function revalidateMessages() {
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}

/** Mark one message read (toggle supported for unreading). */
export async function setMessageRead(id: string, read: boolean): Promise<SaveResult> {
  const denied = await adminGuard();
  if (denied) return denied;

  const { error } = await (await createAuthClient())
    .from("messages")
    .update({ is_read: read })
    .eq("id", id);

  if (error) return { ok: false, message: error.message };

  revalidateMessages();
  return { ok: true, message: read ? "Marked as read." : "Marked as unread." };
}

/** Mark every unread message read in one stroke. */
export async function markAllMessagesRead(): Promise<SaveResult> {
  const denied = await adminGuard();
  if (denied) return denied;

  const { error } = await (await createAuthClient())
    .from("messages")
    .update({ is_read: true })
    .eq("is_read", false);

  if (error) return { ok: false, message: error.message };

  revalidateMessages();
  return { ok: true, message: "All messages marked read." };
}

export async function deleteMessage(id: string): Promise<SaveResult> {
  const denied = await adminGuard();
  if (denied) return denied;

  const { error } = await (await createAuthClient()).from("messages").delete().eq("id", id);
  if (error) return { ok: false, message: error.message };

  revalidateMessages();
  return { ok: true, message: "Message deleted." };
}

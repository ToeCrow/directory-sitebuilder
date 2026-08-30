"use server";

import {
  changeAdminPassword,
  updateAdminAccount,
} from "@/lib/admin/session";
import type { ActionResult } from "@/lib/admin/types";

export async function updateAccountAction(raw: {
  username: string;
  displayName: string;
}): Promise<ActionResult> {
  return updateAdminAccount(raw);
}

export async function changePasswordAction(raw: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<ActionResult> {
  if (raw.newPassword !== raw.confirmPassword) {
    return { ok: false, error: "New passwords do not match." };
  }
  return changeAdminPassword({
    currentPassword: raw.currentPassword,
    newPassword: raw.newPassword,
  });
}

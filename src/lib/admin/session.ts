import { eq, sql } from "drizzle-orm";
import {
  ADMIN_REFRESH_COOKIE,
  ADMIN_SESSION_COOKIE,
  resolveAdminAuth,
} from "@/lib/admin-auth";
import {
  userCanAccessSite,
  type AdminUser,
} from "@/lib/admin-access";
import { hashPassword, verifyPassword } from "@/lib/admin-password";
import { getDb } from "@/lib/db";
import { sites, users, userSiteAccess } from "@/lib/db/schema";
import { getAdminSiteSlug } from "@/lib/admin/sites";

export type { AdminUser };

export async function loadAdminUser(id: string): Promise<AdminUser | null> {
  const db = getDb();
  const [row] = await db.select().from(users).where(eq(users.id, id)).limit(1);
  if (!row) {
    return null;
  }

  const accessRows = await db
    .select({ slug: sites.slug })
    .from(userSiteAccess)
    .innerJoin(sites, eq(userSiteAccess.siteId, sites.id))
    .where(eq(userSiteAccess.userId, row.id));

  return {
    id: row.id,
    username: row.username,
    displayName: row.displayName,
    role: row.role,
    siteSlugs: accessRows.map((access) => access.slug),
    profile: (row.profile ?? {}) as Record<string, unknown>,
  };
}

export async function authenticateAdmin(
  username: string | undefined,
  password: string | undefined,
): Promise<AdminUser | null> {
  const trimmed = username?.trim() ?? "";
  if (!trimmed || !password) {
    return null;
  }

  const db = getDb();
  const [row] = await db
    .select()
    .from(users)
    .where(sql`lower(${users.username}) = lower(${trimmed})`)
    .limit(1);

  if (!row) {
    await hashPassword(password);
    return null;
  }

  const ok = await verifyPassword(
    password,
    row.passwordSalt,
    row.passwordHash,
    row.passwordKdf,
  );
  if (!ok) {
    return null;
  }

  return loadAdminUser(row.id);
}

export async function requireAdminUser(): Promise<AdminUser> {
  const { cookies } = await import("next/headers");
  const jar = await cookies();
  const access = jar.get(ADMIN_SESSION_COOKIE)?.value;
  const refresh = jar.get(ADMIN_REFRESH_COOKIE)?.value;
  const auth = await resolveAdminAuth(access, refresh);
  if (!auth.ok) {
    throw new Error("Unauthorized");
  }
  const user = await loadAdminUser(auth.userId);
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

export async function adminGuard(): Promise<
  { ok: true; user: AdminUser } | { ok: false; error: string }
> {
  try {
    return { ok: true, user: await requireAdminUser() };
  } catch {
    return { ok: false, error: "Unauthorized" };
  }
}

export async function adminSiteGuard(
  siteId: string,
): Promise<
  | { ok: true; user: AdminUser; siteSlug: string }
  | { ok: false; error: string }
> {
  const auth = await adminGuard();
  if (!auth.ok) {
    return auth;
  }
  const siteSlug = await getAdminSiteSlug(siteId);
  if (!siteSlug || !userCanAccessSite(auth.user, siteSlug)) {
    return { ok: false, error: "Site not found" };
  }
  return { ok: true, user: auth.user, siteSlug };
}

export async function updateAdminAccount(input: {
  username: string;
  displayName: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const auth = await adminGuard();
  if (!auth.ok) {
    return auth;
  }

  const username = input.username.trim();
  const displayName = input.displayName.trim();
  if (username.length < 2 || username.length > 40) {
    return { ok: false, error: "Username must be 2–40 characters." };
  }
  if (!/^[A-Za-z0-9._-]+$/.test(username)) {
    return {
      ok: false,
      error: "Username may only contain letters, numbers, dots, underscores, and hyphens.",
    };
  }
  if (displayName.length < 1 || displayName.length > 80) {
    return { ok: false, error: "Display name must be 1–80 characters." };
  }

  const db = getDb();
  try {
    await db
      .update(users)
      .set({
        username,
        displayName,
        updatedAt: new Date(),
      })
      .where(eq(users.id, auth.user.id));
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (/users_username_lower_uidx|username/i.test(message)) {
      return { ok: false, error: "That username is already taken." };
    }
    if (/users_display_name_uidx|display_name/i.test(message)) {
      return { ok: false, error: "That display name is already taken." };
    }
    return { ok: false, error: "Could not save account." };
  }

  return { ok: true };
}

export async function changeAdminPassword(input: {
  currentPassword: string;
  newPassword: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const auth = await adminGuard();
  if (!auth.ok) {
    return auth;
  }

  if (!input.currentPassword || !input.newPassword) {
    return { ok: false, error: "Current and new password are required." };
  }
  if (input.newPassword.length < 8) {
    return { ok: false, error: "New password must be at least 8 characters." };
  }

  const db = getDb();
  const [row] = await db
    .select()
    .from(users)
    .where(eq(users.id, auth.user.id))
    .limit(1);
  if (!row) {
    return { ok: false, error: "Unauthorized" };
  }

  const currentOk = await verifyPassword(
    input.currentPassword,
    row.passwordSalt,
    row.passwordHash,
    row.passwordKdf,
  );
  if (!currentOk) {
    return { ok: false, error: "Current password is incorrect." };
  }

  const hashed = await hashPassword(input.newPassword);
  await db
    .update(users)
    .set({
      passwordSalt: hashed.salt,
      passwordHash: hashed.hash,
      passwordKdf: hashed.kdf,
      updatedAt: new Date(),
    })
    .where(eq(users.id, auth.user.id));

  return { ok: true };
}

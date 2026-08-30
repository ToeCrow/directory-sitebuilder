import { requireAdminUser } from "@/lib/admin/session";
import { AccountForm } from "./AccountForm";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const user = await requireAdminUser();

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">
        Account
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        Update your username, display name, and password. Your user id cannot
        be changed.
      </p>
      <AccountForm
        username={user.username}
        displayName={user.displayName}
        role={user.role}
      />
    </div>
  );
}

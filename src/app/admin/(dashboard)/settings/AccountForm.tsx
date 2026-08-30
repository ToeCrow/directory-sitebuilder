"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";
import { changePasswordAction, updateAccountAction } from "./actions";

const fieldClass =
  "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20";

type AccountFormProps = {
  username: string;
  displayName: string;
  role: string;
};

export function AccountForm({ username, displayName, role }: AccountFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [profile, setProfile] = useState({ username, displayName });
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  function onSaveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setProfileError(null);
    setProfileSuccess(null);
    startTransition(async () => {
      const result = await updateAccountAction(profile);
      if (!result.ok) {
        setProfileError(result.error);
        return;
      }
      setProfileSuccess("Saved.");
      router.refresh();
    });
  }

  function onChangePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);
    startTransition(async () => {
      const result = await changePasswordAction(passwords);
      if (!result.ok) {
        setPasswordError(result.error);
        return;
      }
      setPasswordSuccess("Password updated.");
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    });
  }

  return (
    <div className="mt-8 grid max-w-2xl gap-10">
      <form onSubmit={onSaveProfile} className="space-y-5">
        <h2 className="text-lg font-semibold text-slate-900">Profile</h2>
        <p className="text-sm text-slate-600">
          Role: <span className="font-medium">{role}</span>. Display name is
          used as the author on new articles.
        </p>
        <label className="block text-sm font-medium text-slate-700">
          Username
          <input
            className={fieldClass}
            required
            autoComplete="username"
            value={profile.username}
            onChange={(event) =>
              setProfile({ ...profile, username: event.target.value })
            }
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Display name
          <input
            className={fieldClass}
            required
            value={profile.displayName}
            onChange={(event) =>
              setProfile({ ...profile, displayName: event.target.value })
            }
          />
        </label>
        {profileError && (
          <p className="text-sm text-red-600" role="alert">
            {profileError}
          </p>
        )}
        {profileSuccess && (
          <p className="text-sm text-green-700">{profileSuccess}</p>
        )}
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {pending ? "Saving…" : "Save profile"}
        </button>
      </form>

      <form onSubmit={onChangePassword} className="space-y-5">
        <h2 className="text-lg font-semibold text-slate-900">Password</h2>
        <label className="block text-sm font-medium text-slate-700">
          Current password
          <input
            className={fieldClass}
            type="password"
            autoComplete="current-password"
            required
            value={passwords.currentPassword}
            onChange={(event) =>
              setPasswords({ ...passwords, currentPassword: event.target.value })
            }
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          New password
          <input
            className={fieldClass}
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={passwords.newPassword}
            onChange={(event) =>
              setPasswords({ ...passwords, newPassword: event.target.value })
            }
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Confirm new password
          <input
            className={fieldClass}
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={passwords.confirmPassword}
            onChange={(event) =>
              setPasswords({
                ...passwords,
                confirmPassword: event.target.value,
              })
            }
          />
        </label>
        {passwordError && (
          <p className="text-sm text-red-600" role="alert">
            {passwordError}
          </p>
        )}
        {passwordSuccess && (
          <p className="text-sm text-green-700">{passwordSuccess}</p>
        )}
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {pending ? "Saving…" : "Update password"}
        </button>
      </form>
    </div>
  );
}

"use client";

import { useActionState } from "react";
import { login } from "@/lib/auth/actions";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, undefined);

  return (
    <div
      style={{ fontFamily: "system-ui, sans-serif", minHeight: "100vh" }}
      className="flex items-center justify-center bg-[var(--teal-900)] p-6"
    >
      <form action={formAction} className="w-full max-w-sm bg-white rounded-[12px] p-8">
        <h1 className="text-xl font-bold text-[var(--ink)]">Admin sign in</h1>
        <p className="text-sm text-[var(--muted)] mt-1">Leen Al Sharq Holding</p>

        <label className="block mt-6 text-sm font-semibold text-[var(--ink)]">
          Username
          <input
            name="username"
            type="text"
            required
            autoComplete="username"
            className="mt-1 w-full rounded-[8px] border border-gray-300 px-3 py-2 text-sm"
          />
        </label>

        <label className="block mt-4 text-sm font-semibold text-[var(--ink)]">
          Password
          <input
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="mt-1 w-full rounded-[8px] border border-gray-300 px-3 py-2 text-sm"
          />
        </label>

        {state?.error && <p className="mt-4 text-sm text-[var(--red-600)]">{state.error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="mt-6 w-full rounded-[8px] bg-[var(--teal-900)] text-white py-2.5 text-sm font-semibold disabled:opacity-60"
        >
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}

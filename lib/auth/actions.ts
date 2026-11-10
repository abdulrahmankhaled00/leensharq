"use server";

import bcrypt from "bcryptjs";
import { createHash, timingSafeEqual } from "crypto";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getSession } from "./session";
import { checkRateLimit, resetRateLimit } from "./rate-limit";

/** Error codes are translated by the login page (lib/admin/i18n.ts → login). */
export type LoginState = { error?: "invalid" | "tooMany" | "notConfigured"; username?: string } | undefined;

/** Constant-time text comparison (hashing first makes both sides the same length). */
function sameText(a: string, b: string) {
  const digest = (v: string) => createHash("sha256").update(v).digest();
  return timingSafeEqual(digest(a), digest(b));
}

export async function login(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");

  const h = await headers();
  const ip = h.get("x-forwarded-for") ?? "local";
  const rate = checkRateLimit(`login:${ip}`);
  if (!rate.allowed) {
    return { error: "tooMany", username };
  }

  const expectedUsername = process.env.ADMIN_USERNAME;
  // ADMIN_PASSWORD is the plain password (easiest to manage in .env / host secrets);
  // ADMIN_PASSWORD_HASH (bcrypt) still works when ADMIN_PASSWORD is not set.
  // A value in ADMIN_PASSWORD_HASH that isn't a bcrypt hash ($2a$/$2b$/$2y$…) is treated as the plain password.
  const rawHash = process.env.ADMIN_PASSWORD_HASH;
  const hashIsBcrypt = !!rawHash && /^\$2[aby]\$/.test(rawHash);
  const expectedPassword = process.env.ADMIN_PASSWORD || (rawHash && !hashIsBcrypt ? rawHash : undefined);
  const expectedHash = hashIsBcrypt ? rawHash : undefined;

  if (!expectedUsername || (!expectedPassword && !expectedHash)) {
    return { error: "notConfigured", username };
  }

  const validUsername = username === expectedUsername;
  const validPassword = expectedPassword ? sameText(password, expectedPassword) : await bcrypt.compare(password, expectedHash!);

  if (!validUsername || !validPassword) {
    return { error: "invalid", username };
  }

  resetRateLimit(`login:${ip}`);

  const session = await getSession();
  session.isAdmin = true;
  await session.save();

  redirect("/admin");
}

export async function logout() {
  const session = await getSession();
  session.destroy();
  redirect("/admin/login");
}

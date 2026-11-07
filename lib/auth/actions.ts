"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getSession } from "./session";
import { checkRateLimit, resetRateLimit } from "./rate-limit";

/** Error codes are translated by the login page (lib/admin/i18n.ts → login). */
export type LoginState = { error?: "invalid" | "tooMany" | "notConfigured"; username?: string } | undefined;

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
  const expectedHash = process.env.ADMIN_PASSWORD_HASH;

  if (!expectedUsername || !expectedHash) {
    return { error: "notConfigured", username };
  }

  const validUsername = username === expectedUsername;
  const validPassword = await bcrypt.compare(password, expectedHash);

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

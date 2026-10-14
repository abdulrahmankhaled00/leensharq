"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getSession } from "./session";
import { checkRateLimit, resetRateLimit } from "./rate-limit";

export async function login(_prevState: { error?: string } | undefined, formData: FormData) {
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");

  const h = await headers();
  const ip = h.get("x-forwarded-for") ?? "local";
  const rate = checkRateLimit(`login:${ip}`);
  if (!rate.allowed) {
    return { error: "Too many attempts. Try again later." };
  }

  const expectedUsername = process.env.ADMIN_USERNAME;
  const expectedHash = process.env.ADMIN_PASSWORD_HASH;

  if (!expectedUsername || !expectedHash) {
    return { error: "Admin account is not configured." };
  }

  const validUsername = username === expectedUsername;
  const validPassword = await bcrypt.compare(password, expectedHash);

  if (!validUsername || !validPassword) {
    return { error: "Invalid username or password." };
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

import { NextRequest, NextResponse } from "next/server";
import { unsealData } from "iron-session";

const SESSION_COOKIE = "leen_admin_session";

async function isAdminSession(request: NextRequest): Promise<boolean> {
  const raw = request.cookies.get(SESSION_COOKIE)?.value;
  if (!raw || !process.env.SESSION_SECRET) return false;
  try {
    const data = await unsealData<{ isAdmin?: boolean }>(raw, { password: process.env.SESSION_SECRET });
    return data.isAdmin === true;
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const authed = await isAdminSession(request);
    if (!authed) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }

  let locale: "ar" | "en" = "ar";
  if (pathname === "/en" || pathname.startsWith("/en/")) locale = "en";
  else if (pathname.startsWith("/admin")) locale = "en";

  const headers = new Headers(request.headers);
  headers.set("x-locale", locale);
  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|ico|pdf|xml|txt)$).*)"],
};

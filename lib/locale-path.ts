/** Locale a pathname is served in. Mirrors proxy.ts: /en/* is English, /admin/* is English, everything else is Arabic. */
export function localeFromPathname(pathname: string): "ar" | "en" {
  if (pathname === "/en" || pathname.startsWith("/en/")) return "en";
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return "en";
  return "ar";
}

/** Maps a pathname to its sibling in the other locale. Arabic is unprefixed (default), English lives under /en. */
export function toggleLocalePath(pathname: string): string {
  if (pathname === "/en" || pathname.startsWith("/en/")) {
    const rest = pathname.slice(3);
    return rest === "" ? "/" : rest;
  }
  return pathname === "/" ? "/en" : `/en${pathname}`;
}

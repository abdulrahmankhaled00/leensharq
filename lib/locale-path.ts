/** Maps a pathname to its sibling in the other locale. Arabic is unprefixed (default), English lives under /en. */
export function toggleLocalePath(pathname: string): string {
  if (pathname === "/en" || pathname.startsWith("/en/")) {
    const rest = pathname.slice(3);
    return rest === "" ? "/" : rest;
  }
  return pathname === "/" ? "/en" : `/en${pathname}`;
}

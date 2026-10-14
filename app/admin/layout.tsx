import Link from "next/link";
import { isAuthenticated } from "@/lib/auth/session";
import { logout } from "@/lib/auth/actions";

export const metadata = { robots: { index: false, follow: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const authed = await isAuthenticated();

  if (!authed) {
    // Login page renders its own minimal shell.
    return <>{children}</>;
  }

  return (
    <div style={{ fontFamily: "system-ui, sans-serif" }}>
      <header className="flex items-center justify-between px-6 py-4 bg-[var(--teal-900)] text-white">
        <Link href="/admin" className="font-bold">
          Leen Al Sharq — Admin
        </Link>
        <nav className="flex items-center gap-5 text-sm">
          <Link href="/admin/partners" className="opacity-85 hover:opacity-100">
            Partners
          </Link>
          <form action={logout}>
            <button type="submit" className="opacity-85 hover:opacity-100 underline">
              Log out
            </button>
          </form>
        </nav>
      </header>
      <main className="p-6 max-w-5xl mx-auto">{children}</main>
    </div>
  );
}

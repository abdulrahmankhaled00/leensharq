import { cookies } from "next/headers";
import { isAuthenticated } from "@/lib/auth/session";
import { logout } from "@/lib/auth/actions";
import { getAdminT } from "@/lib/admin/locale";
import { AdminI18nProvider } from "@/components/admin/I18n";
import { AdminShell } from "@/components/admin/AdminShell";
import { ADMIN_SIDEBAR_COOKIE } from "@/lib/admin/i18n";
import "./admin.css";

export async function generateMetadata() {
  const { t } = await getAdminT();
  return { title: t.meta.title, robots: { index: false, follow: false } };
}

/**
 * Dashboard root. Its own language (cookie, independent of the public site), its own direction,
 * and its own styles scoped under .ad-root. The public header, footer and intro loader never render here.
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const [{ locale }, authed, jar] = await Promise.all([getAdminT(), isAuthenticated(), cookies()]);
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <div className="ad-root" lang={locale} dir={dir}>
      <AdminI18nProvider locale={locale}>
        {authed ? (
          <AdminShell logout={logout} initialCollapsed={jar.get(ADMIN_SIDEBAR_COOKIE)?.value === "collapsed"}>
            {children}
          </AdminShell>
        ) : (
          children
        )}
      </AdminI18nProvider>
    </div>
  );
}

"use client";

import Image from "next/image";
import { useActionState } from "react";
import { login } from "@/lib/auth/actions";
import { useAdminI18n } from "@/components/admin/I18n";
import { LanguageSwitch } from "@/components/admin/LanguageSwitch";

export default function LoginPage() {
  const { t, locale } = useAdminI18n();
  const [state, formAction, pending] = useActionState(login, undefined);
  const error = state?.error ? t.login[state.error] : null;

  return (
    <div className="ad-login">
      <div className="ad-login-bg" aria-hidden />
      <div className="ad-login-lang">
        <LanguageSwitch />
      </div>

      <main className="ad-login-main">
        <form action={formAction} className="ad-login-card">
          <div className="ad-login-brand">
            <Image src="/icon.png" alt="" width={56} height={56} priority />
            <div>
              <p className="ad-login-company">{t.login.subtitle}</p>
              <p className="ad-login-product">{t.brand.tagline}</p>
            </div>
          </div>

          <h1 className="ad-login-title">{t.login.title}</h1>

          <div className="ad-fields">
            <div className="ad-field">
              <label className="ad-label" htmlFor="username">
                {t.login.username}
              </label>
              <input id="username" name="username" type="text" required autoComplete="username" dir="ltr" className="ad-input ad-input-lg" defaultValue={state?.username} key={state?.username} />
            </div>
            <div className="ad-field">
              <label className="ad-label" htmlFor="password">
                {t.login.password}
              </label>
              <input id="password" name="password" type="password" required autoComplete="current-password" dir="ltr" className="ad-input ad-input-lg" />
            </div>
          </div>

          {error && (
            <div className="ad-notice ad-notice-error ad-login-error" role="alert">
              {error}
            </div>
          )}

          <button type="submit" disabled={pending} className="ad-btn ad-btn-primary ad-login-submit">
            {pending ? t.login.pending : t.login.submit}
          </button>
        </form>

        <a href="/" className="ad-login-back">
          <span aria-hidden>{locale === "ar" ? "→" : "←"}</span>
          {t.login.back}
        </a>
      </main>
    </div>
  );
}

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
    <div className="cms-login">
      <div className="cms-login-bg" aria-hidden />
      <div className="cms-login-lang">
        <LanguageSwitch />
      </div>

      <main className="cms-login-main">
        <form action={formAction} className="cms-login-card">
          <div className="cms-login-brand">
            <Image src="/icon.png" alt="" width={56} height={56} priority />
            <div>
              <p className="cms-login-company">{t.login.subtitle}</p>
              <p className="cms-login-product">{t.brand.tagline}</p>
            </div>
          </div>

          <h1 className="cms-login-title">{t.login.title}</h1>

          <div className="cms-fields">
            <div className="cms-field">
              <label className="cms-label" htmlFor="username">
                {t.login.username}
              </label>
              <input id="username" name="username" type="text" required autoComplete="username" dir="ltr" className="cms-input cms-input-lg" defaultValue={state?.username} key={state?.username} />
            </div>
            <div className="cms-field">
              <label className="cms-label" htmlFor="password">
                {t.login.password}
              </label>
              <input id="password" name="password" type="password" required autoComplete="current-password" dir="ltr" className="cms-input cms-input-lg" />
            </div>
          </div>

          {error && (
            <div className="cms-notice cms-notice-error cms-login-error" role="alert">
              {error}
            </div>
          )}

          <button type="submit" disabled={pending} className="cms-btn cms-btn-primary cms-login-submit">
            {pending ? t.login.pending : t.login.submit}
          </button>
        </form>

        <a href="/" className="cms-login-back">
          <span aria-hidden>{locale === "ar" ? "→" : "←"}</span>
          {t.login.back}
        </a>
      </main>
    </div>
  );
}

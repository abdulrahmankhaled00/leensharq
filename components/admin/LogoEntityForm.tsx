"use client";

import { useActionState } from "react";
import type { LogoEntity } from "@/lib/db/schema";
import type { FormState } from "@/lib/admin/guard";
import type { LogoKind } from "@/lib/admin/entities";
import { fmt } from "@/lib/admin/i18n";
import { useAdminI18n } from "./I18n";
import { FormErrorBanner, FormFoot, FormSection, ImageField, TextField, Toggle } from "./fields";

type Action = (prev: FormState, fd: FormData) => Promise<FormState>;

/** Create / edit form shared by Brands, Clients and Partners. */
export function LogoEntityForm({ action, item, kind, readOnly }: { action: Action; item?: LogoEntity; kind: LogoKind; readOnly?: boolean }) {
  const { t } = useAdminI18n();
  const k = t.kinds[kind];
  const f = t.fields;
  const [state, formAction] = useActionState(action, undefined);
  const e = state?.fieldErrors;
  // After a failed save, show what was submitted (React resets the form to these defaults).
  const v = (name: string, saved?: string | number | null) => (state?.values ? (state.values[name] ?? "") : String(saved ?? ""));
  const on = (name: string, saved: boolean) => (state?.values ? state.values[name] === "on" : saved);

  return (
    <form action={formAction} className="cms-panel" noValidate>
      <FormErrorBanner state={state} />

      <FormSection title={t.form.nameTitle} hint={fmt(t.form.nameHint, { singular: k.singular })}>
        <div className="cms-fields-2">
          <TextField name="nameEn" label={f.name} lang="en" defaultValue={v("nameEn", item?.nameEn)} errors={e} required maxLength={160} />
          <TextField name="nameAr" label={f.name} lang="ar" defaultValue={v("nameAr", item?.nameAr)} errors={e} required maxLength={160} />
        </div>
      </FormSection>

      <FormSection title={t.form.logoTitle} hint={t.form.logoHint}>
        <ImageField name="logo" removeName="removeLogo" current={item?.logo} errors={e} />
        <div className="cms-fields-2">
          <TextField name="altTextEn" label={f.altLogo} lang="en" defaultValue={v("altTextEn", item?.altTextEn)} errors={e} maxLength={255} help={f.altLogoHelp} />
          <TextField name="altTextAr" label={f.altLogo} lang="ar" defaultValue={v("altTextAr", item?.altTextAr)} errors={e} maxLength={255} />
        </div>
      </FormSection>

      <FormSection title={t.form.websiteTitle} hint={t.form.websiteHint}>
        <TextField name="websiteUrl" label={f.website} type="url" defaultValue={v("websiteUrl", item?.websiteUrl)} errors={e} placeholder="https://example.com" maxLength={255} />
      </FormSection>

      <FormSection title={t.form.visibilityTitle} hint={t.form.visibilityHint}>
        <Toggle name="isActive" label={t.common.active} help={t.form.activeHelp} defaultChecked={on("isActive", item?.isActive ?? true)} />
        <Toggle name="showOnHomepage" label={t.form.homepageToggle} help={t.form.homepageHelp} defaultChecked={on("showOnHomepage", item?.showOnHomepage ?? true)} />
      </FormSection>

      <FormFoot cancelHref={`/admin/${kind}`} label={item ? t.common.saveChanges : fmt(t.form.create, { singular: k.singular })} disabled={readOnly} />
    </form>
  );
}

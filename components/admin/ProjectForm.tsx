"use client";

import { useActionState } from "react";
import Link from "next/link";
import type { ProjectRow } from "@/lib/db/schema";
import type { FormState } from "@/lib/admin/guard";
import { useAdminI18n } from "./I18n";
import { FieldLabel, FormErrorBanner, FormFoot, FormSection, ImageField, TextField, Toggle } from "./fields";

type Action = (prev: FormState, fd: FormData) => Promise<FormState>;

export function ProjectForm({
  action,
  item,
  clients,
  sectors,
  readOnly,
}: {
  action: Action;
  item?: ProjectRow;
  clients: { id: number; nameEn: string; nameAr: string; isActive: boolean }[];
  sectors: { en: string; ar: string }[];
  readOnly?: boolean;
}) {
  const { t, locale } = useAdminI18n();
  const f = t.fields;
  const [state, formAction] = useActionState(action, undefined);
  const e = state?.fieldErrors;
  const v = (name: string, saved?: string | number | null) => (state?.values ? (state.values[name] ?? "") : String(saved ?? ""));
  const on = (name: string, saved: boolean) => (state?.values ? state.values[name] === "on" : saved);
  const clientErr = e?.clientId?.[0];

  return (
    <form action={formAction} className="ad-panel" noValidate>
      <FormErrorBanner state={state} />

      <FormSection
        title={t.form.clientTitle}
        hint={
          <>
            {t.form.clientHint}{" "}
            <Link href="/admin/clients/new" className="ad-link">
              {t.form.addClient}
            </Link>
          </>
        }
      >
        <div className="ad-field" data-invalid={clientErr ? "true" : undefined}>
          <FieldLabel htmlFor="f-clientId" label={f.client} />
          <select id="f-clientId" name="clientId" className="ad-select" defaultValue={v("clientId", item?.clientId)}>
            <option value="">{f.noClient}</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {locale === "ar" ? c.nameAr || c.nameEn : c.nameEn}
                {c.isActive ? "" : ` ${f.clientInactive}`}
              </option>
            ))}
          </select>
          {clientErr && <p className="ad-error">{clientErr}</p>}
        </div>
      </FormSection>

      <FormSection title={t.form.projectTitle} hint={t.form.projectHint}>
        <div className="ad-fields-2">
          <TextField name="projectNameEn" label={f.projectName} lang="en" defaultValue={v("projectNameEn", item?.projectNameEn)} errors={e} required maxLength={200} />
          <TextField name="projectNameAr" label={f.projectName} lang="ar" defaultValue={v("projectNameAr", item?.projectNameAr)} errors={e} required maxLength={200} />
          <TextField name="descriptionEn" label={f.description} lang="en" defaultValue={v("descriptionEn", item?.descriptionEn)} errors={e} multiline maxLength={2000} />
          <TextField name="descriptionAr" label={f.description} lang="ar" defaultValue={v("descriptionAr", item?.descriptionAr)} errors={e} multiline maxLength={2000} />
        </div>
      </FormSection>

      <FormSection title={t.form.detailsTitle} hint={t.form.detailsHint}>
        <div className="ad-fields-2">
          <TextField name="locationEn" label={f.location} lang="en" defaultValue={v("locationEn", item?.locationEn)} errors={e} required maxLength={200} placeholder="Riyadh, Saudi Arabia" />
          <TextField name="locationAr" label={f.location} lang="ar" defaultValue={v("locationAr", item?.locationAr)} errors={e} required maxLength={200} placeholder="الرياض، المملكة العربية السعودية" />
          <TextField name="scopeOfWorkEn" label={f.scope} lang="en" defaultValue={v("scopeOfWorkEn", item?.scopeOfWorkEn)} errors={e} required maxLength={255} placeholder="Supply & Installation" />
          <TextField name="scopeOfWorkAr" label={f.scope} lang="ar" defaultValue={v("scopeOfWorkAr", item?.scopeOfWorkAr)} errors={e} required maxLength={255} placeholder="توريد وتركيب" />
        </div>
      </FormSection>

      <FormSection title={t.form.sectorTitle} hint={t.form.sectorHint}>
        <datalist id="sector-options">
          {sectors.map((s) => (
            <option key={s.en} value={s.en} />
          ))}
        </datalist>
        <div className="ad-fields-2">
          <TextField name="sectorEn" label={f.sector} lang="en" defaultValue={v("sectorEn", item?.sectorEn)} errors={e} maxLength={120} list="sector-options" />
          <TextField name="sectorAr" label={f.sector} lang="ar" defaultValue={v("sectorAr", item?.sectorAr)} errors={e} maxLength={120} />
        </div>
      </FormSection>

      <FormSection title={t.form.photoTitle} hint={t.form.photoHint}>
        <ImageField name="image" removeName="removeImage" current={item?.image} photo errors={e} />
        <div className="ad-fields-2">
          <TextField name="imageAltEn" label={f.altPhoto} lang="en" defaultValue={v("imageAltEn", item?.imageAltEn)} errors={e} maxLength={255} help={f.altPhotoHelp} />
          <TextField name="imageAltAr" label={f.altPhoto} lang="ar" defaultValue={v("imageAltAr", item?.imageAltAr)} errors={e} maxLength={255} />
        </div>
      </FormSection>

      <FormSection title={t.form.visibilityTitle}>
        <Toggle name="isActive" label={t.common.active} help={t.form.projectActiveHelp} defaultChecked={on("isActive", item?.isActive ?? true)} />
        <Toggle name="showOnHomepage" label={t.form.homepageToggle} help={t.form.projectHomepageHelp} defaultChecked={on("showOnHomepage", item?.showOnHomepage ?? false)} />
      </FormSection>

      <FormFoot cancelHref="/admin/projects" label={item ? t.common.saveChanges : t.form.createProject} disabled={readOnly} />
    </form>
  );
}

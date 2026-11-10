"use client";

import { useActionState, useState, type FormEvent } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import type { DocumentRow } from "@/lib/db/schema";
import type { FormState } from "@/lib/admin/guard";
import { fmt } from "@/lib/admin/i18n";
import { MAX_PDF_BYTES, MAX_PDF_MB, PDF_ACCEPT } from "@/lib/upload-limits";
import { useAdminI18n } from "./I18n";
import { FilePicker, FormErrorBanner, TextField, Toggle } from "./fields";

type Action = (prev: FormState, fd: FormData) => Promise<FormState>;

function Submit({ label, disabled }: { label: string; disabled?: boolean }) {
  const { t } = useAdminI18n();
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="cms-btn cms-btn-primary" disabled={disabled || pending}>
      {pending ? t.common.saving : label}
    </button>
  );
}

/** Labels + visibility of the active PDF. */
export function ProfileSettingsForm({ action, doc, readOnly }: { action: Action; doc: DocumentRow; readOnly?: boolean }) {
  const { t } = useAdminI18n();
  const [state, formAction] = useActionState(action, undefined);
  return (
    <form action={formAction} noValidate>
      <FormErrorBanner state={state} />
      <div className="cms-panel-body cms-fields">
        <div className="cms-fields-2">
          <TextField name="titleEn" label={t.fields.buttonLabel} lang="en" defaultValue={state?.values?.titleEn ?? doc.titleEn} errors={state?.fieldErrors} required maxLength={200} />
          <TextField name="titleAr" label={t.fields.buttonLabel} lang="ar" defaultValue={state?.values?.titleAr ?? doc.titleAr} errors={state?.fieldErrors} required maxLength={200} />
        </div>
        <Toggle
          name="showDownloadButton"
          label={t.profile.showButton}
          help={t.profile.showButtonHelp}
          defaultChecked={state?.values ? state.values.showDownloadButton === "on" : doc.showDownloadButton}
        />
        <div>
          <Submit label={t.profile.saveSettings} disabled={readOnly} />
        </div>
      </div>
    </form>
  );
}

/**
 * Upload a replacement PDF; it becomes the active one. Sent to app/admin/api/company-profile
 * (the only endpoint that accepts bodies up to 32 MB), checked for size here first.
 */
export function ProfileUploadForm({ defaults, readOnly }: { defaults: { titleEn: string; titleAr: string }; readOnly?: boolean }) {
  const { t } = useAdminI18n();
  const router = useRouter();
  const [state, setState] = useState<FormState>(undefined);
  const [pending, setPending] = useState(false);
  const fileErr = state?.fieldErrors?.file?.[0];

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const file = fd.get("file");
    if (!(file instanceof File) || file.size === 0) return setState({ error: t.errors.fixFields, fieldErrors: { file: [t.errors.pdfRequired] } });
    if (file.size > MAX_PDF_BYTES) return setState({ error: t.errors.fixFields, fieldErrors: { file: [fmt(t.errors.pdfTooLarge, { max: MAX_PDF_MB })] } });

    setPending(true);
    setState(undefined);
    try {
      const res = await fetch("/admin/api/company-profile", { method: "POST", body: fd });
      const body = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; fieldErrors?: Record<string, string[]> };
      if (res.ok && body.ok) {
        router.push("/admin/company-profile?saved=uploaded");
        router.refresh();
        return;
      }
      setState({ error: body.error ?? t.errors.uploadFailed, fieldErrors: body.fieldErrors });
    } catch {
      setState({ error: t.errors.uploadFailed });
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={onSubmit} noValidate>
      <FormErrorBanner state={state} />
      <div className="cms-panel-body cms-fields">
        <div className="cms-field" data-invalid={fileErr ? "true" : undefined}>
          <div className="cms-upload">
            <div className="cms-upload-body">
              <FilePicker
                id="f-file"
                name="file"
                accept={PDF_ACCEPT}
                label={t.upload.choosePdf}
                invalid={Boolean(fileErr)}
                onFile={(f, input) => {
                  if (f && f.size > MAX_PDF_BYTES) {
                    setState({ error: t.errors.fixFields, fieldErrors: { file: [fmt(t.errors.pdfTooLarge, { max: MAX_PDF_MB })] } });
                    input.value = "";
                  } else setState(undefined);
                }}
              />
              <p className="cms-help">{fmt(t.upload.pdfHelp, { max: MAX_PDF_MB })}</p>
            </div>
          </div>
          {fileErr && (
            <p className="cms-error" role="alert">
              {fileErr}
            </p>
          )}
        </div>
        <div className="cms-fields-2">
          <TextField name="titleEn" label={t.fields.buttonLabel} lang="en" defaultValue={defaults.titleEn} errors={state?.fieldErrors} required maxLength={200} />
          <TextField name="titleAr" label={t.fields.buttonLabel} lang="ar" defaultValue={defaults.titleAr} errors={state?.fieldErrors} required maxLength={200} />
        </div>
        <Toggle name="showDownloadButton" label={t.profile.showButton} defaultChecked />
        <div>
          <button type="submit" className="cms-btn cms-btn-primary" disabled={readOnly || pending}>
            {pending ? t.upload.uploading : t.profile.uploadActivate}
          </button>
        </div>
      </div>
    </form>
  );
}

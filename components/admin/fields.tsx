"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import type { FormState } from "@/lib/admin/guard";
import { fmt } from "@/lib/admin/i18n";
import { IMAGE_ACCEPT, MAX_IMAGE_BYTES, MAX_IMAGE_MB } from "@/lib/upload-limits";
import { useAdminI18n } from "./I18n";

type Errors = NonNullable<FormState>["fieldErrors"];

export function FormSection({ title, hint, children }: { title: string; hint?: ReactNode; children: ReactNode }) {
  return (
    <section className="ad-form-section">
      <div>
        <h2 className="ad-form-section-title">{title}</h2>
        {hint && <p className="ad-form-section-hint">{hint}</p>}
      </div>
      <div className="ad-fields">{children}</div>
    </section>
  );
}

/** Interface label + content-language badge. Arabic content is typed RTL, English LTR, in either interface language. */
export function FieldLabel({ htmlFor, label, lang, required }: { htmlFor: string; label: string; lang?: "en" | "ar"; required?: boolean }) {
  const { t } = useAdminI18n();
  return (
    <label className="ad-label" htmlFor={htmlFor}>
      {label}
      {lang && <span className="ad-lang">{lang === "en" ? t.common.langEn : t.common.langAr}</span>}
      {!required && <span className="ad-optional">{t.common.optional}</span>}
    </label>
  );
}

export function TextField({
  name,
  label,
  lang,
  defaultValue,
  errors,
  required,
  multiline,
  placeholder,
  help,
  type = "text",
  maxLength,
  list,
}: {
  name: string;
  label: string;
  lang?: "en" | "ar";
  defaultValue?: string | null;
  errors?: Errors;
  required?: boolean;
  multiline?: boolean;
  placeholder?: string;
  help?: string;
  type?: string;
  maxLength?: number;
  list?: string;
}) {
  const err = errors?.[name]?.[0];
  const id = `f-${name}`;
  const common = {
    id,
    name,
    defaultValue: defaultValue ?? "",
    required,
    placeholder,
    maxLength,
    // Content direction follows the content language, not the interface.
    dir: lang === "ar" ? ("rtl" as const) : lang === "en" || type === "url" ? ("ltr" as const) : undefined,
    lang,
    "aria-invalid": err ? true : undefined,
    "aria-describedby": err ? `${id}-err` : help ? `${id}-help` : undefined,
  };
  return (
    <div className="ad-field" data-invalid={err ? "true" : undefined}>
      <FieldLabel htmlFor={id} label={label} lang={lang} required={required} />
      {multiline ? <textarea className="ad-textarea" rows={4} {...common} /> : <input className="ad-input" type={type} list={list} {...common} />}
      {err ? (
        <p className="ad-error" id={`${id}-err`}>
          {err}
        </p>
      ) : (
        help && (
          <p className="ad-help" id={`${id}-help`}>
            {help}
          </p>
        )
      )}
    </div>
  );
}

export function Toggle({ name, label, help, defaultChecked }: { name: string; label: string; help?: string; defaultChecked?: boolean }) {
  return (
    <label className="ad-toggle-row">
      <span>
        <strong>{label}</strong>
        {help && <span className="ad-help">{help}</span>}
      </span>
      <span className="ad-toggle-control">
        <input type="checkbox" name={name} defaultChecked={defaultChecked} />
        <span className="ad-switch-track" aria-hidden />
      </span>
    </label>
  );
}

/**
 * File picker with a translated button and file name (the browser's own "Choose file / No file chosen"
 * text can't be translated). The real <input type="file"> stays in the page for keyboard and screen readers.
 */
export function FilePicker({
  id,
  name,
  accept,
  label,
  invalid,
  describedBy,
  onFile,
}: {
  id: string;
  name: string;
  accept: string;
  label: string;
  invalid?: boolean;
  describedBy?: string;
  onFile: (file: File | null, input: HTMLInputElement) => void;
}) {
  const { t } = useAdminI18n();
  const [fileName, setFileName] = useState<string | null>(null);
  return (
    <span className="ad-file">
      <input
        id={id}
        type="file"
        name={name}
        accept={accept}
        className="ad-file-input"
        aria-label={label}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        onChange={(e) => {
          const f = e.target.files?.[0] ?? null;
          onFile(f, e.target);
          setFileName(e.target.files?.[0]?.name ?? null);
        }}
      />
      <label htmlFor={id} className="ad-btn ad-btn-secondary ad-btn-sm ad-file-btn" aria-hidden>
        {t.upload.choose}
      </label>
      <span className="ad-file-name" dir="auto">
        {fileName ?? t.upload.noFile}
      </span>
    </span>
  );
}

/**
 * Image input with a live preview, a 2 MB check before upload (the server checks again),
 * and an option to remove the current image.
 */
export function ImageField({ name, current, photo, errors, removeName }: { name: string; current?: string | null; photo?: boolean; errors?: Errors; removeName: string }) {
  const { t } = useAdminI18n();
  const [preview, setPreview] = useState<string | null>(null);
  const [removed, setRemoved] = useState(false);
  const [clientError, setClientError] = useState<string | null>(null);
  useEffect(() => () => void (preview && URL.revokeObjectURL(preview)), [preview]);
  // A new server response replaces any earlier browser-side message.
  useEffect(() => setClientError(null), [errors]);
  const shown = preview ?? (removed ? null : current);
  const err = clientError ?? errors?.[name]?.[0];
  const id = `f-${name}`;
  return (
    <div className="ad-field" data-invalid={err ? "true" : undefined}>
      <div className="ad-upload">
        <div className="ad-upload-preview" data-photo={photo ? "true" : undefined}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {shown ? <img src={shown} alt={t.upload.previewAlt} /> : <span>{photo ? t.upload.noPhoto : t.upload.noLogo}</span>}
        </div>
        <div className="ad-upload-body">
          <FilePicker
            id={id}
            name={name}
            accept={IMAGE_ACCEPT}
            label={photo ? t.upload.choosePhoto : t.upload.chooseLogo}
            invalid={Boolean(err)}
            describedBy={err ? `${id}-err` : `${id}-help`}
            onFile={(f, input) => {
              setClientError(null);
              if (f && f.size > MAX_IMAGE_BYTES) {
                setClientError(fmt(t.errors.imageTooLarge, { max: MAX_IMAGE_MB }));
                input.value = "";
                setPreview(null);
                return;
              }
              setPreview(f ? URL.createObjectURL(f) : null);
            }}
          />
          <p className="ad-help" id={`${id}-help`}>
            {fmt(photo ? t.upload.photoHelp : t.upload.logoHelp, { max: MAX_IMAGE_MB })}
          </p>
          {current && !preview && (
            <label className="ad-checkline">
              <input type="checkbox" name={removeName} onChange={(e) => setRemoved(e.target.checked)} />
              {photo ? t.upload.removePhoto : t.upload.removeLogo}
            </label>
          )}
        </div>
      </div>
      {err && (
        <p className="ad-error" id={`${id}-err`} role="alert">
          {err}
        </p>
      )}
    </div>
  );
}

function SaveButton({ label }: { label: string }) {
  const { t } = useAdminI18n();
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="ad-btn ad-btn-primary" disabled={pending}>
      {pending ? t.common.saving : label}
    </button>
  );
}

export function FormFoot({ cancelHref, label, disabled }: { cancelHref: string; label?: string; disabled?: boolean }) {
  const { t } = useAdminI18n();
  const text = label ?? t.common.saveChanges;
  return (
    <div className="ad-form-foot">
      <div className="ad-form-foot-actions">
        <Link href={cancelHref} className="ad-btn ad-btn-secondary">
          {t.common.cancel}
        </Link>
        {disabled ? (
          <button type="button" className="ad-btn ad-btn-primary" disabled title={t.common.connectToEdit}>
            {text}
          </button>
        ) : (
          <SaveButton label={text} />
        )}
      </div>
    </div>
  );
}

export function FormErrorBanner({ state }: { state: FormState }) {
  if (!state?.error) return null;
  return (
    <div className="ad-notice ad-notice-error ad-form-banner" role="alert">
      <div>{state.error}</div>
    </div>
  );
}

"use client";

import { useId, useRef } from "react";
import { useFormStatus } from "react-dom";
import { fmt } from "@/lib/admin/i18n";
import { useAdminI18n } from "./I18n";
import { AI } from "./icons";

function ConfirmSubmit() {
  const { t } = useAdminI18n();
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="ad-btn ad-btn-danger" disabled={pending}>
      {pending ? t.common.deleting : t.common.delete}
    </button>
  );
}

/** Trash button that opens a confirmation dialog before running the delete Server Action. */
export function ConfirmDelete({
  action,
  name,
  detail,
  disabled,
  variant = "icon",
}: {
  action: () => Promise<void>;
  name: string;
  detail?: string;
  disabled?: boolean;
  variant?: "icon" | "button";
}) {
  const { t } = useAdminI18n();
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  return (
    <>
      {variant === "icon" ? (
        <button
          type="button"
          className="ad-icon-btn ad-icon-btn-danger"
          onClick={() => ref.current?.showModal()}
          disabled={disabled}
          aria-label={fmt(t.common.deleteItem, { name })}
          title={t.common.delete}
        >
          {AI.trash}
        </button>
      ) : (
        <button type="button" className="ad-btn ad-btn-ghost ad-btn-danger-text" onClick={() => ref.current?.showModal()} disabled={disabled}>
          {AI.trash} {t.common.delete}
        </button>
      )}
      <dialog ref={ref} className="ad-dialog" aria-labelledby={titleId}>
        <form action={action}>
          <div className="ad-dialog-body">
            <span className="ad-dialog-icon">{AI.trash}</span>
            <p className="ad-dialog-title" id={titleId}>
              {fmt(t.lists.deleteTitle, { name })}
            </p>
            <p className="ad-muted">{detail ?? t.lists.deleteDetail}</p>
          </div>
          <div className="ad-dialog-foot">
            <button type="button" className="ad-btn ad-btn-secondary" onClick={() => ref.current?.close()}>
              {t.common.cancel}
            </button>
            <ConfirmSubmit />
          </div>
        </form>
      </dialog>
    </>
  );
}

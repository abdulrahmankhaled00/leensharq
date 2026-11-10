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
    <button type="submit" className="cms-btn cms-btn-danger" disabled={pending}>
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
          className="cms-icon-btn cms-icon-btn-danger"
          onClick={() => ref.current?.showModal()}
          disabled={disabled}
          aria-label={fmt(t.common.deleteItem, { name })}
          title={t.common.delete}
        >
          {AI.trash}
        </button>
      ) : (
        <button type="button" className="cms-btn cms-btn-ghost cms-btn-danger-text" onClick={() => ref.current?.showModal()} disabled={disabled}>
          {AI.trash} {t.common.delete}
        </button>
      )}
      <dialog ref={ref} className="cms-dialog" aria-labelledby={titleId}>
        <form action={action}>
          <div className="cms-dialog-body">
            <span className="cms-dialog-icon">{AI.trash}</span>
            <p className="cms-dialog-title" id={titleId}>
              {fmt(t.lists.deleteTitle, { name })}
            </p>
            <p className="cms-muted">{detail ?? t.lists.deleteDetail}</p>
          </div>
          <div className="cms-dialog-foot">
            <button type="button" className="cms-btn cms-btn-secondary" onClick={() => ref.current?.close()}>
              {t.common.cancel}
            </button>
            <ConfirmSubmit />
          </div>
        </form>
      </dialog>
    </>
  );
}

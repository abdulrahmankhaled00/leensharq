"use client";

import { useActionState } from "react";
import type { Partner } from "@/lib/db/schema";

type Action = (prevState: { error?: string } | undefined, formData: FormData) => Promise<{ error?: string } | undefined>;

export function PartnerForm({ partner, action }: { partner?: Partner; action: Action }) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="mt-6 space-y-5 max-w-xl">
      <label className="block text-sm font-semibold">
        Name
        <input
          name="name"
          defaultValue={partner?.name}
          required
          maxLength={120}
          className="mt-1 w-full rounded-[8px] border border-gray-300 px-3 py-2 text-sm"
        />
      </label>

      <label className="block text-sm font-semibold">
        Arabic description
        <textarea
          name="descriptionAr"
          defaultValue={partner?.descriptionAr}
          required
          dir="rtl"
          rows={3}
          className="mt-1 w-full rounded-[8px] border border-gray-300 px-3 py-2 text-sm"
        />
      </label>

      <label className="block text-sm font-semibold">
        English description
        <textarea
          name="descriptionEn"
          defaultValue={partner?.descriptionEn}
          required
          rows={3}
          className="mt-1 w-full rounded-[8px] border border-gray-300 px-3 py-2 text-sm"
        />
      </label>

      <label className="block text-sm font-semibold">
        Website URL (optional)
        <input
          name="websiteUrl"
          type="url"
          defaultValue={partner?.websiteUrl ?? ""}
          placeholder="https://example.com"
          className="mt-1 w-full rounded-[8px] border border-gray-300 px-3 py-2 text-sm"
        />
      </label>

      <label className="block text-sm font-semibold">
        Logo (PNG, JPG, WebP or SVG, max 2MB)
        <input name="logo" type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" className="mt-1 block text-sm" />
      </label>
      {partner?.logoPath && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={partner.logoPath} alt="Current logo" className="h-12 object-contain" />
      )}

      <label className="block text-sm font-semibold">
        Display order
        <input
          name="displayOrder"
          type="number"
          min={0}
          defaultValue={partner?.displayOrder ?? 0}
          className="mt-1 w-32 rounded-[8px] border border-gray-300 px-3 py-2 text-sm"
        />
      </label>

      <label className="flex items-center gap-2 text-sm font-semibold">
        <input name="isActive" type="checkbox" defaultChecked={partner?.isActive ?? true} />
        Active (visible on the public site)
      </label>

      {state?.error && <p className="text-sm text-[var(--red-600)]">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-[8px] bg-[var(--teal-900)] text-white px-5 py-2.5 text-sm font-semibold disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save"}
      </button>
    </form>
  );
}

"use client";

export function DeleteButton({ action, name }: { action: () => void; name: string }) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(`Delete "${name}"? This cannot be undone.`)) e.preventDefault();
      }}
    >
      <button type="submit" className="text-[var(--red-600)] text-sm font-semibold hover:underline">
        Delete
      </button>
    </form>
  );
}

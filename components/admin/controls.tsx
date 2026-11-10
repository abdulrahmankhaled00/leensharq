import Link from "next/link";
import { fmt, type AdminDict } from "@/lib/admin/i18n";
import { AI } from "./icons";

/** Up/down buttons; each is its own Server Action form, so ordering works without client JS. */
export function MoveButtons({
  position,
  isFirst,
  isLast,
  up,
  down,
  disabled,
  label,
  t,
}: {
  position: number;
  isFirst: boolean;
  isLast: boolean;
  up: () => Promise<void>;
  down: () => Promise<void>;
  disabled?: boolean;
  label: string;
  t: AdminDict;
}) {
  return (
    <div className="cms-order">
      <span className="cms-order-n">{position}</span>
      <form action={up}>
        <button type="submit" className="cms-icon-btn" disabled={disabled || isFirst} aria-label={fmt(t.common.moveUp, { name: label })} title={t.common.moveUpShort}>
          {AI.up}
        </button>
      </form>
      <form action={down}>
        <button type="submit" className="cms-icon-btn" disabled={disabled || isLast} aria-label={fmt(t.common.moveDown, { name: label })} title={t.common.moveDownShort}>
          {AI.down}
        </button>
      </form>
    </div>
  );
}

/** A pill switch that submits a Server Action. */
export function SwitchForm({ action, on, label, disabled }: { action: () => Promise<void>; on: boolean; label: string; disabled?: boolean }) {
  return (
    <form action={action}>
      <button type="submit" className="cms-switch" aria-pressed={on} disabled={disabled}>
        <span className="cms-switch-track" aria-hidden />
        {label}
      </button>
    </form>
  );
}

/** "All items / Homepage order" segmented control for list pages. */
export function ViewSwitch({ base, view, params, t }: { base: string; view: "all" | "homepage"; params?: Record<string, string | undefined>; t: AdminDict }) {
  const qs = (v: string) => {
    const p = new URLSearchParams();
    for (const [k, val] of Object.entries(params ?? {})) if (val && k !== "view") p.set(k, val);
    if (v !== "all") p.set("view", v);
    const s = p.toString();
    return s ? `${base}?${s}` : base;
  };
  return (
    <nav className="cms-segmented" aria-label={t.lists.viewLabel}>
      <Link href={qs("all")} aria-current={view === "all"}>
        {t.lists.allOrder}
      </Link>
      <Link href={qs("homepage")} aria-current={view === "homepage"}>
        {t.lists.homepageOrder}
      </Link>
    </nav>
  );
}

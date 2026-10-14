import Link from "next/link";

export default function AdminHome() {
  return (
    <div>
      <h1 className="text-xl font-bold">Dashboard</h1>
      <p className="text-sm text-[var(--muted)] mt-1">One admin account, one job: keep the Brands section current.</p>

      <Link
        href="/admin/partners"
        className="mt-6 inline-flex items-center rounded-[10px] bg-[var(--teal-900)] text-white px-5 py-3 text-sm font-semibold"
      >
        Manage Partners →
      </Link>
    </div>
  );
}

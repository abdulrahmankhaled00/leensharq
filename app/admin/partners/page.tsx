import Link from "next/link";
import { getAllPartners } from "@/lib/db/partners";
import { deletePartner, toggleActive } from "@/lib/partners/actions";
import { DeleteButton } from "@/components/admin/DeleteButton";

export default async function PartnersPage() {
  const list = await getAllPartners();
  const dbConfigured = Boolean(process.env.DATABASE_URL);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Partners</h1>
        <Link
          href="/admin/partners/new"
          className="rounded-[8px] bg-[var(--teal-900)] text-white px-4 py-2 text-sm font-semibold"
        >
          + Add partner
        </Link>
      </div>

      {!dbConfigured && (
        <p className="mt-4 rounded-[8px] bg-amber-100 text-amber-900 text-sm px-4 py-3">
          DATABASE_URL is not set yet — showing the seed list (read-only) until the database is connected.
        </p>
      )}

      <table className="mt-6 w-full text-sm border-collapse"> {/* taste-skill-ignore: real data table */}
        <thead>
          <tr className="text-left text-[var(--muted)] border-b border-gray-200"> {/* taste-skill-ignore: real data table */}
            <th className="py-2 pr-4">Order</th>
            <th className="py-2 pr-4">Name</th>
            <th className="py-2 pr-4">Status</th>
            <th className="py-2 pr-4">Website</th>
            <th className="py-2" />
          </tr>
        </thead>
        <tbody>
          {list.map((p) => (
            <tr key={p.id} className="border-b border-gray-100"> {/* taste-skill-ignore: real data table */}
              <td className="py-3 pr-4">{p.displayOrder}</td>
              <td className="py-3 pr-4 font-semibold">{p.name}</td>
              <td className="py-3 pr-4">
                {dbConfigured ? (
                  <form action={toggleActive.bind(null, p.id, !p.isActive)}>
                    <button
                      type="submit"
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        p.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {p.isActive ? "Active" : "Inactive"}
                    </button>
                  </form>
                ) : (
                  <span className="text-xs">{p.isActive ? "Active" : "Inactive"}</span>
                )}
              </td>
              <td className="py-3 pr-4">
                {p.websiteUrl ? (
                  <a href={p.websiteUrl} target="_blank" rel="noopener noreferrer" className="underline">
                    {p.websiteUrl}
                  </a>
                ) : (
                  <span className="text-[var(--muted)]">—</span>
                )}
              </td>
              <td className="py-3 text-right">
                {dbConfigured && (
                  <div className="flex items-center justify-end gap-4">
                    <Link href={`/admin/partners/${p.id}`} className="font-semibold hover:underline">
                      Edit
                    </Link>
                    <DeleteButton action={deletePartner.bind(null, p.id)} name={p.name} />
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

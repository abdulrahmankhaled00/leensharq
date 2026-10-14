import { notFound } from "next/navigation";
import { getPartnerById } from "@/lib/db/partners";
import { updatePartner } from "@/lib/partners/actions";
import { PartnerForm } from "@/components/admin/PartnerForm";

export default async function EditPartnerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const partnerId = Number(id);
  if (!Number.isInteger(partnerId)) notFound();

  const partner = await getPartnerById(partnerId);
  if (!partner) notFound();

  const action = updatePartner.bind(null, partnerId);

  return (
    <div>
      <h1 className="text-xl font-bold">Edit partner</h1>
      <PartnerForm partner={partner} action={action} />
    </div>
  );
}

import { createPartner } from "@/lib/partners/actions";
import { PartnerForm } from "@/components/admin/PartnerForm";

export default function NewPartnerPage() {
  return (
    <div>
      <h1 className="text-xl font-bold">Add partner</h1>
      <PartnerForm action={createPartner} />
    </div>
  );
}

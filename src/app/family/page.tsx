import { getFamily } from "@/actions/family";
import { FamilyManagement } from "@/components/family/family-management";
import { PageHeader } from "@/components/ui/page-header";

export default async function FamilyPage() {
  const family = await getFamily();

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <PageHeader title="Quản lý Gia đình" />

        <FamilyManagement initialFamily={family as any} />
      </div>
    </div>
  );
}

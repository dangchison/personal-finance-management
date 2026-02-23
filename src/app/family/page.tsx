import { getFamily } from "@/actions/family";
import { FamilyManagement } from "@/components/family/family-management";
import { WorkspaceLayout } from "@/components/layout/workspace-layout";

export const dynamic = "force-dynamic";

export default async function FamilyPage() {
  const family = await getFamily();

  return (
    <WorkspaceLayout
      maxWidthClassName="max-w-5xl"
      withPanel={false}
    >
      <div className="space-y-6">
        <FamilyManagement initialFamily={family} />
      </div>
    </WorkspaceLayout>
  );
}

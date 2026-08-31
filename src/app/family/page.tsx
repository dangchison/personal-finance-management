import { getFamily } from "@/actions/family";
import { FamilyManagement } from "@/components/family/family-management";
import { WorkspaceLayout } from "@/components/layout/workspace-layout";

export const dynamic = "force-dynamic";

export default async function FamilyPage() {
  const family = await getFamily();

  return (
    <WorkspaceLayout
      withPanel={false}
    >
      <FamilyManagement initialFamily={family} />
    </WorkspaceLayout>
  );
}

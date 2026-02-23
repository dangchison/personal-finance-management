import { getFamily } from "@/actions/family";
import { FamilyManagement } from "@/components/family/family-management";
import { WorkspaceLayout } from "@/components/layout/workspace-layout";

export const dynamic = "force-dynamic";

export default async function FamilyPage() {
  const family = await getFamily();

  return (
    <WorkspaceLayout
      title="Quản lý Gia đình"
      description="Tạo nhóm, mời thành viên và chia sẻ chi tiêu."
      maxWidthClassName="max-w-5xl"
      contentInnerClassName="p-4 sm:p-5"
    >
      <div className="space-y-6">
        <FamilyManagement initialFamily={family} />
      </div>
    </WorkspaceLayout>
  );
}

import { getFamily } from "@/actions/family";
import { FamilyManagement } from "@/components/family/family-management";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function FamilyPage() {
  const family = await getFamily();

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Quản lý Gia đình</h1>
        </div>

        <FamilyManagement initialFamily={family as any} />
      </div>
    </div>
  );
}

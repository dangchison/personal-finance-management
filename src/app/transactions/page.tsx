import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getTransactions, getCategories } from "@/actions/transaction";
import { TransactionsClient } from "@/components/transaction/transactions-client";
import { PageHeader } from "@/components/ui/page-header";
import { getFamilyMembers } from "@/actions/family";

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const resolvedSearchParams = await searchParams;

  const scope = (resolvedSearchParams.scope as "personal" | "family") || "personal";
  const categoryId = resolvedSearchParams.categoryId as string;
  const memberId = resolvedSearchParams.memberId as string;
  const startDate = resolvedSearchParams.from ? new Date(resolvedSearchParams.from as string) : undefined;
  const endDate = resolvedSearchParams.to ? new Date(resolvedSearchParams.to as string) : undefined;

  const [categories, transactions, familyMembers] = await Promise.all([
    getCategories(),
    getTransactions(1000, 0, { // Fetch many transactions (will use react-window)
      scope,
      categoryId,
      memberId,
      startDate,
      endDate
    }),
    getFamilyMembers()
  ]);

  return (
    <div className="flex flex-col h-screen max-w-5xl mx-auto">
      <div className="flex-none p-4 pb-0">
        <PageHeader
          title="Lịch sử giao dịch"
          description="Xem lại toàn bộ chi tiêu của bạn"
        />
      </div>

      <div className="flex-1 overflow-hidden p-4">
        <TransactionsClient
          initialTransactions={transactions}
          categories={categories}
          familyMembers={familyMembers}
          initialScope={scope}
        />
      </div>
    </div>
  );
}

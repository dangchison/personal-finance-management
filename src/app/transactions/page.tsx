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
  const page = Number(resolvedSearchParams.page) || 1;
  const limit = 50; // Increased limit for history page
  const offset = (page - 1) * limit;

  const scope = (resolvedSearchParams.scope as "personal" | "family") || "personal";
  const categoryId = resolvedSearchParams.categoryId as string;
  const memberId = resolvedSearchParams.memberId as string;
  const startDate = resolvedSearchParams.from ? new Date(resolvedSearchParams.from as string) : undefined;
  const endDate = resolvedSearchParams.to ? new Date(resolvedSearchParams.to as string) : undefined;

  const [categories, transactions, familyMembers] = await Promise.all([
    getCategories(),
    getTransactions(limit, offset, {
      scope,
      categoryId,
      memberId,
      startDate,
      endDate
    }),
    getFamilyMembers()
  ]);

  return (
    <div className="p-4 space-y-6 max-w-5xl mx-auto min-h-screen">
      <PageHeader
        title="Lịch sử giao dịch"
        description="Xem lại toàn bộ chi tiêu của bạn"
      />

      <TransactionsClient
        initialTransactions={transactions}
        categories={categories}
        familyMembers={familyMembers}
        currentPage={page}
        hasNextPage={transactions.length === limit}
        initialScope={scope}
      />
    </div>
  );
}

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { getTransactions, getCategories } from "@/actions/transaction";
import { TransactionsClient } from "@/components/transaction/transactions-client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
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
      <div className="flex items-center gap-4 border-b pb-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Lịch sử giao dịch</h1>
          <p className="text-muted-foreground text-sm">Xem lại toàn bộ chi tiêu của bạn</p>
        </div>
      </div>

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

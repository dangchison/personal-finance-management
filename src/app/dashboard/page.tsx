import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { getCategories, getTransactions, getMonthlyStats, TransactionWithCategory } from "@/actions/transaction";
import { DashboardClient } from "@/components/dashboard/dashboard-client";

import { getFamilyMembers } from "@/actions/family";

export default async function DashboardPage({
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

  const [categories, transactions, stats, familyMembers] = await Promise.all([
    getCategories(),
    getTransactions(50, 0, { scope, categoryId, memberId, startDate, endDate }) as Promise<TransactionWithCategory[]>,
    getMonthlyStats(), // Note: stats might need filters too later
    getFamilyMembers() as Promise<any>
  ]);

  return (
    <DashboardClient
      user={session.user || {}}
      categories={categories}
      transactions={transactions}
      stats={stats}
      familyMembers={familyMembers}
    />
  );
}

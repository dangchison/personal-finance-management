import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getCategories, getTransactions, getMonthlyStats, TransactionWithCategory } from "@/actions/transaction";
import { getBudgetProgress } from "@/actions/budget";
import { getFamilyMembers } from "@/actions/family";
import { DashboardClient } from "@/components/dashboard/dashboard-client";

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

  // Dashboard only shows current month data (Aligned with Vietnam Time UTC+7)
  const TIMEZONE_OFFSET_HOURS = 7;
  const offsetMs = TIMEZONE_OFFSET_HOURS * 60 * 60 * 1000;

  const now = new Date();
  const nowVn = new Date(now.getTime() + offsetMs);
  const vnYear = nowVn.getUTCFullYear();
  const vnMonth = nowVn.getUTCMonth();

  // Start Of Month (VN): Year-Month-01 00:00:00 VN -> UTC
  const startDate = new Date(Date.UTC(vnYear, vnMonth, 1) - offsetMs);

  // End Of Month (VN): Year-Month-Last 23:59:59.999 VN -> UTC
  const endDate = new Date(Date.UTC(vnYear, vnMonth + 1, 0, 23, 59, 59, 999) - offsetMs);

  // Ignore searchParams.from/to for dashboard to enforce current month view

  const [categories, transactions, stats, familyMembers, budgetProgress] = await Promise.all([
    getCategories(),
    getTransactions(50, 0, { scope, categoryId, memberId, startDate, endDate }) as Promise<TransactionWithCategory[]>,
    getMonthlyStats(),
    getFamilyMembers() as Promise<any>,
    getBudgetProgress(),
  ]);

  return (
    <DashboardClient
      user={session.user || {}}
      categories={categories}
      transactions={transactions}
      stats={stats}
      familyMembers={familyMembers}
      budgetProgress={budgetProgress}
    />
  );
}

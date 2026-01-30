import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getDailyStats, getCategoryStats, getYearlyComparison } from "@/actions/analytics";
import { getFamilyMembers } from "@/actions/family";
import { MonthlyChart } from "@/components/charts/monthly-chart";
import { PageHeader } from "@/components/ui/page-header";
import { CategoryPieChart } from "@/components/charts/category-pie";
import { ReportFilters } from "@/components/reports/report-filters";
import { ReportSummary } from "@/components/reports/report-summary";
import { YearlyComparison } from "@/components/charts/yearly-comparison";

export default async function ReportsPage({
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
  // Allow date filters? For now simple default (last 30 days / current month).
  // Future: Add filter controls to Reports page.

  const now = new Date();
  const startDate = resolvedSearchParams.from ? new Date(resolvedSearchParams.from as string) : new Date(now.getFullYear(), now.getMonth(), 1); // Current month start
  const endDate = resolvedSearchParams.to ? new Date(resolvedSearchParams.to as string) : new Date();

  const [dailyStats, categoryStats, familyMembers, yearlyComparison] = await Promise.all([
    getDailyStats(startDate, endDate, scope),
    getCategoryStats(startDate, endDate, scope),
    getFamilyMembers(),
    getYearlyComparison(scope),
  ]);

  const hasFamily = familyMembers.length > 0;

  // Calculate summary metrics
  const totalExpense = dailyStats?.reduce((acc, curr) => acc + (curr.expense || 0), 0) || 0;

  return (
    <div className="p-4 space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col gap-4">
        <PageHeader
          title="Báo cáo & Phân tích"
          description="Tổng quan tài chính của bạn"
        >
          {/* Report Filters aligned with header if space permits, or below */}
        </PageHeader>

        <ReportFilters
          initialScope={scope}
          dateRange={{ from: startDate, to: endDate }}
          hasFamily={hasFamily}
        />
      </div>

      <ReportSummary expense={totalExpense} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MonthlyChart data={dailyStats || []} />
        <CategoryPieChart data={categoryStats || []} />
        <YearlyComparison data={yearlyComparison || []} />
      </div>
    </div>
  );
}

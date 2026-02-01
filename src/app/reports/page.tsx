import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getSixMonthTrend, getMonthlySummary, getCategoryStats } from "@/actions/analytics";
import { getFamilyMembers } from "@/actions/family";
import { PageHeader } from "@/components/ui/page-header";
import { ReportFilters } from "@/components/reports/report-filters";
import { RecentTrendChart } from "@/components/charts/recent-trend";
import { SpendingAnalysis } from "@/components/reports/spending-analysis";

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

  const now = new Date();
  const startDate = resolvedSearchParams.from ? new Date(resolvedSearchParams.from as string) : new Date(now.getFullYear(), now.getMonth(), 1); // Current month start
  const endDate = resolvedSearchParams.to ? new Date(resolvedSearchParams.to as string) : new Date();

  // Fetch all necessary data in parallel
  const [monthlySummary, categoryStats, familyMembers, sixMonthTrend] = await Promise.all([
    getMonthlySummary(startDate, endDate, scope),
    getCategoryStats(startDate, endDate, scope),
    getFamilyMembers(),
    getSixMonthTrend(scope),
  ]);

  const hasFamily = familyMembers.length > 0;

  return (
    <div className="p-4 space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col gap-4">
        <PageHeader
          title="Báo cáo & Phân tích"
          description="Tổng quan tài chính của bạn"
        >
        </PageHeader>

        <ReportFilters
          initialScope={scope}
          hasFamily={hasFamily}
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-6">
        {/* Spending Analysis (Top) */}
        <SpendingAnalysis
          summary={monthlySummary}
          categories={categoryStats}
        />

        {/* Trend Chart (Bottom) */}
        <RecentTrendChart data={sixMonthTrend || []} />
      </div>
    </div>
  );
}

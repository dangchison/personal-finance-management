import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getSixMonthTrend, getMonthlySummary, getCategoryStats } from "@/actions/analytics";
import { getFamilyMembers } from "@/actions/family";
import { ReportFilters } from "@/components/reports/report-filters";
import { RecentTrendChart } from "@/components/charts/recent-trend";
import { SpendingAnalysis } from "@/components/reports/spending-analysis";
import { getAppMonthRange, parseDateParam } from "@/lib/app-time";
import { WorkspaceLayout } from "@/components/layout/workspace-layout";

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
  const fromParam = Array.isArray(resolvedSearchParams.from)
    ? resolvedSearchParams.from[0]
    : resolvedSearchParams.from;
  const toParam = Array.isArray(resolvedSearchParams.to)
    ? resolvedSearchParams.to[0]
    : resolvedSearchParams.to;

  const currentMonthRange = getAppMonthRange();
  const startDate = parseDateParam(fromParam) || currentMonthRange.start;
  const endDate = parseDateParam(toParam) || currentMonthRange.end;

  // Fetch all necessary data in parallel
  const [monthlySummary, categoryStats, familyMembers, sixMonthTrend] = await Promise.all([
    getMonthlySummary(startDate, endDate, scope),
    getCategoryStats(startDate, endDate, scope),
    getFamilyMembers(),
    getSixMonthTrend(scope),
  ]);

  const hasFamily = familyMembers.length > 0;

  return (
    <WorkspaceLayout
      title="Báo cáo & Phân tích"
      description="Tổng quan tài chính của bạn"
      withPanel={false}
      maxWidthClassName="max-w-6xl"
    >
      <div className="space-y-6">
        <ReportFilters
          initialScope={scope}
          hasFamily={hasFamily}
        />

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
    </WorkspaceLayout>
  );
}

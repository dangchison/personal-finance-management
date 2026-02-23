"use client";

import { useState, useEffect, useTransition } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { List, BarChart3, Users, Filter, PanelRightOpen, PanelRightClose, ChartPie } from "lucide-react";
import { UserNav } from "@/components/auth/user-nav";
import { AddTransaction } from "@/components/transaction/add-transaction";
import { TransactionList } from "@/components/transaction/transaction-list";
import { Category } from "@prisma/client";
import { useRouter } from "next/navigation";
import { WelcomeScreen } from "@/components/auth/welcome-screen";
import { CountUpAnimation } from "@/components/ui/count-up-animation";
import { TransactionDetailsModal } from "@/components/transaction/transaction-details-modal";
import { QuickActionButton } from "./quick-action-button";
import { useUrlFilters } from "@/hooks/useUrlFilters";
import { StatsCard } from "./stats-card";
import { SpendingPieChart } from "./spending-pie-chart";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TransactionFilters } from "@/components/transaction/transaction-filters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

// Match TransactionList requirements
import { TransactionWithCategory } from "@/actions/transaction";
import { isSameMonth } from "date-fns";

export interface BudgetProgress {
  amount: number;
  spent: number;
}

interface DashboardClientProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  categories: Category[];
  transactions: TransactionWithCategory[];
  stats: {
    income: number;
    expense: number;
    previousIncome?: number;
    previousExpense?: number;
  };
  familyMembers?: { id: string; name: string | null; image: string | null }[];
  budgetProgress?: BudgetProgress[];
  categoryStats: { name: string; value: number }[];
}

export function DashboardClient({ user, categories, transactions, stats, familyMembers = [], budgetProgress = [], categoryStats = [] }: DashboardClientProps) {
  const router = useRouter();
  const [editingTransaction, setEditingTransaction] = useState<TransactionWithCategory | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [viewingTransaction, setViewingTransaction] = useState<TransactionWithCategory | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [navLoading, setNavLoading] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showInsightsDesktop, setShowInsightsDesktop] = useState(true);
  const [mobileInsightsOpen, setMobileInsightsOpen] = useState(false);
  const [isRefreshingTransactions, startRefreshTransition] = useTransition();

  // Check localStorage only on client-side to avoid hydration errors
  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    if (!hasSeenWelcome) {
      localStorage.setItem('hasSeenWelcome', 'true');
      // Use setTimeout to avoid synchronous state update in effect
      setTimeout(() => setShowWelcome(true), 0);
    }
  }, []);
  // Use URL filters hook
  const { updateFilters, updateDateRange, dateRange, isPending, searchParams } = useUrlFilters("/dashboard");

  // Filter States (Synced with URL)
  const scope = searchParams.get("scope") || "personal";
  const categoryId = searchParams.get("categoryId") || "all";
  const memberId = searchParams.get("memberId") || "all";

  const handleTabChange = (value: string) => {
    updateFilters({ scope: value, memberId: null }); // Reset member filter on scope switch
  };

  const handleDateSelect = (range: { from?: Date; to?: Date } | undefined) => {
    updateDateRange(range);
  };

  const handleEdit = (transaction: TransactionWithCategory) => {
    if (scope === 'family') return;

    // If transaction is not in current month, only allow viewing
    if (!isSameMonth(new Date(transaction.date), new Date())) {
      handleView(transaction);
      return;
    }

    setEditingTransaction(transaction);
    setIsEditOpen(true);
    setIsViewOpen(false); // Close view if open
  };

  const handleView = (transaction: TransactionWithCategory) => {
    setViewingTransaction(transaction);
    setIsViewOpen(true);
  };

  const handleTransactionAdded = () => {
    startRefreshTransition(() => {
      router.refresh();
    });
  };

  const handleEditFromView = () => {
    if (viewingTransaction && scope !== 'family') {
      setEditingTransaction(viewingTransaction);
      setIsViewOpen(false);
      setIsEditOpen(true);
    }
  };

  const onOpenChange = (open: boolean) => {
    setIsEditOpen(open);
    if (!open) {
      setTimeout(() => setEditingTransaction(null), 300);
    }
  };


  // Calculate percentage change for expense
  const prevExpense = stats.previousExpense || 0;
  // If previous is 0, and current is > 0, it's 100% increase (technically infinite, but 100% fits UI). 
  // If both 0, it's 0%.
  const expensePercent = prevExpense === 0
    ? (stats.expense > 0 ? 100 : 0)
    : Math.round(((stats.expense - prevExpense) / prevExpense) * 100);

  const isIncrease = expensePercent > 0;
  const isDecrease = expensePercent < 0;
  const remainingBudget = budgetProgress.reduce((acc, b) => acc + (b.amount - b.spent), 0);
  const totalBudget = budgetProgress.reduce((acc, b) => acc + b.amount, 0);
  const totalSpentBudget = budgetProgress.reduce((acc, b) => acc + b.spent, 0);
  const budgetUsage = totalBudget > 0 ? Math.round((totalSpentBudget / totalBudget) * 100) : 0;
  const overBudgetCount = budgetProgress.filter((b) => b.spent > b.amount).length;
  const isTransactionListLoading = isPending || isRefreshingTransactions;

  return (
    <>
      {showWelcome && (
        <WelcomeScreen
          userName={user.name}
          onComplete={() => setShowWelcome(false)}
        />
      )}
      <div className="p-4 w-full mx-auto lg:h-[calc(100vh-2rem)]">
        <header className="flex lg:hidden items-center justify-between border-b border-border/70 pb-4 mb-4">
          <div>
            <h1 className="text-2xl font-semibold">Xin chào, {user.name || "Bạn"}!</h1>
            <p className="text-muted-foreground text-sm">Theo dõi tài chính tháng này.</p>
          </div>
          <UserNav />
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:h-full">
          <aside className="lg:col-span-3 lg:h-full lg:overflow-y-auto lg:pr-1 space-y-4">
            <div className="hidden lg:flex items-center gap-3 pb-1">
              <UserNav />
              <div>
                <h1 className="text-lg font-semibold">{user.name || "Bạn"}</h1>
                <p className="text-xs text-muted-foreground">Command Center</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <StatsCard title="Chi tiêu tháng này">
                <div className="text-2xl font-semibold tabular-nums text-red-600 dark:text-red-400">
                  <CountUpAnimation end={stats.expense} /> ₫
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs text-muted-foreground">So với tháng trước:</p>
                  <span className={cn(
                    "text-xs font-medium",
                    isIncrease ? "text-red-500" : isDecrease ? "text-emerald-500" : "text-muted-foreground"
                  )}>
                    {expensePercent > 0 ? "+" : ""}{expensePercent}%
                  </span>
                </div>
              </StatsCard>

            </div>

            <div className="grid grid-cols-2 gap-3">
              <AddTransaction
                categories={categories}
                onTransactionAdded={handleTransactionAdded}
              />
              <QuickActionButton
                icon={List}
                label="Lịch sử"
                onClick={() => {
                  setNavLoading("history");
                  router.push("/transactions");
                }}
                isLoading={navLoading === "history"}
                disabled={navLoading !== null}
              />
              <QuickActionButton
                icon={BarChart3}
                label="Báo cáo"
                onClick={() => {
                  setNavLoading("reports");
                  router.push("/reports");
                }}
                isLoading={navLoading === "reports"}
                disabled={navLoading !== null}
              />
              <QuickActionButton
                icon={Users}
                label="Gia đình"
                onClick={() => {
                  setNavLoading("family");
                  router.push("/family");
                }}
                isLoading={navLoading === "family"}
                disabled={navLoading !== null}
              />
            </div>
          </aside>

          <section
            className={cn(
              "flex flex-col lg:h-full lg:overflow-hidden gap-4",
              showInsightsDesktop ? "lg:col-span-6" : "lg:col-span-9"
            )}
          >
            <div className="flex items-center justify-between gap-2 border-b border-border/70 pb-3">
              <h2 className="text-lg font-semibold">Giao dịch tháng hiện tại</h2>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="lg:hidden"
                  onClick={() => setMobileInsightsOpen(true)}
                >
                  <ChartPie className="h-4 w-4 mr-2" />
                  Insights
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden lg:inline-flex"
                  onClick={() => setShowInsightsDesktop((prev) => !prev)}
                >
                  {showInsightsDesktop ? (
                    <>
                      <PanelRightClose className="h-4 w-4 mr-2" />
                      Ẩn insights
                    </>
                  ) : (
                    <>
                      <PanelRightOpen className="h-4 w-4 mr-2" />
                      Hiện insights
                    </>
                  )}
                </Button>
              </div>
            </div>

            {familyMembers.length > 0 ? (
              <Tabs defaultValue={scope} onValueChange={handleTabChange} className="flex-1 flex flex-col min-h-0 gap-4">
                <div className="flex flex-col gap-3 shrink-0">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <TabsList className="grid grid-cols-2 w-full sm:w-[260px]">
                      <TabsTrigger value="personal">Cá nhân</TabsTrigger>
                      <TabsTrigger value="family">Gia đình</TabsTrigger>
                    </TabsList>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowFilters(!showFilters)}
                      className="w-full sm:w-auto h-9"
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      {showFilters ? "Ẩn bộ lọc" : "Hiện bộ lọc"}
                    </Button>
                  </div>

                  <TransactionFilters
                    categoryId={categoryId}
                    memberId={memberId}
                    dateRange={dateRange || {}}
                    categories={categories}
                    familyMembers={familyMembers}
                    scope={scope as "personal" | "family"}
                    showFilters={showFilters}
                    hideTrigger
                    hideDateFilter
                    onCategoryChange={(val) => updateFilters({ categoryId: val })}
                    onMemberChange={(val) => updateFilters({ memberId: val })}
                    onDateRangeChange={handleDateSelect}
                    onToggleFilters={() => setShowFilters(!showFilters)}
                  />
                </div>

                <TabsContent value="personal" className="flex-1 flex flex-col min-h-0 gap-3 mt-0">
                  <div className="flex items-center justify-between shrink-0">
                    <h3 className="text-base font-medium">Giao dịch cá nhân</h3>
                    <Button variant="link" asChild className="px-0">
                      <Link href="/transactions">Xem tất cả</Link>
                    </Button>
                  </div>
                  <div className="flex-1 min-h-0">
                    <TransactionList
                      transactions={transactions}
                      onEdit={handleEdit}
                      onView={handleView}
                      readOnly={false}
                      isLoading={isTransactionListLoading}
                      isFullPage
                    />
                  </div>
                </TabsContent>

                <TabsContent value="family" className="flex-1 flex flex-col min-h-0 gap-3 mt-0">
                  <div className="flex items-center justify-between shrink-0">
                    <h3 className="text-base font-medium">Giao dịch gia đình</h3>
                  </div>
                  <div className="flex-1 min-h-0">
                    <TransactionList
                      transactions={transactions}
                      onEdit={handleEdit}
                      onView={handleView}
                      readOnly
                      isLoading={isTransactionListLoading}
                      isFullPage
                    />
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="flex-1 flex flex-col min-h-0 gap-4">
                <div className="flex flex-col gap-3 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                    className="w-full sm:w-auto h-9"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    {showFilters ? "Ẩn bộ lọc" : "Hiện bộ lọc"}
                  </Button>

                  <TransactionFilters
                    categoryId={categoryId}
                    dateRange={dateRange || {}}
                    categories={categories}
                    scope="personal"
                    showFilters={showFilters}
                    hideDateFilter
                    onCategoryChange={(val) => updateFilters({ categoryId: val })}
                    onDateRangeChange={handleDateSelect}
                    onToggleFilters={() => setShowFilters(!showFilters)}
                  />
                </div>

                <div className="flex-1 min-h-0">
                  <TransactionList
                    transactions={transactions}
                    onEdit={handleEdit}
                    onView={handleView}
                    readOnly={false}
                    isLoading={isTransactionListLoading}
                    isFullPage
                  />
                </div>
              </div>
            )}
          </section>

          {showInsightsDesktop && (
            <aside className="hidden lg:flex lg:col-span-3 lg:h-full lg:overflow-y-auto lg:pl-1 flex-col gap-4">
              <Card className="border border-border/80 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Insights tháng này</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Ngân sách còn lại</span>
                    <span className="font-semibold tabular-nums"><CountUpAnimation end={remainingBudget} /> ₫</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Mức sử dụng ngân sách</span>
                    <span className="font-semibold">{budgetUsage}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Danh mục vượt ngân sách</span>
                    <span className={cn("font-semibold", overBudgetCount > 0 ? "text-red-600" : "text-emerald-600")}>
                      {overBudgetCount}
                    </span>
                  </div>
                  <Button variant="outline" asChild className="w-full mt-2">
                    <Link href="/settings?tab=budget">Quản lý ngân sách</Link>
                  </Button>
                </CardContent>
              </Card>
              <SpendingPieChart data={categoryStats} />
            </aside>
          )}
        </div>

        <Sheet open={mobileInsightsOpen} onOpenChange={setMobileInsightsOpen}>
          <SheetContent side="bottom" className="max-h-[90vh] rounded-t-2xl overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Insights tháng này</SheetTitle>
            </SheetHeader>
            <div className="space-y-4 px-4 pb-6">
              <Card className="border border-border/80 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Tổng quan ngân sách</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Ngân sách còn lại</span>
                    <span className="font-semibold tabular-nums"><CountUpAnimation end={remainingBudget} /> ₫</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Mức sử dụng ngân sách</span>
                    <span className="font-semibold">{budgetUsage}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Danh mục vượt ngân sách</span>
                    <span className={cn("font-semibold", overBudgetCount > 0 ? "text-red-600" : "text-emerald-600")}>
                      {overBudgetCount}
                    </span>
                  </div>
                </CardContent>
              </Card>
              <SpendingPieChart data={categoryStats} />
            </div>
          </SheetContent>
        </Sheet>

        {/* Edit Dialog */}
        <AddTransaction
          categories={categories}
          initialData={editingTransaction}
          open={isEditOpen}
          onOpenChange={onOpenChange}
          onTransactionAdded={handleTransactionAdded}
        />

        {/* View Modal */}
        <TransactionDetailsModal
          transaction={viewingTransaction}
          open={isViewOpen}
          onOpenChange={setIsViewOpen}
          onEdit={handleEditFromView}
          readOnly={scope === 'family' || (viewingTransaction ? !isSameMonth(new Date(viewingTransaction.date), new Date()) : false)}
        />
      </div>{/* End of max-w-7xl */}
    </>
  );
}

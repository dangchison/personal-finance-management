"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Filter, PanelRightOpen, PanelRightClose, ChartPie } from "lucide-react";
import { AddTransaction } from "@/components/transaction/add-transaction";
import { TransactionList } from "@/components/transaction/transaction-list";
import { Category } from "@prisma/client";
import { useRouter } from "next/navigation";
import { CountUpAnimation } from "@/components/ui/count-up-animation";
import { TransactionDetailsModal } from "@/components/transaction/transaction-details-modal";
import { useUrlFilters } from "@/hooks/useUrlFilters";
import { InsightsPanel } from "./insights-panel";
import { SteelGrid, Readout } from "@/components/ui/panel";
import { formatCurrency } from "@/lib/format-currency";
import { SpendingPieChart } from "./spending-pie-chart";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TransactionFilters } from "@/components/transaction/transaction-filters";
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

export function DashboardClient({ categories, transactions, stats, familyMembers = [], budgetProgress = [], categoryStats = [] }: DashboardClientProps) {
  const router = useRouter();
  const [editingTransaction, setEditingTransaction] = useState<TransactionWithCategory | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [viewingTransaction, setViewingTransaction] = useState<TransactionWithCategory | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showInsightsDesktop, setShowInsightsDesktop] = useState(true);
  const [mobileInsightsOpen, setMobileInsightsOpen] = useState(false);
  const [isRefreshingTransactions, startRefreshTransition] = useTransition();
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
      <div className="h-full w-full">
        <div className="grid h-full min-h-0 grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-px lg:border lg:border-border lg:bg-border">
          <aside className="shrink-0 space-y-4 lg:col-span-3 lg:h-full lg:overflow-y-auto lg:bg-background lg:p-4">
            {/* Hàng đo: lưới thép, số mono theo mã màu dữ liệu */}
            <SteelGrid className="grid-cols-2 lg:grid-cols-1">
              <Readout
                label="Chi tiêu tháng này"
                tone="var(--pf-expense-ink)"
                className="col-span-2 lg:col-span-1"
              >
                <CountUpAnimation end={stats.expense} formatNumber={formatCurrency} />
              </Readout>
              <Readout
                label="So với tháng trước"
                tone={
                  isIncrease
                    ? "var(--pf-over-ink)"
                    : isDecrease
                      ? "var(--pf-ok-ink)"
                      : undefined
                }
              >
                {expensePercent > 0 ? "+" : ""}{expensePercent}%
              </Readout>
              <Readout
                label="Ngân sách còn lại"
                tone={
                  remainingBudget < 0 ? "var(--pf-over-ink)" : "var(--pf-budget-ink)"
                }
              >
                {formatCurrency(remainingBudget)}
              </Readout>
            </SteelGrid>

            <div className="grid grid-cols-1 gap-3">
              <AddTransaction
                categories={categories}
                onTransactionAdded={handleTransactionAdded}
              />
            </div>
          </aside>

          <section
            className={cn(
              "flex min-h-0 flex-col gap-4 overflow-hidden lg:bg-background lg:p-4",
              showInsightsDesktop ? "lg:col-span-6" : "lg:col-span-9"
            )}
          >
            <div className="flex items-center justify-between gap-2 border-b border-border/70 pb-3">
              <h2 className="pf-display text-lg font-bold text-foreground">Giao dịch tháng hiện tại</h2>
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
                    hideTrigger
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
            <aside className="hidden flex-col gap-4 lg:col-span-3 lg:flex lg:h-full lg:overflow-y-auto lg:bg-background lg:p-4">
              <InsightsPanel
                title="Insights tháng này"
                showManageLink
                remainingBudget={remainingBudget}
                budgetUsage={budgetUsage}
                overBudgetCount={overBudgetCount}
              />
              <SpendingPieChart data={categoryStats} />
            </aside>
          )}
        </div>

        <Sheet open={mobileInsightsOpen} onOpenChange={setMobileInsightsOpen}>
          <SheetContent side="bottom" className="max-h-[90vh] overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Insights tháng này</SheetTitle>
            </SheetHeader>
            <div className="space-y-4 px-4 pb-6">
              <InsightsPanel
                title="Tổng quan ngân sách"
                showManageLink
                remainingBudget={remainingBudget}
                budgetUsage={budgetUsage}
                overBudgetCount={overBudgetCount}
              />
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
      </div>
    </>
  );
}

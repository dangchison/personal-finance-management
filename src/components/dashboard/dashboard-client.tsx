"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { List, BarChart3, Users, Filter } from "lucide-react";
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
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Check localStorage only on client-side to avoid hydration errors
  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    if (!hasSeenWelcome) {
      localStorage.setItem('hasSeenWelcome', 'true');
      // Use setTimeout to avoid synchronous state update in effect
      setTimeout(() => setShowWelcome(true), 0);
    }
  }, []);
  useEffect(() => {
    setIsRefreshing(false);
  }, [transactions]);

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

  return (
    <>
      {showWelcome && (
        <WelcomeScreen
          userName={user.name}
          onComplete={() => setShowWelcome(false)}
        />
      )}
      <div className="p-4 w-full mx-auto lg:h-[calc(100vh-2rem)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:h-full">
          {/* Left Column: Header, Stats */}
          <div className="lg:col-span-3 xl:col-span-3 space-y-6 lg:overflow-y-auto lg:pr-2">
            {/* Mobile Header */}
            <header className="flex lg:hidden items-center justify-between border-b pb-4">
              <div>
                <h1 className="text-2xl font-bold">Xin chào, {user.name || "Bạn"}!</h1>
                <p className="text-muted-foreground text-sm">Chào mừng bạn quay lại quản lý tài chính.</p>
              </div>
              <UserNav />
            </header>

            {/* PC Header: Avatar + Text in one row */}
            <div className="hidden lg:flex items-center gap-3">
              <UserNav />
              <div>
                <h1 className="text-lg font-bold">{user.name || "Bạn"}</h1>
                <p className="text-xs text-muted-foreground">Quản lý tài chính</p>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 gap-4">
              {/* Chi tiêu Card */}
              <StatsCard
                title="Chi tiêu tháng này"
                shadowColor="shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/35"
              >
                <div className="text-3xl font-bold text-blue-500">
                  <CountUpAnimation end={stats.expense} /> ₫
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs text-muted-foreground">So với tháng trước:</p>
                  <span className={`text-xs font-medium ${isIncrease ? "text-rose-500" : isDecrease ? "text-emerald-500" : "text-muted-foreground"
                    }`}>
                    {expensePercent > 0 ? "+" : ""}{expensePercent}%
                  </span>
                </div>
              </StatsCard>

              {/* Ngân sách Card */}
              <StatsCard
                title="Ngân sách còn lại"
                shadowColor="shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/35"
                headerAction={
                  (!budgetProgress || budgetProgress.length === 0) ? (
                    <Link
                      href="/settings?tab=budget"
                      className="text-muted-foreground hover:text-blue-600 transition-colors"
                      title="Thiết lập ngân sách"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </Link>
                  ) : undefined
                }
              >
                {budgetProgress && budgetProgress.length > 0 ? (
                  <>
                    <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                      <CountUpAnimation
                        end={budgetProgress.reduce((acc, b) => acc + (b.amount - b.spent), 0)}
                      /> ₫
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Tổng hạn mức: <CountUpAnimation end={budgetProgress.reduce((acc, b) => acc + b.amount, 0)} /> ₫
                    </p>
                  </>
                ) : (
                  <div className="text-sm text-muted-foreground">Chưa thiết lập ngân sách</div>
                )}
              </StatsCard>
            </div>

            {/* Spending Pie Chart - PC Only */}
            <div className="hidden lg:block">
              <SpendingPieChart data={categoryStats} />
            </div>
          </div>

          {/* Right Column: Main Content Area with Tabs & Filters */}
          <div className="lg:col-span-9 xl:col-span-9 flex flex-col lg:h-full lg:overflow-hidden gap-6">
            {/* Quick Actions moved here */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 shrink-0">
              <AddTransaction
                categories={categories}
                onTransactionAdded={() => setIsRefreshing(true)}
              />

              <QuickActionButton
                icon={List}
                label="Lịch sử"
                onClick={() => {
                  setNavLoading('history');
                  router.push('/transactions');
                }}
                gradient="bg-gradient-to-br from-sky-500 to-blue-600"
                shadowColor="shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40"
                isLoading={navLoading === 'history'}
                disabled={navLoading !== null}
              />

              <QuickActionButton
                icon={BarChart3}
                label="Báo cáo"
                onClick={() => {
                  setNavLoading('reports');
                  router.push('/reports');
                }}
                gradient="bg-gradient-to-br from-indigo-500 to-purple-600"
                shadowColor="shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40"
                isLoading={navLoading === 'reports'}
                disabled={navLoading !== null}
              />

              <QuickActionButton
                icon={Users}
                label="Gia đình"
                onClick={() => {
                  setNavLoading('family');
                  router.push('/family');
                }}
                gradient="bg-gradient-to-br from-blue-500 to-cyan-600"
                shadowColor="shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40"
                isLoading={navLoading === 'family'}
                disabled={navLoading !== null}
              />
            </div>

            {familyMembers.length > 0 ? (
              <Tabs defaultValue={scope} onValueChange={handleTabChange} className="flex-1 flex flex-col min-h-0 gap-4">
                <div className="flex flex-col gap-4 shrink-0">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                    <TabsList className="grid grid-cols-2 w-full sm:w-[280px]">
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
                    hideTrigger={true}
                    hideDateFilter={true}
                    onCategoryChange={(val) => updateFilters({ categoryId: val })}
                    onMemberChange={(val) => updateFilters({ memberId: val })}
                    onDateRangeChange={handleDateSelect}
                    onToggleFilters={() => setShowFilters(!showFilters)}
                  />
                </div>

                <TabsContent value="personal" className="flex-1 flex flex-col min-h-0 gap-4 mt-0">
                  {/* Controlled by URL param 'scope=personal' (default) */}
                  <div className="flex items-center justify-between shrink-0">
                    <h2 className="text-xl font-bold">Giao dịch cá nhân</h2>
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
                      isLoading={isPending || isRefreshing}
                      isFullPage={true}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="family" className="flex-1 flex flex-col min-h-0 gap-4 mt-0">
                  {/* Controlled by URL param 'scope=family' */}
                  <div className="flex items-center justify-between shrink-0">
                    <h2 className="text-xl font-bold">Giao dịch gia đình</h2>
                  </div>
                  <div className="flex-1 min-h-0">
                    <TransactionList
                      transactions={transactions}
                      onEdit={handleEdit}
                      onView={handleView}
                      readOnly={true}
                      isLoading={isPending}
                      isFullPage={true}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="flex-1 flex flex-col min-h-0 gap-4">
                {/* No Tabs - Personal Only View */}
                <div className="flex flex-col gap-4 shrink-0">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                    <h2 className="text-xl font-bold">Giao dịch cá nhân</h2>
                  </div>

                  <TransactionFilters
                    categoryId={categoryId}
                    dateRange={dateRange || {}}
                    categories={categories}
                    scope="personal"
                    showFilters={showFilters}
                    hideDateFilter={true}
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
                    isLoading={isPending || isRefreshing}
                    isFullPage={true}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Edit Dialog */}
        <AddTransaction
          categories={categories}
          initialData={editingTransaction}
          open={isEditOpen}
          onOpenChange={onOpenChange}
          onTransactionAdded={() => setIsRefreshing(true)}
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

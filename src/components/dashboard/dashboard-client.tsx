"use client";

import { useState, useCallback, useTransition, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { List, BarChart3, Users, Filter, Loader2 } from "lucide-react";
import { UserNav } from "@/components/auth/user-nav";
import { AddTransaction } from "@/components/transaction/add-transaction";
import { TransactionList } from "@/components/transaction/transaction-list";
import { Category } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";
import { WelcomeScreen } from "@/components/auth/welcome-screen";
import { CountUpAnimation } from "@/components/ui/count-up-animation";
import { TransactionDetailsModal } from "@/components/transaction/transaction-details-modal";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TransactionFilters } from "@/components/transaction/transaction-filters";

// Match TransactionList requirements
import { TransactionWithCategory } from "@/actions/transaction";

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
  };
  familyMembers?: { id: string; name: string | null; image: string | null }[];
  budgetProgress?: any[]; // Using any to avoid type complexity for now
}

export function DashboardClient({ user, categories, transactions, stats, familyMembers = [], budgetProgress = [] }: DashboardClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [editingTransaction, setEditingTransaction] = useState<TransactionWithCategory | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [viewingTransaction, setViewingTransaction] = useState<TransactionWithCategory | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [showFilters, setShowFilters] = useState(false);
  const [navLoading, setNavLoading] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState(() => {
    if (typeof window !== 'undefined') {
      const hasSeenWelcome = sessionStorage.getItem('hasSeenWelcome');
      if (!hasSeenWelcome) {
        sessionStorage.setItem('hasSeenWelcome', 'true');
        return true;
      }
    }
    return false;
  });


  // Filter States (Synced with URL)
  const scope = searchParams.get("scope") || "personal";
  const categoryId = searchParams.get("categoryId") || "all";
  const memberId = searchParams.get("memberId") || "all";
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const dateRange = useMemo(() => ({
    from: from ? new Date(from) : undefined,
    to: to ? new Date(to) : undefined,
  }), [from, to]);


  const updateFilters = useCallback((updates: Record<string, string | null>) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "all") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });
      router.push(`/dashboard?${params.toString()}`);
    });
  }, [searchParams, router]);

  const handleTabChange = (value: string) => {
    updateFilters({ scope: value, memberId: null }); // Reset member filter on scope switch
  };

  const handleDateSelect = (range: { from?: Date; to?: Date } | undefined) => {
    if (range?.from) {
      updateFilters({
        from: range.from.toISOString(),
        to: range.to ? range.to.toISOString() : null,
      });
    } else {
      updateFilters({ from: null, to: null });
    }
  };

  const handleEdit = (transaction: TransactionWithCategory) => {
    if (scope === 'family') return;
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


  return (
    <>
      {showWelcome && (
        <WelcomeScreen
          userName={user.name}
          onComplete={() => setShowWelcome(false)}
        />
      )}
      <div className="p-4 space-y-6 max-w-4xl mx-auto">
        <header className="flex items-center justify-between border-b pb-4">
          <div>
            <h1 className="text-2xl font-bold">Xin chào, {user.name || "Bạn"}!</h1>
            <p className="text-muted-foreground text-sm">Chào mừng bạn quay lại quản lý tài chính.</p>
          </div>
          <UserNav />
        </header>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-primary text-primary-foreground">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Chi tiêu tháng này</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                <CountUpAnimation end={stats.expense} /> ₫
              </div>
              <p className="text-xs opacity-80 mt-1">So với tháng trước: --%</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Ngân sách còn lại</CardTitle>
            </CardHeader>
            <CardContent>
              {budgetProgress && budgetProgress.length > 0 ? (
                <>
                  <div className="text-3xl font-bold">
                    <CountUpAnimation
                      end={budgetProgress.reduce((acc, b) => acc + (b.amount - b.spent), 0)}
                    /> ₫
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Tổng hạn mức: <CountUpAnimation end={budgetProgress.reduce((acc, b) => acc + b.amount, 0)} /> ₫
                  </p>
                </>
              ) : (
                <>
                  <div className="text-sm text-muted-foreground mb-2">Chưa thiết lập ngân sách</div>
                  <Button variant="outline" size="sm" asChild className="w-full h-8">
                    <Link href="/settings?tab=budget">Thiết lập ngay</Link>
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions Types */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <AddTransaction categories={categories} />
          <Button
            variant="secondary"
            className="h-20 flex-col gap-2"
            onClick={() => {
              setNavLoading('history');
              router.push('/transactions');
            }}
            disabled={navLoading !== null}
          >
            {navLoading === 'history' ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <List className="w-6 h-6" />
            )}
            <span>Lịch sử</span>
          </Button>
          <Button
            variant="secondary"
            className="h-20 flex-col gap-2"
            onClick={() => {
              setNavLoading('reports');
              router.push('/reports');
            }}
            disabled={navLoading !== null}
          >
            {navLoading === 'reports' ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <BarChart3 className="w-6 h-6" />
            )}
            <span>Báo cáo</span>
          </Button>
          <Button
            variant="secondary"
            className="h-20 flex-col gap-2"
            onClick={() => {
              setNavLoading('family');
              router.push('/family');
            }}
            disabled={navLoading !== null}
          >
            {navLoading === 'family' ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <Users className="w-6 h-6" />
            )}
            <span>Gia đình</span>
          </Button>
        </div>



        {/* Main Content Area with Tabs & Filters */}
        {/* Main Content Area with Tabs & Filters */}
        {familyMembers.length > 0 ? (
          <Tabs defaultValue={scope} onValueChange={handleTabChange} className="space-y-4">
            <div className="flex flex-col gap-4">
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
                dateRange={dateRange}
                categories={categories}
                familyMembers={familyMembers}
                scope={scope as "personal" | "family"}
                showFilters={showFilters}
                hideTrigger={true}
                onCategoryChange={(val) => updateFilters({ categoryId: val })}
                onMemberChange={(val) => updateFilters({ memberId: val })}
                onDateRangeChange={handleDateSelect}
                onToggleFilters={() => setShowFilters(!showFilters)}
              />
            </div>

            <TabsContent value="personal" className="space-y-4">
              {/* Controlled by URL param 'scope=personal' (default) */}
              <div className="flex items-center justify-between pb-2">
                <h2 className="text-xl font-bold">Giao dịch cá nhân</h2>
                <Button variant="link" asChild className="px-0">
                  <Link href="/transactions">Xem tất cả</Link>
                </Button>
              </div>
              <TransactionList
                transactions={transactions}
                onEdit={handleEdit}
                onView={handleView}
                readOnly={false}
                isLoading={isPending}
              />
            </TabsContent>

            <TabsContent value="family" className="space-y-4">
              {/* Controlled by URL param 'scope=family' */}
              <div className="flex items-center justify-between pb-2">
                <h2 className="text-xl font-bold">Giao dịch gia đình</h2>
              </div>
              <TransactionList
                transactions={transactions}
                onEdit={handleEdit}
                onView={handleView}
                readOnly={true}
                isLoading={isPending}
              />
            </TabsContent>
          </Tabs>
        ) : (
          <div className="space-y-4">
            {/* No Tabs - Personal Only View */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <h2 className="text-xl font-bold">Giao dịch cá nhân</h2>
              </div>

              <TransactionFilters
                categoryId={categoryId}
                dateRange={dateRange}
                categories={categories}
                scope="personal"
                showFilters={showFilters}
                onCategoryChange={(val) => updateFilters({ categoryId: val })}
                onDateRangeChange={handleDateSelect}
                onToggleFilters={() => setShowFilters(!showFilters)}
              />
            </div>

            <TransactionList
              transactions={transactions}
              onEdit={handleEdit}
              onView={handleView}
              readOnly={false}
              isLoading={isPending}
            />
          </div>
        )}

        {/* Edit Dialog */}
        <AddTransaction
          categories={categories}
          initialData={editingTransaction as any}
          open={isEditOpen}
          onOpenChange={onOpenChange}
        />

        {/* View Modal */}
        <TransactionDetailsModal
          transaction={viewingTransaction}
          open={isViewOpen}
          onOpenChange={setIsViewOpen}
          onEdit={handleEditFromView}
          readOnly={scope === 'family'}
        />
      </div>
    </>
  );
}

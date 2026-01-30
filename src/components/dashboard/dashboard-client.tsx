"use client";

import { useState, useCallback, useTransition, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { List, BarChart3, Users, Calendar as CalendarIcon } from "lucide-react";
import { UserNav } from "@/components/auth/user-nav";
import { AddTransaction } from "@/components/transaction/add-transaction";
import { TransactionList } from "@/components/transaction/transaction-list";
import { Category } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { cn } from "@/lib/utils";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

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
}

export function DashboardClient({ user, categories, transactions, stats, familyMembers = [] }: DashboardClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [editingTransaction, setEditingTransaction] = useState<TransactionWithCategory | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

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
    if (scope === 'family') return; // Double check, though UI hides it
    setEditingTransaction(transaction);
    setIsEditOpen(true);
  };

  const onOpenChange = (open: boolean) => {
    setIsEditOpen(open);
    if (!open) {
      setTimeout(() => setEditingTransaction(null), 300);
    }
  };


  return (
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
              {new Intl.NumberFormat("vi-VN").format(stats.expense)} ₫
            </div>
            <p className="text-xs opacity-80 mt-1">So với tháng trước: --%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ngân sách còn lại</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">Chưa thiết lập</div>
            <p className="text-xs text-muted-foreground mt-1">Hạn mức: -- ₫</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Types */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <AddTransaction categories={categories} />
        <Button variant="secondary" className="h-20 flex-col gap-2" asChild>
          <Link href="/transactions">
            <List className="w-6 h-6" />
            <span>Lịch sử</span>
          </Link>
        </Button>
        <Button variant="secondary" className="h-20 flex-col gap-2 opacity-50 cursor-not-allowed" disabled>
          <BarChart3 className="w-6 h-6" />
          <span>Báo cáo</span>
        </Button>
        <Button variant="secondary" className="h-20 flex-col gap-2" asChild>
          <Link href="/family">
            <Users className="w-6 h-6" />
            <span>Gia đình</span>
          </Link>
        </Button>
      </div>

      {/* Main Content Area with Tabs & Filters */}
      {/* Main Content Area with Tabs & Filters */}
      {familyMembers.length > 0 ? (
        <Tabs defaultValue={scope} onValueChange={handleTabChange} className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <TabsList className="grid grid-cols-2 w-full sm:w-[280px]">
              <TabsTrigger value="personal">Cá nhân</TabsTrigger>
              <TabsTrigger value="family">Gia đình</TabsTrigger>
            </TabsList>

            {/* Filters Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
              {/* Category Filter */}
              <Select value={categoryId} onValueChange={(val) => updateFilters({ categoryId: val })}>
                <SelectTrigger className="w-full sm:w-[160px] h-9">
                  <SelectValue placeholder="Danh mục" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  <SelectItem value="all">Tất cả danh mục</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Member Filter (Family Only) */}
              {scope === 'family' && (
                <Select value={memberId} onValueChange={(val) => updateFilters({ memberId: val })}>
                  <SelectTrigger className="w-full sm:w-[160px] h-9">
                    <SelectValue placeholder="Thành viên" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả mọi người</SelectItem>
                    {familyMembers.map((m) => (
                      <SelectItem key={m.id} value={m.id}>{m.name || "Thành viên"}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {/* Date Picker */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                      "w-full sm:w-[220px] justify-start text-left font-normal h-9",
                      !dateRange.from && "text-muted-foreground"
                    )}
                    suppressHydrationWarning
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                    <span className="truncate">
                      {dateRange.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "dd/MM", { locale: vi })} -{" "}
                            {format(dateRange.to, "dd/MM", { locale: vi })}
                          </>
                        ) : (
                          format(dateRange.from, "dd/MM/yyyy", { locale: vi })
                        )
                      ) : (
                        "Chọn ngày"
                      )}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange.from}
                    selected={dateRange as any}
                    onSelect={handleDateSelect as any}
                    numberOfMonths={1}
                    locale={vi}
                  />
                </PopoverContent>
              </Popover>
            </div>
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
              readOnly={true}
              isLoading={isPending}
            />
          </TabsContent>
        </Tabs>
      ) : (
        <div className="space-y-4">
          {/* No Tabs - Personal Only View */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <h2 className="text-xl font-bold">Giao dịch cá nhân</h2>

            {/* Filters Bar (Simpler without member filter) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
              <Select value={categoryId} onValueChange={(val) => updateFilters({ categoryId: val })}>
                <SelectTrigger className="w-full sm:w-[160px] h-9">
                  <SelectValue placeholder="Danh mục" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  <SelectItem value="all">Tất cả danh mục</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                      "w-full sm:w-[220px] justify-start text-left font-normal h-9",
                      !dateRange.from && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                    <span className="truncate">
                      {dateRange.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "dd/MM", { locale: vi })} -{" "}
                            {format(dateRange.to, "dd/MM", { locale: vi })}
                          </>
                        ) : (
                          format(dateRange.from, "dd/MM/yyyy", { locale: vi })
                        )
                      ) : (
                        "Chọn ngày"
                      )}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange.from}
                    selected={dateRange as any}
                    onSelect={handleDateSelect as any}
                    numberOfMonths={1}
                    locale={vi}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <TransactionList
            transactions={transactions}
            onEdit={handleEdit}
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
    </div>
  );
}

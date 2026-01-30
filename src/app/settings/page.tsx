import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getCategories } from "@/actions/transaction";
import { getBudgetProgress } from "@/actions/budget";
import { PageHeader } from "@/components/ui/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BudgetList } from "@/components/budget/budget-list";
import { UserNav } from "@/components/auth/user-nav";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const [categories, budgetProgress] = await Promise.all([
    getCategories(),
    getBudgetProgress(),
  ]);

  const resolvedSearchParams = await searchParams;
  const defaultTab = (resolvedSearchParams.tab as string) || "budget";

  return (
    <div className="p-4 space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="Cài đặt"
        description="Quản lý tài khoản và thiết lập hệ thống"
      >
        <UserNav />
      </PageHeader>

      <Tabs defaultValue={defaultTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">Thông tin chung</TabsTrigger>
          <TabsTrigger value="budget">Ngân sách</TabsTrigger>
          <TabsTrigger value="preferences" disabled>Tùy chọn khác</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin tài khoản</CardTitle>
              <CardDescription>
                Thông tin cá nhân và bảo mật
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Tên hiển thị</label>
                  <div className="p-2 border rounded-md bg-muted/50">{session.user?.name || "Chưa cập nhật"}</div>
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <div className="p-2 border rounded-md bg-muted/50">{session.user?.email}</div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Hiện tại bạn chưa thể thay đổi thông tin này trực tiếp.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="budget">
          <BudgetList initialBudgets={budgetProgress} categories={categories} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

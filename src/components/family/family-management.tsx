"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { createFamily, joinFamily, leaveFamily } from "@/actions/family";
import { toast } from "sonner";
import { Copy, LogOut, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Define strict types based on Prisma structure
interface FamilyMember {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
}

interface FamilyData {
  id: string;
  name: string;
  inviteCode: string;
  users: FamilyMember[];
}

interface FamilyManagementProps {
  initialFamily: FamilyData | null;
}

export function FamilyManagement({ initialFamily }: FamilyManagementProps) {
  const [family, setFamily] = useState<FamilyData | null>(initialFamily);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCreateFamily = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;

    const result = await createFamily(name);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Tạo gia đình thành công!");
      setFamily(result.data as FamilyData); // Type assertion needed or fix action return type
      router.refresh();
    }
    setLoading(false);
  };

  const handleJoinFamily = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const code = formData.get("code") as string;

    const result = await joinFamily(code);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Tham gia gia đình thành công!");
      setFamily(result.data as FamilyData);
      router.refresh();
    }
    setLoading(false);
  };

  const handleLeaveFamily = async () => {
    setLoading(true);
    const result = await leaveFamily();
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Đã rời khỏi gia đình");
      setFamily(null);
      router.refresh();
      router.push("/dashboard");
    }
    setLoading(false);
  };

  const copyInviteCode = () => {
    if (family?.inviteCode) {
      navigator.clipboard.writeText(family.inviteCode);
      toast.success("Đã sao chép mã mời!");
    }
  };

  if (family) {
    return (
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <Card className="border border-border/80 shadow-sm lg:col-span-8">
          <CardHeader className="border-b border-border/70 pb-5">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                <Users className="h-3.5 w-3.5" />
                Nhóm đang hoạt động
              </span>
              <CardTitle className="text-2xl tracking-tight">{family.name}</CardTitle>
              <CardDescription>Quản lý thành viên và chi tiêu chung của gia đình trong một nơi.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-5 pt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">
                Thành viên ({family.users?.length || 0})
              </h3>
              <p className="text-xs text-muted-foreground">Đồng bộ theo thời gian thực</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {(family.users || []).map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-3 rounded-xl border border-border/80 bg-muted/30 px-3 py-3"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={member.image || ""} />
                    <AvatarFallback>{member.name?.[0]?.toUpperCase() || "U"}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{member.name || "Unnamed User"}</p>
                    <p className="truncate text-xs text-muted-foreground">{member.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4 lg:col-span-4">
          <Card className="border border-border/80 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Mã mời thành viên</CardTitle>
              <CardDescription>Gửi mã này để mời người thân vào nhóm.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-xl border border-border/80 bg-muted/30 px-3 py-3">
                <code className="block break-all text-sm font-semibold tracking-wide">{family.inviteCode}</code>
              </div>
              <Button variant="outline" onClick={copyInviteCode} className="w-full" disabled={loading}>
                <Copy className="mr-2 h-4 w-4" />
                Sao chép mã mời
              </Button>
            </CardContent>
          </Card>

          <Card className="border border-border/80 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Hành động nhóm</CardTitle>
              <CardDescription>Rời nhóm khi bạn không còn nhu cầu theo dõi chi tiêu chung.</CardDescription>
            </CardHeader>
            <CardContent>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-red-600" disabled={loading}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Rời khỏi gia đình
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Rời khỏi gia đình?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Bạn sẽ không còn quyền truy cập vào các giao dịch gia đình sau khi xác nhận.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                    <AlertDialogAction onClick={handleLeaveFamily} className="bg-red-600 hover:bg-red-700">
                      Rời nhóm
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="border border-border/80 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl tracking-tight">Gia đình & Chia sẻ</CardTitle>
          <CardDescription>
            Tạo nhóm mới hoặc tham gia nhóm đã có để quản lý chi tiêu chung một cách minh bạch.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="border border-border/80 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Tạo nhóm mới</CardTitle>
            <CardDescription>Bạn sẽ nhận được mã mời để chia sẻ với thành viên khác.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateFamily} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Tên gia đình</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Ví dụ: Gia đình Hạnh Phúc"
                  required
                  disabled={loading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Đang tạo..." : "Tạo gia đình"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border border-border/80 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Tham gia nhóm</CardTitle>
            <CardDescription>Nhập mã mời từ người thân để vào nhóm hiện có.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleJoinFamily} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Mã mời</Label>
                <Input
                  id="code"
                  name="code"
                  placeholder="Nhập mã mời"
                  required
                  disabled={loading}
                />
              </div>
              <Button type="submit" variant="outline" className="w-full" disabled={loading}>
                {loading ? "Đang tham gia..." : "Tham gia gia đình"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

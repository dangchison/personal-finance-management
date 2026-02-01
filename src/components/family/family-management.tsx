"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">{family.name}</CardTitle>
                <CardDescription>Quản lý thành viên và chia sẻ chi tiêu</CardDescription>
              </div>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="icon" disabled={loading} title="Rời nhóm">
                    <LogOut className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Rời khỏi gia đình?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Bạn có chắc chắn muốn rời khỏi gia đình này? Bạn sẽ không còn quyền truy cập vào các giao dịch của gia đình nữa.
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
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Mã mời thành viên</p>
                <code className="text-lg font-bold tracking-wider break-all">{family.inviteCode}</code>
              </div>
              <Button variant="ghost" size="icon" onClick={copyInviteCode}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Users className="h-4 w-4" />
                Thành viên ({family.users?.length || 0})
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {(family.users || []).map((member) => (
                  <div key={member.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <Avatar>
                      <AvatarImage src={member.image || ""} />
                      <AvatarFallback>{member.name?.[0]?.toUpperCase() || "U"}</AvatarFallback>
                    </Avatar>
                    <div className="overflow-hidden">
                      <p className="font-medium truncate">{member.name || "Unnamed User"}</p>
                      <p className="text-xs text-muted-foreground truncate">{member.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-8">
      <Card>
        <CardHeader>
          <CardTitle>Gia đình & Chia sẻ</CardTitle>
          <CardDescription>
            Tạo hoặc tham gia một nhóm gia đình để quản lý chi tiêu chung.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="create" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="create">Tạo mới</TabsTrigger>
              <TabsTrigger value="join">Tham gia</TabsTrigger>
            </TabsList>

            <TabsContent value="create">
              <form onSubmit={handleCreateFamily} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Tên gia đình</Label>
                  <Input id="name" name="name" placeholder="Ví dụ: Gia đình Hạnh Phúc" required disabled={loading} />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Đang tạo..." : "Tạo Gia đình"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="join">
              <form onSubmit={handleJoinFamily} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Mã mời</Label>
                  <Input id="code" name="code" placeholder="Nhập mã mời từ người thân" required disabled={loading} />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Đang tham gia..." : "Tham gia"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Panel } from "@/components/ui/panel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { createFamily, joinFamily, leaveFamily } from "@/actions/family";
import { toast } from "sonner";
import { Copy, LogOut } from "lucide-react";
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
    const members = family.users || [];

    return (
      <div className="space-y-4">
        <header className="space-y-2">
          <span className="pf-mono inline-flex items-center gap-2 border border-border px-2.5 py-1 text-[11px] tracking-[0.16em] text-muted-foreground uppercase">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-(--pf-ok)" />
            Nhóm đang hoạt động
          </span>
          <h1 className="pf-display text-2xl font-bold tracking-tight text-foreground">{family.name}</h1>
          <p className="text-sm text-muted-foreground">
            Quản lý thành viên và chi tiêu chung của gia đình trong một nơi.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <Panel className="lg:col-span-8">
            <div className="pf-mono flex items-center justify-between gap-3 border-b border-border px-3 py-2 text-[10px] tracking-[0.14em] text-muted-foreground uppercase sm:px-4">
              <span>Thành viên ({members.length})</span>
              <span>Đồng bộ theo thời gian thực</span>
            </div>

            <div className="grid gap-px bg-border sm:grid-cols-2">
              {members.map((member) => (
                <div key={member.id} className="flex items-center gap-3 bg-card px-3 py-3">
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
              {/* Số thành viên lẻ: ô trống cuối lưới sẽ lộ nền bg-border thành mảng đặc, phải lấp bằng một ô nền card. */}
              {members.length % 2 === 1 && <div aria-hidden className="hidden bg-card sm:block" />}
            </div>
          </Panel>

          <div className="space-y-4 lg:col-span-4">
            <Panel plaque="Mã mời thành viên" className="px-4 pb-4">
              <p className="text-sm text-muted-foreground">Gửi mã này để mời người thân vào nhóm.</p>
              <button
                type="button"
                onClick={copyInviteCode}
                disabled={loading}
                title="Sao chép mã mời"
                className="mt-3 flex min-h-11 w-full items-center justify-between gap-3 rounded-none border border-border px-3 py-3 text-left transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--pf-expense)"
              >
                <code className="pf-mono text-sm font-semibold break-all tracking-[0.16em]">
                  {family.inviteCode}
                </code>
                <Copy className="h-4 w-4 shrink-0 text-muted-foreground" />
              </button>
            </Panel>

            <Panel plaque="Hành động nhóm" className="px-4 pb-4">
              <p className="text-sm text-muted-foreground">
                Rời nhóm khi bạn không còn nhu cầu theo dõi chi tiêu chung.
              </p>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="mt-3 w-full justify-start text-(--pf-over-ink) hover:text-(--pf-over-ink)"
                    disabled={loading}
                  >
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
                    <AlertDialogAction variant="destructive" onClick={handleLeaveFamily}>
                      Rời nhóm
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </Panel>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <header className="space-y-2">
        <h1 className="pf-display text-xl font-bold tracking-tight text-foreground">Gia đình & Chia sẻ</h1>
        <p className="text-sm text-muted-foreground">
          Tạo nhóm mới hoặc tham gia nhóm đã có để quản lý chi tiêu chung một cách minh bạch.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel plaque="Tạo nhóm mới" className="px-4 pb-4">
          <p className="text-sm text-muted-foreground">Bạn sẽ nhận được mã mời để chia sẻ với thành viên khác.</p>
          <form onSubmit={handleCreateFamily} className="mt-3 space-y-4">
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
            {/* pf-action: trên mobile nút này phải là outline vì FAB vàng đặc đã giữ suất "một nguồn sáng". */}
            <Button type="submit" className="pf-action w-full" disabled={loading}>
              {loading ? "Đang tạo..." : "Tạo gia đình"}
            </Button>
          </form>
        </Panel>

        <Panel plaque="Tham gia nhóm" className="px-4 pb-4">
          <p className="text-sm text-muted-foreground">Nhập mã mời từ người thân để vào nhóm hiện có.</p>
          <form onSubmit={handleJoinFamily} className="mt-3 space-y-4">
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
        </Panel>
      </div>
    </div>
  );
}

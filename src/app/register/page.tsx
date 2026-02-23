"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { registerUser } from "@/actions/auth";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await registerUser(formData);

    if (result?.error) {
      toast.error(result.error);
      setLoading(false);
      return;
    }

    toast.success("Tạo tài khoản thành công!");
    router.replace("/login");
    router.refresh();
  }

  return (
    <AuthShell
      mode="register"
      title="Tạo tài khoản mới"
      description="Bắt đầu quản lý tài chính cá nhân và gia đình chỉ trong vài bước."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-slate-700">
            Họ và tên
          </Label>
          <Input
            id="name"
            name="name"
            placeholder="Nguyễn Văn A"
            required
            disabled={loading}
            className="h-11 border-slate-300 bg-slate-50/60 text-slate-900 placeholder:text-slate-400 focus:border-blue-500"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-slate-700">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="john@example.com"
            required
            disabled={loading}
            className="h-11 border-slate-300 bg-slate-50/60 text-slate-900 placeholder:text-slate-400 focus:border-blue-500"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-slate-700">
            Mật khẩu
          </Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              disabled={loading}
              className="h-11 border-slate-300 bg-slate-50/60 pr-11 text-slate-900 focus:border-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-slate-700"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <Button type="submit" disabled={loading} className="h-11 w-full bg-blue-600 text-white hover:bg-blue-500">
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Đang tạo tài khoản...
            </span>
          ) : (
            "Đăng ký"
          )}
        </Button>

        <p className="text-center text-sm text-slate-600">
          Đã có tài khoản?{" "}
          <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-500">
            Đăng nhập ngay
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}

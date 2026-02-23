"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthShell } from "@/components/auth/auth-shell";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    const res = await signIn("credentials", {
      redirect: false,
      username,
      password,
      rememberMe: rememberMe.toString(),
    });

    if (res?.error) {
      toast.error(res.error);
      setLoading(false);
      return;
    }

    toast.success("Đăng nhập thành công!");
    router.replace(callbackUrl);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="username" className="text-slate-700">
          Tên đăng nhập hoặc email
        </Label>
        <Input
          id="username"
          name="username"
          type="text"
          placeholder="admin hoặc john@example.com"
          required
          autoCapitalize="none"
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

      <div className="flex items-center gap-2">
        <Checkbox
          id="remember"
          checked={rememberMe}
          onCheckedChange={(checked) => setRememberMe(checked === true)}
          disabled={loading}
        />
        <Label htmlFor="remember" className="cursor-pointer text-sm text-slate-600">
          Ghi nhớ đăng nhập
        </Label>
      </div>

      <Button type="submit" disabled={loading} className="h-11 w-full bg-blue-600 text-white hover:bg-blue-500">
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Đang đăng nhập...
          </span>
        ) : (
          "Đăng nhập"
        )}
      </Button>

      <p className="text-center text-sm text-slate-600">
        Chưa có tài khoản?{" "}
        <Link href="/register" className="font-semibold text-blue-600 hover:text-blue-500">
          Đăng ký ngay
        </Link>
      </p>
    </form>
  );
}

function LoginFormFallback() {
  return (
    <div className="flex h-40 items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-slate-500" />
    </div>
  );
}

export default function LoginPage() {
  return (
    <AuthShell
      mode="login"
      title="Chào mừng quay lại"
      description="Đăng nhập để tiếp tục theo dõi giao dịch và ngân sách của bạn."
    >
      <Suspense fallback={<LoginFormFallback />}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}

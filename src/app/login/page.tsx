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
import { authErrorMessage } from "@/lib/auth-errors";

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
      // res.error là mã lỗi, không phải câu để hiện thẳng cho người dùng
      toast.error(authErrorMessage(res.error));
      setLoading(false);
      return;
    }

    toast.success("Xong, mở sổ đây");
    router.replace(callbackUrl);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="username" className="pf-mono text-[11px] tracking-[0.14em] text-(--text-steel)">
          TÊN ĐĂNG NHẬP HOẶC EMAIL
        </Label>
        <Input
          id="username"
          name="username"
          type="text"
          placeholder="ten_dang_nhap hoặc ban@email.com"
          required
          autoCapitalize="none"
          autoComplete="username"
          disabled={loading}
          className="h-12 rounded-sm border-(--steel) bg-(--vacuum) text-(--text-bright) placeholder:text-(--text-steel)/60"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="pf-mono text-[11px] tracking-[0.14em] text-(--text-steel)">
          MẬT KHẨU
        </Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            autoComplete="current-password"
            disabled={loading}
            className="h-12 rounded-sm border-(--steel) bg-(--vacuum) pr-12 text-(--text-bright)"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute top-1/2 right-1 flex h-11 w-11 -translate-y-1/2 items-center justify-center text-(--text-steel) transition-colors hover:text-(--track-yellow)"
            aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
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
        <Label htmlFor="remember" className="cursor-pointer text-sm text-(--text-steel)">
          Giữ tôi đăng nhập trên máy này
        </Label>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="pf-display h-12 w-full rounded-sm bg-(--track-yellow) text-base font-bold tracking-wide text-(--vacuum) hover:bg-(--track-yellow)/90"
      >
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Đang mở sổ...
          </span>
        ) : (
          "MỞ SỔ"
        )}
      </Button>

      <p className="text-center text-sm text-(--text-steel)">
        Chưa có tài khoản?{" "}
        <Link href="/register" className="font-semibold text-(--track-yellow) hover:underline">
          Tạo một cái, mất 1 phút
        </Link>
      </p>
    </form>
  );
}

function LoginFormFallback() {
  return (
    <div className="flex h-40 items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-(--track-yellow)" />
    </div>
  );
}

export default function LoginPage() {
  return (
    <AuthShell
      mode="login"
      title="Mở sổ của bạn"
      description="Đăng nhập để xem tháng này tiền đi đâu và ngân sách còn bao nhiêu."
    >
      <Suspense fallback={<LoginFormFallback />}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}

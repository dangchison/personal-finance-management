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

const fieldClass =
  "h-12 rounded-sm border-(--steel) bg-(--vacuum) text-(--text-bright) placeholder:text-(--text-steel)/60";
const labelClass = "pf-mono text-[11px] tracking-[0.14em] text-(--text-steel)";

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

    toast.success("Tài khoản xong rồi, đăng nhập thôi");
    router.replace("/login");
    router.refresh();
  }

  return (
    <AuthShell
      mode="register"
      title="Mở sổ mới"
      description="Email và mật khẩu là đủ. Không thẻ, không phí, không quảng cáo."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="name" className={labelClass}>
            HỌ VÀ TÊN
          </Label>
          <Input
            id="name"
            name="name"
            placeholder="Nguyễn Văn A"
            required
            autoComplete="name"
            disabled={loading}
            className={fieldClass}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className={labelClass}>
            EMAIL
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="ban@email.com"
            required
            autoCapitalize="none"
            autoComplete="email"
            disabled={loading}
            className={fieldClass}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="username" className={labelClass}>
            TÊN ĐĂNG NHẬP <span className="normal-case">(tuỳ chọn)</span>
          </Label>
          <Input
            id="username"
            name="username"
            placeholder="vidu: sondc"
            autoCapitalize="none"
            autoComplete="username"
            pattern="[A-Za-z0-9_.]{3,24}"
            title="3-24 ký tự, chỉ chữ, số, dấu _ và ."
            disabled={loading}
            className={fieldClass}
          />
          <p className="text-xs text-(--text-steel)/80">
            Đặt tên này thì lần sau đăng nhập gõ nó thay cho email cũng được.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className={labelClass}>
            MẬT KHẨU
          </Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              minLength={6}
              autoComplete="new-password"
              disabled={loading}
              className={`${fieldClass} pr-12`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute top-1/2 right-1 flex h-11 w-11 -translate-y-1/2 items-center justify-center text-(--text-steel) transition-colors hover:text-(--track-yellow-ink)"
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <p className="text-xs text-(--text-steel)/80">Từ 6 ký tự trở lên.</p>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="pf-display h-12 w-full rounded-sm bg-(--track-yellow) text-base font-bold tracking-wide text-(--pf-on-signal) hover:bg-(--track-yellow)/90"
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Đang tạo tài khoản...
            </span>
          ) : (
            "TẠO TÀI KHOẢN"
          )}
        </Button>

        <p className="text-center text-sm text-(--text-steel)">
          Đã có tài khoản?{" "}
          <Link href="/login" className="font-semibold text-(--track-yellow-ink) hover:underline">
            Đăng nhập
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}

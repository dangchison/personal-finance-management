import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, BarChart3, Shield, Users, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AuthShellProps {
  mode: "login" | "register";
  title: string;
  description: string;
  children: ReactNode;
}

const highlights = [
  {
    icon: BarChart3,
    title: "Báo cáo rõ ràng",
    description: "Theo dõi xu hướng chi tiêu và phân tích theo danh mục.",
  },
  {
    icon: Users,
    title: "Làm việc theo gia đình",
    description: "Tách giao dịch cá nhân và giao dịch chung linh hoạt.",
  },
  {
    icon: Shield,
    title: "Kiểm soát truy cập",
    description: "Luồng xác thực và phân quyền rõ ràng theo tài khoản.",
  },
];

export function AuthShell({ mode, title, description, children }: AuthShellProps) {
  const isLogin = mode === "login";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f3f7fc]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-16 h-72 w-72 rounded-full bg-cyan-200/70 blur-3xl" />
        <div className="absolute top-32 -right-20 h-80 w-80 rounded-full bg-blue-200/70 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-emerald-200/60 blur-3xl" />
      </div>

      <div className="relative z-10">
        <header className="border-b border-slate-200/80 bg-white/75 backdrop-blur-xl">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-md">
                <Wallet className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold tracking-tight text-slate-900">Personal Finance</p>
                <p className="text-xs text-slate-500">Quản lý chi tiêu thông minh</p>
              </div>
            </Link>

            <Button variant="ghost" asChild className="text-slate-700 hover:bg-slate-100">
              <Link href={isLogin ? "/register" : "/login"}>
                {isLogin ? "Tạo tài khoản" : "Đăng nhập"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </header>

        <section className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-16">
          <aside className="hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)] lg:block">
            <div className="mb-8 space-y-3">
              <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
                Nền tảng tài chính cá nhân
              </span>
              <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
                Kiểm soát chi tiêu mỗi ngày
              </h2>
              <p className="text-sm leading-relaxed text-slate-600">
                Giao diện hiện đại, thao tác nhanh, tối ưu để bạn cập nhật giao dịch và theo dõi ngân sách dễ dàng.
              </p>
            </div>

            <div className="space-y-4">
              {highlights.map((item) => (
                <div key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white">
                    <item.icon className="h-4 w-4 text-slate-700" />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">{item.description}</p>
                </div>
              ))}
            </div>
          </aside>

          <div className="mx-auto w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_24px_70px_-40px_rgba(30,64,175,0.45)] sm:p-8">
            <div className="mb-6 space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900">{title}</h1>
              <p className="text-sm text-slate-600">{description}</p>
            </div>
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}

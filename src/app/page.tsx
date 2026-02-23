"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BarChart3, CheckCircle2, PiggyBank, Shield, Smartphone, TrendingUp, Users, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: TrendingUp,
    title: "Ghi chi tiêu nhanh",
    description: "Nhập giao dịch trong vài giây, tự động nhóm theo ngày để dễ theo dõi.",
    className: "md:col-span-2",
  },
  {
    icon: PiggyBank,
    title: "Giữ ngân sách đúng nhịp",
    description: "Theo dõi mức dùng ngân sách từng danh mục theo thời gian thực.",
    className: "",
  },
  {
    icon: BarChart3,
    title: "Báo cáo rõ ràng",
    description: "Xem xu hướng 6 tháng và biết chính xác tiền đang đi đâu.",
    className: "",
  },
  {
    icon: Users,
    title: "Quản lý gia đình",
    description: "Tạo nhóm, mời thành viên và phân tách giao dịch cá nhân/gia đình.",
    className: "",
  },
  {
    icon: Shield,
    title: "An toàn dữ liệu",
    description: "Quyền truy cập được kiểm soát theo tài khoản và phạm vi sử dụng.",
    className: "md:col-span-2",
  },
  {
    icon: Smartphone,
    title: "Tối ưu mọi thiết bị",
    description: "Giao diện gọn gàng trên điện thoại, rộng rãi trên desktop.",
    className: "",
  },
];

const steps = [
  {
    title: "Tạo tài khoản",
    description: "Đăng ký trong 1 phút và chọn phạm vi theo dõi cá nhân hoặc gia đình.",
  },
  {
    title: "Thêm giao dịch",
    description: "Nhập chi tiêu hằng ngày, lọc theo danh mục và thành viên ngay trên dashboard.",
  },
  {
    title: "Theo dõi tiến độ",
    description: "Kiểm tra báo cáo, điều chỉnh ngân sách và tối ưu thói quen chi tiêu mỗi tháng.",
  },
];

function FadeIn({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.45, delay }}
    >
      {children}
    </motion.div>
  );
}

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#f3f7fc] text-slate-900">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-20 h-72 w-72 rounded-full bg-cyan-200/70 blur-3xl" />
        <div className="absolute top-36 -right-20 h-80 w-80 rounded-full bg-blue-200/70 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-emerald-200/60 blur-3xl" />
      </div>

      <div className="relative z-10">
        <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-md">
                <Wallet className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold tracking-tight">Personal Finance</p>
                <p className="text-xs text-slate-500">Quản lý chi tiêu thông minh</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild className="text-slate-700 hover:bg-slate-100">
                <Link href="/login">Đăng nhập</Link>
              </Button>
              <Button asChild className="bg-blue-600 text-white hover:bg-blue-500">
                <Link href="/register">Dùng thử ngay</Link>
              </Button>
            </div>
          </div>
        </header>

        <section className="mx-auto grid w-full max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-24">
          <FadeIn>
            <div className="space-y-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                <CheckCircle2 className="h-4 w-4" />
                Gọn, rõ, dễ dùng mỗi ngày
              </div>

              <h1 className="text-4xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Kiểm soát chi tiêu
                <br />
                theo cách hiện đại
              </h1>

              <p className="max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
                Tập trung vào điều quan trọng nhất: biết tiền đang đi đâu, còn bao nhiêu ngân sách,
                và cần điều chỉnh gì để đạt mục tiêu tài chính.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button size="lg" asChild className="h-12 bg-blue-600 px-8 text-white hover:bg-blue-500">
                  <Link href="/register">
                    Bắt đầu miễn phí
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="h-12 border-slate-300 px-8 text-slate-800 hover:bg-slate-50">
                  <Link href="/login">Mình đã có tài khoản</Link>
                </Button>
              </div>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-600">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  100% miễn phí
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-blue-500" />
                  Không cần thẻ tín dụng
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-cyan-500" />
                  Dùng ngay trong 1 phút
                </span>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)] sm:p-6">
              <div className="mb-5 flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-700">Dashboard tháng hiện tại</p>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">Live overview</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Chi tiêu tháng này</p>
                  <p className="mt-2 text-xl font-semibold text-red-600">12.450.000 ₫</p>
                  <p className="mt-1 text-xs text-slate-500">+8% so với tháng trước</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Ngân sách còn lại</p>
                  <p className="mt-2 text-xl font-semibold text-emerald-600">3.550.000 ₫</p>
                  <p className="mt-1 text-xs text-slate-500">72% ngân sách đã dùng</p>
                </div>
              </div>

              <div className="mt-4 space-y-3 rounded-2xl border border-slate-200 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Ăn uống</span>
                  <span className="font-medium">4.300.000 ₫</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100">
                  <div className="h-2 w-[68%] rounded-full bg-blue-500" />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Di chuyển</span>
                  <span className="font-medium">1.620.000 ₫</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100">
                  <div className="h-2 w-[42%] rounded-full bg-cyan-500" />
                </div>
              </div>
            </div>
          </FadeIn>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-3xl font-semibold text-slate-900">24/7</p>
              <p className="mt-1 text-sm text-slate-500">Theo dõi tài chính mọi lúc</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-3xl font-semibold text-slate-900">2 chế độ</p>
              <p className="mt-1 text-sm text-slate-500">Cá nhân và gia đình linh hoạt</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-3xl font-semibold text-slate-900">6 tháng</p>
              <p className="mt-1 text-sm text-slate-500">Báo cáo xu hướng trực quan</p>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <FadeIn>
            <div className="mb-10 space-y-3">
              <p className="text-sm font-semibold uppercase tracking-wider text-blue-700">Tính năng nổi bật</p>
              <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                Đủ mạnh để quản lý tài chính, đủ gọn để dùng mỗi ngày
              </h2>
            </div>
          </FadeIn>

          <div className="grid gap-4 md:grid-cols-3">
            {features.map((feature, index) => (
              <FadeIn key={feature.title} delay={index * 0.04}>
                <div className={`h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ${feature.className}`}>
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
                    <feature.icon className="h-5 w-5 text-slate-700" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{feature.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <FadeIn>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
              <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-wider text-blue-700">Cách hoạt động</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Bắt đầu nhanh trong 3 bước</h2>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                {steps.map((step, index) => (
                  <div key={step.title} className="space-y-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                      {index + 1}
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">{step.title}</h3>
                    <p className="text-sm leading-relaxed text-slate-600">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 pb-24 sm:px-6">
          <FadeIn>
            <div className="rounded-3xl border border-blue-200 bg-gradient-to-r from-blue-600 to-cyan-600 p-8 text-white sm:p-12">
              <div className="max-w-3xl space-y-5">
                <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  Sẵn sàng làm chủ tài chính của bạn?
                </h2>
                <p className="text-white/90">
                  Tạo tài khoản miễn phí và bắt đầu ghi chép giao dịch đầu tiên ngay hôm nay.
                </p>
                <Button size="lg" asChild className="h-12 bg-white px-8 text-blue-700 hover:bg-slate-100">
                  <Link href="/register">
                    Đăng ký miễn phí
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </FadeIn>
        </section>
      </div>
    </div>
  );
}

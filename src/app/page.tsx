"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  PiggyBank,
  BarChart3,
  Users,
  Shield,
  Smartphone,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

function FadeInSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  );
}

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-cyan-500 via-teal-600 to-emerald-600 animate-gradient-xy" />

      {/* Animated Shapes */}
      <div className="fixed top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse" />
      <div className="fixed bottom-20 right-20 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl animate-pulse delay-700" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl animate-pulse delay-1000" />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="backdrop-blur-xl bg-white/10 border-b border-white/20 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-lg">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Quản lý Chi tiêu</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <Button
                variant="ghost"
                asChild
                className="text-white hover:bg-white/20 hover:text-white transition-all duration-300"
              >
                <Link href="/login">Đăng nhập</Link>
              </Button>
              <Button
                asChild
                className="bg-white text-cyan-600 hover:bg-white/90 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Link href="/register">Đăng ký ngay</Link>
              </Button>
            </motion.div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-5xl mx-auto text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-sm">
                <Sparkles className="h-4 w-4" />
                <span>Quản lý tài chính thông minh</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
                Kiểm soát chi tiêu,
                <br />
                <span className="bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent">
                  Đạt mục tiêu tài chính
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                Ghi chép chi tiêu, lập ngân sách và theo dõi tài chính gia đình một cách dễ dàng với giao diện hiện đại
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button
                size="lg"
                className="text-lg h-14 px-10 bg-white text-cyan-600 hover:bg-white/90 shadow-2xl hover:shadow-xl hover:scale-105 transition-all duration-300"
                asChild
              >
                <Link href="/register">
                  Bắt đầu miễn phí
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg h-14 px-10 border-2 border-white/30 bg-white/10 text-white hover:text-white hover:bg-white/20 backdrop-blur-sm hover:scale-105 transition-all duration-300"
                asChild
              >
                <Link href="/login">Đăng nhập</Link>
              </Button>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="pt-12"
            >
              <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 border border-white/20 shadow-2xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center space-y-2">
                    <div className="text-5xl font-bold text-white">100%</div>
                    <div className="text-white/80 text-lg">Miễn phí sử dụng</div>
                  </div>
                  <div className="text-center space-y-2">
                    <Shield className="h-12 w-12 mx-auto text-white" />
                    <div className="text-white/80 text-lg">Bảo mật tuyệt đối</div>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="text-5xl font-bold text-white">24/7</div>
                    <div className="text-white/80 text-lg">Truy cập mọi lúc</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-20">
          <div className="container mx-auto px-4">
            <FadeInSection>
              <div className="text-center space-y-4 mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-white">
                  Tính năng nổi bật
                </h2>
                <p className="text-xl text-white/80 max-w-2xl mx-auto">
                  Mọi công cụ bạn cần để quản lý tài chính cá nhân và gia đình
                </p>
              </div>
            </FadeInSection>

            <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: TrendingUp,
                  title: "Theo dõi chi tiêu",
                  description: "Ghi chép và phân loại chi tiêu hàng ngày một cách dễ dàng, nhanh chóng",
                  delay: 0,
                },
                {
                  icon: PiggyBank,
                  title: "Quản lý ngân sách",
                  description: "Thiết lập và theo dõi ngân sách theo từng danh mục, tránh chi tiêu vượt mức",
                  delay: 0.1,
                },
                {
                  icon: BarChart3,
                  title: "Báo cáo trực quan",
                  description: "Biểu đồ và thống kê chi tiết giúp bạn hiểu rõ thói quen chi tiêu của mình",
                  delay: 0.2,
                },
                {
                  icon: Users,
                  title: "Quản lý gia đình",
                  description: "Chia sẻ và theo dõi chi tiêu cùng người thân, quản lý tài chính gia đình hiệu quả",
                  delay: 0.3,
                },
                {
                  icon: Shield,
                  title: "Bảo mật cao",
                  description: "Dữ liệu được mã hóa và bảo vệ an toàn, bạn hoàn toàn yên tâm",
                  delay: 0.4,
                },
                {
                  icon: Smartphone,
                  title: "Giao diện thân thiện",
                  description: "Thiết kế hiện đại, dễ sử dụng trên mọi thiết bị, từ di động đến máy tính",
                  delay: 0.5,
                },
              ].map((feature, index) => (
                <FadeInSection key={index} delay={feature.delay}>
                  <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-2xl h-full">
                    <div className="space-y-4">
                      <div className="h-14 w-14 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                        <feature.icon className="h-7 w-7 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                      <p className="text-white/80 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </FadeInSection>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto">
            <FadeInSection>
              <div className="text-center space-y-4 mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-white">
                  Tại sao nên chọn chúng tôi?
                </h2>
              </div>
            </FadeInSection>

            <div className="space-y-6">
              {[
                {
                  title: "Tiết kiệm thời gian",
                  description: "Giao diện đơn giản, thao tác nhanh chóng. Chỉ vài giây để ghi chép mỗi giao dịch.",
                  delay: 0,
                },
                {
                  title: "Kiểm soát tài chính tốt hơn",
                  description: "Biết rõ tiền đi đâu, chi bao nhiêu. Nhận thông báo khi sắp vượt ngân sách.",
                  delay: 0.1,
                },
                {
                  title: "Đạt mục tiêu nhanh hơn",
                  description: "Theo dõi tiến độ, điều chỉnh chi tiêu kịp thời để đạt được mục tiêu tài chính của bạn.",
                  delay: 0.2,
                },
              ].map((benefit, index) => (
                <FadeInSection key={index} delay={benefit.delay}>
                  <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <CheckCircle2 className="h-7 w-7 text-white mt-1 flex-shrink-0" />
                      <div className="space-y-2">
                        <h3 className="text-2xl font-semibold text-white">{benefit.title}</h3>
                        <p className="text-white/80 text-lg leading-relaxed">{benefit.description}</p>
                      </div>
                    </div>
                  </div>
                </FadeInSection>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-20 pb-32">
          <div className="container mx-auto px-4">
            <FadeInSection>
              <div className="max-w-4xl mx-auto">
                <div className="backdrop-blur-xl bg-white/20 rounded-3xl p-12 border border-white/30 shadow-2xl text-center space-y-8">
                  <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                    Bắt đầu quản lý tài chính ngay hôm nay
                  </h2>
                  <p className="text-xl text-white/90 leading-relaxed">
                    Hoàn toàn miễn phí. Không cần thẻ tín dụng. <br />
                    Chỉ mất 1 phút để tạo tài khoản.
                  </p>
                  <Button
                    size="lg"
                    className="text-lg h-16 px-12 bg-white text-cyan-600 hover:bg-white/90 shadow-2xl hover:shadow-xl hover:scale-105 transition-all duration-300"
                    asChild
                  >
                    <Link href="/register">
                      Đăng ký miễn phí
                      <ArrowRight className="ml-2 h-6 w-6" />
                    </Link>
                  </Button>
                </div>
              </div>
            </FadeInSection>
          </div>
        </section>
      </div>
    </div>
  );
}

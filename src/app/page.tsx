"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  TrendingUp,
  PiggyBank,
  BarChart3,
  Users,
  Shield,
  Smartphone,
  ArrowRight,
  CheckCircle2,
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Quản lý Chi tiêu</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Đăng nhập</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Đăng ký ngay</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent leading-tight md:leading-tight">
              Quản lý tài chính thông minh, đơn giản
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Kiểm soát chi tiêu, lập ngân sách và đạt mục tiêu tài chính của bạn một cách dễ dàng
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button size="lg" className="text-lg h-14 px-8" asChild>
              <Link href="/register">
                Bắt đầu ngay
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg h-14 px-8" asChild>
              <Link href="/login">Đăng nhập</Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="pt-8"
          >
            <div className="relative max-w-3xl mx-auto">
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
              <div className="relative bg-card border rounded-2xl p-8 shadow-2xl">
                <div className="grid grid-cols-3 gap-8 text-center">
                  <div>
                    <div className="text-3xl font-bold text-primary">100%</div>
                    <div className="text-sm text-muted-foreground">Miễn phí</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary">
                      <Shield className="h-8 w-8 mx-auto" />
                    </div>
                    <div className="text-sm text-muted-foreground">Bảo mật</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary">24/7</div>
                    <div className="text-sm text-muted-foreground">Truy cập</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <FadeInSection>
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl md:text-4xl font-bold">
                Tính năng nổi bật
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
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
                <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg h-full">
                  <CardContent className="pt-6 space-y-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
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
              <h2 className="text-3xl md:text-4xl font-bold">
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
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-20 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10">
        <div className="container mx-auto px-4">
          <FadeInSection>
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <h2 className="text-3xl md:text-5xl font-bold">
                Bắt đầu quản lý tài chính ngay hôm nay
              </h2>
              <p className="text-xl text-muted-foreground">
                Hoàn toàn miễn phí. Không cần thẻ tín dụng. Chỉ mất 1 phút để tạo tài khoản.
              </p>
              <Button size="lg" className="text-lg h-14 px-12" asChild>
                <Link href="/register">
                  Đăng ký miễn phí
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </FadeInSection>
        </div>
      </section>
    </div>
  );
}

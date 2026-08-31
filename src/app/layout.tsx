import type { Metadata } from "next";
import "./globals.css";
import "./nprogress.css";
import { AuthProvider } from "@/components/providers/auth-provider";
import { Toaster } from "@/components/ui/sonner";
import { ProgressBarProvider } from "@/components/providers/progress-bar-provider";
import { ThemeProvider, THEME_BOOTSTRAP } from "@/components/providers/theme-provider";
import { pfFontVars } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Personal Finance — Sổ dòng tiền của bạn",
  description:
    "Ghi chi tiêu trong vài giây, đặt ngân sách theo danh mục, xem tiền tháng này đi đâu. Tiếng Việt, VND, miễn phí.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        {/* Đặt theme trước khi vẽ. Ở <head> chứ không phải trong <body>: một
            element script nằm trong cây React của body làm lệch bộ đếm useId
            và sinh hydration mismatch cho mọi component Radix phía sau. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP }} />
      </head>
      {/* pfFontVars phải ở <body>: Dialog/Sheet/Select render qua portal ra
          document.body nên nếu đặt font ở lớp sâu hơn thì portal mất font. */}
      <body className={`${pfFontVars} antialiased`}>
        <ProgressBarProvider />
        <AuthProvider>
          <ThemeProvider>
            {children}
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md space-y-5 rounded-2xl border border-border bg-card p-6 text-center shadow-sm sm:p-8">
        <p className="font-mono text-sm text-muted-foreground">404</p>
        <h1 className="text-xl font-semibold text-foreground">
          Không có trang này
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Đường dẫn bạn mở không tồn tại hoặc đã đổi.
        </p>
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button asChild className="h-11">
            <Link href="/dashboard">Về dashboard</Link>
          </Button>
          <Button variant="outline" asChild className="h-11">
            <Link href="/">Về trang chủ</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}

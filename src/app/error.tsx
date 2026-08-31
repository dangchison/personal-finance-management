"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Chỉ hiện câu chung và mã digest. Không bao giờ render error.message —
 * client không cần biết truy vấn nào hỏng hay thiếu biến môi trường nào.
 */
export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app] lỗi không bắt được:", error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md space-y-5 rounded-2xl border border-border bg-card p-6 text-center shadow-sm sm:p-8">
        <h1 className="text-xl font-semibold text-foreground">
          Trang này đang không tải được
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Lỗi nằm ở phía máy chủ, không phải do bạn thao tác sai. Thử tải lại;
          nếu vẫn vậy thì đợi ít phút rồi quay lại.
        </p>

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button onClick={reset} className="h-11">
            <RotateCw className="mr-2 h-4 w-4" />
            Thử lại
          </Button>
          <Button variant="outline" asChild className="h-11">
            <Link href="/dashboard">Về dashboard</Link>
          </Button>
        </div>

        {error.digest && (
          <p className="font-mono text-xs text-muted-foreground">
            Mã lỗi: {error.digest}
          </p>
        )}
      </div>
    </main>
  );
}

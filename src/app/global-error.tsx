"use client";

import { useEffect } from "react";

/** Lưới an toàn cuối cùng: chạy khi chính root layout hỏng, nên phải tự dựng html/body. */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app] lỗi ở root layout:", error);
  }, [error]);

  return (
    <html lang="vi">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0b0f14",
          color: "#e8eef5",
          fontFamily: "system-ui, sans-serif",
          padding: "1rem",
        }}
      >
        <div style={{ maxWidth: "28rem", textAlign: "center" }}>
          <h1 style={{ fontSize: "1.25rem", marginBottom: "0.75rem" }}>
            Ứng dụng đang gặp sự cố
          </h1>
          <p style={{ fontSize: "0.875rem", lineHeight: 1.6, color: "#a7b3c2" }}>
            Thử tải lại trang. Nếu vẫn vậy thì đợi ít phút rồi quay lại.
          </p>
          <button
            onClick={reset}
            style={{
              marginTop: "1.25rem",
              minHeight: "44px",
              padding: "0 1.5rem",
              borderRadius: "6px",
              border: "none",
              background: "#ffd23a",
              color: "#0b0f14",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Thử lại
          </button>
          {error.digest && (
            <p style={{ marginTop: "1rem", fontSize: "0.75rem", color: "#6b7686" }}>
              Mã lỗi: {error.digest}
            </p>
          )}
        </div>
      </body>
    </html>
  );
}

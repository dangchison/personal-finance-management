/**
 * Mã lỗi đăng nhập dùng chung cho server và client.
 * Server chỉ được ném đúng các mã này — chi tiết thật (stack, tên biến môi
 * trường, câu truy vấn) ở lại log server, không bao giờ gửi xuống trình duyệt.
 */
export const AUTH_ERROR = {
  INVALID_CREDENTIALS: "InvalidCredentials",
  SERVICE_UNAVAILABLE: "ServiceUnavailable",
} as const;

const MESSAGES: Record<string, string> = {
  [AUTH_ERROR.INVALID_CREDENTIALS]: "Tên đăng nhập hoặc mật khẩu chưa đúng.",
  // NextAuth tự trả mã này khi authorize trả null
  CredentialsSignin: "Tên đăng nhập hoặc mật khẩu chưa đúng.",
  [AUTH_ERROR.SERVICE_UNAVAILABLE]:
    "Hệ thống đang không truy cập được dữ liệu. Thử lại sau ít phút giúp mình.",
};

/** Đổi mã lỗi thành câu tiếng Việt; mã lạ thì trả câu chung, không hiện nguyên văn. */
export function authErrorMessage(code: string | null | undefined): string {
  if (!code) return "Đăng nhập không được. Thử lại giúp mình.";
  return MESSAGES[code] ?? "Đăng nhập không được. Thử lại giúp mình.";
}

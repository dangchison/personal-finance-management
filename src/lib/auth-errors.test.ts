import { describe, expect, it } from "vitest";
import { AUTH_ERROR, authErrorMessage } from "./auth-errors";

describe("authErrorMessage", () => {
  it("đổi mã sai thông tin đăng nhập thành câu tiếng Việt", () => {
    expect(authErrorMessage(AUTH_ERROR.INVALID_CREDENTIALS)).toContain("chưa đúng");
    expect(authErrorMessage("CredentialsSignin")).toContain("chưa đúng");
  });

  it("đổi mã lỗi hạ tầng thành câu chung, không nhắc chi tiết kỹ thuật", () => {
    const msg = authErrorMessage(AUTH_ERROR.SERVICE_UNAVAILABLE);
    expect(msg).toContain("Thử lại sau");
    expect(msg).not.toMatch(/prisma|DATABASE_URL|invocation/i);
  });

  it("không hiện nguyên văn mã lạ hay stack trace lọt xuống client", () => {
    const leak =
      'Invalid `prisma.user.findFirst()` invocation ... DATABASE_URL ... schema.prisma:10';
    const msg = authErrorMessage(leak);
    expect(msg).toBe("Đăng nhập không được. Thử lại giúp mình.");
    expect(msg).not.toContain("prisma");
  });

  it("mã rỗng vẫn có câu để hiện", () => {
    expect(authErrorMessage(undefined)).toBeTruthy();
    expect(authErrorMessage(null)).toBeTruthy();
  });
});

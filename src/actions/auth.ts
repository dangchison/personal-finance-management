"use server";

import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

const USERNAME_RE = /^[a-z0-9_.]{3,24}$/;

export async function registerUser(formData: FormData) {
  const email = ((formData.get("email") as string) || "").trim().toLowerCase();
  const password = (formData.get("password") as string) || "";
  const name = ((formData.get("name") as string) || "").trim();
  const rawUsername = ((formData.get("username") as string) || "").trim().toLowerCase();

  if (!email || !password) {
    return { error: "Cần email và mật khẩu" };
  }

  if (password.length < 6) {
    return { error: "Mật khẩu phải từ 6 ký tự trở lên" };
  }

  // Username là tuỳ chọn, nhưng nếu nhập thì phải hợp lệ vì login cho đăng nhập bằng nó
  if (rawUsername && !USERNAME_RE.test(rawUsername)) {
    return { error: "Tên đăng nhập chỉ gồm chữ thường, số, dấu _ và . (3-24 ký tự)" };
  }

  const existingEmail = await prisma.user.findUnique({ where: { email } });
  if (existingEmail) {
    return { error: "Email này đã có tài khoản rồi" };
  }

  if (rawUsername) {
    const existingUsername = await prisma.user.findUnique({
      where: { username: rawUsername },
    });
    if (existingUsername) {
      return { error: "Tên đăng nhập này có người dùng rồi, chọn tên khác nhé" };
    }
  }

  const passwordHash = await bcrypt.hash(password, 10);

  try {
    await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        username: rawUsername || null,
      },
    });

    return { success: true };
  } catch {
    return { error: "Tạo tài khoản không được, thử lại giúp mình" };
  }
}

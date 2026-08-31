import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { NextAuthOptions } from "next-auth";
import { Adapter } from "next-auth/adapters";
import { AUTH_ERROR } from "@/lib/auth-errors";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Username or Email", type: "text" },
        password: { label: "Password", type: "password" },
        rememberMe: { label: "Remember Me", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error(AUTH_ERROR.INVALID_CREDENTIALS);
        }

        let user;
        try {
          user = await prisma.user.findFirst({
            where: {
              OR: [
                { email: credentials.username },
                { username: credentials.username }
              ]
            },
          });
        } catch (error) {
          // Mất DB, sai cấu hình, timeout... chỉ log ở server rồi trả mã chung
          console.error("[auth] không truy vấn được user:", error);
          throw new Error(AUTH_ERROR.SERVICE_UNAVAILABLE);
        }

        // Cùng một câu trả lời cho "không có user" và "sai mật khẩu",
        // để không lộ email nào đã đăng ký
        if (!user || !user.passwordHash) {
          throw new Error(AUTH_ERROR.INVALID_CREDENTIALS);
        }

        let isPasswordCorrect = false;
        try {
          isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.passwordHash
          );
        } catch (error) {
          console.error("[auth] so khớp mật khẩu lỗi:", error);
          throw new Error(AUTH_ERROR.SERVICE_UNAVAILABLE);
        }

        if (!isPasswordCorrect) {
          throw new Error(AUTH_ERROR.INVALID_CREDENTIALS);
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          username: user.username,
          role: user.role,
          rememberMe: credentials.rememberMe === "true",
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days (Cookie max persistence)
  },
  pages: {
    signIn: "/login",
    signOut: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.role = user.role;
        token.username = user.username;
        // Handle remember me
        const rememberMe = user.rememberMe;
        const now = Math.floor(Date.now() / 1000);

        if (rememberMe) {
          token.exp = now + 30 * 24 * 60 * 60; // 30 days
        } else {
          token.exp = now + 24 * 60 * 60; // 1 day default
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.role = token.role;
        session.user.username = token.username;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

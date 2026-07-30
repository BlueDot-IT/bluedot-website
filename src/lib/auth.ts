// src/lib/auth.ts
import { getServerSession } from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { isAdminEmail, trustedClientIdentity } from "@/lib/securityConfig";
import { clearLoginFailures, isLoginBlocked, recordLoginFailure } from "@/lib/rateLimit";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" as const }, // Use JWT for better compatibility
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, request) {
        const username = credentials?.username?.trim();
        const password = credentials?.password || "";
        if (!username || !password) return null;

        const account = username.toLowerCase();
        const clientIdentity = trustedClientIdentity(request.headers ?? {});
        if (!clientIdentity) return null;

        try {
          if (await isLoginBlocked(clientIdentity, account)) return null;
        } catch (error) {
          console.error("Login protection unavailable:", error);
          return null;
        }

        const user = await prisma.user.findFirst({ where: { username } });
        if (!user || !user.password) {
          await recordLoginFailure(clientIdentity, account);
          return null;
        }

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) {
          await recordLoginFailure(clientIdentity, account);
          return null;
        }

        await clearLoginFailures(clientIdentity, account);

        return {
          id: String(user.id),
          name: user.username ?? undefined,
          email: user.email ?? undefined,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
      }
      token.isAdmin = isAdminEmail(token.email);
      return token;
    },
    async session({ session, token }: any) {
      if (token) {
        session.user.id = token.id as string;
        session.user.isAdmin = token.isAdmin === true;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export function auth() {
  // SSR helper to keep your Header/server components simple
  return getServerSession(authOptions);
}

import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import { isAdminEmail } from "@/lib/securityConfig";

export async function requireAdminSession() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.isAdmin || !isAdminEmail(session.user.email)) {
    return null;
  }

  return session;
}

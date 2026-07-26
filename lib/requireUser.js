import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function requireUser() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("authToken")?.value;
  if (!authToken) return null;

  try {
    const session = await prisma.userSession.findUnique({
      where: { authToken },
      include: { user: true },
    });

    if (!session || session.expiresAt < new Date()) {
      // Clear invalid / expired token cookie
      cookieStore.set("authToken", "", { path: "/", expires: new Date(0) });
      return null;
    }

    return session.user;
  } catch (err) {
    console.error("requireUser error:", err);
    return null;
  }
}

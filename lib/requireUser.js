import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function requireUser() {
  const cookieStore = cookies();
  const authToken = cookieStore.get("authToken")?.value;
  if (!authToken) return null;
  const session = await prisma.userSession.findUnique({ where: { authToken }, include: { user: true } });
  if (!session || session.expiresAt < new Date()) return null;
  return session.user;
}

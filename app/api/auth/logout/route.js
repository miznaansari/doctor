import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const cookieStore = cookies();
  const authToken = cookieStore.get("authToken")?.value;
  if (authToken) {
    await prisma.userSession.deleteMany({ where: { authToken } });
    cookies().set("authToken", "", { path: "/", expires: new Date(0) });
  }
  return Response.json({ ok: true });
}

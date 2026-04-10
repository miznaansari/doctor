import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { randomBytes } from "crypto";

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return Response.json({ error: "Email and password required" }, { status: 400 });
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 });
    }
    // Create session
    const authToken = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 days
    await prisma.userSession.create({
      data: { userId: user.id, authToken, expiresAt },
    });
    const cookieStore = await cookies();

cookieStore.set("authToken", authToken, {
  httpOnly: true,
  sameSite: "lax",
  path: "/",
  expires: expiresAt,
});
    return Response.json({ id: user.id, email: user.email, name: user.name });
  } catch (e) {
    return Response.json({ error: "Login failed" }, { status: 500 });
  }
}

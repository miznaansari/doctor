import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { email, password, name } = await req.json();
    if (!email || !password) {
      return Response.json({ error: "Email and password required" }, { status: 400 });
    }
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return Response.json({ error: "Email already registered" }, { status: 400 });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashed, name },
    });
    return Response.json({ id: user.id, email: user.email, name: user.name });
  } catch (e) {
    return Response.json({ error: "Signup failed" }, { status: 500 });
  }
}

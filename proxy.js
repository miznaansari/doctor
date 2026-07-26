import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function proxy(request) {
  const { pathname } = request.nextUrl;
  const authToken = request.cookies.get("authToken")?.value;

  const isAuthPage = pathname === "/login" || pathname === "/signup";
  const isProtectedPath = pathname === "/" || pathname.startsWith("/patient") || pathname.startsWith("/add");

  let validUser = false;
  if (authToken) {
    try {
      const session = await prisma.userSession.findUnique({
        where: { authToken },
      });
      if (session && session.expiresAt > new Date()) {
        validUser = true;
      }
    } catch (err) {
      console.error("Proxy session verification error:", err);
    }
  }

  // If user has a valid token and tries to access login or signup -> Redirect to Home /
  if (isAuthPage && validUser) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If user has no valid token and tries to access protected paths -> Redirect to /login
  if (isProtectedPath && !validUser) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    if (authToken) {
      response.cookies.set("authToken", "", { path: "/", expires: new Date(0) });
    }
    return response;
  }

  return NextResponse.next();
}

export const runtime = "nodejs";

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

export const middleware = proxy;

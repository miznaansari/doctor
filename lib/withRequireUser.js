import { requireUser } from "@/lib/requireUser";
import { cookies } from "next/headers";

export function withRequireUser(handler) {
  return async function (req, ...args) {
    const user = await requireUser();
    if (!user) {
      const cookieStore = await cookies();
      cookieStore.set("authToken", "", { path: "/", expires: new Date(0) });
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    req.user = user;
    return handler(req, ...args);
  };
}

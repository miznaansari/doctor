import { requireUser } from "@/lib/requireUser";

export function withRequireUser(handler) {
  return async function (req, ...args) {
    const user = await requireUser();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    req.user = user;
    return handler(req, ...args);
  };
}

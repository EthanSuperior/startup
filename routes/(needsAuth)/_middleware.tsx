import { Handlers, MiddlewareHandlerContext } from "$fresh/server.ts";
import { getCookies } from "$std/http/cookie.ts"
import { getUserByToken } from "../../database/database.tsx";

export async function handler(req: Request, ctx: MiddlewareHandlerContext) {
  const { authToken } = await getCookies(req.headers);
  if (authToken && await getUserByToken(authToken)) return await ctx.next();
  if (req.method == "GET") return new Response("", 
  {
    status: 307,
    headers: { Location: "/" },
  });
  return new Response(null, {
    status: 401,
    statusText: "Unauthorized access"
  });
}

import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { getCookies } from "$std/http/cookie.ts"
import { getUserByToken } from "../../database/database.tsx";


export const handler = [
  authenticate,
];

async function authenticate (
  req: Request,
  ctx: MiddlewareHandlerContext,
): Promise<Response> {
  const cookies = getCookies(req.headers);
  const { authToken, ...rest} = cookies;
  console.log(authToken, rest, cookies, req)
  if (authToken && await getUserByToken(authToken)) return await ctx.next();
  const url = new URL(req.url);
  url.pathname = "/";
  if (req.method == "GET") return Response.redirect(url, 307);
  return new Response(null, {
    status: 401,
    statusText: "Unauthorized access"
  });
}

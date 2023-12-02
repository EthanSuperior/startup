import { FreshContext } from "$fresh/server.ts";
import { getCookies } from "$std/http/cookie.ts";
import { getUserByToken } from "../../server/database.tsx";

export const handler = [
  authenticate,
];

async function authenticate(
  req: Request,
  ctx: FreshContext,
): Promise<Response> {
  if (req.method == "GET" && req.url.endsWith("/score")) {
    return await ctx.next();
  }
  const { authToken } = getCookies(req.headers);
  if (authToken && await getUserByToken(authToken)) return await ctx.next();
  const url = new URL(req.url);
  url.pathname = "/";
  if (req.method == "GET") return Response.redirect(url, 307);
  return new Response(null, {
    status: 401,
    statusText: "Unauthorized access",
  });
}

// async function cors(
//   _req: Request,
//   ctx: MiddlewareHandlerContext,
// ) {
//   if (_req.method == "OPTIONS") {
//     return new Response(null, {
//       status: 204,
//     });
//   }
//   const origin = _req.headers.get("Origin") || "*";
//   const resp = await ctx.next();
//   const headers = resp.headers;

//   headers.set("Access-Control-Allow-Origin", origin);
//   headers.set("Access-Control-Allow-Credentials", "true");
//   headers.set(
//     "Access-Control-Allow-Headers",
//     "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With",
//   );
//   headers.set(
//     "Access-Control-Allow-Methods",
//     "POST, OPTIONS, GET, PUT, DELETE",
//   );

//   return resp;
// }

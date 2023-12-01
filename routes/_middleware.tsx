// routes/_middleware.ts

import { FreshContext } from "$fresh/server.ts";

export const handler = [
  logging,
];

async function logging(
  req: Request,
  ctx: FreshContext,
): Promise<Response> {
  const res = await ctx.next();
  if (!req.url.includes("_frsh")) {
    console.log(`${req.method} ${req.url} ${res.status}`);
  }
  return res;
}

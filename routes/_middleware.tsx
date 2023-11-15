// routes/_middleware.ts

import { MiddlewareHandlerContext } from "$fresh/server.ts";

export const handler = [
  logging,
  timing,
];

async function timing(
  req: Request,
  ctx: MiddlewareHandlerContext,
): Promise<Response> {
  const start = performance.now();
  const res = await ctx.next();
  if (req.url.includes('_frsh')) return res;
  const end = performance.now();
  const dur = (end - start).toFixed(1);
  res.headers.set("Server-Timing", `handler;dur=${dur}ms`);
  return res;
}

async function logging(
  req: Request,
  ctx: MiddlewareHandlerContext,
): Promise<Response> {
  const res = await ctx.next();
  if (!req.url.includes('_frsh')) console.log(`${req.method} ${req.url} ${res.status} ${res.headers.get('Server-Timing')}`);
  return res;
}
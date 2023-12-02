import { getCookies } from "$std/http/cookie.ts";
import Login from "../islands/Login.tsx";
import { getUserByToken } from "../server/database.tsx";
import { FreshContext, Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  async GET(req: Request, ctx: FreshContext) {
    const { authToken } = getCookies(req.headers);
    if (authToken && await getUserByToken(authToken)) {
      const url = new URL(req.url);
      url.pathname = "/play";
      return Response.redirect(url, 307);
    }
    return await ctx.render();
  },
};

export default function Home() {
  //container padding: 0px 15px 0px 15px
  return (
    <main className="max-w-screen-2xl mx-auto flex flex-col items-center justify-center">
      <h1 className="mt-5 text-2xl font-semibold">Welcome</h1>
      <p className="mb-4 text-lg">
        Enter your login information to play - Otrio
      </p>
      <Login />
    </main>
  );
}

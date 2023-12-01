import { getCookies } from "$std/http/cookie.ts";
import { getUserByToken } from "../../server/database.tsx";
import Log from "../../islands/Log.tsx";
import OtrioGame from "../../islands/Otrio.tsx";
export default async function PlayOtrio(req: Request) {
  const { authToken } = getCookies(req.headers);
  const { username } = await getUserByToken(authToken);
  //container padding: 0px 15px 0px 15px
  return (
    <>
      <main class="mx-auto">
        <div class="grid grid-cols-8 gap-4">
          <div class="col-span-6">
            <div class="players text-center">
              <span class="user-name">{username}</span>
              <OtrioGame url={req.url} {...{ "username": username }} />
            </div>
          </div>
          <div class="col-span-2">
            <Log />
          </div>
        </div>
      </main>
    </>
  );
}

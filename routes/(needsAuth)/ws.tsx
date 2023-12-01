import { getCookies } from "$std/http/cookie.ts";
import OtrioServer from "../../server/OtrioServer.tsx";
import { getUserByToken } from "../../server/database.tsx";

const clients = new Map<string, WebSocket>();
const serverGame = new OtrioServer();

export interface WebSockMsg {
  type: "player" | "reset" | "end" | "turn" | "set" | "move" | "log";
  data: string;
}
export function wsSend(target: string, msg: WebSockMsg) {
  if (target === "all") {
    for (const client of clients.values()) {
      client.send(JSON.stringify(msg));
    }
  } else {
    clients.get(target)?.send(JSON.stringify(msg));
  }
}

function wsHandler(ws: WebSocket, id: string, username: string) {
  clients.set(id, ws);
  ws.onopen = (e) => {
    serverGame.playerJoined(id, username);
  };
  ws.onmessage = (e) => {
    serverGame.recieve(id, e);
  };
  ws.onclose = (e) => {
    clients.delete(id);
    serverGame.playerLeft(id);
  };
}

export const handler = async (req: Request) => {
  const { authToken } = getCookies(req.headers);
  const { socket, response } = Deno.upgradeWebSocket(req);
  const username = (await getUserByToken(authToken)).username;
  wsHandler(socket, req.url.split("?", 2)[1], username ?? "");
  return response;
};

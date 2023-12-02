import { getCookies } from "$std/http/cookie.ts";
import OtrioServer from "../../server/OtrioServer.tsx";
import { getUserByToken } from "../../server/database.tsx";

const clients = new Map<string, WebSocket>();
const serverGame = new OtrioServer();

type _GameMsg = "end" | "move" | "reset" | "set" | "turn";
type _ServerMsg = "join" | "leave" | "log" | "player" | "update";
type MsgType = _GameMsg | _ServerMsg;
export interface WebSockMsg {
  type: MsgType;
  data: string;
}
export interface PlayerData {
  username: string;
  place: number;
  sock_id: string;
  pieces_left: number;
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
  const msg: WebSockMsg = { type: "join", data: username };
  serverGame.recieve(id, msg);
  ws.onmessage = (e) => {
    serverGame.recieve(id, JSON.parse(e.data));
  };
  ws.onclose = (_e) => {
    clients.delete(id);
    const msg: WebSockMsg = { type: "leave", data: username };
    serverGame.recieve(id, msg);
  };
}

export const handler = async (req: Request) => {
  const { authToken } = getCookies(req.headers);
  const { socket, response } = Deno.upgradeWebSocket(req);
  const username = (await getUserByToken(authToken)).username;
  wsHandler(socket, req.url.split("?", 2)[1], username ?? "");
  return response;
};

import OtrioServer from "../server/OtrioServer.tsx";

const clients = new Map<string, WebSocket>();
const serverGame = new OtrioServer();

export interface WebSockMsg {
  type: string;
  data: string;
}
function wsHandler(ws: WebSocket, id: string) {
  clients.set(id, ws);
  ws.onopen = (e) => {
    serverGame.playerJoined(id);
  };
  ws.onmessage = (e) => {
    const { target, msg } = serverGame.recieve(id, e);
    if (target === "all") {
      for (const client of clients.values()) {
        client.send(JSON.stringify(msg));
      }
    } else {
      clients.get(target)?.send(JSON.stringify(msg));
    }
  };
  ws.onclose = (e) => {
    clients.delete(id);
    serverGame.playerLeft(id);
  };
}

export const handler = (req: Request): Response => {
  const { socket, response } = Deno.upgradeWebSocket(req);
  wsHandler(socket, req.url.split("?", 2)[1]);
  return response;
};

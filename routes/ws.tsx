import OtrioServer from "../server/OtrioServer.tsx"

const clients = new Map<string, WebSocket>();
const serverGame = new OtrioServer()
function dispatch(msg: Parameters<WebSocket["send"]>[0]): void {
  for (const client of clients.values()) {
    client.send(msg);
  }
}

function wsHandler(ws: WebSocket) {
  const id = crypto.randomUUID();
  clients.set(id, ws);

  ws.onmessage = (e) => {
    let result = serverGame.recieve(e);
    dispatch(result);
  };
  ws.onclose = () => {
    clients.delete(id);
    dispatch(`Closed: [${id}]`);
  };
}

export const handler = (req: Request): Response => {
  const { socket, response } = Deno.upgradeWebSocket(req);
  wsHandler(socket);
  return response;
};
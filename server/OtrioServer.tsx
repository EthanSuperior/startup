// 0 -> copse? 0->occupied 00->player#  -> 000[8]  0-None, 1-pl1, 2-pl2, pl3, pl4 7-dead
// 000 00000->pos
// move&(7 << 5)->states dead = 224
// move&~(7 << 5)->place
// opacity->float
// Pieces => Uint8Array
// LVL Data 0000 0000

import { move } from "$std/fs/move.ts";
import { WebSockMsg } from "../routes/ws.tsx";

// function win_game() {
//   const txt = "Player 1 Wins!!";
//   Log("Congrats!!! " + txt);
//   const url = new URL(self.location.href);
//   url.pathname = "/api/score";
//   fetch(url, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ "name": user, "wins": 1, "games": 1 }), // Convert the data object to a JSON string
//   }).then((r) => Log);
// }
// function cats_game() {
//   const url = new URL(self.location.href);
//   url.pathname = "/api/score";
//   fetch(url, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ "name": user, "games": 1 }), // Convert the data object to a JSON string
//   }).then((r) => Log);
//   const txt = "Nobody wins...";
//   Log("Cats Game " + txt);
//   // deadMen = [];
// }

export default class OtrioServer {
  playerJoined(id: string) {
  }
  recieve(id: string, e: MessageEvent<string>) {
    const msg: WebSockMsg = JSON.parse(e.data);
    return { target: "all", msg: msg };
  }
  playerLeft(id: string) {
  }
}

import Slot from "../components/Slot.tsx";
import { WebSockMsg, wsSend } from "../routes/ws.tsx";

// 0 -> copse? 0->occupied 00->player#  -> 000[8]  0-None, 1-pl1, 2-pl2, pl3, pl4; ;7-dead
// 000 00000->pos
// move&(7 << 5)->states dead = 224
// move&~(7 << 5)->place
// opacity->float
// Pieces => Uint8Array
// LVL Data 0000 0000

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
  #players = new Set<string>();
  #currentlyPlaying: string[] = [];
  #currPlayer = 1;
  #board!: Slot[];
  constructor() {
    this.#newGame();
  }
  playerJoined(id: string) {
    this.#players.add(id);
  }
  recieve(id: string, e: MessageEvent<string>) {
    const msg: WebSockMsg = JSON.parse(e.data);
    wsSend("all", msg);
  }
  playerLeft(id: string) {
    this.#players.delete(id);
    if (this.#currentlyPlaying.find((v) => v == id)) this.#newGame();
  }
  #newGame() {
    this.#board = Array.from({ length: 27 }, (_, idx) => new Slot(idx));
    this.#currPlayer = 1;
    throw new Error("Method not implemented.");
  }
}

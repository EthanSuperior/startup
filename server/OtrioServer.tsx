import { ServerSlot } from "../islands/Slot.tsx";
import { WebSockMsg, wsSend } from "../routes/(needsAuth)/ws.tsx";

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
  #players = new Map<string, string>();
  #currentlyPlaying: string[] = [];
  #currPlayer = 1;
  #board!: ServerSlot[];
  constructor() {
    this.#newGame();
  }
  #handleEndMsg(msg: WebSockMsg): void {
    throw new Error("Method not implemented.");
  }
  #handleJoinMsg(msg: WebSockMsg): void {
    throw new Error("Method not implemented.");
  }
  #handleLogMsg(msg: WebSockMsg): void {
    throw new Error("Method not implemented.");
  }
  #handleLeaveMsg(msg: WebSockMsg): void {
    throw new Error("Method not implemented.");
  }
  #handleMoveMsg(msg: WebSockMsg): void {
    throw new Error("Method not implemented.");
  }
  #handlePlayerMsg(msg: WebSockMsg): void {
    throw new Error("Method not implemented.");
  }
  #handleResetMsg(msg: WebSockMsg): void {
    throw new Error("Method not implemented.");
  }
  #handleSetMsg(msg: WebSockMsg): void {
    throw new Error("Method not implemented.");
  }
  #handleTurnMsg(msg: WebSockMsg): void {
    throw new Error("Method not implemented.");
  }
  recieve(id: string, { data }: MessageEvent<string> | { data: string }) {
    const msg: WebSockMsg = JSON.parse(data);
    if (msg.type == "join") {
      const notStarted = this.#currentlyPlaying.length < 2;
      this.#players.set(id, msg.data);
      if (notStarted) this.#newGame();
    } else if (msg.type == "leave") {
      this.#players.delete(id);
      if (this.#currentlyPlaying.find((v) => v == id)) this.#newGame();
    }
    console.log(msg.type);
    wsSend("all", msg);
  }
  #newGame() {
    this.#board = Array.from({ length: 27 }, (_, idx) => new ServerSlot(idx));
    this.#currPlayer = 1;
    this.#currentlyPlaying = [];
    function getRandomItem<T, S>(set: Map<T, S>): T {
      return Array.from(set.keys())[Math.floor(Math.random() * set.size)];
    }
    console.log(this.#players.size);
    if (this.#players.size < 2) return;
    this.#currentlyPlaying = [];
    while (this.#currentlyPlaying.length < 2) {
      const item = getRandomItem(this.#players);
      if (!this.#currentlyPlaying.find((v) => v == item)) {
        this.#currentlyPlaying.push();
      }
    }
    console.log("game started....");
  }
}

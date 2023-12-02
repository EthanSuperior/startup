import { ServerSlot } from "../islands/Slot.tsx";
import { PlayerData, WebSockMsg, wsSend } from "../routes/(needsAuth)/ws.tsx";

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
  #currentlyPlaying: PlayerData[] = [];
  #currPlayer = 1;
  #board!: ServerSlot[];
  #corpses: number[] = [];
  constructor() {
    this.#newGame();
  }
  recieve(id: string, msg: WebSockMsg) {
    switch (msg.type) {
      case "join":
        this.#handleJoinMsg(id, msg);
        break;
      case "leave":
        this.#handleLeaveMsg(id, msg);
        break;
      case "move":
        this.#handleMoveMsg(id, msg);
        break;
      case "log":
        this.#handleLogMsg(id, msg);
        break;
      default:
        console.error(`Unknown msg type ${msg.type} with value: ${msg.data}`);
        break;
    }
  }
  #newGame() {
    this.#reset();
    if (this.#players.size < 2) return;
    function getRandomItem<T, S>(set: Map<T, S>): T {
      return Array.from(set.keys())[Math.floor(Math.random() * set.size)];
    }
    for (const i of this.#corpses) {
      this.#board[i].state = 7;
    }
    while (this.#currentlyPlaying.length < 2) {
      const id = getRandomItem(this.#players);
      if (!this.#currentlyPlaying.find((v) => v.sock_id == id)) {
        const playerData: PlayerData = {
          sock_id: id,
          pieces_left: 511,
          place: this.#currentlyPlaying.length + 1,
          username: this.#players.get(id) ?? "",
        };
        this.#currentlyPlaying.push(playerData);
      }
    }
    console.log("Starting a game...");
    for (const plyrData of this.#currentlyPlaying) {
      wsSend(plyrData.sock_id, {
        type: "join",
        data: JSON.stringify(plyrData.place),
      });
      wsSend("all", { type: "player", data: JSON.stringify(plyrData) });
    }
  }
  #reset() {
    this.#board = Array.from({ length: 27 }, (_, idx) => new ServerSlot(idx));
    this.#currPlayer = 1;
    this.#currentlyPlaying = [];
  }
  #handleJoinMsg(id: string, msg: WebSockMsg): void {
    const notStarted = this.#currentlyPlaying.length < 2;
    this.#players.set(id, msg.data);
    console.log(this.#currentlyPlaying.length, " w ", this.#players.size);
    if (notStarted) this.#newGame();
    for (const slot of this.#board) {
      if (slot.state !== 0) {
        wsSend(id, { type: "set", data: slot.toString() });
      }
    }
    wsSend(id, { type: "turn", data: this.#currPlayer.toString() });
  }
  #handleLogMsg(id: string, msg: WebSockMsg): void {
    console.log(`${this.#players.get(id)}[${id}] logged ${msg}`);
  }
  #handleLeaveMsg(id: string, msg: WebSockMsg): void {
    this.#players.delete(id);
    const idx_in_plys = this.#currentlyPlaying.find((v) => v.sock_id == id);
    if (idx_in_plys !== undefined) {
      wsSend("all", { type: "leave", data: `${idx_in_plys.place}` });
      this.#newGame();
    }
  }
  #handleMoveMsg(id: string, msg: WebSockMsg): void {
    const slot = new ServerSlot(parseInt(msg.data, 16));
    const idx = slot.key % 3;
    const plyrData = this.#currentlyPlaying[this.#currPlayer - 1];
    const piece_cnt = (plyrData.pieces_left >> (3 * idx)) & 7;
    if (
      this.#board[slot.key].isOccupied || this.#currPlayer !== slot.state ||
      id !== plyrData?.sock_id || piece_cnt == 0
    ) {
      wsSend(id, { type: "set", data: `${this.#board[slot.key].info}` });
      console.log(this.#board.map((x) => x.toString()));
      return;
    }
    wsSend("all", msg);
    this.#board[slot.key].state = slot.state;
    plyrData.pieces_left &= ~(7 << (3 * idx)) | ((piece_cnt >> 1) << (3 * idx));
    if (this.#checkWinCondtions()) return;
    if (++this.#currPlayer > this.#currentlyPlaying.length) {
      wsSend("all", { type: "turn", data: "1" });
      this.#currPlayer = 1;
      if (this.#currentlyPlaying[0].pieces_left == 0) this.#catsGame();
    }
  }
  #catsGame() {
    wsSend("all", { type: "end", data: "Cats Game" });
    this.#corpses = [];
    this.#newGame();
  }
  #winsGame() {
    wsSend("all", {
      type: "end",
      data: `${this.#currentlyPlaying[this.#currPlayer - 1].username} Won!`,
    });
    this.#corpses = [];
    this.#newGame();
  }
  #checkThreeWin(pos: [number, number, number]) {
    for (let i = 0; i < 3; i++) {
      if (
        this.#board[pos[0] + i].state === this.#board[pos[1] + i].state &&
        this.#board[pos[1] + i].state === this.#board[pos[2] + i].state &&
        this.#board[pos[2] + i].state === this.#currPlayer
      ) return true;
    }
    if (
      this.#board[pos[0]].state == this.#board[pos[1] + 1].state &&
      this.#board[pos[1] + 1].state == this.#board[pos[2] + 2].state &&
      this.#board[pos[2] + 2].state == this.#currPlayer
    ) return true;
    if (
      this.#board[pos[0] + 2].state == this.#board[pos[1] + 1].state &&
      this.#board[pos[1] + 1].state == this.#board[pos[2]].state &&
      this.#board[pos[2]].state == this.#currPlayer
    ) return true;
    return false;
  }
  #checkWinCondtions(): boolean {
    const winningCombinations: [number, number, number][] = [
      [0, 3, 6],
      [9, 12, 15],
      [18, 21, 24],
      [0, 9, 18],
      [3, 12, 21],
      [6, 15, 24],
      [0, 12, 24],
      [6, 12, 18],
    ];
    if (winningCombinations.some(this.#checkThreeWin.bind(this))) {
      return this.#winsGame(), true;
    }
    if (this.#board.every((s) => s.isOccupied)) {
      return this.#catsGame(), true;
    }
    return false;
  }
}

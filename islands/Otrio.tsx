import { ChangeCircle } from "./CicleSet.tsx";
import Slot from "./Slot.tsx";
import { PlayerData, WebSockMsg } from "../routes/(needsAuth)/ws.tsx";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { Signal, useSignal } from "@preact/signals";

let logger: HTMLElement | null;
// deno-lint-ignore no-explicit-any
function Log(msg: any | string, _tag: string | null = null) {
  if (!IS_BROWSER) return;
  if (typeof document === "undefined") return;
  logger = document.querySelector("#log_msg");
  if (!logger) return;
  msg = JSON.stringify(msg);
  console.log(msg);
  if (msg == "") return;
  const msgbox = document.createElement("li");
  msgbox.textContent = msg;
  logger.appendChild(msgbox);
}

interface UserSettings {
  corpse: string; //Corpse Color
  hover: number; //Selection Opacity
  board: string; //Board Base Color
  secondary: string; //Empty Pieces/Border
}

class ClientOtrio {
  #board: Slot[];
  #players: PlayerData[] = [];
  #playerPieces: Signal<string>[][] = [];
  #currPlayer = 1;
  #yourTurnNum = 0;
  #playerID!: string;
  #socket!: WebSocket;
  #playNames1 = useSignal("");
  #playNames2 = useSignal("");
  #playerColors = [
    "#B58B59",
    "#9fff37",
    "#fe122e",
    "#3d03b5",
    "#9f009f",
  ];
  #defaultColors: UserSettings = {
    corpse: "#382e17",
    hover: 0.33,
    board: "#FED06B",
    secondary: "#B58B59",
  };
  constructor(url: URL) {
    // corpse_colors = ["#6cd10066", "#a7011466", "#1b005266", "#38003866"]
    // player: "#9fff37",
    this.#board = Array.from({ length: 27 }, (_, idx) => new Slot(idx));
    this.#initialize(url);
  }
  #initialize(url: URL) {
    this.#playerID = crypto.randomUUID();
    console.log(url.protocol);
    const wsProtocol = "wss"; //url.protocol === "http:" ? "ws" : "wss"
    const sockURL = `${wsProtocol}://${url.hostname}:${url.port}/ws`;
    this.#socket = new WebSocket(`${sockURL}?${this.#playerID}`);
    this.#socket.addEventListener("open", () => {
      this.#socket.send(JSON.stringify({ type: "update", data: "" }));
    });
    this.#socket.addEventListener("message", this.#receive.bind(this));
  }
  #receive({ data: jsonStr }: MessageEvent<string>) {
    const msg = JSON.parse(jsonStr);
    switch (msg.type) {
      case "ping":
        this.#socket.send(JSON.stringify({ type: "pong", data: "" }));
        break;
      case "player":
        this.#handlePlayerMsg(msg);
        break;
      case "reset":
        this.#handleResetMsg(msg);
        break;
      case "end":
        this.#handleEndMsg(msg);
        break;
      case "turn":
        this.#handleTurnMsg(msg);
        break;
      case "set":
        this.#handleSetMsg(msg);
        break;
      case "move":
        this.#handleMoveMsg(msg);
        break;
      case "log":
        this.#handleLogMsg(msg);
        break;
      case "leave":
        this.#handleLeaveMsg(msg);
        break;
      case "join":
        this.#handleJoinMsg(msg);
        Log(msg);
        break;
      default:
        console.error(`Unknown msg type ${msg.type} with value: ${msg.data}`);
        break;
    }
  }
  #handleEndMsg(msg: WebSockMsg): void {
    this.#playNames1.value = "";
    this.#playNames2.value = "";
    if (this.#yourTurnNum != 0) {
      const url = new URL(self.location.href);
      url.pathname = "/api/score";
      const username = this.#players[this.#yourTurnNum].username;
      const victor = msg.data === `${username} Won!`;

      fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          "name": username,
          "games": 1,
          ...((msg.data !== "Cats Game")
            ? {
              "wins": +victor,
              "losses": +!victor,
            }
            : {}),
        }), // Convert the data object to a JSON string
      });
    }
    this.#handleResetMsg(msg);
  }
  #handleJoinMsg(msg: WebSockMsg): void {
    this.#yourTurnNum = +msg.data;
  }
  #handleLogMsg(msg: WebSockMsg): void {
    Log(msg);
  }
  #handleLeaveMsg(msg: WebSockMsg): void {
    Log(msg);
  }
  #handleMoveMsg(msg: WebSockMsg): void {
    this.#handleSetMsg(msg);
    const idx = (parseInt(msg.data, 16) & 31) % 3;
    const plyrData = this.#players[this.#currPlayer];
    const piece_cnt = (plyrData.pieces_left >> (3 * idx)) & 7;
    plyrData.pieces_left &= ~(7 << (3 * idx)) | ((piece_cnt >> 1) << (3 * idx));
    this.#markOff(this.#currPlayer++, idx, piece_cnt);
  }
  #handlePlayerMsg(msg: WebSockMsg): void {
    const playerData: PlayerData = JSON.parse(msg.data);
    this.#players[playerData.place] = playerData;
    if (playerData.place == 1) this.#playNames1.value = playerData.username;
    if (playerData.place == 2) this.#playNames2.value = playerData.username;
  }
  #handleResetMsg(msg: WebSockMsg): void {
    this.#board.forEach((s) => {
      s.state = 0;
      s.sig.value = this.#playerColors[0];
    });
    this.#playerPieces.forEach((arr, i) =>
      arr.forEach((v) => v.value = this.#playerColors[i + 1])
    );
    this.#players = [];
    this.#yourTurnNum = 0;
    this.#currPlayer = 1;
  }
  #handleSetMsg(msg: WebSockMsg): void {
    const result = parseInt(msg.data, 16);
    const idx = result & 31;
    const state = (result & 224) >> 5;
    this.#board[idx].info = result;
    this.#board[idx].sig.value = (state != 7)
      ? this.#playerColors[state]
      : this.#defaultColors.corpse;
  }
  #handleTurnMsg(msg: WebSockMsg): void {
    this.#currPlayer = +msg.data;
  }
  #markOff(playerNum: number, idx: number, piece_cnt: number) {
    const piece_pos = (piece_cnt == 7) ? 2 : (piece_cnt == 3) ? 1 : 0;
    this.#playerPieces[playerNum - 1][(piece_pos * 3) + idx].value =
      this.#defaultColors.secondary;
  }
  render() {
    const pieces = this.#board.map((v, idx) => {
      const { x, y, i } = {
        y: (idx / 3 | 0) / 3 | 0,
        x: (idx / 3 | 0) % 3,
        i: idx % 3,
      };
      return (
        <ChangeCircle x={x} y={y} i={i} onChange={this.#onClick} sig={v.sig} />
      );
    });
    this.#playerPieces = Array.from({ length: 2 }, (_, i) => {
      return Array.from(
        { length: 9 },
        () => useSignal(this.#playerColors[i + 1]),
      );
    });
    const playerCircles = this.#playerPieces.flatMap((arr, j) => {
      const xOff = (j == 0) ? 4 : 27.5;
      const xDir = (j == 0) ? 6.5 : -6.5;
      return arr.map((sig, i) => (
        <circle
          cx={xOff + xDir * ((i / 3) >> 0)}
          cy={5 + 36 * j}
          r={.75 + (i % 3) * .8}
          stroke={sig}
          stroke-width={.75}
          fill="none"
        />
      ));
    });
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="min(100vw, 100vh)"
        height="min(100vw, 100vh)"
        viewBox="0 0 32 46"
      >
        <rect
          x={.25}
          y={.5}
          width={21.5}
          height={17}
          rx={5}
          ry={5}
          style={{ fill: this.#defaultColors.board }}
        >
        </rect>
        <rect
          x={.25}
          y={7.25}
          width={31.5}
          height={31.5}
          rx={5}
          ry={5}
          style={{ fill: this.#defaultColors.board }}
        >
        </rect>
        <rect
          x={10.25}
          y={28.25}
          width={21.5}
          height={17}
          rx={5}
          ry={5}
          style={{ fill: this.#defaultColors.board }}
        >
        </rect>
        {...playerCircles}
        {...pieces}
        <text
          x="2.4"
          y="1.8"
          dx={2}
          font-size=".07em"
        >
          {this.#playNames1}
        </text>
        <text
          x="15"
          y="44.8"
          font-size=".07rem"
        >
          {this.#playNames2}
        </text>
      </svg>
    );
  }
  get #onClick() {
    function click(this: ClientOtrio, i: number) {
      const piece_cnt =
        (this.#players[this.#currPlayer]?.pieces_left >> (3 * ((i & 31) % 3))) &
        7;
      if (
        this.#board[i].isOccupied || this.#currPlayer != this.#yourTurnNum ||
        piece_cnt == 0
      ) return;
      this.#board[i].sig.value = this.#playerColors[this.#currPlayer];
      const msg: WebSockMsg = {
        type: "move",
        data: ((this.#yourTurnNum << 5) | i).toString(16),
      };
      this.#socket.send(JSON.stringify(msg));
    }
    const colorFunc = click.bind(this);
    return function (this: SVGCircleElement, key: number) {
      return colorFunc(key);
    };
  }
  clean_up() {
    this.#socket.close();
  }
}

export default function OtrioGame({ url }: { url: string }) {
  const gameInfo = new ClientOtrio(new URL(url));
  onbeforeunload = () => gameInfo.clean_up();
  return gameInfo.render();
}

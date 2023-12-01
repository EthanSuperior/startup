import { useEffect } from "preact/hooks";
import { ChangeCircle } from "./CicleSet.tsx";
import Slot from "./Slot.tsx";
import { WebSockMsg } from "../routes/(needsAuth)/ws.tsx";
import { IS_BROWSER } from "$fresh/runtime.ts";

const Log = (() => {
  let logger: HTMLElement | null;
  // deno-lint-ignore no-explicit-any
  return (msg: any | string, _tag: string | null = null) => {
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
  };
})();

interface UserSettings {
  corpse: string; //Corpse Color
  hover: number; //Selection Opacity
  board: string; //Board Base Color
  secondary: string; //Empty Pieces/Border
}

class ClientOtrio {
  #board: Slot[];
  #currPlayer: number;
  #playerID!: string;
  #socket!: WebSocket;
  #playerColors: string[];
  #defaultColors: UserSettings;
  constructor(url: URL) {
    // corpse_colors = ["#6cd10066", "#a7011466", "#1b005266", "#38003866"]
    // player: "#9fff37",
    this.#defaultColors = {
      corpse: "#33000000",
      hover: 0.33,
      board: "#FED06B",
      secondary: "#220033",
    };
    this.#board = Array.from({ length: 27 }, (_, idx) => new Slot(idx));
    this.#currPlayer = 0;
    this.#playerColors = [
      "#000000",
      "#9fff37",
      "#fe122e",
      "#3d03b5",
      "#9f009f",
    ];
    this.#initialize(url);
  }
  #initialize(url: URL) {
    this.#playerID = crypto.randomUUID();
    const wsProtocol = (url.protocol.endsWith("s")) ? "wss" : "ws";
    const sockURL = `${wsProtocol}://${url.hostname}:${url.port}/ws`;
    this.#socket = new WebSocket(`${sockURL}?${this.#playerID}`);
    this.#socket.addEventListener("message", this.#receive.bind(this));
  }
  get onClick() {
    function click(this: ClientOtrio, svg: SVGCircleElement, i: number) {
      if (this.board[i].isOccupied || !this.#currPlayer) return;
      svg.style.stroke = this.#playerColors[this.#currPlayer];
      const msg: WebSockMsg = {
        type: "move",
        data: ((this.#currPlayer << 5) | i).toString(16),
      };
      this.#socket.send(JSON.stringify(msg));
    }
    const colorFunc = click.bind(this);
    return function (this: SVGCircleElement, key: number) {
      return colorFunc(this, key);
    };
  }
  get board() {
    return this.#board;
  }
  clean_up() {
    this.#socket.removeEventListener("message", this.#receive.bind(this));
    this.#socket.close();
  }
  #receive({ data: jsonStr }: MessageEvent<string>) {
    const msg = JSON.parse(jsonStr);
    switch (msg.type) {
      case "player":
        this.#handlePlayerMsg(msg);
        break;
      case "reset":
        this.#handleResetMsg(msg);
        break;
      case "end":
        this.#handleResetMsg(msg);
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
      default:
        break;
    }
  }
  #handleEndMsg(msg: WebSockMsg): void {
  }
  #handleJoinMsg(msg: WebSockMsg): void {
  }
  #handleLogMsg(msg: WebSockMsg): void {
    Log(msg);
  }
  #handleLeaveMsg(msg: WebSockMsg): void {
  }
  #handleMoveMsg(msg: WebSockMsg): void {
    this.#handleSetMsg(msg);
    this.#currPlayer = this.#currPlayer + 1;
  }
  #handlePlayerMsg(msg: WebSockMsg): void {
    const num = +msg.data.charAt(0);
    const name = msg.data.slice(1);
  }
  #handleResetMsg(msg: WebSockMsg): void {
    this.#board.forEach((s) => {
      s.state = 0;
      s.sig.value = this.#playerColors[0];
    });
  }
  #handleSetMsg(msg: WebSockMsg): void {
    const result = parseInt(msg.data, 16);
    const idx = result & 31;
    const state = (result & 224) >> 5;
    this.#currPlayer = state;
    this.board[idx].info = result;
    this.board[idx].sig.value = (state != 7)
      ? this.#playerColors[state]
      : this.#defaultColors.corpse;
  }
  #handleTurnMsg(msg: WebSockMsg): void {
    this.#currPlayer = +msg.data;
  }
}

export default function OtrioGame({ url }: { url: string }) {
  const gameInfo = new ClientOtrio(new URL(url));
  useEffect(() => {
    return () => {
      gameInfo.clean_up();
    };
  });
  const pieces = gameInfo.board.map((v, idx) => {
    const { x, y, i } = {
      y: (idx / 3 | 0) / 3 | 0,
      x: (idx / 3 | 0) % 3,
      i: idx % 3,
    };
    return (
      <ChangeCircle x={x} y={y} i={i} onChange={gameInfo.onClick} sig={v.sig} />
    );
  });
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="min(100vw, 100vh)"
      height="min(100vw, 100vh)"
      viewBox="0 0 32 32"
    >
      {...pieces}
    </svg>
  );
}

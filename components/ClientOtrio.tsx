import Log from "../components/Logger.tsx";
import Slot from "../components/Slot.tsx";
import { WebSockMsg } from "../routes/(needsAuth)/ws.tsx";

interface UserSettings {
  corpse: string; //Corpse Color
  hover: number; //Selection Opacity
  board: string; //Board Base Color
  secondary: string; //Empty Pieces/Border
}

export default class ClientOtrio {
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
    this.#currPlayer = 1;
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
      if (this.board[i].isOccupied) return;
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
    console.log(jsonStr);
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
        Log(msg);
        break;
      default:
        break;
    }
  }
  #handleTurnMsg(msg: WebSockMsg) {
    this.#currPlayer = +msg.data;
  }
  #handleResetMsg(msg: WebSockMsg) {
  }
  #handlePlayerMsg(msg: WebSockMsg) {
    const num = +msg.data.charAt(0);
    const name = msg.data.slice(1);
  }
  #handleSetMsg(msg: WebSockMsg) {
    const result = parseInt(msg.data, 16);
    const idx = result & 31;
    const state = (result & 224) >> 5;
    this.#currPlayer = state;
    this.board[idx].info = result;
    this.board[idx].sig.value = (state != 7)
      ? this.#playerColors[state]
      : this.#defaultColors.corpse;
  }
  #handleMoveMsg(msg: WebSockMsg) {
    this.#handleSetMsg(msg);
    this.#currPlayer++;
  }
}

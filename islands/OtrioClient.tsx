import { ChangeCircle } from "../components/CicleSet.tsx";
import Slot from "../components/Slot.tsx";
import { WebSockMsg } from "../routes/ws.tsx";

interface UserSettings {
  player: string; //Players Color
  corpse: string; //Corpse Color
  hover: number; //Selection Opacity
  board: string; //Board Base Color
  secondary: string; //Empty Pieces/Border
}

class ClientOtrio {
  board: Slot[];
  currPlayer: number;
  #playerID!: string;
  #socket!: WebSocket;
  playerColors: string[];
  defaultColors: {
    corpse: string;
    hover: number;
    board: string;
    secondary: string;
  };
  constructor({ player, ...def }: UserSettings, url: URL) {
    this.defaultColors = def;
    this.board = Array.from({ length: 27 }, (_, idx) => new Slot(idx));
    this.currPlayer = 1;
    this.playerColors = [
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
  clean_up() {
    this.#socket.removeEventListener("message", this.#receive.bind(this));
    this.#socket.close();
  }
  #receive({ data: jsonStr }: MessageEvent<string>) {
    console.log(jsonStr);
    const { type, data } = JSON.parse(jsonStr);
    console.log(type, data);
    const result = parseInt(data, 16);
    const idx = result & 31;
    this.board[idx].info = result;
    this.board[idx].sig.value = this.#getColor();
  }
  #handleMoveMsg(msg: WebSockMsg) {}
  #getColor(): string {
    return this.playerColors[this.currPlayer];
  }
  get onClick() {
    function click(this: ClientOtrio, svg: SVGCircleElement, i: number) {
      if (this.board[i].isOccupied) return;
      this.currPlayer = (this.currPlayer === 1) ? 2 : 1;
      this.board[i].state = this.currPlayer;
      svg.style.stroke = this.#getColor();
      const msg: WebSockMsg = {
        type: "move",
        data: ((this.currPlayer << 5) | i).toString(16),
      };
      this.#socket.send(JSON.stringify(msg));
    }
    const colorFunc = click.bind(this);
    return function (this: SVGCircleElement, key: number) {
      return colorFunc(this, key);
    };
  }
}

export default function OtrioDevGame({ url }: { url: string }) {
  // corpse_colors = ["#6cd10066", "#a7011466", "#1b005266", "#38003866"]
  const userSettings: UserSettings = {
    player: "#9fff37",
    corpse: "#33000000",
    hover: 0.33,
    board: "#FED06B",
    secondary: "#220033",
  };
  const gameInfo = new ClientOtrio(userSettings, new URL(url));
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

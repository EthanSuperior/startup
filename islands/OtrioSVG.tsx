import { useEffect } from "preact/hooks";
import { ChangeCircle, CircleColor } from "../components/CicleSet.tsx";
import { Signal, useSignal } from "@preact/signals";
// 0 -> copse? 0->occupied 00->player#  -> 000[8]  0-None, 1-pl1, 2-pl2, pl3, pl4 7-dead
// 000 00000->pos
// move&(7 << 5)->states dead = 224
// move&~(7 << 5)->place
// opacity->float
// Pieces => Uint8Array
// LVL Data 0000 0000

interface UserSettings {
  player: string; //Players Color
  corpse: string; //Corpse Color
  hover: number; //Selection Opacity
  board: string; //Board Base Color
  secondary: string; //Empty Pieces/Border
}

class Slot {
  #state!: number;
  key!: number;
  sig: Signal<string>;

  constructor(move: number) {
    this.info = move;
    this.sig = useSignal("#000000");
  }
  get isOccupied() {
    return this.#state != 0;
  }
  get playerID() {
    if (this.#state == 0 || this.#state == 7) return 0;
    else return this.#state;
  }
  set info(move: number) {
    this.key = move & 31;
    this.#state = (move & 224) >> 5;
  }
  get info() {
    return this.#state << 5 | this.key;
  }
  get state() {
    return this.#state;
  }
  set state(state: number) {
    this.#state = state;
  }
}
class ClientOtrio {
  board: Slot[];
  currPlayer: number;
  #playerID: string;
  playerColors: string[];
  defaultColors: {
    corpse: string;
    hover: number;
    board: string;
    secondary: string;
  };
  constructor({ player, ...def }: UserSettings, playerId: string) {
    this.defaultColors = def;
    this.board = Array.from({ length: 27 }, (_, idx) => new Slot(idx));
    this.currPlayer = 1;
    this.#playerID = playerId;
    this.playerColors = [
      "#000000",
      "#9fff37",
      "#fe122e",
      "#3d03b5",
      "#9f009f",
    ];
  }
  receive(move: string) {
    const result = parseInt(move, 16);
    const idx = result & 31;
    this.board[idx].info = result;
    this.board[idx].sig.value = this.getColor();
  }
  send(move: number) {
    console.log(move.toString(16));
  }
  getColor(): string {
    return this.playerColors[this.currPlayer];
  }
  get onClick() {
    function click(this: ClientOtrio, svg: SVGCircleElement, i: number) {
      if (this.board[i].isOccupied) return;
      this.currPlayer = (this.currPlayer === 1) ? 2 : 1;
      this.board[i].state = this.currPlayer;
      svg.style.stroke = this.getColor();
      this.send((this.currPlayer << 5) | i);
    }
    const colorFunc = click.bind(this);
    return function (this: SVGCircleElement, key: number) {
      return colorFunc(this, key);
    };
  }
}
function Initilize() {}

const user = "";
const userId = 0;
export function OnLoad() {
  Log("", "move");
  Log(`${user} started a game with themselves.......`);
}
let logger;

function Log(msg: string, _tag: string | null = null) {
  if (typeof document === "undefined") return;
  logger ??= document.getElementById("log_msg");
  if (!logger) return;
  if (msg == "") return;
  const msgbox = document.createElement("li");
  msgbox.textContent = msg;
  logger.appendChild(msgbox);
}
function win_game() {
  const txt = "Player 1 Wins!!";
  Log("Congrats!!! " + txt);
  const url = new URL(self.location.href);
  url.pathname = "/api/score";
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ "name": user, "wins": 1, "games": 1 }), // Convert the data object to a JSON string
  }).then((r) => Log);
}
function cats_game() {
  const url = new URL(self.location.href);
  url.pathname = "/api/score";
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ "name": user, "games": 1 }), // Convert the data object to a JSON string
  }).then((r) => Log);
  const txt = "Nobody wins...";
  Log("Cats Game " + txt);
  // deadMen = [];
}
export default function OtrioDevGame({ roomId }: { roomId: string }) {
  // corpse_colors = ["#6cd10066", "#a7011466", "#1b005266", "#38003866"]
  const playerId = "3x4";
  const userSettings: UserSettings = {
    player: "#9fff37",
    corpse: "#33000000",
    hover: 0.33,
    board: "#FED06B",
    secondary: "#220033",
  };
  const gameInfo: ClientOtrio = new ClientOtrio(userSettings, playerId);
  const defaultColor: CircleColor = {
    stroke: gameInfo.defaultColors.secondary,
    opacity: 0x44,
  };
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
  useEffect(() => {
    Initilize();
    OnLoad();
    setTimeout(() => gameInfo.receive("4D"), 2500);
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

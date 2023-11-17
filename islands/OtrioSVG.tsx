import { useEffect } from "preact/hooks";
import {encode, decode} from "$std/encoding/base64.ts";
import CircleSet, { CircleColor, CircleProps } from "../components/CicleSet.tsx";
// 0 -> copse? 0->occupied 00->player#  -> 000[8]  0-None, 1-pl1, 2-pl2, pl3, pl4 7-dead
// 000 00000->pos
// move&(7 << 5)->states dead = 224
// move&~(7 << 5)->place
// opacity->float
// Pieces => Uint8Array
// LVL Data 0000 0000

interface UserSettings {
    player: string,     //Players Color
    corpse: string,     //Corpse Color
    hover: number,      //Selection Opacity
    board: string,      //Board Base Color
    secondary: string   //Empty Pieces/Border
}

class Slot {
    color:string
    state:number
    key:number
    constructor(move:number, color:string){
        this.state = (move&224)>>5;
        this.color = color;
        this.key = move&31;
    }
    get isOccupied(){
        return this.state!=0
    }
    get playerID(){
        if (this.state == 0 || this.state == 7) return 0;
        else return this.state
    }
}
class ClientOtrio {
    board:Slot[]
    currPlayer: number
    #playerID:string
    playerColors: string[]
    defaultColors: {
        corpse: string,
        hover: number,
        board: string,
        secondary: string
    }
    constructor({player, ...def}:UserSettings, playerId:string){
        this.defaultColors = def;
        this.board = Array.from({ length: 21 }, (_, idx) => new Slot(idx, this.defaultColors.secondary));
        this.currPlayer = 0;
        this.#playerID = playerId;
        this.playerColors= [
            "#0000",
            "#9fff37",
            "#fe122e",
            "#3d03b5",
            "#9f009f",
        ];
    }

    receive(move:string){
        const result = decode(move);
    }
    getColor():string {
        console.log('Hey', this);
        return this.playerColors[2];
    }
    get onClick() {
        function click(this:SVGCircleElement, i:number, getColor:()=>string) {
            const color = getColor();
            if(color) this.style.stroke = color;
        }
        const colorFunc = this.getColor.bind(this);
        return function(this:SVGCircleElement, key:number) {
            return click.bind(this)(key, colorFunc);
        };
    }
}
function Initilize() {}

const user = '';
const userId = 0;
export function OnLoad() {
    Log('', 'move');
    Log(`${user} started a game with themselves.......`);
}
let logger;

function Log(msg:string, _tag:string|null=null) {
    if (typeof document === 'undefined')  return;
    logger??=document.getElementById("log_msg");
    if(!logger) return;
    if (msg == '') return;
    const msgbox = document.createElement('li');
    msgbox.textContent = msg;
    logger.appendChild(msgbox);
}
function win_game() {
    const txt = "Player 1 Wins!!";
    Log("Congrats!!! " + txt);
    const url = new URL(self.location.href);
    url.pathname = "/api/score";
    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify({"name":user,"wins":1,"games":1}), // Convert the data object to a JSON string
    }).then(r => Log);
}
function cats_game() {
    const url = new URL(self.location.href);
    url.pathname = "/api/score";
    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify({"name":user,"games":1}), // Convert the data object to a JSON string
    }).then(r => Log);
    const txt = "Nobody wins...";
    Log("Cats Game " + txt);
    // deadMen = [];
}
export default function OtrioDevGame({roomId}:{roomId:string}){
    // corpse_colors = ["#6cd10066", "#a7011466", "#1b005266", "#38003866"]
    let playerId = "3x4";
    const userSettings:UserSettings = {
        player: "#9fff37",
        corpse: "#33000000",
        hover: 0.33,
        board: "#FED06B",
        secondary: "#220033",
    }
    const gameInfo:ClientOtrio = new ClientOtrio(userSettings, playerId);
    useEffect(()=>{
        Initilize();
        OnLoad();
    });
    const defaultColor:CircleColor = {
        stroke:gameInfo.defaultColors.secondary,
        opacity: 0x44,
    };
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 32 32">
            {[0, 1, 2].flatMap(y=>[0, 1, 2].map(x=>
            <CircleSet x={x} y={y} c={defaultColor} onChange={gameInfo.onClick}/>
            ))}
        </svg>
    )
}
import { useEffect } from "preact/hooks";
import CircleSet, { CircleColor, CircleProps } from "../components/CicleSet.tsx";
// 0 -> copse? 0->occupied 00->player#  -> 000[8]  0-None, 1-pl1, 2-pl2, pl3, pl4 7-dead
// 000 00000->pos
// move&(7 << 5)->states dead = 224
// move&~(7 << 5)->place
// opacity->float
// Pieces => Uint8Array
// LVL Data 0000 0000

interface GameSettings{
    board:Uint8Array,
    currPlayer: number,
    playerColors: string[],
    defaultColors: {
        corpse: string,
        hover: number,
        board: string,
        boardSecondary: string
    },
}
function Initilize() {}

const user = '';
export function OnLoad() {
    Log('', 'move');
    Log(`${user} started a game with themselves.......`);
}
let logger;

function Log(msg:string, _tag:string|null=null){
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
    fetch('https://startup.evankchase.click/api/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify({"name":user,"wins":1,"games":1}), // Convert the data object to a JSON string
    }).then(r => Log);
}
function cats_game() {
    fetch('https://startup.evankchase.click/api/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify({"name":user,"games":1}), // Convert the data object to a JSON string
    }).then(r => Log);
    const txt = "Nobody wins...";
    Log("Cats Game " + txt);
    // deadMen = [];
}

export default function OtrioDevGame(){
    // corpse_colors = ["#6cd10066", "#a7011466", "#1b005266", "#38003866"]
    const userSettings:GameSettings = {
        board: new Uint8Array(21),
        currPlayer: 0,
        playerColors: [
            "#9fff37",
            "#fe122e",
            "#3d03b5",
            "#9f009f",
        ],
        defaultColors: {
            corpse: "#33000000",
            hover: 0.33,
            board: "#FED06B",
            boardSecondary: "#220033",
        }
    }
    useEffect(()=>{
        Initilize();
        OnLoad();
    });
    function swapColors(this:SVGCircleElement, i:number){
        console.log(this, i);
        this.style.stroke = userSettings.playerColors[userSettings.currPlayer];
    }
    const defaultColor:CircleColor = {
        stroke:userSettings.defaultColors.boardSecondary,
        opacity: 0x44,
    };
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 32 32">
            {[0, 1, 2].flatMap(y=>[0, 1, 2].map(x=>
            <CircleSet x={x} y={y} c={defaultColor} onChange={swapColors}/>
            ))}
        </svg>
    )
}
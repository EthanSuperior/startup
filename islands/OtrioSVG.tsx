import { useEffect } from "preact/hooks";
import CircleSet, { CircleColor, CircleProps } from "../components/CicleSet.tsx";
let width = 3,
    num_players = 0,
    saveCorpses = true,
    deadMen: CircleInfo[] = [];
const MAX_PLAYERS = 4;
let user = '';
// 0 -> copse? 0->occupied 00->player#  -> 000[8]  0-None, 1-pl1, 2-pl2, pl3, pl4 7-dead
// 000 00000->pos
// move&(7 << 5)->states dead = 224
// move&~(7 << 5)->place
// opacity->float
// Pieces => Uint8Array
// LVL Data 0000 0000
/*
line_width = 4
circle_gap = 5
spacing = 20
arc_pos = 11
draw_offset = 32

total width=64  width+.2
*/
// const lol = new Uint8Array(22)
// lol.at(3)
let spacing:number;
const colors:string[] = ["#9fff37", "#fe122e", "#3d03b5", "#9f009f"],
    corpse_colors = ["#6cd10066", "#a7011466", "#1b005266", "#38003866"]

interface GameSettings{
    board:Uint8Array,
    currPlayer: number,
    playerColors: {
        player1:string,
        player2:string,
        player3:string,
        player4:string,        
    },
    defaultColors: {
        corpse: string,
        hover: number,
        board: string,
        boardSecondary: string
    },
}

let players: Player[],
    game: Otrio[][],
    currentPlayer = 0;

function Initilize() {}

export function OnLoad() {
    Log('', 'move');
    Log(`${user} started a game with themselves.......`);
    currentPlayer = currentPlayer % num_players;
    players = [];
    for (let i = 0; i < MAX_PLAYERS; i++) players.push(new Player(i));
    for (let i = num_players; i < MAX_PLAYERS; i++) {
        players[i].pieces.forEach((t) => {
            for (let j = 0; j < t.circles.length; j++) t.circles[j] = corpse_colors[i];
        });
    }
    game = [];
    for (let i = 0; i < width; i++) {
        game[i] = [];
        for (let j = 0; j < width; j++) game[i].push(new Otrio(i, j));
    }
    if (saveCorpses) deadMen.forEach((c_i) => (game[c_i.r][c_i.c].circles[c_i.n] = corpse_colors[c_i.color]));
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
    const txt = "Player " + (currentPlayer + 1) + " Wins!!";
    Log("Congrats!!! " + txt);
    fetch('https://startup.evankchase.click/api/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify({"name":user,"wins":1,"games":1}), // Convert the data object to a JSON string
    }).then(r => Log);
}
function is_cats() {
    let player_matches = true;
    for (let i = 0; i < num_players; i++)
        player_matches &&= players[i].pieces.every((c) => c.get_match('') == (1 << width) - 1);
    if (player_matches) return true;
    return game.every((r) => r.every((c) => c.get_match('') == 0));
}
function cats_game() {
    fetch('https://startup.evankchase.click/api/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify({"name":user,"games":1}), // Convert the data object to a JSON string
    }).then(r => Log);
    const txt = "Nobody wins...";
    Log("Cats Game " + txt);
    deadMen = [];
}
function checkWin(circle_info: CircleInfo) {
    const playerColor = colors[currentPlayer];
    circle_info.color = currentPlayer;
    const r = circle_info.r,
        c = circle_info.c,
        ascending_arr = Array.from({ length: width }, (_, i) => i);
    let hasMatch = game[r][c].get_match(playerColor) == (1 << width) - 1;
    hasMatch ||=
        check_consecutive(new Array(width).fill(r), ascending_arr, playerColor) ||
        check_consecutive(ascending_arr, new Array(width).fill(c), playerColor);
    hasMatch ||=
        check_consecutive(ascending_arr, ascending_arr, playerColor) ||
        check_consecutive(ascending_arr, [...ascending_arr].reverse(), playerColor);
    if (hasMatch) {
        deadMen.push(circle_info);
        win_game();
    } else if (is_cats()) cats_game();
    else currentPlayer = (currentPlayer + 1) % num_players;
}
function check_consecutive(rows: number[], cols: number[], playerColor: string): boolean {
    const matches = rows.map((row, i) => game[row][cols[i]].get_match(playerColor));
    if (matches.reduce((p, c) => p & c, (1 << width) - 1) != 0) return true;
    if (matches.reduce((p, c, i) => p | (c & (1 << i)), 0) == (1 << width) - 1) return true;
    return matches.reduce((p, c, i) => p | (c & (1 << (width - 1 - i))), 0) == (1 << width) - 1;
}
class Player {
    id: number;
    pieces: Otrio[];
    color: string;
    postion: number;
    constructor(id: number) {
        this.id = id;
        this.postion = id * spacing;
        this.color = colors[id];
        let dx = new Array(width).fill(-1.05);
        let dy = new Array(width).fill(-1.05);
        switch (id) {
            case 0:
                dy = new Array(width).fill(width + 0.1);
                /* falls through */
            case 1: 
                dx = Array.from({ length: width }, (_, i) => i);
                break;
            case 3:
                dx = new Array(width).fill(width + 0.1);
                /* falls through */
            case 2:
                dy = Array.from({ length: width }, (_, i) => i);
                break;
        }
        this.pieces = [];
        for (let i = 0; i < width; i++) this.pieces.push(new Otrio(dx[i], dy[i], this.color));
    }
    makeMove(circle_info: CircleInfo) {
        const played_pos = game[circle_info.r][circle_info.c];
        if (played_pos.circles[circle_info.n] == '' && this.markPiece(circle_info.n)) {
            Log(`Player ${currentPlayer+1} moved at ${circle_info.r+1} ${circle_info.c+1} ${circle_info.n+1}`)
            played_pos.circles[circle_info.n] = colors[currentPlayer];
            checkWin(circle_info);
        }
    }
    markPiece(n: number) {
        for (let i = 0; i < this.pieces.length; i++)
            if (this.pieces[i].circles[n]) {
                this.pieces[i].circles[n] = '';
                return true;
            }
        return false;
    }
}
class CircleInfo {
    r: number;
    c: number;
    n: number;
    color: number;
    constructor(r: number, c: number, n: number) {
        this.r = r;
        this.c = c;
        this.n = n;
        this.color = 0;
    }
}
class Otrio {
    circles: string[];
    x: number;
    y: number;
    constructor(x: number, y: number, c: string = '') {
        this.x = x;
        this.y = y;
        this.circles = new Array(width).fill(c);
    }
    get_match(c: string) {
        let matches = 0;
        for (let i = 0; i < this.circles.length; i++) matches |= +(this.circles[i] == c) << i;
        return matches;
    }
}

export default function OtrioDevGame(){
    const userSettings:GameSettings = {
        board: new Uint8Array(21),
        currPlayer: 0,
        playerColors: {
            player1:"#9fff37",
            player2:"#fe122e",
            player3:"#3d03b5",
            player4:"#9f009f",
        },
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
        this.style.stroke = 'red';
    }
    const defaultColor:CircleColor = {
        stroke:userSettings.defaultColors.boardSecondary,
        opacity: 0x44,
    };
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 42 42">
            {[0, 1, 2].flatMap(y=>[0, 1, 2].map(x=><CircleSet x={x} y={y} c={defaultColor} onChange={swapColors}/>))}
        </svg>
    )
}
import { useEffect } from "preact/hooks";
import { ScoreboardRow } from "../routes/leaderboard.tsx";
let canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    input_players: HTMLInputElement,
    input_size: HTMLInputElement,
    check_box: HTMLInputElement,
    input_width: HTMLInputElement,
    gameOver: boolean;
let width = 3,
    background_color = "#FED06B",
    num_players = 0,
    saveCorpses = true,
    lastMouseE: MouseEvent|null,
    deadMen: CircleInfo[] = [];
const MAX_PLAYERS = 4;

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
const lol = new Uint8Array(22)
lol.at(3)
let line_width:number,
    circle_gap:number,
    spacing:number,
    draw_offset:number,
    empty_color = "#44220033";
const colors:string[] = ["#9fff37", "#fe122e", "#3d03b5", "#9f009f"],
    corpse_colors = ["#6cd10066", "#a7011466", "#1b005266", "#38003866"],
    corpse_alpha = "66",
    empty_alpha = "33",
    corpse_alpha_val = 0x66,
    empty_alpha_val = 0x33;

let players: Player[],
    game: Otrio[][],
    currentPlayer = 0;
function changeBGColor(){
    const elm = document.getElementById('bkgrd_color') as HTMLInputElement;
    if(elm) background_color=elm.value;
}
function Initilize() {
    Log("Johnny challenged Sammy");
    const delay = (ms:number) => new Promise(res => setTimeout(res, ms));
    setInterval(() => {
        Log((Math.random()<.5)?"Johnny beat Sammy!!!":"Sammy beat Johnny!!!");
        delay(1000+ Math.random()*2000)
        Log("Johnny and Sammy started a rematch");
        console.log('hey...');
      }, (Math.random() * 3000) + 30000);
}

export function OnLoad() {
    Log('', 'move');
    Log(`${getUsername()} started a game with themselves.......`);
    const element = document.querySelector('span.user-name');
    if (element) element.textContent = getUsername();
    getSettings();
    gameOver = false;
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
    draw();
}

function getSettings() {
    input_players = input_players ? input_players : document.getElementById("player-count") as HTMLInputElement;
    input_size = input_size ? input_size : document.getElementById("game-width") as HTMLInputElement;
    check_box = check_box ? check_box : document.getElementById("checkbox-corpse") as HTMLInputElement;
    input_width = input_width ? input_width : document.getElementById("game-size") as HTMLInputElement;
    if (!canvas) {
        Log('Added Canvas...');
        canvas = document.getElementById("canvas") as HTMLCanvasElement;
        canvas.addEventListener("click", mouseClick);
        canvas.addEventListener("mousemove", (e) => (lastMouseE = e));
    }
    ctx = ctx ?? canvas.getContext("2d");
    num_players = +input_players.value;
    line_width = +input_size.value;
    saveCorpses = check_box.checked;
    width = +input_width.value;
    circle_gap = line_width * 1.25;
    spacing = (circle_gap + line_width) * (width + 1);
    draw_offset = 1.6 * spacing;
    canvas.width = spacing * (width + 2) + spacing / 4;
    canvas.height = spacing * (width + 2) + spacing / 4;
    if (game) for (let i = 0; i < game.length; i++) for (let j = 0; j < game.length; j++) game[i][j].recalcPaths();
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
    lastMouseE = null;
    draw();
    gameOver = true;
    const txt = "Player " + (currentPlayer + 1) + " Wins!!";
    Log("Congrats!!! " + txt);
    fetch('startup.evankchase.click/api/score', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify({"name":getUsername(),"wins":1,"games":1}), // Convert the data object to a JSON string
    }).then(r => Log);
    ctx.fillStyle = colors[currentPlayer];
    ctx.strokeStyle = "#000";
    ctx.lineWidth = line_width / 2;
    ctx.font = spacing / 2 + "px Arial";
    ctx.textAlign = "center";
    ctx.lineJoin = "round";
    ctx.strokeText("Congrats!!!", spacing * (width - 0.5), spacing * (width - 0.25));
    ctx.fillText("Congrats!!!", spacing * (width - 0.5), spacing * (width - 0.25));
    ctx.strokeText(txt, spacing * (width - 0.5), spacing * (width + 0.25));
    ctx.fillText(txt, spacing * (width - 0.5), spacing * (width + 0.25));
}
function is_cats() {
    let player_matches = true;
    for (let i = 0; i < num_players; i++)
        player_matches &&= players[i].pieces.every((c) => c.get_match('') == (1 << width) - 1);
    if (player_matches) return true;
    return game.every((r) => r.every((c) => c.get_match('') == 0));
}
function cats_game() {
    lastMouseE = null;
    draw();
    fetch('startup.evankchase.click/api/score', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify({"name":getUsername(),"games":1}), // Convert the data object to a JSON string
    }).then(r => Log);
    gameOver = true;
    const txt = "Nobody wins...";
    Log("Cats Game " + txt);
    ctx.fillStyle = background_color;
    ctx.strokeStyle = "#000";
    ctx.lineWidth = line_width / 2;
    ctx.font = spacing / 2 + "px Arial";
    ctx.textAlign = "center";
    ctx.lineJoin = "round";
    ctx.strokeText("Cats Game", spacing * (width - 0.5), spacing * (width - 0.25));
    ctx.fillText("Cats Game", spacing * (width - 0.5), spacing * (width - 0.25));
    ctx.strokeText(txt, spacing * (width - 0.5), spacing * (width + 0.25));
    ctx.fillText(txt, spacing * (width - 0.5), spacing * (width + 0.25));
    deadMen = [];
}

function exchange_colors(elem: HTMLInputElement, idx:number|null, is_corpse:boolean) {
    let new_c = elem.value;
    let old_c = elem.getAttribute("old_color")??'';
    if (new_c != old_c && (colors.includes(new_c) || corpse_colors.includes(new_c + corpse_alpha))) {
        elem.value = old_c;
        return;
    }
    if (idx == null) {
        empty_color = new_c + empty_alpha;
        return;
    }
    if (is_corpse) {
        old_c += corpse_alpha;
        new_c += corpse_alpha;
    }
    c_swap(idx, old_c, new_c, is_corpse);
}

function getClickOffset(e:MouseEvent):[number, number] {
    /*
    const canvasRect = canvas.getBoundingClientRect();
    const canvasX = canvasRect.left;
    const canvasY = canvasRect.top;
    const iframeRect = self.frameElement?.getBoundingClientRect();
    const iframeX = iframeRect.left;
    const iframeY = iframeRect.top;
    */
    return [e.offsetX , e.offsetY];
}
function c_swap(idx: number, old_c: string, new_c: string, is_corpse: boolean) {
    players[idx].pieces.forEach((p) =>
        p.circles.forEach((c, i) => {
            if (c === old_c) p.circles[i] = new_c;
        })
    );
    game.forEach((r) =>
        r.forEach((p) =>
            p.circles.forEach((c, i) => {
                if (c === old_c) p.circles[i] = new_c;
            })
        )
    );
    (is_corpse ? corpse_colors : colors)[idx] = new_c;
}


function draw() {
    if (gameOver) return;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = line_width / 2;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    draw_game_board();
    if (lastMouseE) highlightSelected(lastMouseE);
    requestAnimationFrame(draw);
}
function draw_game_board() {
    ctx.fillStyle = ctx.strokeStyle = background_color;
    ctx.beginPath();
    const game_board_width = (spacing + line_width / 3) * (width + 2);
    const game_board_height = spacing * (width + 0.1);
    ctx.roundRect(line_width / 2, spacing + line_width / 2, game_board_width, game_board_height, circle_gap);
    ctx.roundRect(spacing + line_width / 2, line_width / 2, game_board_height, game_board_width, circle_gap);
    ctx.fill();
    ctx.closePath();
    ctx.fillStyle = background_color;
    ctx.fillStyle = background_color;
    {
        const close_dist = spacing + line_width / 2,
            mid_dist = spacing / 2,
            far_dist = spacing * (width + 1) + line_width * 1.36;
        ctx.beginPath();
        ctx.moveTo(close_dist, mid_dist);
        ctx.arcTo(close_dist, close_dist, mid_dist, close_dist, 90);
        ctx.lineTo(close_dist, close_dist);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(far_dist, mid_dist);
        ctx.arcTo(far_dist, close_dist, far_dist + mid_dist, close_dist, 90);
        ctx.lineTo(far_dist, close_dist);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(close_dist, far_dist + mid_dist);
        ctx.arcTo(close_dist, far_dist, mid_dist, far_dist, 90);
        ctx.lineTo(close_dist, far_dist);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(far_dist, far_dist + mid_dist);
        ctx.arcTo(far_dist, far_dist, far_dist + mid_dist, far_dist, 90);
        ctx.lineTo(far_dist, far_dist);
        ctx.closePath();
        ctx.fill();
    }

    ctx.strokeStyle = empty_color;
    ctx.beginPath();
    ctx.roundRect(spacing + line_width, spacing + line_width, game_board_height, game_board_height, circle_gap);
    ctx.stroke();
    ctx.closePath();

    players.forEach((p) => p.draw());
    game.forEach((r) => r.forEach((c) => c.draw()));
}

function highlightSelected(e: MouseEvent) {
    const circle_info = getSelectedCircle(e);
    if (circle_info && circle_info.n != null) {
        ctx.strokeStyle = colors[currentPlayer] + empty_alpha;
        ctx.stroke(game[circle_info.r][circle_info.c].paths[circle_info.n]);
    }
}
function mouseClick(e: MouseEvent) {
    if (gameOver) {
        OnLoad();
        return;
    }
    const circle_info = getSelectedCircle(e);
    if (circle_info) players[currentPlayer].makeMove(circle_info);
}
function getSelectedCircle(e: MouseEvent): CircleInfo | null {
    for (let r = 0; r < game.length; r++)
        for (let c = 0; c < game.length; c++)
            if (ctx.isPointInPath(game[r][c].inRange, ...getClickOffset(e)))
                return new CircleInfo(r, c, game[r][c].getCircle(e)??0);
    return null;
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
function getUsername(){return localStorage.getItem('username')??'';}


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
    draw() {
        this.pieces.forEach((t) => t.draw());
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
    inRange!: Path2D;
    paths!: Path2D[];
    constructor(x: number, y: number, c: string = '') {
        this.x = x;
        this.y = y;
        this.circles = new Array(width).fill(c);
        this.recalcPaths();
    }
    recalcPaths() {
        this.paths = [];
        for (let i = 0; i < this.circles.length; i++)
            this.paths.push(this._draw_circle(line_width + i * circle_gap, this.circles[i]));
        const selectR = line_width + (width - 1) * circle_gap + line_width;
        const p = new Path2D();
        p.arc(draw_offset + this.x * spacing, draw_offset + this.y * spacing, selectR, 0, 2 * Math.PI);
        this.inRange = p;
    }

    draw() {
        for (let i = 0; i < this.circles.length; i++) this._draw_circle(line_width + i * circle_gap, this.circles[i]);
    }
    _draw_circle(r: number, c: string) {
        ctx.strokeStyle = c ? c : empty_color;
        ctx.lineWidth = line_width;
        const x = draw_offset + this.x * spacing;
        const y = draw_offset + this.y * spacing;
        const p = new Path2D();
        p.arc(x, y, r, 0, 2 * Math.PI);
        p.closePath();
        ctx.stroke(p);
        return p;
    }
    get_match(c: string) {
        let matches = 0;
        for (let i = 0; i < this.circles.length; i++) matches |= +(this.circles[i] == c) << i;
        return matches;
    }
    getCircle(e: MouseEvent) {
        for (let i = 0; i < this.circles.length; i++)
            if (ctx.isPointInStroke(this.paths[i], ...getClickOffset(e))) return i;
        return null;
    }
}
export default function OtrioGame(){
    useEffect(()=>{
        Initilize();
        OnLoad();
    });
    return (
        <canvas id="canvas">Otrio Game</canvas>
    )
}
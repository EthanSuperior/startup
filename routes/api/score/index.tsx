import { Handlers } from "$fresh/server.ts";
import { ScoreboardRow } from "../../leaderboard.tsx";


export const handler: Handlers = {
    async GET() {
        console.log('This one');
        return new Response(await Deno.readTextFile('scoreboard.json'));
    },
    async POST(req, _ctx) {
        console.log("HEY");
        const scoreFile = Deno.readTextFile('scoreboard.json');
        const result:ScoreboardRow = JSON.parse( await req.text());
        const scores:ScoreboardRow[] = JSON.parse(await scoreFile);
        const i = scores.findIndex((r=>r.name==result.name));
        if (i == -1) scores.push(result);
        else {
            scores[i].wins = (scores[i].wins ?? 0) + (result.wins ?? 0);
            scores[i].losses = (scores[i].losses ?? 0) + (result.losses ?? 0);
            scores[i].games = (scores[i].games ?? 0) + (result.games ?? 0);
        }
        console.log(scores);
        await Deno.writeTextFile('scoreboard.json', JSON.stringify(scores));
        return new Response(JSON.stringify(scores[i]));
    },
}
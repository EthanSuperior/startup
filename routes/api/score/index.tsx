import { Handlers } from "$fresh/server.ts";
import { ScoreboardRow } from "../../leaderboard.tsx";
import db from "../../../database/database.tsx";

export const handler: Handlers = {
    async GET() {
        const scores = db.collection("scores").find();
        const results = [];
        for await (const v of scores) results.push(v);
        return new Response(JSON.stringify(results));
    },
    async POST(req, _ctx) {
        // Mongo Collection to use
        const scores = db.collection("scores");

        const result: ScoreboardRow = JSON.parse(await req.text());

        // Check if the document with the given name already exists
        const filter = { name: result.name };
        const update = {
            $inc: {
                wins: result.wins ?? 0,
                losses: result.losses ?? 0,
                games: result.games ?? 0,
            },
        };
        const { modifiedCount } = await scores.updateOne(filter, update);
        if (modifiedCount === 0) await scores.insertOne(result);
        return new Response();
    }
}
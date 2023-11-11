import { Handlers } from "$fresh/server.ts";
import { ScoreboardRow } from "../../leaderboard.tsx";
import db from "../../../database/database.tsx";

export const handler: Handlers = {
    async GET() {
        const results = await db.collection("scores").find({}).toArray();
        return new Response(JSON.stringify(results), { headers: { "Content-Type": "application/json" } });
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
import { Handlers } from "$fresh/server.ts";
import { ScoreboardRow } from "../../../leaderboard.tsx";
import {
  fetchScores,
  scoreCollection,
} from "../../../../server/database.tsx";
export const handler: Handlers = {
  async GET() {
    return await fetchScores();
  },
  async POST(req, _ctx) {
    // Mongo Collection to use

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
    const { modifiedCount } = await scoreCollection.updateOne(filter, update);
    if (modifiedCount === 0) await scoreCollection.insertOne(result);
    return new Response();
  },
};

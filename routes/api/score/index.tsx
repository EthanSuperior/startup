import { Handlers } from "$fresh/server.ts";
import { fetchScores } from "../../../database/database.tsx";

export const handler: Handlers = {
async GET() {
    return await fetchScores();
  },
}
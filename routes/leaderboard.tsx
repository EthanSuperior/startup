import { Handlers, RouteContext } from "$fresh/server.ts";
import { asset } from "$fresh/runtime.ts";
import LeaderboardRow from "../components/LeaderboardRows.tsx";

export interface ScoreboardRow {
    name: string;
    wins: number | null;
    losses: number | null;
    games: number;
    winRate?: number;
    rank?: number;
}

export default async function Leaderboard(_req: Request, ctx: RouteContext){
    const resp = await (await fetch(`startup.evankchase.click/api/score`)).text();
    const data: ScoreboardRow[] = (JSON.parse(resp));
    return (
        <main class='flex items-center justify-center mt-6'>
            <div class="relative overflow-x-auto w-3/4 ">
            <table class="w-full text-md text-left text-gray-500 dark:text-gray-400">
                <thead class="text-md text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" class="px-6 py-3">#</th>
                        <th scope="col" class="px-6 py-3">Name</th>
                        <th scope="col" class="px-6 py-3">Wins</th>
                        <th scope="col" class="px-6 py-3">Losses</th>
                        <th scope="col" class="px-6 py-3">Games</th>
                        <th scope="col" class="px-6 py-3">Win Rate(%)</th>
                    </tr>
                </thead>
                <tbody>
                    <LeaderboardRow data={data}/>
                </tbody>
            </table>
            </div>
        </main>
    );
}
import { ScoreboardRow } from "../routes/leaderboard.tsx";

interface LeaderboardProps {
  data: ScoreboardRow[];
}

export default function LeaderboardRow(props: LeaderboardProps) {
  props.data.forEach((row: ScoreboardRow) => {
    row.winRate = +(((row.wins ?? 0) / row.games) * 100.0).toFixed(2);
  });
  props.data.sort((a: ScoreboardRow, b: ScoreboardRow) =>
    (b.winRate ?? 0) - (a.winRate ?? 0)
  );
  props.data.forEach((row: ScoreboardRow, i: number) => {
    if (i === 0) row.rank = 1;
    else row.rank = (props.data[i - 1].rank ?? 0) + 1;
  });
  return (
    <>
      {props.data.map((row: ScoreboardRow) => (
        <tr
          class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
          key={row.name}
        >
          <td
            scope="row"
            class="px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
          >
            {row.rank}
          </td>
          <td
            scope="row"
            class="px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
          >
            {row.name}
          </td>
          <td
            scope="row"
            class="px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
          >
            {row.wins ?? 0}
          </td>
          <td
            scope="row"
            class="px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
          >
            {row.losses ?? 0}
          </td>
          <td
            scope="row"
            class="px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
          >
            {row.games}
          </td>
          <td
            scope="row"
            class="px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
          >
            {row.winRate}
          </td>
        </tr>
      ))}
    </>
  );
}

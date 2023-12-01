import { useEffect } from "preact/hooks";
import { ChangeCircle } from "../components/CicleSet.tsx";
import ClientOtrio from "../components/ClientOtrio.tsx";

export default function OtrioGame({ url }: { url: string }) {
  const gameInfo = new ClientOtrio(new URL(url));
  useEffect(() => {
    return () => {
      gameInfo.clean_up();
    };
  });
  const pieces = gameInfo.board.map((v, idx) => {
    const { x, y, i } = {
      y: (idx / 3 | 0) / 3 | 0,
      x: (idx / 3 | 0) % 3,
      i: idx % 3,
    };
    return (
      <ChangeCircle x={x} y={y} i={i} onChange={gameInfo.onClick} sig={v.sig} />
    );
  });
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="min(100vw, 100vh)"
      height="min(100vw, 100vh)"
      viewBox="0 0 32 32"
    >
      {...pieces}
    </svg>
  );
}

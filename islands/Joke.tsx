import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";

export default function Joke() {
  const jokeOpening = useSignal("");
  const jokePunch = useSignal("");
  const rotation = useSignal("rotateY(0deg)");
  const jokeRate = 14 * 1000;
  async function revealJoke() {
    let punch = "";
    await fetch("https://backend-omega-seven.vercel.app/api/getjoke")
      .then((r) => r.json())
      .then((d) => {
        jokeOpening.value = d[0].question;
        punch = d[0].punchline;
        rotation.value = "rotateY(0deg)";
      });
    setTimeout(() => {
      jokePunch.value = punch;
      rotation.value = "rotateY(180deg)";
    }, 2 * jokeRate / 3);
  }
  useEffect(() => {
    revealJoke();
    const intervalId = setInterval(revealJoke, jokeRate);
    return () => {
      clearInterval(intervalId);
    };
  }, []);
  return (
    <div class="group relative flex items-center justify-center h-full text mt-2">
      <div
        class="relative w-full h-full duration-1000"
        style={{ transformStyle: "preserve-3d", transform: `${rotation}` }}
      >
        <div
          class="absolute inset-0 flex items-center justify-center"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          {jokePunch}
        </div>
        <div
          class="absolute inset-0 flex items-center justify-center"
          style={{ backfaceVisibility: "hidden" }}
        >
          {jokeOpening}
        </div>
      </div>
    </div>
  );
}

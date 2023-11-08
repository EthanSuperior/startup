import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";

export default function Joke() {
  const jokeOpening = useSignal("");
  const jokePunch = useSignal("");
  const rotation = useSignal('rotateY(0deg)');

  function revealJoke() {
    let punch = ''
    fetch("https://backend-omega-seven.vercel.app/api/getjoke")
      .then((r) => r.json())
      .then((d) => {
        jokeOpening.value = d[0].question;
        punch = d[0].punchline;
        rotation.value = "rotateY(0deg)";
      });
    setTimeout(() => {
      jokePunch.value = punch;
      rotation.value = "rotateY(180deg)";
    }, 1500);
  }
  useEffect(() => {
    revealJoke();
    const intervalId = setInterval(revealJoke, 3000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);
  return (
    <div class="group relative flex items-center justify-center h-full text">
      <div class="relative h-full duration-1000" style={{ transformStyle: "preserve-3d", transform:`${rotation}`}}>
        <div class="absolute h-full" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>{jokePunch}</div>
        <div class="absolute h-full" style={{ backfaceVisibility: "hidden" }} >{jokeOpening}</div>
      </div>
    </div>
  );
}

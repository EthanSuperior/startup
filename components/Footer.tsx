import Joke from "../islands/Joke.tsx";

export default function Footer() {
  return (
    <footer class="p-4">
      <hr />
      <p class="text-center">
        <a
          style="text-transform: uppercase"
          href="https://github.com/EthanSuperior/startup"
        >
          Evan Chase
        </a>
      </p>
      <Joke />
    </footer>
  );
}

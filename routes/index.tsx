import { useSignal } from "@preact/signals";
import Login from "../islands/Login.tsx";


export default function Home() {
	//container padding: 0px 15px 0px 15px
  return (
	<main className="max-w-screen-2xl mx-auto flex flex-col items-center justify-center">
		<h1 className="mt-5 text-2xl font-semibold">Welcome</h1>
		<p className="mb-4 text-lg">Enter your login information to play - Otrio</p>  
		<Login/>
	</main>
	);
}

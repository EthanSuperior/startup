import { useRef } from "preact/hooks";
import LabeledInput from "../components/LabeledInput.tsx";

export default function Login() {

  const nameIn = useRef<HTMLInputElement>(null);
  return (
    <form method="get" action="/play">
        <LabeledInput ref={nameIn} id="name" name="q" placeholder="Enter username here"/>
        <LabeledInput id="password" placeholder="Enter password here"/>
        <button type="submit" className="w-full bg-indigo-500 text-white rounded-md py-2 px-4 hover:bg-indigo-600 focus:ring focus:ring-indigo-300 focus:outline-none">Login</button>
    </form>
  );
}
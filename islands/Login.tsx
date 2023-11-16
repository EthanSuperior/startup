import { useRef } from "preact/hooks";
import LabeledInput from "../components/LabeledInput.tsx";

export default function Login() {
  return (
    <form method='post' action='/user/login'>
        <LabeledInput id="username" placeholder="Enter username here"/>
        <LabeledInput type="password" id="password" placeholder="Enter password here"/>
        <button type="submit" className="w-full bg-indigo-500 text-white rounded-md py-2 px-4 hover:bg-indigo-600 focus:ring focus:ring-indigo-300 focus:outline-none">Login</button>
    </form>
  );
}